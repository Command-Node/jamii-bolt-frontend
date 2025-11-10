import { CheckCircle, ArrowRight, MessageCircle, Download } from 'lucide-react';

type PaymentConfirmationProps = {
  transactionId: string;
  amount: number;
  helperName: string;
  serviceName: string;
  jobTitle: string;
  onClose: () => void;
  onViewMessages: () => void;
};

export function PaymentConfirmation({
  transactionId,
  amount,
  helperName,
  serviceName,
  jobTitle,
  onClose,
  onViewMessages,
}: PaymentConfirmationProps) {
  const handleDownloadReceipt = () => {
    window.open(`/api/payment/receipt/${transactionId}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-12 h-12 text-[#2ECC71]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-white text-opacity-90">Your booking has been confirmed</p>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
              <p className="text-4xl font-bold text-gray-900">${amount.toFixed(2)}</p>
            </div>
            <div className="border-t border-gray-300 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-gray-900 text-xs">{transactionId.slice(0, 16)}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service</span>
                <span className="font-semibold text-gray-900">{serviceName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Helper</span>
                <span className="font-semibold text-gray-900">{helperName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Job</span>
                <span className="font-semibold text-gray-900">{jobTitle}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">1.</span>
                <span>Your payment is held securely in escrow</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">2.</span>
                <span>{helperName} will be notified of your booking</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">3.</span>
                <span>You can coordinate details via messages</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">4.</span>
                <span>Funds are released after job completion is confirmed</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={onViewMessages}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message {helperName}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleDownloadReceipt}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


