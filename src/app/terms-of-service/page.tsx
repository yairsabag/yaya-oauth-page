'use client'
import React from 'react'

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>

          <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: '3rem', border: '1px solid #c3d9c6', lineHeight: '1.7', color: '#2d5016' }}>
            
            <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
              <strong>Last updated: {new Date().toLocaleDateString()}</strong>
            </p>

            <p style={{ marginBottom: '2rem', fontSize: '1rem' }}>
              These Terms of Service ("Terms") govern your use of Yaya ("we," "our," or "us") products and services ("Services") including our website and conversational AI assistant. By accessing or using our Service, you agree to be bound by these Terms. Please read them carefully.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              By using Yaya, whether through WhatsApp or our website, you agree to these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use our Service.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              2. Description of Service
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Yaya is an AI assistant service that operates primarily through WhatsApp, allowing users to set reminders, manage calendars, take notes, and conduct other productivity-based tasks. Users can also access the service through our website.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              3. User Accounts
            </h2>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>To use Yaya, you must have a valid WhatsApp account. Your Yaya account is connected when you message Yaya for the first time.</li>
              <li style={{ marginBottom: '0.5rem' }}>Your account is primarily tied to your WhatsApp number. See our termination terms for questions about WhatsApp number deactivation and/or transfer.</li>
              <li style={{ marginBottom: '0.5rem' }}>Your Yaya account may additionally be linked to an email address if you choose to become a paying subscriber.</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              4. Use of Service
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Yaya provides productivity tools via an AI assistant Service. You may choose to subscribe to our paid services and cancel at anytime. Paid services may provide more features over non-paid services.
            </p>
            <p style={{ marginBottom: '0.5rem' }}><strong>You agree not to use Yaya:</strong></p>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>In any way that violates any applicable law or regulation</li>
              <li style={{ marginBottom: '0.5rem' }}>To send spam or any other unauthorized advertisements or solicitations</li>
              <li style={{ marginBottom: '0.5rem' }}>To impersonate or attempt to impersonate Yaya, a Yaya employee, another user, or any other person or entity</li>
              <li style={{ marginBottom: '0.5rem' }}>In any way that could disable, overburden, damage, or impair the service</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              5. Acceptable Use
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              When conversing with Yaya, you may not attempt to get it to discuss harmful, abusive, or illegal topics. You may not attempt to evade our security, learn about Yaya's algorithms, prompts, models, or source code. Your account may be terminated and deleted if we encounter such activity.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              6. Free Trial and Subscription
            </h2>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>We offer a 7-day free trial for paid plans</li>
              <li style={{ marginBottom: '0.5rem' }}>You can cancel anytime during the trial period without charge</li>
              <li style={{ marginBottom: '0.5rem' }}>After the trial, your subscription will automatically renew unless cancelled</li>
              <li style={{ marginBottom: '0.5rem' }}>You can cancel your subscription at any time through your account settings or by contacting support</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              7. Termination
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              We may terminate or suspend your access to Yaya immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              Upon termination, your right to use the service will immediately cease. Your subscription will be cancelled, connected third party APIs will be disabled, and all personal data related to you will be permanently deleted in accordance with applicable data protection laws.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              8. Data Protection and Privacy
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We are committed to protecting your privacy and complying with applicable data protection laws, including Israeli Privacy Protection Law. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your personal data.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              9. Account Transfer and Deletion
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              We do not support transferring accounts across emails or phone numbers. We automatically detect when a WhatsApp account has been transferred or deactivated. In this case, we automatically delete all your personal data related to Yaya and Services.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              If you would like to request account deletion, please email us at info@yaya.com with relevant details.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              10. Limitation of Liability
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              To the maximum extent permitted by law, in no event shall Yaya be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              11. Changes to Service and Terms
            </h2>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice</li>
              <li style={{ marginBottom: '0.5rem' }}>We may revise these Terms from time to time. The most current version will always be posted on our website</li>
              <li style={{ marginBottom: '0.5rem' }}>By continuing to use Yaya after those revisions become effective, you agree to be bound by the revised Terms</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              12. Governing Law
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              These Terms shall be governed by and construed in accordance with the laws of Israel. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Israel.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016', marginTop: '2rem', marginBottom: '1rem' }}>
              13. Contact Us
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Email: info@yaya.com</li>
              <li style={{ marginBottom: '0.5rem' }}>WhatsApp: +972 55-994-3649</li>
            </ul>

            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #c3d9c6' }}>
              By using Yaya, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
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
