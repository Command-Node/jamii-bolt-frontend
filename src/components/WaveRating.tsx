import { useState } from 'react';
import { Waves } from 'lucide-react';

type WaveRatingProps = {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
};

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
};

export function WaveRating({
  rating,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRate
}: WaveRatingProps) {
  const handleClick = (value: number) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= Math.round(rating);
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={`transition-all ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          >
            <Waves
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'text-blue-500 fill-blue-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
      {showNumber && (
        <span className="text-sm font-semibold text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

type CommunityStatusBadgeProps = {
  status: 'new_neighbor' | 'regular_helper' | 'trusted_provider' | 'community_champion' | 'pillar';
  size?: 'sm' | 'md' | 'lg';
};

const statusConfig = {
  new_neighbor: {
    label: 'New Neighbor',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: '👋',
  },
  regular_helper: {
    label: 'Regular Helper',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: '🤝',
  },
  trusted_provider: {
    label: 'Trusted Provider',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: '⭐',
  },
  community_champion: {
    label: 'Community Champion',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: '🏆',
  },
  pillar: {
    label: 'Pillar in the Community',
    color: 'bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white border-none',
    icon: '👑',
  },
};

const badgeSizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function CommunityStatusBadge({ status, size = 'md' }: CommunityStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center space-x-1 ${badgeSizeClasses[size]} ${config.color} border-2 rounded-full font-semibold`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
}

type WaveGivingInterfaceProps = {
  helperName: string;
  onGiveWaves: (waveCount: number) => void;
  onSkip: () => void;
  userWaveBalance: number;
};

export function WaveGivingInterface({ helperName, onGiveWaves, onSkip, userWaveBalance }: WaveGivingInterfaceProps) {
  const [selectedWaves, setSelectedWaves] = useState(0);

  const handleGiveWaves = () => {
    if (selectedWaves > 0 && selectedWaves <= userWaveBalance) {
      onGiveWaves(selectedWaves);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border-2 border-blue-200 p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Waves className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
          Give Waves to {helperName}
        </h3>
        <p className="text-[#6B7280]">
          Show your appreciation with waves! They help build community trust.
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#6B7280]">Your Wave Balance</span>
          <div className="flex items-center space-x-1">
            <Waves className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-[#1F2937]">{userWaveBalance}</span>
          </div>
        </div>
        <p className="text-xs text-[#6B7280]">
          You get {1} free wave per month. Purchase more for $5 each.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#6B7280] mb-3">
          How many waves would you like to give?
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((count) => (
            <button
              key={count}
              onClick={() => setSelectedWaves(count)}
              disabled={count > userWaveBalance}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedWaves === count
                  ? 'border-blue-500 bg-blue-50 scale-110'
                  : count > userWaveBalance
                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <Waves className={`w-6 h-6 mx-auto ${
                selectedWaves === count ? 'text-blue-500 fill-blue-500' : 'text-gray-400'
              }`} />
              <div className="text-xs font-bold mt-1">{count}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onSkip}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-[#6B7280] rounded-lg hover:bg-gray-50 transition-all font-semibold"
        >
          Skip
        </button>
        <button
          onClick={handleGiveWaves}
          disabled={selectedWaves === 0 || selectedWaves > userWaveBalance}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Give {selectedWaves} Wave{selectedWaves !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}


