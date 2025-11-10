import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Star, CheckCircle, Instagram, Facebook, Linkedin, Twitter, Store, Crown, Shield, MessageCircle, Heart, Share2, Clock, Calendar, Award, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { WaveRating, CommunityStatusBadge } from '../components/WaveRating';

// Safe supabase fallback
let supabase: any = null;
try {
  const supabaseModule = require('../../lib/supabase');
  supabase = supabaseModule.supabase;
} catch (err) {
  supabase = null;
}

type PublicProfilePageProps = {
  onNavigate: (page: string) => void;
  profileId?: string;
};

export function PublicProfilePage({ onNavigate, profileId }: PublicProfilePageProps) {
  const { user, profile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [helperProfile, setHelperProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const viewingOwnProfile = !profileId || profileId === user?.id;
  const targetProfileId = profileId || user?.id;

  useEffect(() => {
    if (targetProfileId) {
      fetchProfileData();
    }
  }, [targetProfileId]);

  const fetchProfileData = async () => {
    if (!targetProfileId) {
      setLoading(false);
      return;
    }

    if (!supabase) {
      setProfile(null);
      setHelperProfile(null);
      setServices([]);
      setReviews([]);
      setBadges([]);
      setShopProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetProfileId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);

        if (profileData.role === 'helper') {
          const { data: helperData } = await supabase
            .from('helper_profiles')
            .select('*')
            .eq('id', targetProfileId)
            .maybeSingle();

          if (helperData) {
            setHelperProfile(helperData);
          }

          const { data: servicesData } = await supabase
            .from('helper_services')
            .select('*')
            .eq('helper_id', targetProfileId)
            .eq('active', true);

          if (servicesData) {
            setServices(servicesData);
          }

          const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*')
            .eq('helper_id', targetProfileId)
            .order('created_at', { ascending: false })
            .limit(10);

          if (reviewsData) {
            setReviews(reviewsData);
          }

          const { data: badgesData } = await supabase
            .from('helper_badges')
            .select('*')
            .eq('helper_id', targetProfileId)
            .eq('verified', true);

          if (badgesData) {
            setBadges(badgesData);
          }

          if (helperData?.shop_enabled) {
            const { data: productsData } = await supabase
              .from('shop_products')
              .select('*')
              .eq('helper_id', targetProfileId)
              .eq('is_active', true)
              .limit(6);

            if (productsData) {
              setShopProducts(productsData);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setProfile(null);
      setHelperProfile(null);
      setServices([]);
      setReviews([]);
      setBadges([]);
      setShopProducts([]);
    }

    setLoading(false);
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return { icon: Crown, text: 'Premium Member', color: 'bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white' };
      case 'pro':
        return { icon: Star, text: 'Pro Member', color: 'bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white' };
      default:
        return { icon: Shield, text: 'Basic Member', color: 'bg-gray-100 text-gray-700' };
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#1F2937] mb-4">Profile Not Found</h2>
        <button
          onClick={() => onNavigate('marketplace')}
          className="text-[#FF6B35] hover:text-[#E5612F] font-medium"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const tierBadge = getTierBadge(profile.subscription_tier);
  const TierIcon = tierBadge.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => onNavigate(viewingOwnProfile ? (profile.role === 'helper' ? 'helper-dashboard' : 'customer-dashboard') : 'marketplace')}
        className="flex items-center space-x-2 text-[#6B7280] hover:text-[#FF6B35] mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to {viewingOwnProfile ? 'Dashboard' : 'Marketplace'}</span>
      </button>

      {viewingOwnProfile && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-[#1F2937] mb-1">This is how others see your profile</h3>
            <p className="text-sm text-[#6B7280]">
              This is your public profile view. To edit your information, go to{' '}
              <button
                onClick={() => onNavigate('settings')}
                className="text-[#FF6B35] hover:text-[#E5612F] font-semibold"
              >
                Profile Settings
              </button>
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#E5612F] h-32"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16 mb-6">
            <div className="relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-[#FF6B35] to-[#E5612F] rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
                  <span className="text-white text-4xl font-bold">{getInitials(profile.full_name)}</span>
                </div>
              )}
              {profile.id_verified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#2ECC71] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 mt-6 md:mt-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#1F2937] mb-2">{profile.full_name}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${tierBadge.color}`}>
                      <TierIcon className="w-4 h-4" />
                      <span>{tierBadge.text}</span>
                    </div>
                    {helperProfile && helperProfile.community_status && (
                      <CommunityStatusBadge status={helperProfile.community_status} size="sm" />
                    )}
                  </div>
                </div>
              </div>

              {helperProfile && (
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <WaveRating rating={helperProfile.rating_average || 0} size="md" showNumber />
                    <span className="text-[#6B7280]">({helperProfile.rating_count} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#6B7280]">
                    <CheckCircle className="w-4 h-4 text-[#2ECC71]" />
                    <span>{helperProfile.jobs_completed} jobs completed</span>
                  </div>
                  {profile.address && (
                    <div className="flex items-center space-x-2 text-[#6B7280]">
                      <MapPin className="w-4 h-4" />
                      <span>{helperProfile.current_radius_miles} mile radius</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!viewingOwnProfile && user && (
              <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('messages')}
                  className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white rounded-xl hover:shadow-xl transition-all font-bold flex items-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Message</span>
                </button>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all font-bold flex items-center space-x-2 ${
                    isSaved
                      ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100'
                      : 'bg-white border-gray-300 text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${profile.full_name} on JAMII`,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 bg-white text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all font-bold flex items-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            )}
          </div>

          {helperProfile?.bio && (
            <p className="text-[#6B7280] text-lg leading-relaxed mb-6">{helperProfile.bio}</p>
          )}

          {helperProfile && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              {helperProfile.years_experience > 0 && (
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#FF6B35]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Experience</p>
                    <p className="font-bold text-[#1F2937]">{helperProfile.years_experience} years</p>
                  </div>
                </div>
              )}
              {helperProfile.response_time_hours && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#FF6B35]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Response Time</p>
                    <p className="font-bold text-[#1F2937]">~{helperProfile.response_time_hours}h</p>
                  </div>
                </div>
              )}
              {helperProfile.availability_status && (
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    helperProfile.availability_status === 'available' ? 'bg-[#2ECC71]' :
                    helperProfile.availability_status === 'busy' ? 'bg-[#FF6B35]' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="text-xs text-[#6B7280]">Status</p>
                    <p className="font-bold text-[#1F2937] capitalize">{helperProfile.availability_status}</p>
                  </div>
                </div>
              )}
              {profile.id_verified && (
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#2ECC71]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Verification</p>
                    <p className="font-bold text-[#2ECC71]">ID Verified</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-full"
                  title={badge.badges.description}
                >
                  <span className="text-xl">{badge.badges.icon}</span>
                  <span className="text-sm font-semibold text-blue-700">{badge.badges.name}</span>
                </div>
              ))}
            </div>
          )}

          {((profile as any).instagram_username || (profile as any).facebook_username || (profile as any).linkedin_username || (profile as any).twitter_username || (profile as any).tiktok_username) && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                {(profile as any).instagram_username && (
                  <a
                    href={`https://instagram.com/${(profile as any).instagram_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="font-medium">@{(profile as any).instagram_username}</span>
                    {(profile as any).instagram_verified && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {(profile as any).instagram_followers > 0 && (
                      <span className="text-xs opacity-90">
                        {(profile as any).instagram_followers >= 1000
                          ? `${((profile as any).instagram_followers / 1000).toFixed(1)}K`
                          : (profile as any).instagram_followers}
                      </span>
                    )}
                  </a>
                )}
                {(profile as any).facebook_username && (
                  <a
                    href={`https://facebook.com/${(profile as any).facebook_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="font-medium">{(profile as any).facebook_username}</span>
                  </a>
                )}
                {(profile as any).tiktok_username && (
                  <a
                    href={`https://tiktok.com/@${(profile as any).tiktok_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                    <span className="font-medium">@{(profile as any).tiktok_username}</span>
                    {(profile as any).tiktok_verified && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {(profile as any).tiktok_followers > 0 && (
                      <span className="text-xs opacity-90">
                        {(profile as any).tiktok_followers >= 1000
                          ? `${((profile as any).tiktok_followers / 1000).toFixed(1)}K`
                          : (profile as any).tiktok_followers}
                      </span>
                    )}
                  </a>
                )}
                {(profile as any).linkedin_username && (
                  <a
                    href={`https://linkedin.com/in/${(profile as any).linkedin_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="font-medium">{(profile as any).linkedin_username}</span>
                  </a>
                )}
                {(profile as any).twitter_username && (
                  <a
                    href={`https://x.com/${(profile as any).twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="font-medium">@{(profile as any).twitter_username}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {profile.role === 'helper' && services.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Services Offered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#FF6B35] transition-all"
              >
                <h3 className="font-bold text-[#1F2937] mb-2">{service.services.name}</h3>
                {service.description && (
                  <p className="text-sm text-[#6B7280] mb-3">{service.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#FF6B35]">
                    {formatPrice(service.custom_price_min)} - {formatPrice(service.custom_price_max)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {helperProfile?.shop_enabled && shopProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Store className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-2xl font-bold text-[#1F2937]">
                {helperProfile.shop_name || `${profile.full_name}'s Shop`}
              </h2>
            </div>
            {!viewingOwnProfile && (
              <button className="text-[#FF6B35] hover:text-[#E5612F] font-semibold text-sm">
                View All Products
              </button>
            )}
          </div>
          {helperProfile.shop_description && (
            <p className="text-[#6B7280] mb-6">{helperProfile.shop_description}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shopProducts.map((product) => (
              <div key={product.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#FF6B35] transition-all">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <Store className="w-12 h-12 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1F2937] mb-2">{product.title}</h3>
                  <p className="text-2xl font-bold text-[#FF6B35]">{formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                <div className="flex items-start space-x-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E5612F] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                      {getInitials(review.profiles.full_name)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-[#1F2937]">{review.profiles.full_name}</h4>
                      <WaveRating rating={review.wave_rating || review.rating || 0} size="sm" />
                    </div>
                    <p className="text-[#6B7280]">{review.comment}</p>
                    <p className="text-xs text-[#9CA3AF] mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {review.response && (
                  <div className="ml-16 mt-3 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-[#1F2937] mb-1">Response from {profile.full_name}</p>
                    <p className="text-sm text-[#6B7280]">{review.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


