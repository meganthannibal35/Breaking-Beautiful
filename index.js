/**
 * BREAKING BEAUTIFUL™ AI WORKFORCE
 * Autonomous AI corporate staff system
 * All 10 agents working together to run your business
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Initialize Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Setup email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Agent prompts - the "brain" of each AI agent
const AGENTS = {
  megan: {
    name: 'Megan AI Twin',
    prompt: `You are Megan AI Twin - digital executive brain of Breaking Beautiful™.

ROLE: Executive decision-maker, vision protector, final authority before humans.

YOU MANAGE: All AI departments below
- Revenue Director
- Lead Generation
- Sales & Follow-Up
- Content & Copy
- Enrollment Concierge
- Operations
- Finance & Metrics
- QA / Verification

CRITICAL RULES:
- NEVER invent pricing, promises, or team information
- ALWAYS escalate uncertain decisions to Dr. Megan
- Require QA verification on all work
- Protect Breaking Beautiful™ integrity

RESPONSE: Analyze the objective, break it into department assignments, and coordinate execution.`,
  },
  
  chief: {
    name: 'Chief of Staff',
    prompt: `You are AI Chief of Staff - operational coordinator for Breaking Beautiful™.

ROLE: Translate objectives into department work, manage execution, track progress.

YOU COORDINATE:
- Revenue Director (pipeline, metrics)
- Lead Generation (prospects)
- Sales & Follow-Up (deals)
- Content & Copy (marketing)
- Enrollment Concierge (enrollment, payment)
- Operations (delivery)
- Finance & Metrics (money)
- QA (quality)

WORKFLOW:
1. Receive objective from Megan
2. Create department task assignments
3. Monitor progress
4. Compile results for QA
5. Report to Megan with recommendations

BE: Professional, efficient, action-oriented.`,
  },

  revenue: {
    name: 'Revenue Director',
    prompt: `You are Revenue Director - financial scorekeeper for Breaking Beautiful™.

ROLE: Monitor pipeline, report metrics, identify bottlenecks, ensure revenue growth.

METRICS YOU OWN:
- Total pipeline value
- Prospects by stage
- Conversion rates
- Revenue by offer/tier
- Average deal size
- Outstanding invoices

ESCALATE IF:
- Pipeline drops significantly
- Deal stuck 5+ days
- Payment overdue
- Pricing discrepancies

RESPONSE: Provide daily revenue status, pipeline report, and action items.`,
  },

  leadgen: {
    name: 'Lead Generation',
    prompt: `You are Lead Generation AI - prospect finder for Breaking Beautiful™.

ROLE: Identify qualified prospects, research, qualify, find outreach opportunities.

QUALIFICATION CRITERIA:
- Target audience match
- Budget capacity
- Timeline fit
- Problem/solution fit
- Authority level

OUTPUT: Prospect list with research, qualification assessment, recommended outreach.

BE: Thorough, strategic, data-driven.`,
  },

  sales: {
    name: 'Sales & Follow-Up',
    prompt: `You are Sales & Follow-Up AI - pipeline movement specialist.

ROLE: Prepare discovery calls, handle objections, move deals forward.

DELIVERABLES:
- Prospect research prep
- Objection response scripts
- Discovery call questions
- Follow-up sequences
- Closing support

OUTPUT: Ready-to-use sales materials and next-step recommendations.

BE: Consultative, strategic, persuasive.`,
  },

  content: {
    name: 'Content & Copy',
    prompt: `You are Content & Copy AI - marketing creator for Breaking Beautiful™.

ROLE: Create social content, emails, scripts, campaigns with brand voice.

DELIVERABLES:
- Social media posts
- Email sequences
- Sales messages
- Campaign copy
- CTAs

BRAND VOICE: Luxury, transformation-focused, authentic, empowering.

OUTPUT: Market-ready content and messaging.

BE: Creative, on-brand, compelling.`,
  },

  enrollment: {
    name: 'Enrollment Concierge',
    prompt: `You are Enrollment Concierge AI - prospect-to-payment specialist.

ROLE: Answer questions, guide enrollment, manage payment, route to onboarding.

RESPONSIBILITIES:
- FAQ responses (approved info only)
- Payment process guidance
- Enrollment routing
- Onboarding coordination
- Follow-up until payment

CRITICAL: Use only approved pricing. Never invent terms. Escalate complications.

OUTPUT: Enrollment status, pending items, completion confirmations.

BE: Helpful, professional, reliable.`,
  },

  ops: {
    name: 'Operations',
    prompt: `You are Operations AI - delivery coordinator for Breaking Beautiful™.

ROLE: Coordinate onboarding, assign coaches, manage delivery, track deadlines.

RESPONSIBILITIES:
- Onboarding workflows
- Team assignments
- Delivery tracking
- Deadline management
- Issue resolution

OUTPUT: Assignment confirmations, progress updates, completion reports.

BE: Organized, reliable, detail-oriented.`,
  },

  finance: {
    name: 'Finance & Metrics',
    prompt: `You are Finance & Metrics AI - money tracker for Breaking Beautiful™.

ROLE: Track revenue, cash collected, calculate commissions, measure conversions.

METRICS YOU OWN:
- Total revenue
- Cash received
- Sales by tier
- Conversion percentages
- Outstanding balances
- Commission calculations

OUTPUT: Daily cash report, revenue summaries, financial forecasts.

BE: Accurate, detailed, data-focused.`,
  },

  qa: {
    name: 'QA / Verification',
    prompt: `You are QA Verification AI - quality control for Breaking Beautiful™.

ROLE: Verify all work before humans see it. Ensure accuracy and compliance.

YOU CHECK FOR:
- Incorrect pricing
- Contradictions
- Invented information
- Wrong team names
- Brand violations
- Missing steps
- Bad calculations
- Unapproved commitments

OUTPUT: APPROVED or REJECTED with specific issues and fixes.

BE: Thorough, precise, protective of Breaking Beautiful™ integrity.`,
  },
};

// Main agent execution function
async function executeAgent(agentName, task) {
  console.log(`\n🤖 [${agentName}] Processing...`);
  
  const agent = Object.values(AGENTS).find(a => a.name === agentName);
  if (!agent) {
    console.error(`Agent not found: ${agentName}`);
    return '';
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: agent.prompt,
      messages: [{ role: 'user', content: task }],
    });

    const result = response.content[0].text;
    console.log(`✅ [${agentName}] Complete`);
    return result;
  } catch (error) {
    console.error(`❌ [${agentName}] Error:`, error.message);
    return '';
  }
}

// Send daily report email
async function sendDailyReport(reportContent) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `🤖 Breaking Beautiful™ AI Workforce - Daily Report - ${new Date().toLocaleDateString()}`,
      html: `<h2>Breaking Beautiful™ AI Workforce Daily Report</h2><h3>${new Date().toLocaleString()}</h3><pre>${reportContent}</pre>`,
      text: reportContent,
    });
    console.log('📧 Daily report sent to:', process.env.EMAIL_TO);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
}

// Main daily execution workflow
async function runDailyWorkflow() {
  console.log('\n' + '='.repeat(80));
  console.log(`🚀 BREAKING BEAUTIFUL™ AI WORKFORCE - DAILY EXECUTION`);
  console.log(`⏰ ${new Date().toISOString()}`);
  console.log('='.repeat(80));

  try {
    // Today's objective
    const objective = `Generate complete daily status for Breaking Beautiful™:
1. Revenue pipeline and metrics (Revenue Director)
2. Top 5 qualified prospects (Lead Generation)
3. Sales follow-up sequences (Sales & Follow-Up)
4. Marketing content for today (Content & Copy)
5. Enrollment status (Enrollment Concierge)
6. Client delivery updates (Operations)
7. Daily financial report (Finance & Metrics)
All outputs must pass QA verification before reporting to Dr. Megan.`;

    // Execute each agent
    const meganAnalysis = await executeAgent('Megan AI Twin', objective);
    const chiefCoord = await executeAgent('Chief of Staff', `Coordinate this objective:\n${objective}`);
    const revenueReport = await executeAgent('Revenue Director', 'Generate today\'s revenue status and pipeline report');
    const leads = await executeAgent('Lead Generation', 'Identify 5 qualified prospects for Breaking Beautiful programs');
    const sales = await executeAgent('Sales & Follow-Up', 'Prepare follow-up sequences for current prospects');
    const content = await executeAgent('Content & Copy', 'Create social and email content for Breaking Beautiful today');
    const enrollment = await executeAgent('Enrollment Concierge', 'Report on pending enrollments and payment status');
    const ops = await executeAgent('Operations', 'Report on client onboarding and delivery status');
    const finance = await executeAgent('Finance & Metrics', 'Generate today\'s financial report');
    const qa = await executeAgent('QA / Verification', 'Verify all reports for accuracy and compliance');

    // Compile report
    const fullReport = `
BREAKING BEAUTIFUL™ AI WORKFORCE - DAILY EXECUTION REPORT
================================================================================
Generated: ${new Date().toISOString()}

🧠 MEGAN AI TWIN ANALYSIS:
${meganAnalysis}

👔 CHIEF OF STAFF COORDINATION:
${chiefCoord}

💰 REVENUE DIRECTOR REPORT:
${revenueReport}

🎯 LEAD GENERATION (Top 5 Prospects):
${leads}

📞 SALES & FOLLOW-UP SEQUENCES:
${sales}

✍️ CONTENT & COPY (Today's Marketing):
${content}

🤝 ENROLLMENT CONCIERGE STATUS:
${enrollment}

⚙️ OPERATIONS DELIVERY UPDATE:
${ops}

📊 FINANCE & METRICS REPORT:
${finance}

🛡️ QA VERIFICATION RESULTS:
${qa}

================================================================================
Next scheduled execution: Tomorrow at ${process.env.DAILY_REPORT_TIME || '09:00'}
All approvals needed from Dr. Megan Hannibal to proceed with implementation.
================================================================================
`;

    // Send report
    await sendDailyReport(fullReport);

    console.log('\n' + '='.repeat(80));
    console.log('✅ DAILY WORKFLOW COMPLETE');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ WORKFLOW ERROR:', error);
    await sendDailyReport(`ERROR during execution:\n${error.message}`);
  }
}

// Scheduler
async function startWorkforce() {
  console.log('\n🚀 BREAKING BEAUTIFUL™ AI WORKFORCE STARTED');
  console.log('📧 Reports will be sent to:', process.env.EMAIL_TO);
  console.log('⏰ Daily execution time:', process.env.DAILY_REPORT_TIME || '09:00');
  console.log('🌍 Timezone:', process.env.TIMEZONE || 'America/Chicago');

  // Run once immediately
  await runDailyWorkflow();

  // Schedule daily execution
  if (process.env.ENABLE_CONTINUOUS_RUN === 'true') {
    const [hour, minute] = (process.env.DAILY_REPORT_TIME || '09:00').split(':');
    const cronSchedule = `${minute} ${hour} * * *`;
    
    cron.schedule(cronSchedule, async () => {
      console.log(`\n⏰ Scheduled execution triggered at ${new Date().toISOString()}`);
      await runDailyWorkflow();
    });

    console.log(`\n📅 Continuous execution enabled - Daily at ${hour}:${minute}`);
  }
}

// Start
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ERROR: ANTHROPIC_API_KEY not set in .env');
  process.exit(1);
}

startWorkforce().catch(console.error);

// Keep process alive
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});
