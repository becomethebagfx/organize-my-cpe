import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not configured - emails will be logged only");
      return null;
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

const FROM_EMAIL = "Organize My CPE <noreply@organizemycpe.com>";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  const resend = getResend();

  if (!resend) {
    console.log("[EMAIL - DEV MODE]", {
      to: options.to,
      subject: options.subject,
    });
    return true;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
  const firstName = name?.split(" ")[0] || "there";

  return sendEmail({
    to: email,
    subject: "Welcome to Organize My CPE - Let's get you compliant!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to Organize My CPE</h1>
        </div>

        <p>Hi ${firstName},</p>

        <p>Welcome! You're now set up to track your CPE credits and stay compliant.</p>

        <p><strong>Here's how to get started:</strong></p>
        <ol>
          <li>Upload your CPE certificates</li>
          <li>Our AI will extract course details automatically</li>
          <li>View your compliance status by state</li>
          <li>Export reports for your state board</li>
        </ol>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>

        <p>Questions? Reply to this email - we're here to help.</p>

        <p>Best,<br>The Organize My CPE Team</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          Organize My CPE - CPE tracking made simple for CPAs.<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #666;">Privacy</a> |
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #666;">Terms</a>
        </p>
      </body>
      </html>
    `,
    text: `Hi ${firstName},

Welcome to Organize My CPE! You're now set up to track your CPE credits and stay compliant.

Here's how to get started:
1. Upload your CPE certificates
2. Our AI will extract course details automatically
3. View your compliance status by state
4. Export reports for your state board

Go to Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Questions? Reply to this email - we're here to help.

Best,
The Organize My CPE Team`,
  });
}

export async function sendComplianceAlertEmail(
  email: string,
  name: string | undefined,
  state: string,
  dueDate: string,
  creditsNeeded: number
): Promise<boolean> {
  const firstName = name?.split(" ")[0] || "there";

  return sendEmail({
    to: email,
    subject: `Action Required: ${state} CPE deadline approaching`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #dc2626;">CPE Deadline Approaching</h1>

        <p>Hi ${firstName},</p>

        <p>Your ${state} CPE compliance deadline is approaching:</p>

        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 0;"><strong>State:</strong> ${state}</p>
          <p style="margin: 10px 0 0;"><strong>Deadline:</strong> ${dueDate}</p>
          <p style="margin: 10px 0 0;"><strong>Credits Needed:</strong> ${creditsNeeded}</p>
        </div>

        <p>Log in to view your full compliance status and track your progress.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Compliance Status
          </a>
        </div>

        <p>Best,<br>The Organize My CPE Team</p>
      </body>
      </html>
    `,
  });
}

export async function sendPaymentSuccessEmail(
  email: string,
  name: string | undefined,
  amount: number
): Promise<boolean> {
  const firstName = name?.split(" ")[0] || "there";

  return sendEmail({
    to: email,
    subject: "Payment confirmed - Organize My CPE subscription active!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Payment Confirmed</h1>

        <p>Hi ${firstName},</p>

        <p>Thank you for subscribing! Your payment of <strong>$${amount}</strong> has been processed successfully.</p>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Plan:</strong> Annual Subscription</p>
          <p style="margin: 10px 0 0;"><strong>Amount:</strong> $${amount}/year</p>
        </div>

        <p>You now have full access to all features including:</p>
        <ul>
          <li>Unlimited certificate uploads</li>
          <li>AI-powered extraction</li>
          <li>Multi-state compliance tracking</li>
          <li>Unlimited exports</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>

        <p>Best,<br>The Organize My CPE Team</p>
      </body>
      </html>
    `,
  });
}

export async function sendExportReadyEmail(
  email: string,
  name: string | undefined,
  state: string,
  downloadUrl: string
): Promise<boolean> {
  const firstName = name?.split(" ")[0] || "there";

  return sendEmail({
    to: email,
    subject: `Your ${state} CPE report is ready`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Your CPE Report is Ready</h1>

        <p>Hi ${firstName},</p>

        <p>Your ${state} CPE compliance report has been generated and is ready for download.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}"
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Download Report
          </a>
        </div>

        <p style="font-size: 14px; color: #666;">
          Note: This download link expires in 24 hours.
        </p>

        <p>Best,<br>The Organize My CPE Team</p>
      </body>
      </html>
    `,
  });
}
