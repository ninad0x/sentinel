import { Resend } from "resend"
import IncidentAlertEmail, { IncidentEmailParams } from "./emails/incidentAlertEmail"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAlertEmail(params: IncidentEmailParams) {
  await resend.emails.send({
    from: "alerts@yourdomain.com",
    to: params.to,
    subject: `🔴 ${params.incidentType} outage detected on ${params.siteName}`,
    react: IncidentAlertEmail(params),
  })
}