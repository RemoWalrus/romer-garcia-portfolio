
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Input validation and sanitization functions
const validateInput = (data: ContactFormData): string | null => {
  // Name validation
  if (!data.name || data.name.trim().length < 2 || data.name.trim().length > 100) {
    return "Name must be between 2 and 100 characters";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email) || data.email.length > 254) {
    return "Please provide a valid email address";
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10 || data.message.trim().length > 5000) {
    return "Message must be between 10 and 5000 characters";
  }

  return null;
};

const sanitizeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

const checkRateLimit = (clientId: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(clientId);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { name, email, message }: ContactFormData = await req.json();

    // Validate input
    const validationError = validateInput({ name, email, message });
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeHtml(name.trim());
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedMessage = sanitizeHtml(message.trim());

    // Send email to site owner
    const ownerEmailResponse = await resend.emails.send({
      from: "Contact Form <contact@romergarcia.com>",
      to: "hireme@romergarcia.com",
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
        <p><small>Sent from: ${clientIp}</small></p>
      `,
    });

    // Send confirmation email to the person who submitted the form
    const confirmationEmailResponse = await resend.emails.send({
      from: "Romer Garcia <contact@romergarcia.com>",
      to: [sanitizedEmail],
      subject: "Thank you for your message!",
      html: `
        <h1>Thank you for reaching out, ${sanitizedName}!</h1>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Romer Garcia</p>
      `,
    });

    console.log("Emails sent successfully from:", clientIp, "for user:", sanitizedEmail);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    // Don't expose internal error details to client
    return new Response(
      JSON.stringify({ error: "An error occurred while sending your message. Please try again later." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
