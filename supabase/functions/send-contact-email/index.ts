
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
    const { name, email, message }: ContactFormData = await req.json();

    if (!name || !email || !message) {
      throw new Error("Missing required fields");
    }

    // Send email to site owner
    const ownerEmailResponse = await resend.emails.send({
      from: "Contact Form <contact@romergarcia.com>",
      to: "hireme@romergarcia.com",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Send confirmation email to the person who submitted the form
    const confirmationEmailResponse = await resend.emails.send({
      from: "Romer Garcia <contact@romergarcia.com>",
      to: [email],
      subject: "Thank you for your message!",
      html: `
        <h1>Thank you for reaching out, ${name}!</h1>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Romer Garcia</p>
      `,
    });

    console.log("Emails sent successfully:", { ownerEmailResponse, confirmationEmailResponse });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
