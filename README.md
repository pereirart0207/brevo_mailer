# Landing Mailer API

A production-ready Node.js microservice for handling contact form submissions and dispatching emails via the Brevo (formerly Sendinblue) API.

## Features

- Health check endpoint
- Contact form submission with validation and sanitization
- Email dispatch via Brevo SMTP API
- Security middleware (CORS, Helmet, rate limiting)
- Environment-based configuration
- Optimized for Render deployment

## Prerequisites

- Node.js 18+
- A Brevo account with API key
- Verified sender email in Brevo

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your values
4. Run the server:
   ```bash
   npm start
   ```

## API Endpoints

### GET /
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### POST /api/contact
Submit a contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, this is a test message."
}
```

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (400):**
```json
{
  "error": "Missing or invalid fields"
}
```

## Deployment on Render

1. **Create a Render Account:** Sign up at [render.com](https://render.com) if you haven't already.

2. **Connect Your Repository:** 
   - Go to your Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your GitHub/GitLab repository containing this code

3. **Configure the Service:**
   - **Name:** Choose a name for your service (e.g., "landing-mailer-api")
   - **Runtime:** Node.js
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Choose the free tier or paid plan as needed

4. **Set Environment Variables:**
   In the Render dashboard, go to your service settings and add the following environment variables:
   - `BREVO_API_KEY`: Your Brevo API key
   - `ADMIN_EMAIL`: Email address to receive contact form submissions
   - `SENDER_EMAIL`: Verified sender email in Brevo
   - `ALLOWED_ORIGIN`: Your production domain (e.g., `https://yourdomain.com`)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render assigns this, but you can set it)

5. **Deploy:** Click "Create Web Service" to deploy. Render will build and deploy your service automatically.

6. **Update Your Frontend:** Point your contact form to the deployed Render URL (e.g., `https://your-service-name.onrender.com/api/contact`).

## Security Features

- Input validation and sanitization
- Rate limiting (5 requests per 15 minutes per IP)
- CORS protection
- Helmet for security headers
- No sensitive data exposure in responses

## Environment Variables

See `.env.example` for required environment variables.# brevo_mailer
