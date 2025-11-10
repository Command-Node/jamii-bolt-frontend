import { useState, useEffect } from 'react';
import { Store, Plus, Package, DollarSign, Edit, Trash2, Eye, EyeOff, Crown, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Safe supabase fallback
let supabase: any = null;
try {
  const supabaseModule = require('../../lib/supabase');
  supabase = supabaseModule.supabase;
} catch (err) {
  supabase = null;
}

type JamiiShopPageProps = {
  onNavigate: (page: string) => void;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  inventory_count: number;
  is_active: boolean;
  created_at: string;
};

export function JamiiShopPage({ onNavigate }: JamiiShopPageProps) {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [helperProfile, setHelperProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchShopData();
    }
  }, [user]);

  const fetchShopData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!supabase) {
      setProducts([]);
      setHelperProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data: helperData } = await supabase
      .from('helper_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (helperData) {
      setHelperProfile(helperData);
    }

      const { data: productsData } = await supabase
        .from('shop_products')
        .select('*')
      .eq('helper_id', user.id)
      .order('created_at', { ascending: false });

      if (productsData) {
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
      setProducts([]);
      setHelperProfile(null);
    }

    setLoading(false);
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('shop_products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (!error) {
        setProducts(products.map(p =>
          p.id === productId ? { ...p, is_active: !currentStatus } : p
        ));
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (!profile || !['pro', 'premium'].includes(profile.subscription_tier)) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-12">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Upgrade to Access Jamii Shop</h2>
          <p className="text-lg text-[#6B7280] mb-8">
            The Jamii Shop is available for Pro and Premium tier members. Sell physical goods and grow your business!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-orange-50 border-2 border-[#FF6B35] rounded-xl p-6">
              <Zap className="w-8 h-8 text-[#FF6B35] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-[#1F2937] mb-2">Pro - $25/mo</h3>
              <p className="text-sm text-[#6B7280] mb-4">Basic shop features, 8% platform fee</p>
              <button className="w-full px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E5612F] transition-all font-bold">
                Upgrade to Pro
              </button>
            </div>
            <div className="bg-green-50 border-2 border-[#2ECC71] rounded-xl p-6">
              <Crown className="w-8 h-8 text-[#2ECC71] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-[#1F2937] mb-2">Premium - $50/mo</h3>
              <p className="text-sm text-[#6B7280] mb-4">Enhanced shop, custom branding, 5% fee</p>
              <button className="w-full px-6 py-3 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-all font-bold">
                Upgrade to Premium
              </button>
            </div>
          </div>
          <button
            onClick={() => onNavigate('helper-dashboard')}
            className="text-[#FF6B35] hover:text-[#E5612F] font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#E5612F] rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Store className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">
                  {helperProfile?.shop_name || 'My Jamii Shop'}
                </h1>
                <p className="text-orange-100">
                  {profile.subscription_tier === 'premium' ? 'Premium Tier' : 'Pro Tier'}
                  {profile.subscription_tier === 'premium' && <Crown className="w-4 h-4 inline ml-2" />}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-6 py-3 bg-white text-[#FF6B35] rounded-xl hover:bg-gray-100 transition-all font-bold flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>
          {helperProfile?.shop_description && (
            <p className="text-white text-lg">{helperProfile.shop_description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Package className="w-8 h-8 text-[#FF6B35] mb-3" />
          <div className="text-3xl font-bold text-[#1F2937] mb-1">{products.length}</div>
          <div className="text-sm text-[#6B7280]">Total Products</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Eye className="w-8 h-8 text-[#2ECC71] mb-3" />
          <div className="text-3xl font-bold text-[#1F2937] mb-1">
            {products.filter(p => p.is_active).length}
          </div>
          <div className="text-sm text-[#6B7280]">Active Listings</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <DollarSign className="w-8 h-8 text-blue-500 mb-3" />
          <div className="text-3xl font-bold text-[#1F2937] mb-1">
            {formatPrice(products.reduce((sum, p) => sum + (p.price * p.inventory_count), 0))}
          </div>
          <div className="text-sm text-[#6B7280]">Inventory Value</div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No products yet</h3>
          <p className="text-[#6B7280] mb-6">Start selling by adding your first product</p>
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E5612F] transition-all font-bold inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Product</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-xl shadow-sm border-2 ${
                product.is_active ? 'border-[#2ECC71]' : 'border-gray-300'
              } overflow-hidden transition-all hover:shadow-lg`}
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-16 h-16 text-gray-400" />
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-[#1F2937] text-lg">{product.title}</h3>
                  <button
                    onClick={() => toggleProductStatus(product.id, product.is_active)}
                    className={`p-2 rounded-lg ${
                      product.is_active ? 'bg-green-100 text-[#2ECC71]' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-[#FF6B35]">{formatPrice(product.price)}</span>
                  <span className="text-sm text-[#6B7280]">Stock: {product.inventory_count}</span>
                </div>

                {product.category && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium mb-3">
                    {product.category}
                  </span>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-orange-50 text-[#FF6B35] rounded-lg hover:bg-orange-100 transition-all font-medium text-sm flex items-center justify-center space-x-1">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


