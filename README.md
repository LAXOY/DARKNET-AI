# DARKNET v0.9 Gemini backend

RUNE is a human character, Ruşen's hacker alias. Keep the Gemini API key on the server only.

## Local test
1. Install Node.js 20+.
2. Run `npm install`.
3. Set the API key in your shell: `export GEMINI_API_KEY='YOUR_KEY'`
4. Run `npm start`, then open `http://localhost:3000`.
5. Check `http://localhost:3000/health`.

The HTML calls `/api/chat`; if no server is reachable it shows a clearly labeled local demo response.

## To use from the installed Android APK
Deploy this server to an HTTPS host, then configure the app's client endpoint to that HTTPS URL. `localhost` inside an APK means the phone itself, not your hosting computer. Use HTTPS, rate limits, quotas/authentication and budget alerts before sharing. Never put the key in HTML, APK or a public repository.
