// Import Resend from npm via esm.sh for Deno
import { Resend } from 'npm:resend@3.0.0'

interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  // Use environment variable or fallback to hardcoded key
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_hjWHQCc7_HAtBfYAPt6K8vfS26ry8zH5n'

  const resend = new Resend(RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from: payload.from || 'YC Hackathon <onboarding@resend.dev>',
    to: Array.isArray(payload.to) ? payload.to : [payload.to],
    subject: payload.subject,
    html: payload.html,
  })

  if (error) {
    console.error('Resend API error:', error)
    throw new Error(`Failed to send email: ${error}`)
  }

  console.log('Email sent successfully:', data)
}

export function createProcessingCompleteEmail(
  userName: string,
  profileName: string,
  analysis: {
    date_met?: string
    meeting_event?: string
    conversation_summary?: string
    follow_up_text?: string
    follow_up_suggestion?: string
    future_potential?: string
    follow_up_priority?: string
  }
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #0a66c2 0%, #004182 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 30px 20px;
          }
          .intro {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .section {
            background: #f8f9fa;
            padding: 15px;
            margin: 15px 0;
            border-radius: 6px;
            border-left: 4px solid #0a66c2;
          }
          .label {
            font-weight: 600;
            color: #0a66c2;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .value {
            color: #333;
            font-size: 14px;
            line-height: 1.5;
          }
          .priority {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .priority-high {
            background: #fef3f2;
            color: #b42318;
          }
          .priority-medium {
            background: #fef9c3;
            color: #ca8a04;
          }
          .priority-low {
            background: #ecfdf3;
            color: #067647;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Processing Complete!</h1>
          </div>
          <div class="content">
            <div class="intro">
              <p>Hi ${userName},</p>
              <p>Your conversation with <strong>${profileName}</strong> has been analyzed successfully!</p>
            </div>

            ${analysis.date_met ? `
            <div class="section">
              <div class="label">📅 Date Met</div>
              <div class="value">${analysis.date_met}</div>
            </div>
            ` : ''}

            ${analysis.meeting_event ? `
            <div class="section">
              <div class="label">📍 Meeting Event</div>
              <div class="value">${analysis.meeting_event}</div>
            </div>
            ` : ''}

            ${analysis.conversation_summary ? `
            <div class="section">
              <div class="label">💬 Conversation Summary</div>
              <div class="value">${analysis.conversation_summary}</div>
            </div>
            ` : ''}

            ${analysis.follow_up_text ? `
            <div class="section">
              <div class="label">✉️ Suggested Follow-up Message</div>
              <div class="value">${analysis.follow_up_text}</div>
            </div>
            ` : ''}

            ${analysis.follow_up_suggestion ? `
            <div class="section">
              <div class="label">💡 Follow-up Suggestion</div>
              <div class="value">${analysis.follow_up_suggestion}</div>
            </div>
            ` : ''}

            ${analysis.future_potential ? `
            <div class="section">
              <div class="label">🚀 Future Potential</div>
              <div class="value">${analysis.future_potential}</div>
            </div>
            ` : ''}

            ${analysis.follow_up_priority ? `
            <div class="section">
              <div class="label">⚡ Priority Level</div>
              <div class="value">
                <span class="priority priority-${analysis.follow_up_priority?.toLowerCase() || 'medium'}">
                  ${analysis.follow_up_priority || 'Medium'}
                </span>
              </div>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Powered by YC Hackathon LinkedIn AI Assistant</p>
            <p>This email was automatically generated after processing your conversation recording.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
