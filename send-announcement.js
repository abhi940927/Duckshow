require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dns = require('dns');

// CRITICAL FIX FOR RAILWAY IPv6 TIMEOUTS
dns.setDefaultResultOrder('ipv4first');

const User = require('./models/User');

const dryRun = process.argv.includes('--dry-run');

async function sendAnnouncements() {
    console.log('🚀 Starting Duckshow Bulk Announcement System');
    if (dryRun) console.log('🧪 DRY RUN MODE ENABLED - No real emails will be sent except to the admin email.');

    if (!process.env.MONGODB_URI || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Missing environment variables. Check .env file.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const transporter = nodemailer.createTransport({
            host: '142.251.10.108', // Hardcoded IPv4 for smtp.gmail.com
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                servername: 'smtp.gmail.com',
                rejectUnauthorized: false
            }
        });

        const users = await User.find({});
        console.log(`📋 Found ${users.length} users in the database.`);

        for (const user of users) {
            const recipientEmail = dryRun ? process.env.EMAIL_USER : (user.email || user.phone);
            
            // Skip users without valid email if not in dry run
            if (!dryRun && (!user.email || !user.email.includes('@'))) {
                console.warn(`⚠️ Skipping user ${user.name} - No valid email.`);
                continue;
            }

            const mailOptions = {
                from: `"Duckshow Team" <${process.env.EMAIL_USER}>`,
                to: recipientEmail,
                subject: '🦆 Duckshow is Live! Your Streaming Journey Begins Now',
                html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #070707; color: #f5f5f0; padding: 0; margin: 0;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070707; padding: 40px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #141414; border-radius: 12px; overflow: hidden; border: 1px solid #1e1e1e;">
                                    <!-- Header -->
                                    <tr>
                                        <td align="center" style="padding: 40px 0; background: linear-gradient(135deg, #141414 0%, #000 100%);">
                                            <h1 style="color: #FFD600; font-size: 36px; letter-spacing: 6px; margin: 0; font-weight: 900;">DUCKSHOW</h1>
                                            <p style="color: #666; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">Premium Streaming</p>
                                        </td>
                                    </tr>
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding: 40px 50px;">
                                            <h2 style="color: #FFD600; font-size: 24px; margin-bottom: 20px;">Hi ${user.name},</h2>
                                            <p style="font-size: 16px; line-height: 1.6; color: #ccc;">
                                                We're thrilled to announce that <strong>Duckshow</strong> is officially live! Your account is ready, and a world of premium cinematic content is waiting for you.
                                            </p>
                                            
                                            <div style="background: rgba(255, 214, 0, 0.05); padding: 25px; border-left: 4px solid #FFD600; margin: 30px 0; border-radius: 4px;">
                                                <h3 style="color: #FFD600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Your Account Details:</h3>
                                                <table width="100%" border="0" cellspacing="0" cellpadding="5">
                                                    <tr>
                                                        <td width="30%" style="color: #888; font-size: 14px;">Username:</td>
                                                        <td style="color: #fff; font-size: 14px; font-weight: bold;">${user.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="color: #888; font-size: 14px;">Registered ${user.email ? 'Email' : 'Phone'}:</td>
                                                        <td style="color: #fff; font-size: 14px; font-weight: bold;">${user.email || user.phone}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="color: #888; font-size: 14px;">Status:</td>
                                                        <td style="color: #00ff88; font-size: 14px; font-weight: bold;">Active ✅</td>
                                                    </tr>
                                                </table>
                                            </div>

                                            <p style="font-size: 16px; line-height: 1.6; color: #ccc;">
                                                From pulse-pounding action to heart-wrenching dramas, our curated library is built for true film lovers.
                                            </p>

                                            <div align="center" style="margin: 40px 0;">
                                                <a href="http://localhost:3000/login" style="background-color: #FFD600; color: #000; padding: 16px 40px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">START STREAMING NOW</a>
                                            </div>

                                            <p style="color: #888; font-size: 13px; font-style: italic; border-top: 1px solid #222; padding-top: 20px;">
                                                "Silence is law, but the truth is buried deep." — Watch <strong>Dark Waters</strong>, a Duckshow Original, streaming now.
                                            </p>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td align="center" style="padding: 30px; background-color: #0d0d0d; border-top: 1px solid #1e1e1e;">
                                            <p style="color: #666; font-size: 12px; margin: 0;">© 2026 Duckshow Streaming Private Limited</p>
                                            <p style="color: #444; font-size: 11px; margin-top: 10px;">If you have any questions, reply to this email or visit our Help Center.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`✅ Announcement sent to: ${user.name} (${recipientEmail})`);

            if (dryRun) {
                console.log('🧪 Dry run successful for first user. Exiting.');
                break;
            }
            
            // Wait 1 second between emails to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('✨ All announcements processed!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error during announcement process:', err);
        process.exit(1);
    }
}

sendAnnouncements();
