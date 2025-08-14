const { Resend } = require('resend');

// Paste your ACTUAL API key here
const resend = new Resend('re_BWBJkqqL_BqQFG6UMprYQj8Pt6W7Ux85i'); // Use your FULL key

async function test() {
  console.log('Testing email with key:', 're_BeLc9yTZ...'.substring(0, 10) + '...');
  
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'kandarp.relhan@gmail.com',
      subject: 'Test Email - Your App Works!',
      html: '<h1>Success!</h1><p>If you see this, email is working!</p>',
    });
    console.log('✅ Email sent successfully:', data);
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

test();