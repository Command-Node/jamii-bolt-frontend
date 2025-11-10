import { useEffect, useState } from 'react';
import { Search, Filter, MapPin, Star, Clock, MessageCircle, Home, Leaf, Sparkles, ChefHat, Scissors, Dog, Truck, Baby, Users, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { JobBookingPayment } from '../components/JobBookingPayment';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { GoodsMarketplace } from '../components/GoodsMarketplace';

// Try to import supabase, but handle if it doesn't exist
let supabase: any = null;
type Service = {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  category: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
};
try {
  const supabaseModule = require('../../lib/supabase');
  supabase = supabaseModule.supabase;
} catch (err) {
  console.log('Supabase not available, using fallback');
}

const serviceIcons: Record<string, any> = {
  'home': Home,
  'leaf': Leaf,
  'sparkles': Sparkles,
  'chef-hat': ChefHat,
  'scissors': Scissors,
  'dog': Dog,
  'truck': Truck,
  'baby': Baby,
};

type Helper = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  current_radius_miles: number;
  jobs_completed: number;
  availability_status: 'available_now' | 'available_today' | 'by_appointment' | 'offline';
  rating_average: number;
  rating_count: number;
  services: Array<{
    service_id: string;
    service_name: string;
    service_icon: string;
    custom_price_min: number;
    custom_price_max: number;
  }>;
  badges: Array<{
    badge_icon: string;
    badge_name: string;
  }>;
};

type MarketplacePageProps = {
  onNavigate: (page: string, params?: any) => void;
};

