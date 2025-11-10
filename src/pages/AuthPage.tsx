import { useState } from 'react';
import { LogIn, UserPlus, AlertCircle, Mail, Shield, Zap, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthPageProps = {
  onNavigate: (page: string) => void;
};

export function AuthPage({ onNavigate }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'helper'>('customer');
  const [selectedTier, setSelectedTier] = useState<'basic' | 'pro' | 'premium'>('basic');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedOAuthRole, setSelectedOAuthRole] = useState<'customer' | 'helper'>('customer');

  const { signIn, signUp, signInWithGoogle, signInWithApple } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName, role);
        onNavigate(role === 'helper' ? 'helper-dashboard' : 'customer-dashboard');
      } else {
        const { profile: userProfile } = await signIn(email, password);
        onNavigate(userProfile?.role === 'helper' ? 'helper-dashboard' : 'customer-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setError('');
    setLoading(true);
    try {
      if (provider === 'google') {
        await signInWithGoogle(selectedOAuthRole);
      } else {
        await signInWithApple(selectedOAuthRole);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            {isSignUp && (
              <div className="inline-block bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide mb-4">
                BRING BACK THE UNITY IN COMMUNITY
              </div>
            )}
            <h2 className="text-3xl font-bold text-[#1F2937] mb-2">
              {isSignUp ? 'Join JAMII' : 'Welcome Back'}
            </h2>
            <p className="text-[#6B7280]">
              {isSignUp
                ? 'Start rebuilding authentic neighborhood connections'
                : 'Continue building unity in your community'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-1">Authentication Error</p>
                  <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
                  {error.includes('Cannot connect to backend') && (
                    <div className="mt-3 p-3 bg-red-100 rounded text-xs text-red-800">
                      <p className="font-semibold mb-1">Troubleshooting:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Check if VITE_API_BASE_URL is set in Vercel environment variables</li>
                        <li>Verify backend CORS allows your frontend URL</li>
                        <li>Check browser console (F12) for detailed error messages</li>
                        <li>See FIX_VERCEL_DEPLOYMENT_ERRORS.md for complete guide</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-6">
            {isSignUp && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#6B7280] mb-3">
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setRole('customer');
                        setSelectedOAuthRole('customer');
                      }}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        role === 'customer'
                          ? 'border-[#FF6B35] bg-orange-50 text-[#E5612F]'
                          : 'border-gray-300 bg-white text-[#6B7280] hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">Find Help</div>
                      <div className="text-xs mt-1">I need services</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRole('helper');
                        setSelectedOAuthRole('helper');
                      }}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        role === 'helper'
                          ? 'border-[#FF6B35] bg-orange-50 text-[#E5612F]'
                          : 'border-gray-300 bg-white text-[#6B7280] hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">Offer Help</div>
                      <div className="text-xs mt-1">I provide services</div>
                    </button>
                  </div>
                </div>

                {role === 'helper' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#6B7280] mb-3">
                      Choose Your Tier
                    </label>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTier('basic')}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          selectedTier === 'basic'
                            ? 'border-gray-600 bg-gray-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-gray-600" />
                          <div className="flex-1">
                            <div className="font-semibold text-[#1F2937]">Basic - FREE</div>
                            <div className="text-xs text-[#6B7280]">1 service, $250 cap, 10% fee</div>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTier('pro')}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          selectedTier === 'pro'
                            ? 'border-[#FF6B35] bg-orange-50'
                            : 'border-gray-300 bg-white hover:border-[#FF6B35]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Zap className="w-5 h-5 text-[#FF6B35]" />
                          <div className="flex-1">
                            <div className="font-semibold text-[#1F2937] flex items-center space-x-2">
                              <span>Pro - $25/mo</span>
                              <span className="px-2 py-0.5 bg-[#FF6B35] text-white text-xs rounded-full">Popular</span>
                            </div>
                            <div className="text-xs text-[#6B7280]">Unlimited services, shop, 8% fee</div>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTier('premium')}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          selectedTier === 'premium'
                            ? 'border-[#2ECC71] bg-green-50'
                            : 'border-gray-300 bg-white hover:border-[#2ECC71]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Crown className="w-5 h-5 text-[#2ECC71]" />
                          <div className="flex-1">
                            <div className="font-semibold text-[#1F2937]">Premium - $50/mo</div>
                            <div className="text-xs text-[#6B7280]">Enhanced shop, 5% fee, VIP status</div>
                          </div>
                        </div>
                      </button>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-2">
                      You can change your tier anytime after signing up
                    </p>
                  </div>
                )}
              </>
            )}

            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn('apple')}
              disabled={loading}
              className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-medium flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#6B7280]">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-[#6B7280] mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#6B7280] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#6B7280] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
              {isSignUp && (
                <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E5612F] transition-all font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Create Account</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-[#FF6B35] hover:text-[#E5612F] font-medium"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>

          {isSignUp && role === 'helper' && (
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-[#2ECC71]">
                <strong>Next steps after signup:</strong> Complete ID verification, add your services, and start earning in your local community!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


