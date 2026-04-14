# Marathon Plan Calculator

Vite + React app for building a marathon training plan and viewing it in a calendar layout.

## Google Calendar Sync Setup

This app supports authenticated sync to a user's Google Calendar from the plan page.

1. In Google Cloud, create or select a project.
2. Enable the Google Calendar API.
3. Configure the OAuth consent screen.
4. Create an OAuth 2.0 Client ID for a Web application.
5. Add your local and production origins to the authorized JavaScript origins list.
6. Copy `.env.example` to `.env` and set:

```bash
VITE_GOOGLE_CLIENT_ID=your-google-oauth-web-client-id.apps.googleusercontent.com
```

7. Start the app with `npm run dev`.

The app requests the `https://www.googleapis.com/auth/calendar.events` scope and syncs planned runs to the signed-in user's primary Google Calendar.

If Google auth is not configured, the `.ics` export button remains available as a fallback import path.
