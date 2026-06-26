import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ProvisionAccessSchema = z.object({
  requestId: z.string().uuid('Invalid request ID'),
  orgId: z.string().uuid('Invalid org ID'),
  trailIds: z.array(z.string().uuid()).min(1, 'At least one trail required'),
  action: z.enum(['grant', 'revoke']),
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Verify caller is admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Parse and validate body
    const body: unknown = await req.json()
    const parsed = ProvisionAccessSchema.safeParse(body)
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Validation failed', details: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { orgId, trailIds, action, requestId } = parsed.data

    if (action === 'grant') {
      const rows = trailIds.map((trailId) => ({
        org_id: orgId,
        trail_id: trailId,
        granted_by: user.id,
      }))

      const { error } = await supabase
        .from('org_trail_access')
        .upsert(rows, { onConflict: 'org_id,trail_id' })

      if (error) throw error

      // Update request status
      if (requestId) {
        await supabase
          .from('access_requests')
          .update({ status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: user.id })
          .eq('id', requestId)
      }
    } else {
      const { error } = await supabase
        .from('org_trail_access')
        .delete()
        .eq('org_id', orgId)
        .in('trail_id', trailIds)

      if (error) throw error
    }

    return new Response(
      JSON.stringify({ success: true, action, orgId, trailCount: trailIds.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
