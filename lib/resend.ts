import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'AgentMatch AI <contact@agentmatch.ai>'
const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://agentmatch.ai'
export async function sendVerificationEmail(email: string, name: string, token: string) {
  const url = `${BASE}/api/auth/verify?token=${token}`
  await resend.emails.send({ from: FROM, to: email, subject: '✅ Confirmez mon email — AgentMatch AI', html: `<h2>Bienvenue, ${name} !</h2><p>Confirmer <a href="${url}">votre email</a></p>` })
}
export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${BASE}/reset-password?token=${token}`
  await resend.emails.send({ from: FROM, to: email, subject: '�Q Runitialisation mot de passe — AgentMatch AI', html: `<h2>Réinitialisation</h2><a href="${url}">RC�initialiser</a>` })
}
export async function sendMatchNotificationEmail(agentEmail: string, agentName: string, missionTitle: string, company: string, score: number) {
  await resend.emails.send({ from: FROM, to: agentEmail, subject: `🎯Nouveau match ${score}% — ${missionTitle}`, html: `<p>Bonjour ${agentName}, match ${score}% pour ${missionTitle} chez ${company}.</p>` })
}
export async function sendApplicationNotificationEmail(companyEmail: string, companyName: string, agentName: string, missionTitle: string) {
  await resend.emails.send({ from: FROM, to: companyEmail, subject: `📬Nouvelle candidature —  ${missionTitle}`, html: `<p>Bonjour ${companyName}, ${agentName} a postulé à ${missionTitle}.</p>` })
}
