import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, ExternalLink, DollarSign, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type OnboardingStatus = {
  hasStripeAccount: boolean;
  stripeAccountId?: string;
  onboardingComplete: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  detailsSubmitted: boolean;
};

export function StripeConnectOnboarding() {
  const { user } = useAuth();
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingOnboarding, setIsStartingOnboarding] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOnboardingStatus();
    }
  }, [user]);

  const fetchOnboardingStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('helper_stripe_accounts')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setStatus({
          hasStripeAccount: true,
          stripeAccountId: data.stripe_account_id,
          onboardingComplete: data.onboarding_complete,
          payoutsEnabled: data.payouts_enabled,
          chargesEnabled: data.charges_enabled,
          detailsSubmitted: data.details_submitted,
        });
      } else {
        setStatus({
          hasStripeAccount: false,
          onboardingComplete: false,
          payoutsEnabled: false,
          chargesEnabled: false,
          detailsSubmitted: false,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch onboarding status');
    } finally {
      setLoading(false);
    }
  };

  const handleStartOnboarding = async () => {
    setIsStartingOnboarding(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/connect/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to start onboarding');
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start onboarding process');
    } finally {
      setIsStartingOnboarding(false);
    }
  };

  const handleRefreshStatus = async () => {
    setError(null);
    try {
      const response = await fetch(`/api/stripe/connect/status?userId=${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to refresh status');
      }
      await fetchOnboardingStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh status');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!status?.hasStripeAccount) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Receiving Payments</h2>
          <p className="text-gray-600">
            Connect your bank account to receive payouts from completed jobs
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6 border border-green-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            How Payouts Work
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Customer pays when booking your service</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Funds are held securely in escrow during the job</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>After job completion, you receive 90% of the payment</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Automatic payouts to your bank account within 2-3 business days</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Secure & Trusted</h4>
              <p className="text-xs text-gray-600">
                Your banking information is processed securely by Stripe, a trusted payment processor used by millions worldwide.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleStartOnboarding}
          disabled={isStartingOnboarding}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isStartingOnboarding ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Connecting to Stripe...
            </>
          ) : (
            <>
              Connect Bank Account
              <ExternalLink className="w-5 h-5 ml-2" />
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          You will be redirected to Stripe to securely connect your bank account
        </p>
      </div>
    );
  }

  const allComplete = status.onboardingComplete && status.payoutsEnabled && status.chargesEnabled;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Stripe Connect Status</h2>
          {allComplete && (
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Active</span>
            </div>
          )}
        </div>
        <p className="text-gray-600">Account ID: {status.stripeAccountId}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            {status.onboardingComplete ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">Onboarding Complete</h3>
              <p className="text-sm text-gray-600">Account setup and verification</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            {status.payoutsEnabled ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">Payouts Enabled</h3>
              <p className="text-sm text-gray-600">Ability to receive funds</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            {status.chargesEnabled ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">Charges Enabled</h3>
              <p className="text-sm text-gray-600">Ability to accept payments</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            {status.detailsSubmitted ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">Details Submitted</h3>
              <p className="text-sm text-gray-600">All required information provided</p>
            </div>
          </div>
        </div>
      </div>

      {!allComplete && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Action Required</h4>
              <p className="text-sm text-gray-700 mb-3">
                Complete your Stripe Connect setup to start receiving payments
              </p>
              <button
                onClick={handleStartOnboarding}
                disabled={isStartingOnboarding}
                className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
              >
                {isStartingOnboarding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    Continue Setup
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handleRefreshStatus}
        className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
      >
        Refresh Status
      </button>
    </div>
  );
}


