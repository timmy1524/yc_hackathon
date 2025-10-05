import { sendEmail } from './simple-resend.ts'

interface EmailData {
  user_name: string
  profile_name: string
  profile_url: string
  analysis: {
    conversation_summary?: string
    date_met?: string
    meeting_event?: string
    follow_up_priority?: string
    follow_up_suggestion?: string
  }
}

export async function sendConnectionNotificationEmail(emailData: EmailData): Promise<void> {
  const { user_name, profile_name, profile_url, analysis } = emailData

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; background: white; border-radius: 8px; }
          .header { background: #0a66c2; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px; }
          .summary-box { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #0a66c2; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Connection Made!</h1>
          </div>
          <div class="content">
            <p>Hi ${user_name},</p>
            <p>Great news! Your conversation with <strong>${profile_name}</strong> has been processed successfully!</p>
            
            <div class="summary-box">
              <h3>💬 Conversation Summary:</h3>
              <p>${analysis.conversation_summary || 'Summary will be available shortly.'}</p>
            </div>

            <p><strong>Connection Details:</strong></p>
            <ul>
              <li><strong>Name:</strong> ${profile_name || 'Unknown'}</li>
              <li><strong>LinkedIn:</strong> <a href="${profile_url}" target="_blank">${profile_url}</a></li>
              <li><strong>Date:</strong> ${analysis.date_met || new Date().toISOString().split('T')[0]}</li>
              <li><strong>Event:</strong> ${analysis.meeting_event || 'Networking'}</li>
              <li><strong>Priority:</strong> ${analysis.follow_up_priority || 'Medium'}</li>
            </ul>

            ${analysis.follow_up_suggestion ? `
            <div class="summary-box">
              <h3>💡 Follow-up Suggestion:</h3>
              <p>${analysis.follow_up_suggestion}</p>
            </div>
            ` : ''}

            <p>Keep building those connections! 🚀</p>
          </div>
        </div>
      </body>
    </html>
  `

  await sendEmail({
    to: 'verandafeng@gmail.com',
    subject: `🎉 Congrats you made a new connection with ${profile_name}`,
    html: emailHtml,
  })
  
  console.log('Email notification sent successfully to: verandafeng@gmail.com')
}
