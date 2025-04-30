
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  type: "subscribe" | "unsubscribe" | "welcome";
  name?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, name = "" }: EmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    let subject = "";
    let html = "";

    // Format email based on type
    switch (type) {
      case "subscribe":
        subject = "Welcome to IRMAI Updates!";
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">You're Subscribed to IRMAI Updates</h1>
            <p>Hello ${name || "there"},</p>
            <p>Thank you for subscribing to IRMAI updates! You'll now receive notifications about:</p>
            <ul>
              <li>New features and improvements</li>
              <li>Important system announcements</li>
              <li>Tips and best practices</li>
            </ul>
            <p>You can unsubscribe at any time from your dashboard.</p>
            <p>Best regards,<br>The IRMAI Team</p>
          </div>
        `;
        break;
      case "unsubscribe":
        subject = "You've Unsubscribed from IRMAI Updates";
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">You've Been Unsubscribed</h1>
            <p>Hello ${name || "there"},</p>
            <p>You have been successfully unsubscribed from IRMAI updates.</p>
            <p>You can always subscribe again from your dashboard if you change your mind.</p>
            <p>Best regards,<br>The IRMAI Team</p>
          </div>
        `;
        break;
      case "welcome":
        subject = "Welcome to IRMAI!";
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to IRMAI!</h1>
            <p>Hello ${name || "there"},</p>
            <p>Thank you for signing up to IRMAI! We're excited to have you on board.</p>
            <p>Log in anytime to access your dashboard and explore our features.</p>
            <p>Best regards,<br>The IRMAI Team</p>
          </div>
        `;
        break;
      default:
        throw new Error("Invalid email type");
    }

    const emailResponse = await resend.emails.send({
      from: "IRMAI <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    console.log(`Email sent to ${email}:`, emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
