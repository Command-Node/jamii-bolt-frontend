import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Heart, MessageCircle, Share2, Eye, Clock, AlertCircle } from 'lucide-react';

type ListingDetailsModalProps = {
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
    seller_id: string;
    seller: {
      full_name: string;
      avatar_url: string | null;
      phone?: string;
    };
    photos: Array<{
      photo_url: string;
    }>;
    category?: {
      name: string;
    };
  };
  isOwner: boolean;
  isFavorited: boolean;
  onClose: () => void;
  onContact: () => void;
  onToggleFavorite: () => void;
  onMarkSold?: () => void;
  onDelete?: () => void;
};

export function ListingDetailsModal({
  listing,
  isOwner,
  isFavorited,
  onClose,
  onContact,
  onToggleFavorite,
  onMarkSold,
  onDelete,
}: ListingDetailsModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const photos = listing.photos.length > 0
    ? listing.photos
    : [{ photo_url: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800' }];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const getConditionLabel = (condition: string) => {
    return condition.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 flex-1 pr-4">{listing.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div>
            <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img
                src={photos[currentPhotoIndex].photo_url}
                alt={`${listing.title} - Photo ${currentPhotoIndex + 1}`}
                className="w-full h-96 object-contain"
              />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/70 text-white text-sm font-semibold rounded-full">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>

            {photos.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentPhotoIndex
                        ? 'border-[#FF6B35]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={photo.photo_url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-4xl font-bold text-[#FF6B35]">
                  ${listing.price.toFixed(2)}
                </p>
                {listing.is_negotiable && (
                  <span className="text-sm text-gray-600 font-medium">or best offer</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {getConditionLabel(listing.condition)}
                </span>
                {listing.category && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                    {listing.category.name}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span>Listed on {formatDate(listing.created_at)}</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="w-5 h-5" />
                  <span>{listing.view_count} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-5 h-5" />
                  <span>{listing.favorited_count} favorites</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-6 border border-orange-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {listing.seller.avatar_url ? (
                    <img
                      src={listing.seller.avatar_url}
                      alt={listing.seller.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {listing.seller.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{listing.seller.full_name}</p>
                  <p className="text-sm text-gray-600">Seller</p>
                </div>
              </div>
            </div>

            {!isOwner ? (
              <div className="space-y-3">
                <button
                  onClick={onContact}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Is this available?</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onToggleFavorite}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                      isFavorited
                        ? 'bg-red-50 text-red-600 border-2 border-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    <span>{isFavorited ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Your Listing</p>
                      <p className="text-xs text-blue-700 mt-1">
                        You can manage this listing or mark it as sold when you've found a buyer.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onMarkSold}
                  className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all"
                >
                  Mark as Sold
                </button>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full px-6 py-3 border-2 border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all"
                  >
                    Delete Listing
                  </button>
                ) : (
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                    <p className="text-sm text-red-900 font-semibold mb-3">
                      Are you sure you want to delete this listing?
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={onDelete}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all border border-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


