import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const IssueCertificateSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  trailId: z.string().uuid('Invalid trail ID'),
})

function generateVerificationCode(): string {
  const prefix = 'SE'
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).toUpperCase().slice(2, 8)
  return `${prefix}-${year}-${random}`
}

async function isTrailCompleted(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  trailId: string
): Promise<boolean> {
  // Get all content items for this trail
  const { data: items } = await supabase
    .from('content_items')
    .select('id, trail_modules!inner(trail_id)')
    .eq('trail_modules.trail_id', trailId)

  if (!items || items.length === 0) return false

  // Check completion rate
  const itemIds = items.map((i) => i.id)
  const { data: progress } = await supabase
    .from('user_progress')
    .select('content_item_id')
    .eq('user_id', userId)
    .eq('completed', true)
    .in('content_item_id', itemIds)

  if (!progress) return false

  const completionRate = progress.length / itemIds.length
  return completionRate >= 1.0
}

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

    const body: unknown = await req.json()
    const parsed = IssueCertificateSchema.safeParse(body)
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Validation failed', details: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { userId, trailId } = parsed.data

    // Only self-issue or admin
    const { data: callerProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (userId !== user.id && callerProfile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check if already issued
    const { data: existing } = await supabase
      .from('certificates')
      .select('id, verification_code')
      .eq('user_id', userId)
      .eq('trail_id', trailId)
      .single()

    if (existing) {
      return new Response(JSON.stringify({ success: true, alreadyIssued: true, verificationCode: existing.verification_code }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify trail completion
    const completed = await isTrailCompleted(supabase, userId, trailId)
    if (!completed && callerProfile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Trail not completed yet' }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Issue certificate
    const verificationCode = generateVerificationCode()
    const { data: cert, error: certError } = await supabase
      .from('certificates')
      .insert({ user_id: userId, trail_id: trailId, verification_code: verificationCode })
      .select()
      .single()

    if (certError) throw certError

    // Award achievement points
    await supabase.from('points_ledger').insert({
      user_id: userId,
      amount: 200,
      reason: 'Certificado emitido',
      source_type: 'certificate',
      source_id: cert.id,
    })

    await supabase.rpc('increment_points', { user_id: userId, amount: 200 }).maybeSingle()

    return new Response(
      JSON.stringify({ success: true, certificateId: cert.id, verificationCode }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
