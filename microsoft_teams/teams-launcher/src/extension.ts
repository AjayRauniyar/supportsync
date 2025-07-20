import * as vscode from 'vscode';
import * as https from 'https';

interface GraphTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    error?: string;
    error_description?: string;
}

interface CalendarEvent {
    subject: string;
    body: {
        contentType: string;
        content: string;
    };
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    attendees: Array<{
        emailAddress: {
            address: string;
            name?: string;
        };
        type: string;
    }>;
    isOnlineMeeting: boolean;
    onlineMeetingProvider: string;
}

class GraphApiService {
    private accessToken: string | undefined;
    private tokenExpiry: number = 0;
    private readonly clientId: string;
    private readonly tenantId: string;
    private readonly clientSecret: string;
    private readonly targetUser: string;

    constructor() {
        console.log("Initializing GraphApiService...");
        const config = vscode.workspace.getConfiguration('teams-launcher');

        this.clientId = config.get('clientId') || '';
        this.tenantId = config.get('tenantId') || '';
        this.clientSecret = config.get('clientSecret') || '';
        this.targetUser = config.get('targetUser') || '';

        console.log(`Loaded clientId: ${this.clientId ? 'OK' : 'MISSING'}`);
        console.log(`Loaded tenantId: ${this.tenantId ? 'OK' : 'MISSING'}`);
        console.log(`Loaded clientSecret: ${this.clientSecret ? 'OK (loaded)' : 'MISSING'}`);
        console.log(`Loaded targetUser: ${this.targetUser ? 'OK' : 'MISSING'}`);

        if (!this.clientId || !this.tenantId || !this.clientSecret || !this.targetUser) {
            let missingSettings = [];
            if (!this.clientId) missingSettings.push('clientId');
            if (!this.tenantId) missingSettings.push('tenantId');
            if (!this.clientSecret) missingSettings.push('clientSecret');
            if (!this.targetUser) missingSettings.push('targetUser');
            
            const errorMessage = `Teams Launcher: Missing configuration. Please set the following in your settings: ${missingSettings.join(', ')}`;
            vscode.window.showErrorMessage(errorMessage);
            console.error(errorMessage);
        }
    }

    private isTokenValid(): boolean {
        return !!(this.accessToken && Date.now() < this.tokenExpiry);
    }

    async authenticate(): Promise<boolean> {
        if (this.isTokenValid()) {
            return true;
        }

        try {
            const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
            
            const postData = new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                scope: 'https://graph.microsoft.com/.default',
                grant_type: 'client_credentials'
            }).toString();

            console.log('Attempting authentication with tenant:', this.tenantId);

