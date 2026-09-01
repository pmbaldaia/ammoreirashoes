const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char])

export async function sendPasswordResetEmail({ user, token }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    const error = new Error('O envio de email ainda não está configurado.')
    error.statusCode = 503
    throw error
  }
  const siteUrl = (process.env.NUXT_SITE_URL || '').replace(/\/$/, '')
  if (!siteUrl) {
    const error = new Error('NUXT_SITE_URL não está configurada.')
    error.statusCode = 503
    throw error
  }
  const link = `${siteUrl}/admin/recuperar-password?token=${encodeURIComponent(token)}`
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev'
  const name = escapeHtml(user.name || user.username || 'utilizador')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)
  let response
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        from,
        to: [user.email],
        subject: 'Recuperação de palavra-passe — AM Moreira',
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#161616;max-width:560px;margin:auto"><h1 style="margin-bottom:8px">Recuperar palavra-passe</h1><p>Olá, ${name}.</p><p>Recebemos um pedido para redefinir a palavra-passe da tua conta AM Moreira.</p><p style="margin:28px 0"><a href="${link}" style="display:inline-block;background:#000;color:#fff;padding:13px 22px;text-decoration:none;border-radius:4px;font-weight:700">Redefinir palavra-passe</a></p><p>Este link é válido durante 1 hora e só pode ser utilizado uma vez.</p><p>Se não fizeste este pedido, podes ignorar este email.</p></div>`,
      }),
    })
  } finally { clearTimeout(timeout) }
  if (!response.ok) {
    const details = await response.text()
    const error = new Error(`Não foi possível enviar o email de recuperação: ${details}`)
    error.statusCode = 502
    throw error
  }
}
