# CallCare Portal

Call-centre app with an admin portal, a customer portal and **real calls to phone numbers**: human to phone (from the browser) and AI to phone. No mocks or simulated screens.

**Live app:** [Render URL] &nbsp; **Demo video:** [video link]

## What it does
- **Human call:** the admin enters a phone number in the Calls tab and clicks *Call (human, from browser)*. The browser microphone is connected to the phone network through the Twilio Voice SDK (WebRTC), so the admin talks to a real phone.
- **AI call:** *Call with AI agent* makes Twilio dial the number. When the person answers, the AI greets them and has a live conversation: Twilio speech recognition, then an LLM (Gemini; Anthropic and OpenAI also supported), then a spoken reply. The admin sees a live transcript, and when the call ends the AI writes a 3-line summary (issue, category, next step) that is saved to the dashboard's call reports.
- **Callback requests:** customers request a call from their portal; agents see the queue and call back in one click.
- Admin dashboard (complaints by type), Caller Guide (Yes/No flowchart with final report), customer FAQ and chat assistant.

## How I got calling working
1. Browser to phone: the server issues a short-lived Twilio access token (`/api/token`). The browser connects with the Voice SDK, Twilio asks the server what to do (`/voice`), and the server replies with TwiML that dials the number.
2. AI to phone: `/api/ai-call` asks Twilio to place an outbound call. Twilio fetches `/ai/start`, which greets and listens (`<Gather input="speech">`). Each turn is posted to `/ai/turn`, which calls the LLM and speaks the answer back. `/ai/status` marks the end of the call and triggers the summary.
3. The app is a single Node server (React build + API) hosted on Render's free plan, because Twilio needs a public HTTPS URL for its webhooks.

## Setup (free Twilio trial)
1. Sign up at twilio.com, verify your email and phone, and get a trial phone number.
2. Add the mobile number you will call under **Verified Caller IDs** (trial accounts can only call verified numbers). Enable **India** under Voice geo permissions.
3. Create an **API Key** (Standard) and note its SID (`SK...`) and secret.
4. Deploy this repo to Render (New Web Service, free plan; `render.yaml` is included). Note the URL.
5. In Twilio, create a **TwiML App** with Voice Request URL `https://YOUR-URL/voice` (POST) and note its SID (`AP...`).
6. In Render, add the environment variables from `.env.example` (Twilio values, one LLM key, and optionally `PUBLIC_URL`), then redeploy.
7. Open the app, sign in as admin (`admin@demo.com` / `admin123`), go to **Calls**, and call your verified number. Customer login: `customer@demo.com` / `user123`.

Local run: `npm install`, copy `.env.example` to `.env`, `npm run build`, `npm start`. Local calls need a public tunnel (for example ngrok) as `PUBLIC_URL`.

## Limitations
- Twilio trial: calls only to verified numbers, a short trial announcement plays first, and the caller number is the trial number.
- Callback requests and AI transcripts are held in server memory and reset on restart. Complaints and reports use browser localStorage.
- Login is a demo and the call endpoints are not authenticated; add real auth before production use.
- Render's free server sleeps when idle; open the app a minute before a demo.

## AI tools used
- Claude (Anthropic): helped write the code, which I reviewed and tested.
- Google Gemini API: powers the AI voice agent and call summaries.
