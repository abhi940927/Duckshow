require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const dns = require('dns');

// CRITICAL FIX FOR RAILWAY IPv4
dns.setDefaultResultOrder('ipv4first');

const User = require('./models/User');

const dryRun = process.argv.includes('--dry-run');

async function sendPromotion() {
    console.log('💎 Starting Duckshow Premium Promotional Campaign');
    if (dryRun) console.log('🧪 DRY RUN MODE - Targeted at admin email only.');

    if (!process.env.MONGODB_URI || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Environment variables missing.');
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
        console.log(`📋 Recipients: ${users.length} users.`);

        for (const user of users) {
            const recipientEmail = dryRun ? process.env.EMAIL_USER : (user.email || user.phone);
            
            if (!dryRun && (!user.email || !user.email.includes('@'))) {
                console.warn(`⚠️ Skipping ${user.name} - Invalid email.`);
                continue;
            }

            const mailOptions = {
                from: `"Duckshow Elite" <${process.env.EMAIL_USER}>`,
                to: recipientEmail,
                subject: '✨ Experience the Golden Age of Streaming at Duckshow',
                html: `
                <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #000; color: #fff; padding: 0; margin: 0; width: 100%;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000;">
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0c0c; border-radius: 16px; overflow: hidden; border: 1px solid #1a1a1a;">
                                    <!-- Banner Image -->
                                    <tr>
                                        <td>
                                            <img src="cid:promoBanner" alt="Duckshow Promotion" style="width: 100%; display: block; border-bottom: 2px solid #FFD600;">
                                        </td>
                                    </tr>
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 40px;">
                                            <div style="text-align: center; margin-bottom: 30px;">
                                                <h1 style="color: #FFD600; font-size: 28px; margin: 0; letter-spacing: 4px; text-transform: uppercase;">The Cinema Awaits</h1>
                                                <div style="height: 2px; width: 60px; background: #FFD600; margin: 15px auto;"></div>
                                            </div>

                                            <p style="font-size: 18px; line-height: 1.6; color: #fff; margin-bottom: 25px;">
                                                Dear ${user.name},
                                            </p>
                                            
                                            <p style="font-size: 16px; line-height: 1.6; color: #b0b0b0; margin-bottom: 30px;">
                                                Your journey into premium cinema has already begun. We have curated an "expensive" collection of global masterpieces, just for you. As a founding member, your credentials are active and your seat is reserved.
                                            </p>

                                            <!-- Personalization Card -->
                                            <div style="background: linear-gradient(135deg, #141414 0%, #0c0c0c 100%); padding: 30px; border-radius: 12px; border: 1px solid #222; margin: 30px 0; text-align: center;">
                                                <p style="color: #FFD600; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">Your Membership Profile</p>
                                                <h2 style="color: #fff; font-size: 22px; margin: 0 0 5px 0;">${user.name}</h2>
                                                <p style="color: #888; font-size: 14px; margin: 0;">Access ID: ${user.email || user.phone}</p>
                                                <div style="margin-top: 20px; display: inline-block; padding: 5px 15px; border-radius: 20px; border: 1px solid #FFD600; color: #FFD600; font-size: 12px; font-weight: bold;">PREMIUM MEMBER</div>
                                            </div>

                                            <div align="center" style="margin: 40px 0;">
                                                <a href="http://duckshow.net/" style="background-color: #FFD600; color: #000; padding: 18px 50px; border-radius: 100px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 10px 20px rgba(255, 214, 0, 0.2);">ENTER DUCKSHOW</a>
                                            </div>

                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="color: #444; font-size: 11px; text-align: center; line-height: 1.5;">
                                                        "A masterpiece is only half-written. The other half is finished by the one who watches."<br>
                                                        Join the conversation. Experience the excellence.
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td align="center" style="padding: 30px; background-color: #0a0a0a; border-top: 1px solid #1a1a1a;">
                                            <p style="color: #555; font-size: 11px; margin: 0; letter-spacing: 1px;">EXCLUSIVELY BY DUCKSHOW STREAMING</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
                `,
                attachments: [{
                    filename: 'promo-banner.png',
                    path: path.join(__dirname, 'promo-banner.png'),
                    cid: 'promoBanner'
                }]
            };

            await transporter.sendMail(mailOptions);
            console.log(`✨ Promotion sent to: ${user.name} (${recipientEmail})`);

            if (dryRun) {
                console.log('🧪 Dry run complete. Verify the email in your inbox.');
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 1500)); // Throttle
        }

        console.log('🏁 Campaign Finalized!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

sendPromotion();
