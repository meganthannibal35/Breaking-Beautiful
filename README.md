# Breaking Beautiful™ AI Workforce

Autonomous 10-agent AI corporate staff system for Breaking Beautiful™.

## Agents

- 🧠 **Megan AI Twin** — Executive decision-maker
- 👔 **Chief of Staff** — Operations coordinator
- 💰 **Revenue Director** — Pipeline & metrics
- 🎯 **Lead Generation** — Prospect finder
- 📞 **Sales & Follow-Up** — Deal movement
- ✍️ **Content & Copy** — Marketing creator
- 🤝 **Enrollment Concierge** — Payment & onboarding
- ⚙️ **Operations** — Delivery coordinator
- 📊 **Finance & Metrics** — Money tracker
- 🛡️ **QA / Verification** — Quality control

## Setup

1. Install: `npm install`
2. Create `.env` with variables (see below)
3. Run: `npm start`

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
EMAIL_FROM=megan@breakingbeautiful.com
EMAIL_TO=megan@breakingbeautiful.com
SMTP_USER=megan@breakingbeautiful.com
SMTP_PASS=your-gmail-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
DAILY_REPORT_TIME=09:00
TIMEZONE=America/Chicago
ENABLE_CONTINUOUS_RUN=true
```

## How It Works

- Runs daily at 9 AM Chicago time
- All 10 agents execute sequentially
- QA verifies all outputs
- Email report sent to Dr. Megan for approval

Deployed on Render as a Background Worker.
