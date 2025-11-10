import { CheckCircle, Clock, XCircle, AlertCircle, DollarSign } from 'lucide-react';

type PaymentStatusBadgeProps = {
  status: 'pending' | 'held' | 'completed' | 'refunded' | 'failed';
  size?: 'sm' | 'md' | 'lg';
};

export function PaymentStatusBadge({ status, size = 'md' }: PaymentStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Completed',
          color: 'bg-green-100 text-green-800 border-green-200',
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
      case 'held':
        return {
          icon: DollarSign,
          label: 'In Escrow',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'refunded':
        return {
          icon: AlertCircle,
          label: 'Refunded',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
        };
      case 'failed':
        return {
          icon: XCircle,
          label: 'Failed',
          color: 'bg-red-100 text-red-800 border-red-200',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span className={`inline-flex items-center space-x-1 ${sizeClasses[size]} rounded-full font-semibold border ${config.color}`}>
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
}


