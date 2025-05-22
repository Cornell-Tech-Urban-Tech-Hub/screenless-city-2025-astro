import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, consent }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
      setConsent(false);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="your@email.com"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-1"
          />
          <span className="text-sm text-gray-600">
            I consent to receiving email updates about The Screenless City conference. 
            I understand that I can unsubscribe at any time. 
            Your email will be stored securely and will not be shared with third parties.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe for Updates'}
      </button>

      {status === 'success' && (
        <p className="mt-2 text-sm text-green-600">
          Thank you for subscribing! We'll keep you updated.
        </p>
      )}

      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </form>
  );
} 