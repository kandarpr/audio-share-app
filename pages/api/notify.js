import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  console.log('=== EMAIL API CALLED ===');
  console.log('Method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, filename } = req.body;

  console.log('Attempting to send email...');
  console.log('To:', email);
  console.log('Filename:', filename);
  console.log('API Key exists:', !!process.env.RESEND_API_KEY);
  console.log('API Key preview:', process.env.RESEND_API_KEY?.substring(0, 15) + '...');

  // Validate inputs
  if (!email || !filename) {
    console.error('Missing email or filename');
    return res.status(400).json({ 
      success: false, 
      error: 'Email and filename are required' 
    });
  }

  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">🎵 Your Audio File Was Downloaded!</h2>
        <p>Hello,</p>
        <p>Your audio file "<strong>${filename}</strong>" has just been downloaded.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>File Details:</strong></p>
          <ul>
            <li>File name: ${filename}</li>
            <li>Download date: ${new Date().toLocaleString()}</li>
          </ul>
        </div>
        <p><strong>Note:</strong> The file has been automatically deleted from our servers after download.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from Epiphany India Audio Share.
        </p>
      </div>
    `;

    console.log('Sending email via Resend...');
    
    const result = await resend.emails.send({
      from: 'Audio Share <onboarding@resend.dev>', // Using Resend's default for now
      to: email,
      subject: `✅ Your audio file "${filename}" was downloaded`,
      html: emailHtml,
    });

    console.log('Resend API response:', result);

    if (result.data) {
      console.log('✅ Email sent successfully with ID:', result.data.id);
      res.status(200).json({ 
        success: true, 
        messageId: result.data.id 
      });
    } else if (result.error) {
      console.error('❌ Resend error:', result.error);
      res.status(200).json({ 
        success: false, 
        error: result.error.message 
      });
    } else {
      console.log('Unexpected response:', result);
      res.status(200).json({ 
        success: false, 
        error: 'Unexpected response from email service' 
      });
    }
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    console.error('Full error:', error);
    
    // Still return success:false but don't break the download
    res.status(200).json({ 
      success: false, 
      error: error.message,
      note: 'Download completed but email failed' 
    });
  }
}