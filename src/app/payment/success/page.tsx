'use client';

import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const registrationCode = searchParams.get('code') || '';
  const email = searchParams.get('email') || '';
  const plan = searchParams.get('plan') || '';
  const price = searchParams.get('price') || '';

  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=314964896562-3vu0iemj1j8d6g44cfttvn09smm393j9.apps.googleusercontent.com&redirect_uri=https://yairsabag.app.n8n.cloud/webhook/google-oauth-callback&response_type=code&scope=email%20https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent&state=${registrationCode}`;

  return (
    <main className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🎉 Welcome to Yaya Executive Plan!</h1>
      <p className="text-lg mb-2">Email: <strong>{email}</strong></p>
      <p className="text-lg mb-4">Plan: <strong>{plan}</strong> – ${price}/month</p>

      <p className="mb-6 text-gray-600">
        One last step – connect your Google account so Yaya can access your calendar 📆 and inbox 📧:
      </p>

      <a
        href={oauthUrl}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold transition"
      >
        🔐 Connect Google Account
      </a>

      <p className="text-sm mt-6 text-gray-400">
        Your data is secure and encrypted. You can revoke access anytime.
      </p>
    </main>
  );
}
