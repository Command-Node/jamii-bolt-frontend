import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token from URL query params
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(errorParam);
          setStatus('error');
          return;
        }

        if (!token) {
          setError('No authentication token received');
          setStatus('error');
          return;
        }

        // Store token
        localStorage.setItem('jamii_token', token);

        // Get role from sessionStorage (set during OAuth initiation)
        const role = sessionStorage.getItem('oauth_role') || 'customer';
        sessionStorage.removeItem('oauth_role');

        // Refresh user profile
        await refreshProfile();

        // Redirect to appropriate dashboard
        setStatus('success');
        setTimeout(() => {
          navigate(role === 'helper' ? '/dashboard/helper' : '/dashboard/customer');
        }, 1500);
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshProfile]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-gray-600">Completing sign-in...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign-in Failed</h2>
          <p className="text-gray-600 mb-6">{error || 'An error occurred during authentication'}</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E5612F] transition-all font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign-in Successful!</h2>
        <p className="text-gray-600 mb-6">Redirecting to your dashboard...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35] mx-auto"></div>
      </div>
    </div>
  );
}

