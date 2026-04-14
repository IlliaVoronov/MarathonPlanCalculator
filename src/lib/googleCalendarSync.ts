import { addDays, format } from "date-fns";
import type { DayPlan } from "./planGenerator";

const GOOGLE_IDENTITY_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

interface GoogleTokenResponse {
  access_token: string;
  error?: string;
  error_description?: string;
}

interface GoogleOauth2 {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: GoogleTokenResponse) => void;
  }): {
    requestAccessToken: (options?: { prompt?: string }) => void;
  };
}

interface GoogleAccounts {
  oauth2: GoogleOauth2;
}

interface GoogleWindow extends Window {
  google?: {
    accounts: GoogleAccounts;
  };
}

declare const window: GoogleWindow;

function escapeEventId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getEventId(day: DayPlan): string {
  return `marathonprep${escapeEventId(day.date)}`;
}

function getGoogleClientId(): string {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Missing VITE_GOOGLE_CLIENT_ID. Add your Google OAuth web client ID to the app env.");
  }

  return clientId;
}

async function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_IDENTITY_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Identity Services.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services."));
    document.head.appendChild(script);
  });
}

async function getAccessToken(): Promise<string> {
  await loadGoogleIdentityScript();

  return await new Promise<string>((resolve, reject) => {
    const client = window.google?.accounts.oauth2.initTokenClient({
      client_id: getGoogleClientId(),
      scope: GOOGLE_CALENDAR_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error_description || response.error || "Google authorization failed."));
          return;
        }

        resolve(response.access_token);
      },
    });

    if (!client) {
      reject(new Error("Google OAuth client could not be initialized."));
      return;
    }

    client.requestAccessToken({ prompt: "consent" });
  });
}

function buildEvent(day: DayPlan) {
  return {
    id: getEventId(day),
    summary: `Marathon Prep: ${day.preview}`,
    description: `${day.workout}\n\n${day.description}`,
    start: { date: day.date },
    end: { date: format(addDays(new Date(day.date), 1), "yyyy-MM-dd") },
    reminders: {
      useDefault: true,
    },
  };
}

async function fetchCalendarEvent(accessToken: string, eventId: string): Promise<Response> {
  return fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function createCalendarEvent(accessToken: string, day: DayPlan): Promise<void> {
  const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildEvent(day)),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create event for ${day.label}: ${errorText}`);
  }
}

async function updateCalendarEvent(accessToken: string, day: DayPlan): Promise<void> {
  const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events/${getEventId(day)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildEvent(day)),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update event for ${day.label}: ${errorText}`);
  }
}

export async function syncRunsToGoogleCalendar(days: DayPlan[]) {
  const runDays = days.filter((day) => day.type !== "rest");
  if (runDays.length === 0) {
    return { created: 0, updated: 0 };
  }

  const accessToken = await getAccessToken();
  let created = 0;
  let updated = 0;

  for (const day of runDays) {
    const eventId = getEventId(day);
    const existingEventResponse = await fetchCalendarEvent(accessToken, eventId);

    if (existingEventResponse.ok) {
      await updateCalendarEvent(accessToken, day);
      updated += 1;
      continue;
    }

    if (existingEventResponse.status !== 404) {
      const errorText = await existingEventResponse.text();
      throw new Error(`Failed to check calendar event for ${day.label}: ${errorText}`);
    }

    await createCalendarEvent(accessToken, day);
    created += 1;
  }

  return { created, updated };
}
