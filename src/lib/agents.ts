// src/lib/agents.ts
import { model } from "./geminiClient";

export type SupportMessage = {
  message: string;
  customerMetadata?: Record<string, any>;
  infoDown?: boolean;
};

export type Ticket = {
  summary: string;
  severity: string;
  needsEscalation: boolean;
  product?: string;
  clarifyingQuestions: string[];
};

export type ExpertRouting = {
  primaryExpert: string;
  backupExperts: string[];
  rationale: string;
};

export type SwarmRoom = {
  meetingLink: string;
  invitees: string[];
  suggestedTime: string;
};

export type AssistantNotes = {
  summary: string;
  decisions: string[];
  actionItems: string[];
};

export type SupportFlowResult = {
  ticket: Ticket;
  expertRouting?: ExpertRouting;
  swarmRoom?: SwarmRoom;
  assistantNotes?: AssistantNotes;
};

async function callGemini(systemInstruction: string, userContent: string) {
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\n${userContent}` }],
      },
    ],
  });

  const response = result.response.text();
  return response;
}

// 1) Customer Chat Agent – converts raw message -> structured ticket
export async function customerChatAgent(
  input: SupportMessage
): Promise<Ticket> {
  const sys = `
You are a senior SAP support intake agent.
Given a raw customer message, extract a structured ticket as JSON with:
summary, severity (P1-P4), product, needsEscalation (boolean),
and up to 3 clarifyingQuestions[].
Return ONLY valid JSON.
  `;

  const raw = await callGemini(sys, input.message);

  try {
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    const json = raw.slice(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(json);

    return {
      summary: parsed.summary,
      severity: parsed.severity,
      needsEscalation: !!parsed.needsEscalation,
      product: parsed.product,
      clarifyingQuestions: parsed.clarifyingQuestions ?? [],
    };
  } catch (e) {
    console.warn("customerChatAgent JSON parse failed, fallback used:", e);

    return {
      summary: input.message.slice(0, 120),
      severity: "P3",
      needsEscalation: true,
      clarifyingQuestions: [],
    };
  }
}

// 2) Expert Matching Agent (simple mocked directory)
const EXPERT_DIRECTORY = [
  {
    id: "sap-hana-high-availability-oncall",
    skills: ["s/4hana", "hana", "high-sev"],
  },
  { id: "sap-basis-core", skills: ["basis", "patching"] },
  { id: "network-oncall", skills: ["network", "latency"] },
];

export async function expertMatchingAgent(
  ticket: Ticket
): Promise<ExpertRouting> {
  const sys = `
You are an expert routing assistant.
Given a ticket summary, choose the best primaryExpert and two backupExperts
from this list: ${EXPERT_DIRECTORY.map((e) => e.id).join(", ")}.
Return JSON: { primaryExpert, backupExperts, rationale }.
  `;

  const raw = await callGemini(sys, ticket.summary);

  try {
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    const json = raw.slice(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(json);

    return {
      primaryExpert: parsed.primaryExpert,
      backupExperts: parsed.backupExperts ?? [],
      rationale: parsed.rationale,
    };
  } catch (e) {
    console.warn("expertMatchingAgent JSON parse failed, fallback used:", e);

    return {
      primaryExpert: "sap-basis-core",
      backupExperts: ["sap-hana-high-availability-oncall"],
      rationale: "Fallback routing because parsing failed.",
    };
  }
}

// 3) Swarm Room Orchestrator (mock meeting creation)
export async function swarmRoomOrchestrator(
  ticket: Ticket,
  routing: ExpertRouting
): Promise<SwarmRoom> {
  const meetingId = Math.random().toString(36).slice(2, 8);

  return {
    meetingLink: `https://meet.example.com/swarm/${meetingId}`,
    invitees: [routing.primaryExpert, ...routing.backupExperts],
    suggestedTime: "in the next 30 minutes",
  };
}

// 4) AI Meeting Assistant – summarizes / redacts (info-down)
export async function meetingAssistantAgent(
  transcript: string,
  infoDown = false
): Promise<AssistantNotes> {
  const sys = `
You are an AI meeting assistant for SAP incident swarms.
Summarize the transcript, list key decisions[], and actionItems[].
If infoDown=true, redact any company names or user identifiers.
Return JSON { summary, decisions, actionItems }.
  `;

  const raw = await callGemini(
    sys + `\ninfoDown=${infoDown}`,
    transcript
  );

  try {
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    const json = raw.slice(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(json);

    return {
      summary: parsed.summary,
      decisions: parsed.decisions ?? [],
      actionItems: parsed.actionItems ?? [],
    };
  } catch (e) {
    console.warn("meetingAssistantAgent JSON parse failed, fallback used:", e);

    return {
      summary: "Unable to parse meeting summary.",
      decisions: [],
      actionItems: [],
    };
  }
}

// 5) Knowledge / Learning Agent – logging-only demo
export async function knowledgeAgent(
  ticket: Ticket,
  notes?: AssistantNotes
): Promise<void> {
  // In a real system, this writes to a DB / vector store.
  console.log("📚 [KnowledgeAgent] New resolved ticket recorded:", {
    ticket,
    notes,
  });
}

// Orchestrator: main flow used by the API route
export async function runSupportFlow(
  input: SupportMessage
): Promise<SupportFlowResult> {
  const ticket = await customerChatAgent(input);

  // Simple policy: escalate if severity P1/P2 or needsEscalation=true
  if (!ticket.needsEscalation && ticket.severity === "P3") {
    return { ticket };
  }

  const routing = await expertMatchingAgent(ticket);
  const swarmRoom = await swarmRoomOrchestrator(ticket, routing);

  // For demo, we fake a short transcript.
  const fakeTranscript =
    "We reviewed the outage, identified a misconfigured patch, and rolled back. System is now stable.";
  const assistantNotes = await meetingAssistantAgent(
    fakeTranscript,
    input.infoDown
  );

  await knowledgeAgent(ticket, assistantNotes);

  return {
    ticket,
    expertRouting: routing,
    swarmRoom,
    assistantNotes,
  };
}