            const response = await this.makeHttpRequest('POST', tokenUrl, postData, {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData).toString()
            });

            const tokenData: GraphTokenResponse = JSON.parse(response);
            
            if (tokenData.error) {
                throw new Error(`Authentication error: ${tokenData.error} - ${tokenData.error_description}`);
            }

            if (!tokenData.access_token) {
                throw new Error('No access token received from authentication response');
            }

            this.accessToken = tokenData.access_token;
            this.tokenExpiry = Date.now() + ((tokenData.expires_in - 300) * 1000);
            
            console.log('Authentication successful');
            return true;
        } catch (error) {
            console.error('Authentication failed:', error);
            this.accessToken = undefined;
            this.tokenExpiry = 0;
            
            let errorMessage = 'Authentication failed';
            if (error instanceof Error) {
                errorMessage += `: ${error.message}`;
            }
            
            if (error instanceof Error && error.message.includes('AADSTS70002')) {
                errorMessage = 'Authentication failed: Invalid client credentials. Please check your clientId and clientSecret.';
            } else if (error instanceof Error && error.message.includes('AADSTS90002')) {
                errorMessage = 'Authentication failed: Invalid tenant ID. Please check your tenantId.';
            }
            
            vscode.window.showErrorMessage(errorMessage);
            return false;
        }
    }

    async createTeamsMeeting(eventDetails: {
        subject: string;
        startTime: string;
        endTime: string;
        attendees: string[];
        description?: string;
    }): Promise<any> {
        if (!await this.authenticate()) {
            throw new Error('Authentication failed');
        }

        const event: CalendarEvent = {
            subject: eventDetails.subject,
            body: {
                contentType: 'HTML',
                content: eventDetails.description || 'Teams meeting created from VS Code'
            },
            start: {
                dateTime: eventDetails.startTime,
                timeZone: 'UTC'
            },
            end: {
                dateTime: eventDetails.endTime,
                timeZone: 'UTC'
            },
            attendees: eventDetails.attendees.map(email => ({
                emailAddress: {
                    address: email.trim()
                },
                type: 'required'
            })),
            isOnlineMeeting: true,
            onlineMeetingProvider: 'teamsForBusiness'
        };

        const response = await this.makeGraphApiCall('POST', `/users/${this.targetUser}/events`, event);
        return JSON.parse(response);
    }

    async sendEmail(emailDetails: {
        to: string[];
        cc?: string[];
        subject: string;
        body: string;
        isHtml?: boolean;
    }): Promise<void> {
        if (!await this.authenticate()) {
            throw new Error('Authentication failed');
        }

        const message = {
            message: {
                subject: emailDetails.subject,
                body: {
                    contentType: emailDetails.isHtml ? 'HTML' : 'Text',
                    content: emailDetails.body
                },
                toRecipients: emailDetails.to.map(email => ({
                    emailAddress: {
                        address: email.trim()
                    }
                })),
                ccRecipients: emailDetails.cc?.map(email => ({
                    emailAddress: {
                        address: email.trim()
                    }
                })) || []
            }
        };

        await this.makeGraphApiCall('POST', `/users/${this.targetUser}/sendMail`, message);
    }

    async getUpcomingEvents(days: number = 7): Promise<any[]> {
        if (!await this.authenticate()) {
            throw new Error('Authentication failed');
        }

        const startTime = new Date().toISOString();
        const endTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        
        const filter = `start/dateTime ge '${startTime}' and start/dateTime le '${endTime}'`;
        const select = 'subject,start,end,webLink,isOnlineMeeting,onlineMeeting';
        
        const response = await this.makeGraphApiCall('GET', `/users/${this.targetUser}/events?$filter=${encodeURIComponent(filter)}&$select=${select}&$orderby=start/dateTime`);
        const data = JSON.parse(response);
        return data.value || [];
    }

    private async makeGraphApiCall(method: string, endpoint: string, body?: any): Promise<string> {
        if (!this.isTokenValid()) {
            console.log("Token is invalid or missing, re-authenticating...");
            if (!await this.authenticate()) {
                throw new Error('Authentication failed and could not be re-established.');
            }
        }

        const url = `https://graph.microsoft.com/v1.0${endpoint}`;
        const headers: { [key: string]: string } = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
        };

        const data = body ? JSON.stringify(body) : undefined;
        if (data) {
            headers['Content-Length'] = Buffer.byteLength(data).toString();
        }

        try {
            return await this.makeHttpRequest(method, url, data, headers);
        } catch (error) {
            if (error instanceof Error && error.message.includes('401')) {
                console.log('Received 401, attempting re-authentication...');
                this.accessToken = undefined;
                this.tokenExpiry = 0;
                
                if (await this.authenticate()) {
                    console.log("Re-authentication successful, retrying API call...");
                    headers['Authorization'] = `Bearer ${this.accessToken}`;
                    return await this.makeHttpRequest(method, url, data, headers);
                }
            }
            throw error;
        }
    }

    private makeHttpRequest(method: string, url: string, data?: string, headers?: { [key: string]: string }): Promise<string> {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || 443,
                path: urlObj.pathname + urlObj.search,
                method: method,
                headers: headers || {},
                timeout: 30000 
            };

            const req = https.request(options, (res) => {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(responseData);
                    } else {
                        // MODIFIED: This now includes the full error message from the server.
                        console.error(`HTTP Error ${res.statusCode}:`, responseData);
                        reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                    }
                });
            });

            req.on('error', (error) => {
                console.error('HTTP request error:', error);
                reject(error);
            });

            req.on('timeout', () => {
                console.error('HTTP request timeout');
                req.destroy();
                reject(new Error('Request timeout'));
            });

            if (data) {
                req.write(data);
            }
            req.end();
        });
    }

    async testAuthentication(): Promise<boolean> {
        try {
            const success = await this.authenticate();
            if (success) {
                await this.makeGraphApiCall('GET', `/users/${this.targetUser}`);
                vscode.window.showInformationMessage('Authentication test successful!');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Authentication test failed:', error);
            vscode.window.showErrorMessage(`Authentication test failed: ${error}`);
            return false;
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    const graphService = new GraphApiService();

    let testAuth = vscode.commands.registerCommand('teams.testAuth', async () => {
        await graphService.testAuthentication();
    });

    let disposable = vscode.commands.registerCommand('teams.startCall', async () => {
        const choice = await vscode.window.showQuickPick(
            ['Open in Browser', 'Open Desktop App'],
            { placeHolder: 'How do you want to open Microsoft Teams?' }
        );

        if (choice === 'Open in Browser') {
            vscode.env.openExternal(vscode.Uri.parse('https://teams.microsoft.com'));
        } else if (choice === 'Open Desktop App') {
            vscode.env.openExternal(vscode.Uri.parse('msteams:'));
        }
    });

    let joinCommand = vscode.commands.registerCommand('teams.joinMeeting', async () => {
        const meetingUrl = await vscode.window.showInputBox({
            prompt: 'Enter Teams meeting URL',
            placeHolder: 'https://teams.microsoft.com/l/meetup-join/...'
        });

        if (meetingUrl) {
            vscode.env.openExternal(vscode.Uri.parse(meetingUrl));
        }
    });

    let scheduleTeamsMeeting = vscode.commands.registerCommand('teams.scheduleMeeting', async () => {
        try {
            const subject = await vscode.window.showInputBox({
                prompt: 'Enter meeting subject',
                placeHolder: 'Weekly Team Standup'
            });
            if (!subject) return;

            const attendeesInput = await vscode.window.showInputBox({
                prompt: 'Enter attendee emails (comma-separated)',
                placeHolder: 'user1@company.com, user2@company.com'
            });
            if (!attendeesInput) return;

            const startDateTime = await vscode.window.showInputBox({
                prompt: 'Enter start date and time (YYYY-MM-DDTHH:MM)',
                placeHolder: '2025-07-25T10:00'
            });
            if (!startDateTime) return;

            const durationMinutes = await vscode.window.showInputBox({
                prompt: 'Enter meeting duration in minutes',
                placeHolder: '60'
            });
            if (!durationMinutes) return;

            const startTime = new Date(startDateTime + ':00.000Z');
            if (isNaN(startTime.getTime())) {
                vscode.window.showErrorMessage('Invalid date format. Please use YYYY-MM-DDTHH:MM');
                return;
            }

            const duration = parseInt(durationMinutes);
            if (isNaN(duration) || duration <= 0) {
                vscode.window.showErrorMessage('Invalid duration. Please enter a positive number of minutes.');
                return;
            }

            const endTime = new Date(startTime.getTime() + duration * 60000);
            const attendees = attendeesInput.split(',').map(email => email.trim());

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const invalidEmails = attendees.filter(email => !emailRegex.test(email));
            if (invalidEmails.length > 0) {
                vscode.window.showErrorMessage(`Invalid email addresses: ${invalidEmails.join(', ')}`);
                return;
            }

            vscode.window.showInformationMessage('Creating Teams meeting...');

            const event = await graphService.createTeamsMeeting({
                subject,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                attendees,
                description: `Meeting scheduled from VS Code Teams Launcher`
            });

            const joinUrl = event.onlineMeeting?.joinUrl || 'Available in calendar';
            vscode.window.showInformationMessage(
                `Teams meeting created successfully!`,
                'Copy Join URL',
                'Open Calendar'
            ).then(action => {
                if (action === 'Copy Join URL' && event.onlineMeeting?.joinUrl) {
                    vscode.env.clipboard.writeText(event.onlineMeeting.joinUrl);
                    vscode.window.showInformationMessage('Join URL copied to clipboard!');
                } else if (action === 'Open Calendar') {
                    vscode.env.openExternal(vscode.Uri.parse('https://outlook.office.com/calendar'));
                }
            });

        } catch (error) {
            console.error('Failed to create meeting:', error);
            vscode.window.showErrorMessage(`Failed to create meeting: ${error}`);
        }
    });

    let sendMeetingInvite = vscode.commands.registerCommand('teams.sendInvite', async () => {
        try {
            const recipients = await vscode.window.showInputBox({
                prompt: 'Enter recipient emails (comma-separated)',
                placeHolder: 'colleague1@company.com, colleague2@company.com'
            });
            if (!recipients) return;

            const subject = await vscode.window.showInputBox({
                prompt: 'Enter email subject',
                placeHolder: 'Invitation: Upcoming Teams Meeting'
            });
            if (!subject) return;

            const meetingUrl = await vscode.window.showInputBox({
                prompt: 'Enter Teams meeting URL (optional)',
                placeHolder: 'https://teams.microsoft.com/l/meetup-join/...'
            });

            const customMessage = await vscode.window.showInputBox({
                prompt: 'Enter additional message (optional)',
                placeHolder: 'Looking forward to our discussion...'
            });

            const emailList = recipients.split(',').map(email => email.trim());
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const invalidEmails = emailList.filter(email => !emailRegex.test(email));
            if (invalidEmails.length > 0) {
                vscode.window.showErrorMessage(`Invalid email addresses: ${invalidEmails.join(', ')}`);
                return;
            }

            const emailBody = `
                <html>
                <body>
                    <p>Hello,</p>
                    <p>You're invited to join our upcoming Teams meeting.</p>
                    ${customMessage ? `<p>${customMessage}</p>` : ''}
                    ${meetingUrl ? `<p><strong><a href="${meetingUrl}" style="color: #0078d4;">🔗 Join Teams Meeting</a></strong></p>` : ''}
                    <p>Best regards,<br/>Your colleague</p>
                    <hr/>
                    <p><small>Sent from VS Code Teams Launcher</small></p>
                </body>
                </html>
            `;

            vscode.window.showInformationMessage('Sending invitation...');

            await graphService.sendEmail({
                to: emailList,
                subject,
                body: emailBody,
                isHtml: true
            });

            vscode.window.showInformationMessage('Meeting invitation sent successfully!');

        } catch (error) {
            console.error('Failed to send invitation:', error);
            vscode.window.showErrorMessage(`Failed to send invitation: ${error}`);
        }
    });

    let viewUpcomingMeetings = vscode.commands.registerCommand('teams.viewUpcoming', async () => {
        try {
            vscode.window.showInformationMessage('Fetching upcoming meetings...');

            const events = await graphService.getUpcomingEvents(7);
            
            if (events.length === 0) {
                vscode.window.showInformationMessage('No upcoming meetings found in the next 7 days.');
                return;
            }

            const meetingItems = events.map(event => ({
                label: event.subject || 'No Subject',
                detail: `${new Date(event.start.dateTime).toLocaleString()} - ${new Date(event.end.dateTime).toLocaleString()}`,
                description: event.isOnlineMeeting ? '📹 Teams Meeting' : '📅 Meeting',
                event: event
            }));

            const selected = await vscode.window.showQuickPick(meetingItems, {
                placeHolder: 'Select a meeting to view details'
            });

            if (selected) {
                if (selected.event.isOnlineMeeting && selected.event.onlineMeeting?.joinUrl) {
                    const action = await vscode.window.showInformationMessage(
                        `Meeting: ${selected.event.subject || 'No Subject'}`,
                        'Join Meeting',
                        'Copy Join URL'
                    );

                    if (action === 'Join Meeting') {
                        vscode.env.openExternal(vscode.Uri.parse(selected.event.onlineMeeting.joinUrl));
                    } else if (action === 'Copy Join URL') {
                        vscode.env.clipboard.writeText(selected.event.onlineMeeting.joinUrl);
                        vscode.window.showInformationMessage('Join URL copied to clipboard!');
                    }
                } else {
                    vscode.window.showInformationMessage(`Meeting: ${selected.event.subject || 'No Subject'} (No Teams link available)`);
                }
            }

        } catch (error) {
            console.error('Failed to fetch meetings:', error);
            vscode.window.showErrorMessage(`Failed to fetch meetings: ${error}`);
        }
    });

    context.subscriptions.push(
        testAuth,
        disposable,
        joinCommand,
        scheduleTeamsMeeting,
        sendMeetingInvite,
        viewUpcomingMeetings
    );
}

export function deactivate() {}