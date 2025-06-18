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
          <h1 style={{ fontSize: '3rem', fontWeight: '400', color: '#2d5016', marginBottom: '2rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
            Privacy Policy
          </h1>

          <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: '3rem', border: '1px solid #c3d9c6', lineHeight: '1.7', color: '#2d5016' }}>
            <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
              <strong>Last updated: {new Date().toLocaleDateString()}</strong>
            </p>

            {/* סעיפים 1–13 נשארים כפי ששלחת, מקוצרים כאן לצורך הפוקוס על סעיף 14 */}

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              13. Data Protection Officer (Israeli Law)
            </h2>
            <p style={{ marginBottom: '2rem' }}>
              For matters specifically related to data protection and privacy under Israeli law, you may contact our Data Protection Officer at privacy@yaya.com.
            </p>

            {/* סעיף חדש לפי דרישות גוגל */}
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
