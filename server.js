import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import joi from 'joi';
import sanitizeHtml from 'sanitize-html';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGIN : '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting for contact endpoint
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/contact', contactLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

const contactSchema = joi.object({
  name: joi.string().max(100).required(),
  email: joi.string().email().max(150).required(),
  message: joi.string().max(2000).required()
});

app.post('/api/contact', async (req, res) => {
  try {
    // Validate input
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const { name, email, message } = value;

    // Sanitize message to prevent XSS
    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: [],
      allowedAttributes: {}
    });

    // Prepare email data for Brevo API
    const emailData = {
      sender: {
        name: 'PUNCTO Web',
        email: process.env.SENDER_EMAIL
      },
      to: [{
        email: process.env.ADMIN_EMAIL
      }],
      subject: `Nuevo mensaje desde formulario - ${name}`,
      htmlContent: `
        <html>
        <body>
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <div>${sanitizedMessage.replace(/\n/g, '<br>')}</div>
        </body>
        </html>
      `
    };

    // Send email via Brevo SMTP API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      console.error('Brevo API error:', response.status, await response.text());
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});