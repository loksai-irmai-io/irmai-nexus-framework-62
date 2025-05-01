
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
    
    switch(type) {
      case 'login':
        emailSubject = "Login detected on your IRMAI account";
        emailHtml = `
          <h1>New login detected</h1>
          <p>A new login was detected on your IRMAI account. If this was you, no action is needed.</p>
          <p>If you did not log in, please contact support immediately.</p>
        `;
        break;
        
      case 'signup':
        emailSubject = "Welcome to IRMAI";
        emailHtml = `
          <h1>Welcome to IRMAI${name ? ', ' + name : ''}!</h1>
          <p>Thank you for creating an account. We're excited to have you on board.</p>
          <p>You can log in to your account at any time to access your dashboard.</p>
        `;
        break;
        
      case 'reset':
        emailSubject = "Password reset successful";
        emailHtml = `
          <h1>Password Reset Successful</h1>
          <p>Your password for your IRMAI account has been updated successfully.</p>
          <p>If you did not make this change, please contact support immediately.</p>
        `;
        break;
        
      case 'magic-link':
        emailSubject = "Your login link";
        emailHtml = `
          <h1>Login Link</h1>
          <p>Click the link below to log in to your IRMAI account:</p>
          <p><a href="${token}">Log in to your account</a></p>
          <p>If you did not request this link, please ignore this email.</p>
        `;
        break;
        
      case 'subscribe':
        emailSubject = "Subscription Confirmation";
        emailHtml = `
          <h1>Subscription Confirmed</h1>
          <p>Hello ${name || 'there'},</p>
          <p>Thank you for subscribing to IRMAI updates!</p>
          <p>You will now receive notifications about new features, updates, and important announcements.</p>
          <p>You can manage your subscription preferences at any time in your profile settings.</p>
          <br>
          <p>Best regards,</p>
          <p>The IRMAI Team</p>
        `;
        break;
        
      default:
        throw new Error('Invalid email type');
    }
    
    // Send the email using Supabase Edge Function capabilities
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'noop',
      email,
      options: {
        data: {
          subject: emailSubject,
          html: emailHtml,
        },
      }
    });

    if (error) {
      throw error;
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
