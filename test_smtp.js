require('dotenv').config();
const nodemailer = require('nodemailer');

async function testConnection() {
    console.log(`Testing SMTP Connection for: ${process.env.EMAIL_USER}`);
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
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
        const success = await transporter.verify();
        if (success) {
            console.log("✅ SMTP Verification SUCCESS! The credentials are valid and the server is accepting connections.");
            
            // Try sending a test email to the user
            const info = await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: "🦆 Duckshow Local Diagnostics Email",
                text: "If you are reading this, your Gmail App Password is correct and Nodemailer is working locally!"
            });
            console.log(`✅ Test Email Sent! Message ID: ${info.messageId}`);
        }
    } catch (error) {
        console.error("❌ SMTP Verification FAILED. The credentials or network might be the issue.");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
    }
}

testConnection();
