import { Resend } from "resend"
import IncidentAlertEmail, { IncidentEmailParams } from "./emails/incidentAlertEmail"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAlertEmail(params: IncidentEmailParams) {
  const subject =
    params.status === "RESOLVED"
      ? `🟢 ${params.siteName} is back online`
      : `🔴 ${params.incidentType} outage detected on ${params.siteName}`;

  await resend.emails.send({
    from: "alerts@sentinel.ninad1.me",
    to: params.to,
    subject,
    react: IncidentAlertEmail(params),
  });
}