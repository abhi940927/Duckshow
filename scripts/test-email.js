require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('Testing Email Credentials in .env');
    console.log('User:', process.env.EMAIL_USER);
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, // SSL
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: `"Duckshow Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self
            subject: '🦆 Duckshow Email Test Pipeline',
            text: 'If you receive this, Nodemailer is working perfectly on the server.',
            html: '<b>If you receive this, Nodemailer is working perfectly on the server.</b>'
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (err) {
        console.error('❌ Email sending failed.');
        console.error(err);
    }
}

testEmail();
