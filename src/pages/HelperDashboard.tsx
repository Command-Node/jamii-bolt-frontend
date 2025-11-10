import { useEffect, useState } from 'react';
import { Clock, DollarSign, Star, TrendingUp, MapPin, Zap, AlertCircle, Activity, MessageCircle, User, Store, Crown, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { MyServicesSection } from '../components/MyServicesSection';
import { CommunicationHub } from '../components/CommunicationHub';
import { WaveRating, CommunityStatusBadge } from '../components/WaveRating';

// Safe supabase fallback
let supabase: any = null;
type HelperProfile = any;
try {
  const supabaseModule = require('../../lib/supabase');
  supabase = supabaseModule.supabase;
} catch (err) {
  // Supabase not available - use mock data
  supabase = null;
}

type HelperDashboardProps = {
  onNavigate: (page: string) => void;
};

export function HelperDashboard({ onNavigate }: HelperDashboardProps) {
  const { user, profile } = useAuth();
  const [helperProfile, setHelperProfile] = useState<HelperProfile | null>(null);
  const [helperServices, setHelperServices] = useState<any[]>([]);
  const [hotJobs, setHotJobs] = useState<any[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [responseRate, setResponseRate] = useState(95);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Mock data for now - will connect to backend API later
    try {
      if (supabase) {
        const { data: helperData } = await supabase
          .from('helper_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (helperData) {
          setHelperProfile(helperData);
        }

        const { data: helperServicesData } = await supabase
          .from('helper_services')
          .select('*')
          .eq('helper_id', user.id);

        if (helperServicesData) {
          setHelperServices(helperServicesData);
        }

        const { data: activeJobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('helper_id', user.id)
          .in('status', ['accepted', 'in_progress'])
          .order('created_at', { ascending: false });

        if (activeJobsData) {
          setActiveJobs(activeJobsData);
        }

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const { data: earningsData } = await supabase
          .from('jobs')
          .select('price_agreed')
          .eq('helper_id', user.id)
          .eq('status', 'completed')
          .gte('completed_at', firstDayOfMonth.toISOString());

        if (earningsData) {
          const total = earningsData.reduce((sum: number, job: any) => sum + (job.price_agreed || 0), 0);
          setMonthlyEarnings(Math.floor(total * 0.9));
        }
      } else {
        // Mock data when supabase not available
        setHelperProfile(null);
        setHelperServices([]);
        setHotJobs([]);
        setActiveJobs([]);
        setMonthlyEarnings(0);
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use empty data on error
      setHelperProfile(null);
      setHelperServices([]);
      setHotJobs([]);
      setActiveJobs([]);
      setMonthlyEarnings(0);
      setRecentActivity([]);
    }

    setLoading(false);
  };

  const updateAvailabilityStatus = async (status: 'available_now' | 'available_today' | 'by_appointment' | 'offline') => {
    if (!user) return;

    setUpdatingStatus(true);

    const { error } = await supabase
      .from('helper_profiles')
      .update({
        availability_status: status,
        status_updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      setHelperProfile((prev) => prev ? { ...prev, availability_status: status } : null);
    }

    setUpdatingStatus(false);
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return { text: 'Urgent', color: 'bg-[#FF6B35] text-white', pulse: true };
      case 'today':
        return { text: 'Today', color: 'bg-[#FF8C5A] text-white', pulse: false };
      default:
        return { text: 'Scheduled', color: 'bg-blue-500 text-white', pulse: false };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-700 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner
          userName={profile?.full_name || null}
          availabilityStatus={helperProfile?.availability_status || 'offline'}
          role="helper"
        />

        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => onNavigate('public-profile')}
            className="px-6 py-3 bg-white text-[#1F2937] border-2 border-[#2ECC71] rounded-xl hover:bg-green-50 transition-all font-bold flex items-center space-x-2 shadow-md"
          >
            <User className="w-5 h-5 text-[#2ECC71]" />
            <span>View My Profile</span>
          </button>

          {profile?.subscription_tier && ['pro', 'premium'].includes(profile.subscription_tier) && (
            <button
              onClick={() => onNavigate('jamii-shop')}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white rounded-xl hover:shadow-xl transition-all font-bold flex items-center space-x-2 shadow-md"
            >
              <Store className="w-5 h-5" />
              <span>Jamii Shop</span>
              {profile.subscription_tier === 'premium' && <Crown className="w-4 h-4" />}
            </button>
          )}

          {helperProfile?.community_status && (
            <div className="ml-auto">
              <CommunityStatusBadge status={helperProfile.community_status} size="md" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-10 h-10 text-white" />
              <TrendingUp className="w-5 h-5 text-white opacity-75" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatPrice(monthlyEarnings)}
            </div>
            <div className="text-sm text-white opacity-90">Earnings This Month</div>
            {profile?.subscription_tier === 'basic' && profile?.monthly_cap_remaining !== undefined && (
              <div className="mt-2 text-xs text-white opacity-75">
                ${(profile.monthly_cap_remaining / 100).toFixed(0)} remaining of $250 cap
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#FF6B35] to-[#E5612F] rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-3">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {helperProfile?.rating_average ? helperProfile.rating_average.toFixed(1) : 'N/A'}
            </div>
            <div className="text-sm text-white opacity-90">
              {helperProfile?.rating_count || 0} Reviews
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#374151] to-[#1F2937] rounded-xl shadow-xl border-2 border-[#2ECC71] p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-10 h-10 text-[#2ECC71]" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {activeJobs.length}
            </div>
            <div className="text-sm text-gray-400">Active Gigs</div>
          </div>

          <div className="bg-gradient-to-br from-[#374151] to-[#1F2937] rounded-xl shadow-xl border-2 border-blue-500 p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {responseRate}%
            </div>
            <div className="text-sm text-gray-400">Response Rate</div>
          </div>
        </div>

        <div className="mb-8 bg-[#1F2937] rounded-xl shadow-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Availability Status</h2>
            {updatingStatus && <span className="text-sm text-gray-400">Updating...</span>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => updateAvailabilityStatus('available_now')}
              disabled={updatingStatus}
              className={`p-4 rounded-lg border-2 transition-all ${
                helperProfile?.availability_status === 'available_now'
                  ? 'border-[#2ECC71] bg-[#2ECC71] bg-opacity-20 shadow-lg shadow-[#2ECC71]/50'
                  : 'border-gray-600 hover:border-[#2ECC71] hover:shadow-md bg-[#374151]'
              }`}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className={`w-3 h-3 bg-[#2ECC71] rounded-full ${helperProfile?.availability_status === 'available_now' ? 'animate-pulse' : ''}`}></div>
                <Clock className="w-5 h-5 text-[#2ECC71]" />
              </div>
              <div className="text-sm font-medium text-white">Available Now</div>
              <div className="text-xs text-gray-400 mt-1">Next 2 hours</div>
            </button>

            <button
              onClick={() => updateAvailabilityStatus('available_today')}
              disabled={updatingStatus}
              className={`p-4 rounded-lg border-2 transition-all ${
                helperProfile?.availability_status === 'available_today'
                  ? 'border-[#FF6B35] bg-[#FF6B35] bg-opacity-20 shadow-lg shadow-[#FF6B35]/50'
                  : 'border-gray-600 hover:border-[#FF6B35] hover:shadow-md bg-[#374151]'
              }`}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-[#FF6B35] rounded-full"></div>
                <Clock className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div className="text-sm font-medium text-white">Available Today</div>
              <div className="text-xs text-gray-400 mt-1">Within 8 hours</div>
            </button>

            <button
              onClick={() => updateAvailabilityStatus('by_appointment')}
              disabled={updatingStatus}
              className={`p-4 rounded-lg border-2 transition-all ${
                helperProfile?.availability_status === 'by_appointment'
                  ? 'border-blue-500 bg-blue-500 bg-opacity-20 shadow-lg shadow-blue-500/50'
                  : 'border-gray-600 hover:border-blue-400 hover:shadow-md bg-[#374151]'
              }`}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-sm font-medium text-white">By Appointment</div>
              <div className="text-xs text-gray-400 mt-1">Schedule only</div>
            </button>

            <button
              onClick={() => updateAvailabilityStatus('offline')}
              disabled={updatingStatus}
              className={`p-4 rounded-lg border-2 transition-all ${
                helperProfile?.availability_status === 'offline'
                  ? 'border-gray-500 bg-gray-500 bg-opacity-20 shadow-lg'
                  : 'border-gray-600 hover:border-gray-400 hover:shadow-md bg-[#374151]'
              }`}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <Clock className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-sm font-medium text-white">Offline</div>
              <div className="text-xs text-gray-400 mt-1">Not available</div>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <MyServicesSection services={helperServices} onNavigate={onNavigate} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1F2937] rounded-xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-[#FF6B35]" />
                  <span>Hot Jobs Near You</span>
                </h2>
                {hotJobs.length > 0 && (
                  <span className="px-4 py-2 bg-[#FF6B35] text-white rounded-full text-sm font-bold shadow-lg animate-pulse">
                    {hotJobs.length} new
                  </span>
                )}
              </div>

              {hotJobs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">No new jobs matching your services</p>
                  <p className="text-sm text-gray-500">Check back soon or update your service offerings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hotJobs.map((job) => {
                    const urgencyBadge = getUrgencyBadge(job.urgency);
                    return (
                      <div
                        key={job.id}
                        className="p-5 border-2 border-gray-600 bg-[#374151] rounded-lg hover:border-[#FF6B35] hover:shadow-xl hover:shadow-[#FF6B35]/20 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-lg group-hover:text-[#FF6B35] transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{job.services.name}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${urgencyBadge.color} ${urgencyBadge.pulse ? 'animate-pulse' : ''}`}>
                            <span>{urgencyBadge.text}</span>
                          </span>
                        </div>

                        {job.description && (
                          <p className="text-sm text-gray-300 mb-4 line-clamp-2">{job.description}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1 text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>Nearby</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-5 h-5 text-[#2ECC71]" />
                              <span className="font-bold text-[#2ECC71]">
                                Negotiable
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onNavigate('marketplace')}
                            className="px-6 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-all font-bold text-sm shadow-lg hover:shadow-xl"
                          >
                            Quick Apply
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-[#1F2937] rounded-xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-[#2ECC71]" />
                  <span>Recent Activity</span>
                </h2>
              </div>

              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-4 hover:bg-[#374151] rounded-lg transition-colors border border-gray-700"
                    >
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${activity.type === 'completed' ? 'bg-[#2ECC71]' : 'bg-[#FF6B35] animate-pulse'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{activity.title}</p>
                        <p className="text-xs text-gray-400 truncate">{activity.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {activity.amount && (
                          <p className="text-sm font-bold text-[#2ECC71]">
                            {formatPrice(activity.amount)}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <CommunicationHub onNavigate={onNavigate} unreadMessages={0} />

            <div className="bg-[#1F2937] rounded-xl shadow-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-6 h-6 text-[#FF6B35]" />
                <span>Active Gigs</span>
              </h2>

              {activeJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No active gigs</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="p-4 bg-[#374151] rounded-lg hover:bg-[#4B5563] transition-colors border border-gray-600">
                      <div className="font-medium text-white text-sm mb-1">{job.title}</div>
                      <div className="text-xs text-gray-400 mb-2">{job.profiles.full_name}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#2ECC71]">
                          {job.price_agreed ? formatPrice(job.price_agreed) : 'Pending'}
                        </span>
                        <button
                          onClick={() => onNavigate('messages')}
                          className="text-xs text-[#FF6B35] hover:text-[#E5612F] font-bold flex items-center space-x-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Message</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-xl shadow-xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate('helper-services')}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all font-semibold text-sm backdrop-blur-sm"
                >
                  Update Services
                </button>
                <button
                  onClick={() => onNavigate('settings')}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all font-semibold text-sm backdrop-blur-sm"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onNavigate('messages')}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all font-semibold text-sm backdrop-blur-sm"
                >
                  Earnings Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


