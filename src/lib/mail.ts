import "server-only";
import nodemailer from "nodemailer";

/**
 * Transactional email over SMTP (provider-agnostic: works with Google
 * Workspace, Resend, SendGrid, Mailgun, Zoho, etc. — just supply that
 * provider's SMTP host/user/pass).
 *
 * All configuration comes from environment variables. If SMTP is not
 * configured, sending is skipped silently so a form submission is NEVER
 * blocked by a mail problem.
 *
 *   SMTP_HOST      e.g. smtp.gmail.com / smtp-relay.gmail.com / smtp.resend.com
 *   SMTP_PORT      default 587 (587 = STARTTLS, 465 = implicit TLS)
 *   SMTP_SECURE    "true" to force implicit TLS (auto-on for port 465)
 *   SMTP_USER      SMTP username
 *   SMTP_PASS      SMTP password / app password / API key
 *   MAIL_FROM      From header (default: "LOOM Rockland <SMTP_USER>")
 *   MAIL_TO        Recipient (default: support@loomrockland.org)
 */

export const MAIL_TO = process.env.MAIL_TO || "support@loomrockland.org";

export interface MailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendMail(opts: {
  subject: string;
  text: string;
  html?: string;
  to?: string;
  attachments?: MailAttachment[];
}): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  const transport = getTransport();
  if (!transport) {
    console.warn("[mail] SMTP not configured — skipping email:", opts.subject);
    return { sent: false, skipped: true };
  }

  const from =
    process.env.MAIL_FROM || `LOOM Rockland <${process.env.SMTP_USER}>`;

  try {
    await transport.sendMail({
      from,
      to: opts.to || MAIL_TO,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      attachments: opts.attachments,
    });
    return { sent: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[mail] send failed:", error);
    return { sent: false, error };
  }
}
