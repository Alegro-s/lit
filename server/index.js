const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), '.env.example'),
];

let loadedEnvPath = null;
for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    loadedEnvPath = envPath;
    break;
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'LEAD_RECEIVER'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('SMTP verify failed:', error.message);
    return;
  }
  console.log('SMTP ready');
});

const sanitize = (value = '') => String(value).trim().slice(0, 2000);

app.get('/api/health', (_, res) => {
  if (missingEnv.length) {
    return res.status(500).json({
      ok: false,
      message: `Missing env keys: ${missingEnv.join(', ')}`,
    });
  }
  return res.json({ ok: true, message: 'Server ready' });
});

app.post('/api/lead', async (req, res) => {
  if (missingEnv.length) {
    return res.status(500).json({
      ok: false,
      message: `Missing env keys: ${missingEnv.join(', ')}`,
    });
  }

  const payload = {
    name: sanitize(req.body.name),
    company: sanitize(req.body.company),
    email: sanitize(req.body.email),
    phone: sanitize(req.body.phone),
    projectType: sanitize(req.body.projectType),
    message: sanitize(req.body.message),
  };

  if (!payload.name || !payload.company || !payload.email || !payload.message) {
    return res.status(400).json({
      ok: false,
      message: 'Required fields are missing',
    });
  }

  const html = `
    <h2>Новая заявка с сайта ЛИТ</h2>
    <p><strong>Имя:</strong> ${payload.name}</p>
    <p><strong>Компания:</strong> ${payload.company}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Телефон:</strong> ${payload.phone || '—'}</p>
    <p><strong>Формат проекта:</strong> ${payload.projectType}</p>
    <p><strong>Комментарий:</strong><br/>${payload.message.replace(/\n/g, '<br/>')}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"LIT Lead Form" <${process.env.SMTP_USER}>`,
      to: process.env.LEAD_RECEIVER,
      subject: `Новая заявка: ${payload.company}`,
      html,
      replyTo: payload.email,
    });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Email send failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(PORT, () => {
  if (!loadedEnvPath) {
    console.warn('Env file not found (.env or .env.local).');
  } else {
    console.log(`Env loaded from: ${loadedEnvPath}`);
  }
  console.log(`Lead server started on http://localhost:${PORT}`);
});
