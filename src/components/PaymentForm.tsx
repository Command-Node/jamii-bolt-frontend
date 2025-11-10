import { useState } from 'react';
import { CreditCard, Smartphone, DollarSign, Shield, AlertCircle } from 'lucide-react';

type PaymentFormProps = {
  servicePrice: number;
  helperName: string;
  serviceName: string;
  onPaymentSubmit: (paymentData: PaymentData) => Promise<void>;
  onCancel: () => void;
};

export type PaymentData = {
  amount: number;
  platform_fee: number;
  total: number;
  payment_method: string;
};

export function PaymentForm({
  servicePrice,
  helperName,
  serviceName,
  onPaymentSubmit,
  onCancel
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const platformFee = servicePrice * 0.10;
  const totalAmount = servicePrice + platformFee;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!termsAccepted) {
      setError('Please accept the terms and conditions to proceed.');
      return;
    }

    if (selectedMethod === 'card') {
      if (cardNumber.length !== 16) {
        setError('Please enter a valid 16-digit card number.');
        return;
      }
      if (expiryDate.length !== 4) {
        setError('Please enter a valid expiry date (MMYY).');
        return;
      }
      if (cvv.length < 3) {
        setError('Please enter a valid CVV.');
        return;
      }
      if (billingZip.length < 5) {
        setError('Please enter a valid ZIP code.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      const paymentData: PaymentData = {
        amount: servicePrice,
        platform_fee: platformFee,
        total: totalAmount,
        payment_method: selectedMethod === 'card' ? 'credit_card' : selectedMethod,
      };

      await onPaymentSubmit(paymentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
        <p className="text-gray-600">
          Booking <span className="font-semibold">{serviceName}</span> with <span className="font-semibold">{helperName}</span>
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Secure Payment Protection</h3>
            <p className="text-xs text-gray-600">
              Your payment is held securely until job completion. Both parties must confirm before funds are released.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="space-y-2">
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

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMethod === 'card'
                  ? 'border-[#FF6B35] bg-orange-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                selectedMethod === 'card' ? 'text-[#FF6B35]' : 'text-gray-600'
              }`} />
              <span className="text-xs font-semibold text-gray-900">Card</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('apple_pay')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMethod === 'apple_pay'
                  ? 'border-[#FF6B35] bg-orange-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Smartphone className={`w-6 h-6 mx-auto mb-2 ${
                selectedMethod === 'apple_pay' ? 'text-[#FF6B35]' : 'text-gray-600'
              }`} />
              <span className="text-xs font-semibold text-gray-900">Apple Pay</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('google_pay')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMethod === 'google_pay'
                  ? 'border-[#FF6B35] bg-orange-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <DollarSign className={`w-6 h-6 mx-auto mb-2 ${
                selectedMethod === 'google_pay' ? 'text-[#FF6B35]' : 'text-gray-600'
              }`} />
              <span className="text-xs font-semibold text-gray-900">Google Pay</span>
            </button>
          </div>
        </div>

        {selectedMethod === 'card' && (
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
              <div className="col-span-1">
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
              <div className="col-span-1">
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
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">ZIP</label>
                <input
                  type="text"
                  value={billingZip}
                  onChange={(e) => setBillingZip(e.target.value)}
                  placeholder="12345"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {(selectedMethod === 'apple_pay' || selectedMethod === 'google_pay') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              You will be redirected to complete payment with {selectedMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
            </p>
          </div>
        )}

        <div className="mb-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-5 h-5 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35] mt-0.5"
            />
            <span className="text-sm text-gray-700">
              I agree to the payment terms and authorize JAMII to hold funds in escrow until job completion. I understand that the helper will receive 90% of the service price and JAMII keeps a 10% platform fee.
            </span>
          </label>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing || !termsAccepted}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
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
  );
}


