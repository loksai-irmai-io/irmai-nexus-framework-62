
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequestBody {
  email: string
  type: 'login' | 'signup' | 'reset' | 'magic-link' | 'subscribe'
  name?: string
  token?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { email, type, name, token }: EmailRequestBody = await req.json();
    
    if (!email) {
      throw new Error('Email is required');
    }
    
    if (!type) {
      throw new Error('Email type is required');
    }

    let emailSubject = '';
    let emailHtml = '';
    
    // Define the redirectUrl for all authentication-related links
    const redirectUrl = 'http://34.45.239.136:8501/';
    
    switch(type) {
      case 'login':
        emailSubject = "Login detected on your IRMAI account";
        emailHtml = `
          <h1>New login detected</h1>
          <p>A new login was detected on your IRMAI account. If this was you, no action is needed.</p>
          <p>If you did not log in, please contact support immediately.</p>
          <p>You can access your dashboard at <a href="${redirectUrl}">${redirectUrl}</a></p>
        `;
        break;
        
      case 'signup':
        emailSubject = "Welcome to IRMAI";
        emailHtml = `
          <h1>Welcome to IRMAI${name ? ', ' + name : ''}!</h1>
          <p>Thank you for creating an account. We're excited to have you on board.</p>
          <p>You can log in to your account at any time to access your dashboard at <a href="${redirectUrl}">${redirectUrl}</a>.</p>
          <img src="https://lovable-uploads.lovable.dev/71af5850-49b8-4d7a-9a67-8bd0fb9b89fb.png" alt="IRMAI Logo" style="max-width: 200px; margin-top: 20px;">
        `;
        break;
        
      case 'reset':
        emailSubject = "Password reset successful";
        emailHtml = `
          <h1>Password Reset Successful</h1>
          <p>Your password for your IRMAI account has been updated successfully.</p>
          <p>You can now log in with your new password at <a href="${redirectUrl}">${redirectUrl}</a>.</p>
          <p>If you did not make this change, please contact support immediately.</p>
          <img src="https://lovable-uploads.lovable.dev/71af5850-49b8-4d7a-9a67-8bd0fb9b89fb.png" alt="IRMAI Logo" style="max-width: 200px; margin-top: 20px;">
        `;
        break;
        
      case 'magic-link':
        emailSubject = "Your login link";
        emailHtml = `
          <h1>Login Link</h1>
          <p>Click the link below to log in to your IRMAI account:</p>
          <p><a href="${token || redirectUrl}">Log in to your account</a></p>
          <p>If you did not request this link, please ignore this email.</p>
          <img src="https://lovable-uploads.lovable.dev/71af5850-49b8-4d7a-9a67-8bd0fb9b89fb.png" alt="IRMAI Logo" style="max-width: 200px; margin-top: 20px;">
        `;
        break;
        
      case 'subscribe':
        emailSubject = "Subscription Confirmation";
        emailHtml = `
          <h1>Subscription Confirmed</h1>
          <p>Hello ${name || 'there'},</p>
          <p>Thank you for subscribing to IRMAI updates!</p>
          <p>You will now receive notifications about new features, updates, and important announcements.</p>
          <p>You can manage your subscription preferences at any time in your profile settings at <a href="${redirectUrl}">${redirectUrl}</a>.</p>
          <br>
          <p>Best regards,</p>
          <p>The IRMAI Team</p>
          <img src="https://lovable-uploads.lovable.dev/71af5850-49b8-4d7a-9a67-8bd0fb9b89fb.png" alt="IRMAI Logo" style="max-width: 200px; margin-top: 20px;">
        `;
        break;
        
      default:
        throw new Error('Invalid email type');
    }
    
    // Use Resend to send emails with custom sender
    const resendApiKey = Deno.env.get('RESEND_API_KEY') || 're_8crBUHuY_4oHZzVu63E3V9eeRdNqdvLTV';
    
    const emailData = {
      from: 'IRMAI <info@irmai.io>',
      to: email,
      subject: emailSubject,
      html: emailHtml,
    };
    
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailData),
    });
    
    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      throw new Error(`Email sending failed: ${JSON.stringify(errorData)}`);
    }
    
    console.log("Email sent successfully:", { email, type });
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email sent successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
