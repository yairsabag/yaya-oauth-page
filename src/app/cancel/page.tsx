'use client';

import React, { useEffect, useMemo, useState } from 'react';

export default function CancelPage() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');      // אופציונלי לאימות עדין
  const [reason, setReason] = useState('');    // אופציונלי
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<null | { ok: boolean; msg: string }>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setCode((p.get('code') || '').trim());
  }, []);

  const canSubmit = useMemo(() => code.length >= 4 && !loading, [code, loading]);

  const handleCancel = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setDone(null);
    try {
      const res = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,         // registration_code בלבד
          email: email.trim() || undefined,
          reason: reason.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Cancel failed');
      setDone({ ok: true, msg: data?.message || 'Your subscription was cancelled.' });
    } catch (e: any) {
      setDone({ ok: false, msg: e.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div style={{
        width: '100%', maxWidth: 560, background: 'white', borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        padding: 20
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom: 8 }}>
          <img src="/yaya-logo.png" alt="Yaya" style={{ width: 48, height: 48 }} />
          <h1 style={{ margin: 0, color:'#2d5016', fontSize: 22, fontWeight: 800 }}>Cancel subscription</h1>
        </div>

        <p style={{ color:'#6b7280', marginTop: 6 }}>
          Enter your code and confirm cancellation. You can always come back anytime 💛
        </p>

        <label style={label}>Registration code</label>
        <input style={input} value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. JRXG7C" />

        <label style={label}>Email (optional, for confirmation)</label>
        <input style={input} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />

        <label style={label}>Reason (optional)</label>
        <input style={input} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Why are you cancelling?" />

        <button
          onClick={handleCancel}
          disabled={!canSubmit}
          style={{
            marginTop: 12, width:'100%', padding:'14px 20px',
            background: '#b91c1c', color: 'white', border: 'none', borderRadius: 10,
            fontSize: '1rem', fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed',
            opacity: canSubmit ? 1 : .6
          }}
        >
          {loading ? 'Cancelling…' : 'Cancel my subscription'}
        </button>

        {done && (
          <div style={{
            marginTop: 12, padding: 12, borderRadius: 10,
            background: done.ok ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.08)',
            border: `1px solid ${done.ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.25)'}`,
            color: done.ok ? '#166534' : '#7f1d1d'
          }}>
            {done.msg}
          </div>
        )}
      </div>
    </div>
  )
}

const label: React.CSSProperties = { display:'block', fontSize:'.85rem', color:'#6b7280', marginTop: 10, marginBottom: 6 };
const input:  React.CSSProperties = { width:'100%', padding:'10px 12px', borderRadius: 10, border:'1px solid #E5DDD5', outline:'none', fontSize:'.95rem' };
