import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Plus, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { MarketplaceListingCard } from './MarketplaceListingCard';
import { ListingDetailsModal } from './ListingDetailsModal';
import { CreateListingForm } from './CreateListingForm';

type Category = {
  id: string;
  name: string;
  icon: string;
};

type Listing = {
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
  };
  photos: Array<{
    photo_url: string;
  }>;
  category?: {
    name: string;
  };
  is_favorited?: boolean;
};

export function GoodsMarketplace() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, [selectedCategory, conditionFilter, sortBy, searchQuery]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('marketplace_categories')
      .select('*')
      .order('name');

    if (data) {
      setCategories(data);
    }
  };

  const fetchListings = async () => {
    setLoading(true);

    let query = supabase
      .from('marketplace_listings')
      .select(`
        *,
        seller:profiles!seller_id(full_name, avatar_url),
        photos:listing_photos(photo_url),
        category:marketplace_categories(name)
      `)
      .eq('status', 'available');

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    if (conditionFilter !== 'all') {
      query = query.eq('condition', conditionFilter);
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    switch (sortBy) {
      case 'price_low':
        query = query.order('price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('price', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data } = await query;

    if (data) {
      if (user) {
        const { data: favorites } = await supabase
          .from('listing_favorites')
          .select('listing_id')
          .eq('user_id', user.id);

        const favoriteIds = new Set(favorites?.map(f => f.listing_id));

        setListings(
          data.map(listing => ({
            ...listing,
            is_favorited: favoriteIds.has(listing.id),
          }))
        );
      } else {
        setListings(data);
      }
    }

    setLoading(false);
  };

  const handleToggleFavorite = async (listingId: string) => {
    if (!user) return;

    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    if (listing.is_favorited) {
      await supabase
        .from('listing_favorites')
        .delete()
        .eq('listing_id', listingId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('listing_favorites')
        .insert({ listing_id: listingId, user_id: user.id });
    }

    fetchListings();
  };

  const handleViewListing = async (listingId: string) => {
    await supabase
      .from('marketplace_listings')
      .update({ view_count: supabase.rpc('increment', { x: 1 }) })
      .eq('id', listingId);

    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      setSelectedListing(listing);
    }
  };

  const handleContact = () => {
    alert('Message functionality coming soon!');
  };

  const handleMarkSold = async () => {
    if (!selectedListing) return;

    await supabase
      .from('marketplace_listings')
      .update({
        status: 'sold',
        sold_at: new Date().toISOString(),
      })
      .eq('id', selectedListing.id);

    setSelectedListing(null);
    fetchListings();
  };

  const handleDelete = async () => {
    if (!selectedListing) return;

    await supabase
      .from('marketplace_listings')
      .delete()
      .eq('id', selectedListing.id);

    setSelectedListing(null);
    fetchListings();
  };

  const filteredListings = listings.filter(listing => {
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !listing.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Jamii Something Great</h2>
          {user && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>List to Jamii</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for items to Jamii..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 border-2 rounded-lg font-semibold transition-all ${
              showFilters
                ? 'border-[#FF6B35] text-[#FF6B35] bg-orange-50'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Condition</label>
                <select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                >
                  <option value="all">All Conditions</option>
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
              !selectedCategory
                ? 'bg-[#FF6B35] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedCategory || conditionFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Be the first to Jamii something!'}
          </p>
          {user && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Start Jamii-ing
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <MarketplaceListingCard
                key={listing.id}
                listing={listing}
                onSelect={handleViewListing}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </>
      )}

      {showCreateForm && (
        <CreateListingForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={fetchListings}
        />
      )}

      {selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          isOwner={user?.id === selectedListing.seller_id}
          isFavorited={selectedListing.is_favorited || false}
          onClose={() => setSelectedListing(null)}
          onContact={handleContact}
          onToggleFavorite={() => handleToggleFavorite(selectedListing.id)}
          onMarkSold={handleMarkSold}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}


