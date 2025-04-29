
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Run SQL to enable realtime for tables
    const { tables } = await req.json()
    
    // Enable REPLICA IDENTITY FULL for each table
    for (const table of tables) {
      await supabaseClient.rpc('set_replica_identity_full', { table_name: table })
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Realtime enabled for tables' }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  }
})
