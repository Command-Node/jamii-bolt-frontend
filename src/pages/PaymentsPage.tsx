import { useState } from 'react';
import { CreditCard, TrendingDown, Settings, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PaymentHistory } from '../components/PaymentHistory';
import { PaymentMethodManager } from '../components/PaymentMethodManager';
import { StripeConnectOnboarding } from '../components/StripeConnectOnboarding';
import { EarningsDashboard } from '../components/EarningsDashboard';

type PaymentsPageProps = {
  onNavigate: (page: string) => void;
};

export function PaymentsPage({ onNavigate }: PaymentsPageProps) {
  const { activeRole } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              {activeRole === 'customer' ? (
                <TrendingDown className="w-8 h-8 text-[#FF6B35]" />
              ) : (
                <CreditCard className="w-8 h-8 text-[#2ECC71]" />
              )}
              <h1 className="text-3xl font-bold text-gray-900">
                {activeRole === 'customer' ? 'Payment History' : 'Earnings & Payments'}
              </h1>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <Settings className="w-5 h-5" />
              <span>Payment Settings</span>
            </button>
          </div>
          <p className="text-gray-600">
            {activeRole === 'customer'
              ? 'View all your payments and transactions'
              : 'Track your earnings and payment history'}
          </p>
        </div>

        {activeRole === 'helper' && (
          <div className="mb-8">
            <EarningsDashboard />
          </div>
        )}

        <PaymentHistory viewMode={activeRole} />
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-[#FF6B35]" />
                <h2 className="text-2xl font-bold text-gray-900">Payment Settings</h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {activeRole === 'helper' ? (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Stripe Connect Setup</h3>
                    <p className="text-gray-600 mb-4">
                      Connect your bank account to receive payouts from completed jobs
                    </p>
                    <StripeConnectOnboarding />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h3>
                    <p className="text-gray-600 mb-4">
                      Manage your saved payment methods for quick checkout
                    </p>
                    <PaymentMethodManager />
                  </div>
                </>
              )}

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


