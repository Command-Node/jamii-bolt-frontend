import { useState, useEffect } from 'react';
import { Search, Filter, Download, CheckCircle, Clock, XCircle, AlertCircle, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type Transaction = {
  id: string;
  customer_id: string;
  helper_id: string;
  booking_id: string | null;
  amount: number;
  platform_fee: number;
  helper_payout: number;
  stripe_payment_intent_id: string | null;
  status: string;
  payment_method: string | null;
  created_at: string;
  completed_at: string | null;
  refunded_at: string | null;
  customer_name?: string;
  helper_name?: string;
};

type PaymentHistoryProps = {
  viewMode: 'customer' | 'helper';
};

export function PaymentHistory({ viewMode }: PaymentHistoryProps) {
  const { user, activeRole } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, viewMode]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('transactions')
        .select(`
          *,
          customer:profiles!customer_id(full_name),
          helper:profiles!helper_id(full_name)
        `)
        .order('created_at', { ascending: false });

      if (viewMode === 'customer') {
        query = query.eq('customer_id', user?.id);
      } else {
        query = query.eq('helper_id', user?.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setTransactions(data.map(t => ({
          id: t.id,
          customer_id: t.customer_id,
          helper_id: t.helper_id,
          booking_id: t.booking_id,
          amount: parseFloat(t.amount),
          platform_fee: parseFloat(t.platform_fee),
          helper_payout: parseFloat(t.helper_payout),
          stripe_payment_intent_id: t.stripe_payment_intent_id,
          status: t.status,
          payment_method: t.payment_method,
          created_at: t.created_at,
          completed_at: t.completed_at,
          refunded_at: t.refunded_at,
          customer_name: (t.customer as any)?.full_name || 'Unknown',
          helper_name: (t.helper as any)?.full_name || 'Unknown',
        })));
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
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
      hour: '2-digit',
      minute: '2-digit',
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
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = viewMode === 'customer'
      ? t.helper_name?.toLowerCase().includes(searchTerm.toLowerCase())
      : t.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const csv = [
      ['Date', 'Person', 'Amount', 'Status', 'Payment Method'].join(','),
      ...filteredTransactions.map(t => [
        formatDate(t.created_at),
        viewMode === 'customer' ? t.helper_name : t.customer_name,
        formatCurrency(viewMode === 'customer' ? t.amount + t.platform_fee : t.helper_payout),
        t.status,
        t.payment_method || 'N/A',
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: filteredTransactions.reduce((sum, t) =>
      sum + (viewMode === 'customer' ? t.amount + t.platform_fee : t.helper_payout), 0),
    completed: filteredTransactions.filter(t => t.status === 'completed').length,
    pending: filteredTransactions.filter(t => t.status === 'pending' || t.status === 'held').length,
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
            <p className="text-sm text-gray-600 mt-1">
              {viewMode === 'customer' ? 'Your payments to helpers' : 'Payments received from customers'}
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">Total {viewMode === 'customer' ? 'Paid' : 'Earned'}</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search by ${viewMode === 'customer' ? 'helper' : 'customer'} name...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border-2 rounded-lg font-semibold transition-colors ${
              showFilters
                ? 'border-[#FF6B35] text-[#FF6B35] bg-orange-50'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {['all', 'completed', 'held', 'pending', 'refunded', 'failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    statusFilter === status
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 px-6">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : `Your ${viewMode === 'customer' ? 'payments' : 'earnings'} will appear here`}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  {viewMode === 'customer' ? 'Helper' : 'Customer'}
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                {viewMode === 'helper' && (
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Your Payout</th>
                )}
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Payment Method</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {formatDate(transaction.created_at)}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {viewMode === 'customer' ? transaction.helper_name : transaction.customer_name}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                    {formatCurrency(viewMode === 'customer' ? transaction.amount + transaction.platform_fee : transaction.amount)}
                  </td>
                  {viewMode === 'helper' && (
                    <td className="py-4 px-6 text-sm font-bold text-[#2ECC71]">
                      {formatCurrency(transaction.helper_payout)}
                    </td>
                  )}
                  <td className="py-4 px-6 text-sm text-gray-600 capitalize">
                    {transaction.payment_method?.replace('_', ' ') || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="capitalize">{transaction.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>
      )}
    </div>
  );
}


