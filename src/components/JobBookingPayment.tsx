import { useState } from 'react';
import { CreditCard, Shield, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type JobBookingPaymentProps = {
  serviceId: string;
  serviceName: string;
  helperName: string;
  helperId: string;
  servicePrice: number;
  jobDetails: {
    title: string;
    description: string;
    urgency: string;
  };
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
};

export function JobBookingPayment({
  serviceId,
  serviceName,
  helperName,
  helperId,
  servicePrice,
  jobDetails,
  onSuccess,
  onCancel,
}: JobBookingPaymentProps) {
  const { user } = useAuth();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([]);
  const [useNewCard, setUseNewCard] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMethods, setLoadingMethods] = useState(true);

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [zipCode, setZipCode] = useState('');

  const platformFee = servicePrice * 0.10;
  const totalAmount = servicePrice + platformFee;

  useState(() => {
    fetchPaymentMethods();
  });

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`/api/payment/methods?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setSavedPaymentMethods(data.paymentMethods || []);
        if (data.paymentMethods && data.paymentMethods.length > 0) {
          const defaultMethod = data.paymentMethods.find((m: any) => m.is_default);
          setSelectedPaymentMethod(defaultMethod?.id || data.paymentMethods[0].id);
        } else {
          setUseNewCard(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch payment methods:', err);
      setUseNewCard(true);
    } finally {
      setLoadingMethods(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    try {
      if (useNewCard) {
        if (cardNumber.length !== 16) {
          throw new Error('Please enter a valid 16-digit card number');
        }
        if (expiryDate.length !== 4) {
          throw new Error('Please enter a valid expiry date');
        }
        if (cvv.length < 3) {
          throw new Error('Please enter a valid CVV');
        }
      } else if (!selectedPaymentMethod) {
        throw new Error('Please select a payment method');
      }

      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user?.id,
          helperId,
          serviceId,
          amount: servicePrice,
          platformFee,
          totalAmount,
          paymentMethodId: useNewCard ? null : selectedPaymentMethod,
          newCard: useNewCard ? {
            cardNumber,
            expMonth: expiryDate.slice(0, 2),
            expYear: '20' + expiryDate.slice(2, 4),
            cvv,
            zipCode,
          } : null,
          jobDetails: {
            title: jobDetails.title,
            description: jobDetails.description,
            urgency: jobDetails.urgency,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }

      const data = await response.json();
      onSuccess(data.transactionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Let's Jamii with {helperName}</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Payment Protection</h3>
                <p className="text-xs text-gray-600">
                  Your payment is held securely until the job is completed. Both you and {helperName} must confirm completion before funds are released.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Your Jamii Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-medium text-gray-900">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Helper</span>
                <span className="font-medium text-gray-900">{helperName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Job</span>
                <span className="font-medium text-gray-900">{jobDetails.title}</span>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Price</span>
                <span className="font-semibold text-gray-900">${servicePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee (10%)</span>
                <span className="font-semibold text-gray-900">${platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-bold text-xl text-[#FF6B35]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmitPayment}>
            {!loadingMethods && savedPaymentMethods.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-900">Payment Method</label>
                  <button
                    type="button"
                    onClick={() => setUseNewCard(!useNewCard)}
                    className="text-sm text-[#FF6B35] hover:text-[#E5612F] font-semibold"
                  >
                    {useNewCard ? 'Use Saved Card' : 'Use New Card'}
                  </button>
                </div>

                {!useNewCard && (
                  <div className="space-y-3">
                    {savedPaymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-[#FF6B35] bg-orange-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-[#FF6B35] focus:ring-[#FF6B35]"
                        />
                        <CreditCard className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 capitalize">
                            {method.brand} •••• {method.last4}
                          </p>
                          <p className="text-sm text-gray-600">
                            Expires {String(method.exp_month).padStart(2, '0')}/{method.exp_year}
                          </p>
                        </div>
                        {method.is_default && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Default
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(useNewCard || savedPaymentMethods.length === 0) && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Card Number</label>
                  <input
                    type="text"
                    value={formatCardNumber(cardNumber)}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Expiry</label>
                    <input
                      type="text"
                      value={formatExpiryDate(expiryDate)}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">ZIP</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="12345"
                      maxLength={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={processing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  `Pay $${totalAmount.toFixed(2)}`
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secured by Stripe | Your payment information is encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