export function MarketplacePage({ onNavigate }: MarketplacePageProps) {
  const { user } = useAuth();
  const [marketplaceMode, setMarketplaceMode] = useState<'services' | 'goods'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  useEffect(() => {
    fetchData();
  }, [selectedService, availabilityFilter]);

  const fetchData = async () => {
    setLoading(true);

    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at');

    if (servicesData) {
      setServices(servicesData);
    }

    let query = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        avatar_url,
        helper_profiles!inner (
          bio,
          current_radius_miles,
          jobs_completed,
          availability_status,
          rating_average,
          rating_count
        )
      `)
      .eq('role', 'helper')
      .eq('id_verified', true);

    if (availabilityFilter === 'available_now') {
      query = query.eq('helper_profiles.availability_status', 'available_now');
    } else if (availabilityFilter === 'available_today') {
      query = query.in('helper_profiles.availability_status', ['available_now', 'available_today']);
    }

    const { data: helpersData, error } = await query;

    if (error) {
      console.error('Error fetching helpers:', error);
      setLoading(false);
      return;
    }

    if (helpersData) {
      const helpersWithDetails = await Promise.all(
        helpersData.map(async (helper: any) => {
          const { data: servicesData } = await supabase
            .from('helper_services')
            .select(`
              service_id,
              custom_price_min,
              custom_price_max,
              services (
                name,
                icon
              )
            `)
            .eq('helper_id', helper.id)
            .eq('active', true);

          const { data: badgesData } = await supabase
            .from('helper_badges')
            .select(`
              badges (
                icon,
                name
              )
            `)
            .eq('helper_id', helper.id)
            .eq('verified', true);

          return {
            id: helper.id,
            full_name: helper.full_name,
            avatar_url: helper.avatar_url,
            bio: helper.helper_profiles.bio,
            current_radius_miles: helper.helper_profiles.current_radius_miles,
            jobs_completed: helper.helper_profiles.jobs_completed,
            availability_status: helper.helper_profiles.availability_status,
            rating_average: helper.helper_profiles.rating_average,
            rating_count: helper.helper_profiles.rating_count,
            services: servicesData?.map((s: any) => ({
              service_id: s.service_id,
              service_name: s.services.name,
              service_icon: s.services.icon,
              custom_price_min: s.custom_price_min,
              custom_price_max: s.custom_price_max,
            })) || [],
            badges: badgesData?.map((b: any) => ({
              badge_icon: b.badges.icon,
              badge_name: b.badges.name,
            })) || [],
          };
        })
      );

      let filteredHelpers = helpersWithDetails;

      if (selectedService) {
        filteredHelpers = filteredHelpers.filter((helper) =>
          helper.services.some((s) => s.service_id === selectedService)
        );
      }

      if (searchQuery) {
        filteredHelpers = filteredHelpers.filter((helper) =>
          helper.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          helper.services.some((s) => s.service_name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      filteredHelpers.sort((a, b) => {
        if (a.availability_status === 'available_now' && b.availability_status !== 'available_now') return -1;
        if (a.availability_status !== 'available_now' && b.availability_status === 'available_now') return 1;
        if (a.availability_status === 'available_today' && b.availability_status !== 'available_today' && b.availability_status !== 'available_now') return -1;
        if (a.availability_status !== 'available_today' && b.availability_status === 'available_today') return 1;
        return b.rating_average - a.rating_average;
      });

      setHelpers(filteredHelpers);
    }

    setLoading(false);
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case 'available_now':
        return { text: 'Available Now', color: 'bg-green-100 text-green-800 border-green-200', dot: 'bg-[#2ECC71]' };
      case 'available_today':
        return { text: 'Available Today', color: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-[#FF6B35]' };
      case 'by_appointment':
        return { text: 'By Appointment', color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' };
      default:
        return { text: 'Offline', color: 'bg-gray-100 text-gray-800 border-gray-200', dot: 'bg-gray-500' };
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">Let's <span className="text-[#FF6B35]">Jamii</span></h1>

        <div className="flex items-center space-x-2 bg-white rounded-xl p-2 border-2 border-gray-200 shadow-sm w-fit">
          <button
            onClick={() => setMarketplaceMode('services')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
              marketplaceMode === 'services'
                ? 'bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Jamii a Service</span>
          </button>
          <button
            onClick={() => setMarketplaceMode('goods')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
              marketplaceMode === 'goods'
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Jamii Something</span>
          </button>
        </div>

        <p className="text-lg text-[#6B7280] mt-4">
          {marketplaceMode === 'services'
            ? 'Jamii with verified neighbors for everyday tasks'
            : 'Jamii great deals from neighbors in your commUNITY'}
        </p>

        {!user && (
          <div className="mt-4 bg-gradient-to-r from-orange-50 to-green-50 border-2 border-[#FF6B35] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#2ECC71] rounded-full flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">Free to browse - Account required to book</p>
                <p className="text-xs text-[#6B7280]">Create a free account to connect with helpers in your commUNITY</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('auth')}
              className="px-6 py-2 bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] text-white rounded-lg hover:shadow-lg transition-all font-bold text-sm whitespace-nowrap"
            >
              Sign Up Free
            </button>
          </div>
        )}
      </div>
      {marketplaceMode === 'goods' ? (
        <GoodsMarketplace />
      ) : (
        <>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or service..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAutocomplete(e.target.value.length > 0);
            }}
            onFocus={() => setShowAutocomplete(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
          />
          {showAutocomplete && searchQuery && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              <div className="p-2">
                {services
                  .filter(service =>
                    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    service.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 8)
                  .map((service) => {
                    const IconComponent = serviceIcons[service.icon] || Home;
                    return (
                      <button
                        key={service.id}
                        onClick={() => {
                          setSearchQuery(service.name);
                          setShowAutocomplete(false);
                        }}
                        className="w-full flex items-center space-x-3 p-3 hover:bg-orange-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-[#FF6B35]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{service.name}</p>
                          <p className="text-xs text-gray-600 truncate">{service.description}</p>
                        </div>
                        <div className="text-sm font-semibold text-[#2ECC71] flex-shrink-0">
                          {formatPrice(service.average_price_min)} - {formatPrice(service.average_price_max)}
                        </div>
                      </button>
                    );
                  })}
                {services.filter(service =>
                  service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  service.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No services found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setAvailabilityFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              availabilityFilter === 'all'
                ? 'bg-[#FF6B35] text-white'
                : 'bg-white text-[#6B7280] border border-gray-300 hover:border-[#FF6B35]'
            }`}
          >
            All Helpers
          </button>
          <button
            onClick={() => setAvailabilityFilter('available_now')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              availabilityFilter === 'available_now'
                ? 'bg-green-600 text-white'
                : 'bg-white text-[#6B7280] border border-gray-300 hover:border-green-500'
            }`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Available Now</span>
          </button>
          <button
            onClick={() => setAvailabilityFilter('available_today')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              availabilityFilter === 'available_today'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-[#6B7280] border border-gray-300 hover:border-yellow-500'
            }`}
          >
            Available Today
          </button>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => setSelectedService(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedService === null
                ? 'bg-[#FF6B35] text-white'
                : 'bg-white text-[#6B7280] border border-gray-300 hover:border-[#FF6B35]'
            }`}
          >
            All Services
          </button>
          {services.map((service) => {
            const IconComponent = serviceIcons[service.icon] || Home;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${
                  selectedService === service.id
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-white text-[#6B7280] border border-gray-300 hover:border-[#FF6B35]'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{service.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-80 animate-pulse">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : helpers.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No helpers found</h3>
          <p className="text-[#6B7280]">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpers.map((helper) => {
            const availabilityBadge = getAvailabilityBadge(helper.availability_status);
            return (
              <div
                key={helper.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#E5612F] rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {helper.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${availabilityBadge.dot} rounded-full border-2 border-white`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[#1F2937] truncate">{helper.full_name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-[#6B7280] ml-1">
                            {helper.rating_average > 0 ? helper.rating_average.toFixed(1) : 'New'}
                          </span>
                          {helper.rating_count > 0 && (
                            <span className="text-sm text-gray-500 ml-1">({helper.rating_count})</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{helper.jobs_completed} jobs</span>
                      </div>
                    </div>
                  </div>

                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border mb-4 ${availabilityBadge.color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${availabilityBadge.dot}`}></div>
                    <span>{availabilityBadge.text}</span>
                  </div>

                  {helper.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {helper.badges.slice(0, 4).map((badge, idx) => (
                        <span key={idx} className="text-lg" title={badge.badge_name}>
                          {badge.badge_icon}
                        </span>
                      ))}
                    </div>
                  )}

                  {helper.bio && (
                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{helper.bio}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    {helper.services.slice(0, 2).map((service, idx) => {
                      const IconComponent = serviceIcons[service.service_icon] || Home;
                      return (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-4 h-4 text-[#FF6B35]" />
                            <span className="text-[#6B7280]">{service.service_name}</span>
                          </div>
                          <span className="text-[#FF6B35] font-medium">
                            {formatPrice(service.custom_price_min)} - {formatPrice(service.custom_price_max)}
                          </span>
                        </div>
                      );
                    })}
                    {helper.services.length > 2 && (
                      <p className="text-xs text-gray-500">+{helper.services.length - 2} more services</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{helper.current_radius_miles} mile radius</span>
                  </div>

                  <div className="flex space-x-2">
                    {user ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedHelper(helper);
                            setBookingDetails({
                              title: `${helper.services[0]?.service_name || 'Service'} Request`,
                              description: `Booking with ${helper.full_name}`,
                              urgency: 'scheduled',
                            });
                            setShowPaymentModal(true);
                          }}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white rounded-lg hover:shadow-lg transition-all font-bold text-sm"
                        >
                          Jamii Now
                        </button>
                        <button
                          onClick={() => onNavigate('messages', { helperId: helper.id })}
                          className="px-4 py-2 bg-orange-50 text-[#FF6B35] rounded-lg hover:bg-orange-100 transition-all"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onNavigate('auth')}
                        className="w-full px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E5612F] transition-all font-medium text-sm"
                      >
                        Sign In to Jamii
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showPaymentModal && selectedHelper && bookingDetails && (
        <JobBookingPayment
          serviceId={selectedHelper.services[0]?.service_id || ''}
          serviceName={selectedHelper.services[0]?.service_name || 'Service'}
          helperName={selectedHelper.full_name}
          helperId={selectedHelper.id}
          servicePrice={(selectedHelper.services[0]?.custom_price_min || 0) / 100}
          jobDetails={bookingDetails}
          onSuccess={(txId) => {
            setTransactionId(txId);
            setShowPaymentModal(false);
            setShowConfirmation(true);
          }}
          onCancel={() => {
            setShowPaymentModal(false);
            setSelectedHelper(null);
            setBookingDetails(null);
          }}
        />
      )}

      {showConfirmation && selectedHelper && bookingDetails && (
        <PaymentConfirmation
          transactionId={transactionId}
          amount={(selectedHelper.services[0]?.custom_price_min || 0) / 100 * 1.1}
          helperName={selectedHelper.full_name}
          serviceName={selectedHelper.services[0]?.service_name || 'Service'}
          jobTitle={bookingDetails.title}
          onClose={() => {
            setShowConfirmation(false);
            setSelectedHelper(null);
            setBookingDetails(null);
            setTransactionId('');
          }}
          onViewMessages={() => {
            setShowConfirmation(false);
            onNavigate('messages');
          }}
        />
      )}
      </>
      )}
    </div>
  );
}


