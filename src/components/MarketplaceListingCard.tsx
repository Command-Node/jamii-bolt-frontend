import { Heart, MapPin, Clock, Eye } from 'lucide-react';
import { useState } from 'react';

type MarketplaceListingCardProps = {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    condition: string;
    location: string;
    is_negotiable: boolean;
    view_count: number;
    favorited_count: number;
    created_at: string;
    seller: {
      full_name: string;
      avatar_url: string | null;
    };
    photos: Array<{
      photo_url: string;
    }>;
    is_favorited?: boolean;
  };
  onSelect: (listingId: string) => void;
  onToggleFavorite: (listingId: string) => void;
};

export function MarketplaceListingCard({ listing, onSelect, onToggleFavorite }: MarketplaceListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(listing.is_favorited || false);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'like_new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'good':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionLabel = (condition: string) => {
    return condition.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getTimeSincePosted = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffMs = now.getTime() - posted.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onToggleFavorite(listing.id);
  };

  const primaryPhoto = listing.photos[0]?.photo_url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';

  return (
    <div
      onClick={() => onSelect(listing.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="relative">
        <img
          src={primaryPhoto}
          alt={listing.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
            isFavorited
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
        {listing.photos.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
            1/{listing.photos.length}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 flex-1 group-hover:text-[#FF6B35] transition-colors">
            {listing.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {listing.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-[#FF6B35]">
              ${listing.price.toFixed(2)}
            </p>
            {listing.is_negotiable && (
              <p className="text-xs text-gray-500">or best offer</p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getConditionColor(listing.condition)}`}>
            {getConditionLabel(listing.condition)}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeSincePosted(listing.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {listing.seller.avatar_url ? (
              <img
                src={listing.seller.avatar_url}
                alt={listing.seller.full_name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {listing.seller.full_name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium">{listing.seller.full_name}</span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{listing.view_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{listing.favorited_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


