import React from 'react';

const InfoPageLayout = ({ title, children }) => (
    <div className="fade-in" style={{ 
        minHeight: '80vh', 
        padding: '140px 48px 100px',
        maxWidth: '800px',
        margin: '0 auto'
    }}>
        <h1 className="logo-font" style={{ fontSize: '3rem', color: 'var(--yellow)', marginBottom: '40px' }}>
            {title}
        </h1>
        <div style={{ 
            color: 'var(--white)', 
            lineHeight: '1.8', 
            fontSize: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        }}>
            {children}
        </div>
    </div>
);

export const About = () => (
    <InfoPageLayout title="ABOUT DUCKSHOW">
        <p>Duckshow is a premier streaming platform designed for ducks, by ducks. We believe that every duck deserves access to high-quality entertainment, from cinematic pond thrillers to feather-ruffling comedies.</p>
        <p>Founded in 2026, Duckshow has quickly grown into the world's most popular streaming destination for the avian community. Our mission is to provide a safe, engaging, and ad-free environment for users to explore the best content from across the globe.</p>
        <h2 style={{ color: 'var(--yellow)', marginTop: '20px' }}>Our Vision</h2>
        <p>A world where every beak has something beautiful to watch. We are committed to fostering creativity, supporting independent duck creators, and pushing the boundaries of what streaming technology can achieve.</p>
    </InfoPageLayout>
);

export const Privacy = () => (
    <InfoPageLayout title="PRIVACY POLICY">
        <p>At Duckshow, your privacy is our top priority. We are committed to protecting the data you share with us and ensuring that your streaming experience remains secure and private.</p>
        <h3 style={{ color: 'var(--yellow)' }}>What Data We Collect</h3>
        <p>We collect basic account information (name, email, age) and your viewing history to improve our recommendations. We do not sell your data to third-party hawks or hunters.</p>
        <h3 style={{ color: 'var(--yellow)' }}>How We Use It</h3>
        <p>Your data is used solely to personalize your dashboard, manage your subscription, and ensure the security of your account. We use industry-standard encryption to protect your information.</p>
        <p>For more details, contact our privacy officer at privacy@duckshow.com.</p>
    </InfoPageLayout>
);

export const Terms = () => (
    <InfoPageLayout title="TERMS OF SERVICE">
        <p>Welcome to Duckshow. By using our service, you agree to follow the rules of the pond. Please read these terms carefully before diving in.</p>
        <h3 style={{ color: 'var(--yellow)' }}>User Conduct</h3>
        <p>Users must be at least 9 years old. Accounts are for personal use only and should not be shared with predatory species. Please maintain a respectful environment when interacting with our platform.</p>
        <h3 style={{ color: 'var(--yellow)' }}>Content Ownership</h3>
        <p>All content on Duckshow is protected by copyright. Unauthorized distribution or copying of our original series is strictly prohibited and may result in a permanent ban from the local lake.</p>
        <p>Duckshow reserves the right to modify these terms at any time. Significant changes will be announced via email.</p>
    </InfoPageLayout>
);
