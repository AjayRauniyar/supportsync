"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const https = __importStar(require("https"));
class GraphApiService {
    accessToken;
    clientId;
    tenantId;
    clientSecret;
    constructor() {
        // You'll need to get these from your app registration
        // Store these securely in your extension settings
        this.clientId = vscode.workspace.getConfiguration('teams-launcher').get('clientId') || '';
        this.tenantId = vscode.workspace.getConfiguration('teams-launcher').get('tenantId') || '';
        this.clientSecret = vscode.workspace.getConfiguration('teams-launcher').get('clientSecret') || '';
    }
    async authenticate() {
        try {
            const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
            const postData = new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                scope: 'https://graph.microsoft.com/.default',
                grant_type: 'client_credentials'
            }).toString();
            const response = await this.makeHttpRequest('POST', tokenUrl, postData, {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData).toString()
            });
            const tokenData = JSON.parse(response);
            this.accessToken = tokenData.access_token;
            return true;
        }
        catch (error) {
            vscode.window.showErrorMessage(`Authentication failed: ${error}`);
            return false;
        }
    }
    async createTeamsMeeting(eventDetails) {
        if (!this.accessToken) {
            const authenticated = await this.authenticate();
            if (!authenticated)
                throw new Error('Authentication failed');
        }
        const event = {
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
        const response = await this.makeGraphApiCall('POST', '/me/events', event);
        return JSON.parse(response);
    }
    async sendEmail(emailDetails) {
        if (!this.accessToken) {
            const authenticated = await this.authenticate();
            if (!authenticated)
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
        await this.makeGraphApiCall('POST', '/me/sendMail', message);
    }
    async getUpcomingEvents(days = 7) {
        if (!this.accessToken) {
            const authenticated = await this.authenticate();
            if (!authenticated)
                throw new Error('Authentication failed');
        }
        const startTime = new Date().toISOString();
        const endTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        const filter = `start/dateTime ge '${startTime}' and start/dateTime le '${endTime}'`;
        const select = 'subject,start,end,webLink,isOnlineMeeting,onlineMeeting';
        const response = await this.makeGraphApiCall('GET', `/me/events?$filter=${encodeURIComponent(filter)}&$select=${select}&$orderby=start/dateTime`);
        const data = JSON.parse(response);
        return data.value || [];
    }
    async makeGraphApiCall(method, endpoint, body) {
        const url = `https://graph.microsoft.com/v1.0${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
        };
        const data = body ? JSON.stringify(body) : undefined;
        if (data) {
            headers['Content-Length'] = Buffer.byteLength(data).toString();
        }
        return this.makeHttpRequest(method, url, data, headers);
    }
    makeHttpRequest(method, url, data, headers) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || 443,
                path: urlObj.pathname + urlObj.search,
                method: method,
                headers: headers || {}
            };
            const req = https.request(options, (res) => {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(responseData);
                    }
                    else {
                        reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                    }
                });
            });
            req.on('error', reject);
            if (data) {
                req.write(data);
            }
            req.end();
        });
    }
}
function activate(context) {
    const graphService = new GraphApiService();
    // Existing commands...
    let disposable = vscode.commands.registerCommand('teams.startCall', async () => {
        const choice = await vscode.window.showQuickPick(['Open in Browser', 'Open Desktop App'], { placeHolder: 'How do you want to open Microsoft Teams?' });
        if (choice === 'Open in Browser') {
            vscode.env.openExternal(vscode.Uri.parse('https://teams.microsoft.com'));
        }
        else if (choice === 'Open Desktop App') {
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
    // New calendar and email commands
    let scheduleTeamsMeeting = vscode.commands.registerCommand('teams.scheduleMeeting', async () => {
        try {
            const subject = await vscode.window.showInputBox({
                prompt: 'Enter meeting subject',
                placeHolder: 'Weekly Team Standup'
            });
            if (!subject)
                return;
            const attendeesInput = await vscode.window.showInputBox({
                prompt: 'Enter attendee emails (comma-separated)',
                placeHolder: 'user1@company.com, user2@company.com'
            });
            if (!attendeesInput)
                return;
            const startDateTime = await vscode.window.showInputBox({
                prompt: 'Enter start date and time (YYYY-MM-DDTHH:MM)',
                placeHolder: '2024-07-25T10:00'
            });
            if (!startDateTime)
                return;
            const durationMinutes = await vscode.window.showInputBox({
                prompt: 'Enter meeting duration in minutes',
                placeHolder: '60'
            });
            if (!durationMinutes)
                return;
            // Calculate end time
            const startTime = new Date(startDateTime + ':00.000Z');
            const endTime = new Date(startTime.getTime() + parseInt(durationMinutes) * 60000);
            const attendees = attendeesInput.split(',').map(email => email.trim());
            vscode.window.showInformationMessage('Creating Teams meeting...');
            const event = await graphService.createTeamsMeeting({
                subject,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                attendees,
                description: `Meeting scheduled from VS Code Teams Launcher`
            });
            vscode.window.showInformationMessage(`Teams meeting created successfully! Join URL: ${event.onlineMeeting?.joinUrl || 'Available in calendar'}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to create meeting: ${error}`);
        }
    });
    let sendMeetingInvite = vscode.commands.registerCommand('teams.sendInvite', async () => {
        try {
            const recipients = await vscode.window.showInputBox({
                prompt: 'Enter recipient emails (comma-separated)',
                placeHolder: 'colleague1@company.com, colleague2@company.com'
            });
            if (!recipients)
                return;
            const subject = await vscode.window.showInputBox({
                prompt: 'Enter email subject',
                placeHolder: 'Invitation: Upcoming Teams Meeting'
            });
            if (!subject)
                return;
            const meetingUrl = await vscode.window.showInputBox({
                prompt: 'Enter Teams meeting URL (optional)',
                placeHolder: 'https://teams.microsoft.com/l/meetup-join/...'
            });
            const customMessage = await vscode.window.showInputBox({
                prompt: 'Enter additional message (optional)',
                placeHolder: 'Looking forward to our discussion...'
            });
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
            await graphService.sendEmail({
                to: recipients.split(','),
                subject,
                body: emailBody,
                isHtml: true
            });
            vscode.window.showInformationMessage('Meeting invitation sent successfully!');
        }
        catch (error) {
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
                label: event.subject,
                detail: `${new Date(event.start.dateTime).toLocaleString()} - ${new Date(event.end.dateTime).toLocaleString()}`,
                description: event.isOnlineMeeting ? '📹 Teams Meeting' : '📅 Meeting',
                event: event
            }));
            const selected = await vscode.window.showQuickPick(meetingItems, {
                placeHolder: 'Select a meeting to view details'
            });
            if (selected && selected.event.isOnlineMeeting && selected.event.onlineMeeting?.joinUrl) {
                const action = await vscode.window.showInformationMessage(`Meeting: ${selected.event.subject}`, 'Join Meeting', 'Copy Join URL');
                if (action === 'Join Meeting') {
                    vscode.env.openExternal(vscode.Uri.parse(selected.event.onlineMeeting.joinUrl));
                }
                else if (action === 'Copy Join URL') {
                    vscode.env.clipboard.writeText(selected.event.onlineMeeting.joinUrl);
                    vscode.window.showInformationMessage('Join URL copied to clipboard!');
                }
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch meetings: ${error}`);
        }
    });
    // Register all commands
    context.subscriptions.push(disposable, joinCommand, scheduleTeamsMeeting, sendMeetingInvite, viewUpcomingMeetings);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map