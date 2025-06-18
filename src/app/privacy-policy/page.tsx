 'use client'
import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016' }}>Yaya</span>
          </a>
          <a href="/" style={{ color: '#4a5568', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
            ← Back to Home
          </a>
        </div>
      </header>

      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '400', 
            color: '#2d5016', 
            marginBottom: '2rem',
            textAlign: 'center',
            letterSpacing: '-0.02em'
          }}>
            Privacy Policy
          </h1>

          <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: '3rem', border: '1px solid #c3d9c6', lineHeight: '1.7', color: '#2d5016' }}>
            
            <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
              <strong>Last updated: {new Date().toLocaleDateString()}</strong>
            </p>

            <p style={{ marginBottom: '2rem', fontSize: '1rem' }}>
              This Privacy Policy describes how Yaya ("we," "our," or "us") collects, uses, and protects your personal information when you use our AI assistant service through WhatsApp and our website.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              1. Information We Collect
            </h2>
            
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d5016', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              Information You Provide:
            </h3>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>WhatsApp phone number when you first message Yaya</li>
              <li style={{ marginBottom: '0.5rem' }}>Email address and contact information for paid subscriptions</li>
              <li style={{ marginBottom: '0.5rem' }}>Messages and content you send to Yaya (reminders, notes, calendar events)</li>
              <li style={{ marginBottom: '0.5rem' }}>Calendar data when you connect Google Calendar or Outlook</li>
            </ul>

            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d5016', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              Information Automatically Collected:
            </h3>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Usage data and interaction patterns with Yaya</li>
              <li style={{ marginBottom: '0.5rem' }}>Technical information (IP address, device type, browser information)</li>
              <li style={{ marginBottom: '0.5rem' }}>WhatsApp message metadata (timestamp, delivery status)</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              2. How We Use Your Information
            </h2>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>To provide and improve Yaya's AI assistant services</li>
              <li style={{ marginBottom: '0.5rem' }}>To manage your reminders, calendar events, and notes</li>
              <li style={{ marginBottom: '0.5rem' }}>To process payments and manage subscriptions</li>
              <li style={{ marginBottom: '0.5rem' }}>To send you service-related notifications</li>
              <li style={{ marginBottom: '0.5rem' }}>To analyze usage patterns and improve our service</li>
              <li style={{ marginBottom: '0.5rem' }}>To comply with legal obligations</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              3. Legal Basis for Processing (Israeli and EU Law)
            </h2>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Your consent when you start using Yaya</li>
              <li style={{ marginBottom: '0.5rem' }}>Contract performance for paid services</li>
              <li style={{ marginBottom: '0.5rem' }}>Legitimate interests for service improvement</li>
              <li style={{ marginBottom: '0.5rem' }}>Legal obligations for compliance and safety</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              4. Data Sharing and Disclosure
            </h2>
            <p style={{ marginBottom: '1rem' }}>We do not sell your personal data. We may share your information only in the following circumstances:</p>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>With third-party services you connect (Google Calendar, Outlook)</li>
              <li style={{ marginBottom: '0.5rem' }}>With payment processors for subscription billing</li>
              <li style={{ marginBottom: '0.5rem' }}>When required by law or to protect safety</li>
              <li style={{ marginBottom: '0.5rem' }}>With service providers who assist in operations (under strict confidentiality)</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              5. Data Security
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption in transit and at rest, access controls, and regular security assessments.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              6. Data Retention
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We retain your personal data only as long as necessary to provide our services and comply with legal obligations. When you delete your account or terminate your subscription, we will delete your personal data within 30 days, except where retention is required by law.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              7. Your Rights
            </h2>
            <p style={{ marginBottom: '1rem' }}>Under Israeli Privacy Protection Law and other applicable laws, you have the right to:</p>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Access your personal data</li>
              <li style={{ marginBottom: '0.5rem' }}>Correct inaccurate or incomplete data</li>
              <li style={{ marginBottom: '0.5rem' }}>Delete your personal data</li>
              <li style={{ marginBottom: '0.5rem' }}>Object to processing</li>
              <li style={{ marginBottom: '0.5rem' }}>Data portability</li>
              <li style={{ marginBottom: '0.5rem' }}>Withdraw consent at any time</li>
            </ul>
            <p style={{ marginBottom: '1.5rem' }}>
              To exercise these rights, please contact us at info@yaya.com.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              8. International Data Transfers
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Your data may be processed in countries outside of Israel. When we transfer data internationally, we ensure appropriate safeguards are in place to protect your privacy in accordance with applicable data protection laws.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              9. Children's Privacy
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Yaya is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              10. Cookies and Tracking
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Our website uses cookies and similar technologies to improve user experience and analyze usage. You can control cookie settings through your browser preferences.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              11. Changes to This Privacy Policy
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website and, where appropriate, through Yaya or email notifications.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              12. Contact Information
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              For any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Email: info@yaya.com</li>
              <li style={{ marginBottom: '0.5rem' }}>WhatsApp: +972 55-994-3649</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              13. Data Protection Officer (Israeli Law)
            </h2>
            <p style={{ marginBottom: '2rem' }}>
              For matters specifically related to data protection and privacy under Israeli law, you may contact our Data Protection Officer at privacy@yaya.com.
            </p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
             14. Use of Google User Data & AI/ML Compliance
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Yaya uses Google Calendar APIs to allow users to view, create, and manage calendar events directly from WhatsApp.
              We do not use or transfer information received from Google APIs to any third party except as necessary to provide and improve the user-facing features of the app.
              We comply with the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#2d5016', textDecoration: 'underline' }}>
              Google API Services User Data Policy
           </a>, including the Limited Use requirements.
           </p>
           <p style={{ marginBottom: '1.5rem' }}>
             Our AI/ML models only process user data to perform tasks explicitly requested by the user (e.g., summarizing emails, creating events).
             No Google user data is used to train models or for any secondary purposes.
           </p>

            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #c3d9c6' }}>
              This Privacy Policy is designed to comply with Israeli Privacy Protection Law, GDPR, and other applicable privacy regulations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#1a202c', color: '#a0aec0', padding: '3rem 0', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '500', color: 'white' }}>Yaya</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            fontSize: '0.875rem'
          }}>
            <a href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/terms-of-service" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="mailto:info@yaya.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@yaya.com</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
