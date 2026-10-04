# ScamShield Bharat 🇮🇳

A SANGYAN Hackathon prototype for Track A — Digital Fraud & Scam Resilience.

## What it does
Users paste a suspicious investment message. ScamShield Bharat detects common warning patterns, gives an explainable risk score, and provides safety-first next steps.

## Important safety boundary
This prototype does NOT provide stock tips, buy/sell/hold recommendations, investment predictions, or financial-product promotion.

## Run locally

### Backend
```bash
cd backend
npm install
npm start
```
API: http://localhost:3000

### Frontend
For the easiest demo, serve `frontend` with any static server, or open `frontend/index.html` in a browser. If opening directly, the app has a local fallback analyzer; when served together with the Express backend, it uses `/api/analyze`.

## Fast deployment option
For a one-hour hackathon deployment, the simplest route is:
1. Push the repository to GitHub.
2. Deploy `backend` as a Node/Express web service.
3. Deploy `frontend` as a static site.
4. Change `apiBase` in `frontend/app.js` from `""` to your backend URL if frontend and backend are on different domains.
5. Test the sample message and one custom message.

## Demo flow
1. Open the site.
2. Click "Try sample".
3. Click "Analyze safely".
4. Show the risk score.
5. Show the highlighted warning signs.
6. Show the safer next steps.
7. Explain Bharat-first regional-language expansion as the next milestone.
