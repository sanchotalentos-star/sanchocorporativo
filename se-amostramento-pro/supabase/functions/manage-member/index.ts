import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ManageMemberSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('invite'),
    email: z.string().email('Invalid email'),
    orgId: z.string().uuid('Invalid org ID'),
    role: z.enum(['manager', 'member']).default('member'),
  }),
  z.object({
    action: z.literal('update_role'),
    memberId: z.string().uuid('Invalid member ID'),
    role: z.enum(['admin', 'manager', 'member']),
  }),
  z.object({
    action: z.literal('suspend'),
    memberId: z.string().uuid('Invalid member ID'),
  }),
  z.object({
    action: z.literal('reactivate'),
    memberId: z.string().uuid('Invalid member ID'),
  }),
  z.object({
    action: z.literal('remove'),
    memberId: z.string().uuid('Invalid member ID'),
  }),
])

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

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

    const { data: callerProfile } = await supabase.from('profiles').select('role, org_id').eq('id', user.id).single()
    if (!callerProfile || !['admin', 'manager'].includes(callerProfile.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body: unknown = await req.json()
    const parsed = ManageMemberSchema.safeParse(body)
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Validation failed', details: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const payload = parsed.data

    switch (payload.action) {
      case 'invite': {
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(payload.email, {
          data: { org_id: payload.orgId, role: payload.role },
        })
        if (error) throw error
        return new Response(JSON.stringify({ success: true, userId: data.user?.id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'update_role': {
        const { error } = await supabase
          .from('profiles')
          .update({ role: payload.role })
          .eq('id', payload.memberId)
        if (error) throw error
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'suspend':
      case 'reactivate': {
        const status = payload.action === 'suspend' ? 'inactive' : 'active'
        const { error } = await supabase
          .from('profiles')
          .update({ status })
          .eq('id', payload.memberId)
        if (error) throw error
        return new Response(JSON.stringify({ success: true, status }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'remove': {
        const { error } = await supabase.auth.admin.deleteUser(payload.memberId)
        if (error) throw error
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
