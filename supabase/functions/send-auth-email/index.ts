
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, type, resetToken, token } = await req.json()

    let subject, content

    // Get the application URL - use origin from request or fallback
    const appUrl = req.headers.get('origin') || 'https://irmai-nexus-framework-62.lovable.app'
    
    switch (type) {
      case 'login':
        subject = 'New Login to Your IRMAI Account'
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">New Login Detected</h1>
            <p style="font-size: 16px; line-height: 1.6;">We detected a new login to your account. If this wasn't you, please contact support immediately.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${appUrl}/dashboard" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Dashboard</a>
            </div>
            <p style="color: #6B7280; font-size: 14px;">If you did not request this email, please ignore it.</p>
          </div>
        `
        break
      case 'reset':
        subject = 'Reset Your IRMAI Password'
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Password Reset Requested</h1>
            <p style="font-size: 16px; line-height: 1.6;">Click the button below to reset your password:</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${resetToken}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #6B7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            <p style="color: #6B7280; font-size: 14px;">Link not working? Copy and paste this URL into your browser: ${resetToken}</p>
          </div>
        `
        break
      case 'magic-link':
        const magicLinkUrl = token
        
        subject = 'Your IRMAI Magic Link'
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Your Magic Login Link</h1>
            <p style="font-size: 16px; line-height: 1.6;">Click the button below to log in to your IRMAI account:</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${magicLinkUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Log In</a>
            </div>
            <p style="color: #6B7280; font-size: 14px;">If you didn't request this login link, please ignore this email.</p>
            <p style="color: #6B7280; font-size: 14px;">This link will expire in 24 hours.</p>
            <p style="color: #6B7280; font-size: 14px;">Link not working? Copy and paste this URL into your browser: ${magicLinkUrl}</p>
          </div>
        `
        break
      case 'subscribe':
        subject = 'Welcome to IRMAI Updates'
        content = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Subscription Confirmed</h1>
            <p style="font-size: 16px; line-height: 1.6;">Thank you for subscribing to IRMAI updates! You will now receive notifications when new features and updates are available.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${appUrl}/dashboard" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Dashboard</a>
            </div>
            <p style="color: #6B7280; font-size: 14px;">If you did not request this subscription, you can unsubscribe by clicking <a href="${appUrl}/profile?unsubscribe=true">here</a>.</p>
          </div>
        `
        break;
      default:
        throw new Error('Invalid email type')
    }

    const emailResponse = await resend.emails.send({
      from: 'IRMAI <info@irmai.io>',
      to: email,
      subject,
      html: content,
    })

    console.log("Email sent successfully:", emailResponse)

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error in send-auth-email function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
