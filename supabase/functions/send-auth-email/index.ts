
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

    switch (type) {
      case 'login':
        subject = 'New Login to Your IRMAI Account'
        content = `
          <h1>New Login Detected</h1>
          <p>We detected a new login to your account. If this wasn't you, please contact support immediately.</p>
        `
        break
      case 'reset':
        subject = 'Reset Your IRMAI Password'
        content = `
          <h1>Password Reset Requested</h1>
          <p>Click the link below to reset your password:</p>
          <p>
            <a href="${resetToken}" style="background-color: #4F46E5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">
              Reset Password
            </a>
          </p>
          <p>If you didn't request this, please ignore this email.</p>
        `
        break
      case 'magic-link':
        // The token provided to this function is the actual token hash from Supabase
        const magicLinkUrl = token
        
        subject = 'Your IRMAI Magic Link'
        content = `
          <h1>Your Magic Login Link</h1>
          <p>Click the button below to log in to your IRMAI account:</p>
          <p>
            <a href="${magicLinkUrl}" style="background-color: #4F46E5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">
              Log In
            </a>
          </p>
          <p>If you didn't request this login link, please ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
        `
        break
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
