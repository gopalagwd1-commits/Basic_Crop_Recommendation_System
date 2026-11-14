# Basic Crop Recommendation System — Verdant

Responsive HTML5/CSS3/JavaScript frontend, Express backend, optional MongoDB Atlas persistence, and SMS through TextBee or Twilio.

## Run in Windows PowerShell
1. Extract ZIP and open the folder in VS Code.
2. Run `npm.cmd install`
3. Run `Copy-Item .env.example .env`
4. Edit `.env`; set your MongoDB URI and SMS provider credentials.
5. Run `npm.cmd run dev`
6. Visit http://localhost:5008

## API
- `GET /api/health`
- `POST /api/crops/recommend`
- `GET /api/crops/history`
- `POST /api/sms/send`

Example request body:
`{"soilType":"Laterite","season":"Kharif","rainfall":1800,"waterAvailability":"High","farmerName":"Ravi","location":"Honnavar","landArea":2.5}`

## SMS
For TextBee, set `SMS_PROVIDER=textbee`, `TEXTBEE_API_KEY`, and `TEXTBEE_DEVICE_ID`. Confirm the endpoint and payload with your current TextBee dashboard/docs before production use. Alternatively set `SMS_PROVIDER=twilio` and configure all three `TWILIO_*` variables. SMS credentials stay in `.env`, never frontend JavaScript.

## Important
The rule-based crop model is an educational prototype with broad illustrative ranges, not a certified agronomic advisory. Verify choices with local agriculture officers/KVKs. The SMS endpoint should gain authentication, user consent and stricter abuse prevention before public deployment. Do not commit `.env`.
