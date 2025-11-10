import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type EarningsSummary = {
  total_earnings: number;
  net_earnings: number;
  pending_balance: number;
  available_balance: number;
  total_transactions: number;
  last_payout_at: string | null;
};

type RecentTransaction = {
  id: string;
  amount: number;
  helper_payout: number;
  status: string;
  created_at: string;
  customer_id: string;
  customer_name?: string;
};

export function EarningsDashboard() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchEarnings();
      fetchRecentTransactions();
    }
  }, [user]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const api = (await import('../lib/api')).default;
      const transactions = await api.getTransactions();
      
      // Filter helper's transactions
      const helperTransactions = transactions.filter((t: any) => t.helper_id === user?.id);
      
      // Calculate earnings
      const total = helperTransactions
        .filter((t: any) => t.status === 'completed')
        .reduce((sum: number, t: any) => sum + (parseFloat(t.amount || 0)), 0);
      
      const net = helperTransactions
        .filter((t: any) => t.status === 'completed')
        .reduce((sum: number, t: any) => sum + (parseFloat(t.helper_payout || 0)), 0);
      
      const pending = helperTransactions
        .filter((t: any) => t.status === 'pending')
        .reduce((sum: number, t: any) => sum + (parseFloat(t.helper_payout || 0)), 0);
      
      const available = helperTransactions
        .filter((t: any) => t.status === 'completed' && !t.refunded_at)
        .reduce((sum: number, t: any) => sum + (parseFloat(t.helper_payout || 0)), 0);
      
      const lastPayout = helperTransactions
        .filter((t: any) => t.status === 'completed')
        .sort((a: any, b: any) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime())[0]?.completed_at || null;

      setEarnings({
        total_earnings: total,
        net_earnings: net,
        pending_balance: pending,
        available_balance: available,
        total_transactions: helperTransactions.length,
        last_payout_at: lastPayout,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch earnings');
      setEarnings({
        total_earnings: 0,
        net_earnings: 0,
        pending_balance: 0,
        available_balance: 0,
        total_transactions: 0,
        last_payout_at: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const api = (await import('../lib/api')).default;
      const transactions = await api.getTransactions();
      
      // Filter helper's transactions and get recent 5
      const recent = transactions
        .filter((t: any) => t.helper_id === user?.id)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((t: any) => ({
          id: t.id,
          amount: typeof t.amount === 'number' ? t.amount : parseFloat(t.amount || 0),
          helper_payout: typeof t.helper_payout === 'number' ? t.helper_payout : parseFloat(t.helper_payout || 0),
          status: t.status,
          created_at: t.created_at,
          customer_id: t.customer_id,
          customer_name: t.customer_name || t.customer?.name || 'Unknown',
        }));
      
      setRecentTransactions(recent);
    } catch (err) {
      console.error('Failed to fetch recent transactions:', err);
      setRecentTransactions([]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'held':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'held':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#2ECC71] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error Loading Earnings</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold opacity-90">Total Earnings</h3>
            <DollarSign className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-1">{formatCurrency(earnings?.total_earnings || 0)}</p>
          <p className="text-xs opacity-80">Before platform fees</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-600">Net Earnings</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(earnings?.net_earnings || 0)}</p>
          <p className="text-xs text-gray-500">After 10% platform fee</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-600">Pending Balance</h3>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(earnings?.pending_balance || 0)}</p>
          <p className="text-xs text-gray-500">Jobs in progress</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-600">Available Now</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(earnings?.available_balance || 0)}</p>
          <p className="text-xs text-gray-500">Ready for payout</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Earnings Overview</h2>
            <p className="text-sm text-gray-600 mt-1">Your payment statistics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Completed Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{earnings?.total_transactions || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Average per Job</p>
            <p className="text-2xl font-bold text-gray-900">
              {earnings?.total_transactions
                ? formatCurrency((earnings.net_earnings || 0) / earnings.total_transactions)
                : formatCurrency(0)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Last Payout</p>
            <p className="text-lg font-bold text-gray-900">
              {earnings?.last_payout_at ? formatDate(earnings.last_payout_at) : 'No payouts yet'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          <button className="text-sm font-semibold text-[#FF6B35] hover:text-[#E5612F] flex items-center">
            View All
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-1">Your completed jobs will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Your Payout</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                      {transaction.customer_name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-[#2ECC71]">
                      {formatCurrency(transaction.helper_payout)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="capitalize">{transaction.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <DollarSign className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">How Payouts Work</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                You receive 90% of each payment, JAMII keeps 10% as a platform fee
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Funds are held in escrow until job completion is confirmed by both parties
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Automatic payouts are processed within 2-3 business days after job completion
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                View detailed tax documents and payment history in your account settings
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


