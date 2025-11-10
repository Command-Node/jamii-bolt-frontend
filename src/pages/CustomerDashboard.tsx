import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, MessageCircle, Star, Sparkles, TrendingUp, Search, DollarSign, User, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { WaveRating } from '../components/WaveRating';

// Safe supabase fallback
let supabase: any = null;
try {
  const supabaseModule = require('../../lib/supabase');
  supabase = supabaseModule.supabase;
} catch (err) {
  // Supabase not available - use mock data
  supabase = null;
}

type CustomerDashboardProps = {
  onNavigate: (page: string) => void;
};

export function CustomerDashboard({ onNavigate }: CustomerDashboardProps) {
  const { user, profile } = useAuth();
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [recommendedHelpers, setRecommendedHelpers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Mock data for now - will connect to backend API later
    try {
      if (supabase) {
        const { data: activeData } = await supabase
          .from('jobs')
          .select('*')
          .eq('customer_id', user.id)
          .in('status', ['pending', 'accepted', 'in_progress'])
          .order('created_at', { ascending: false });

        if (activeData) {
          setActiveJobs(activeData);
        }

        const { data: completedData } = await supabase
          .from('jobs')
          .select('*')
          .eq('customer_id', user.id)
          .in('status', ['completed', 'cancelled'])
          .order('created_at', { ascending: false })
          .limit(10);

        if (completedData) {
          setCompletedJobs(completedData);
          const spent = completedData
            .filter((job: any) => job.status === 'completed' && job.price_agreed)
            .reduce((sum: number, job: any) => sum + (job.price_agreed || 0), 0);
          setTotalSpent(spent);
        }

        const { data: helpersData } = await supabase
          .from('helper_profiles')
          .select('*')
          .gte('rating_average', 4.5)
          .gte('jobs_completed', 5)
          .order('rating_average', { ascending: false })
          .limit(4);

        if (helpersData) {
          setRecommendedHelpers(helpersData);
        }
      } else {
        // Mock data when supabase not available
        setActiveJobs([]);
        setCompletedJobs([]);
        setTotalSpent(0);
        setRecommendedHelpers([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Use empty data on error
      setActiveJobs([]);
      setCompletedJobs([]);
      setTotalSpent(0);
      setRecommendedHelpers([]);
    }

    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'accepted':
        return { text: 'Accepted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
      case 'in_progress':
        return { text: 'In Progress', color: 'bg-green-100 text-green-800', icon: Clock };
      case 'completed':
        return { text: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'cancelled':
        return { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const formatPrice = (cents: number | null) => {
    if (!cents) return 'N/A';
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getFirstName = (fullName: string | null) => {
    if (!fullName) return 'there';
    return fullName.split(' ')[0];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-br from-[#FF6B35] via-[#E5612F] to-[#FF8C5A] rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {getFirstName(profile?.full_name || null)}!
              </h1>
            </div>
          </div>
          <p className="text-white text-lg font-medium mb-6">
            Find trusted local help for any task, anytime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('marketplace')}
              className="px-8 py-4 bg-white text-[#FF6B35] rounded-xl hover:bg-gray-50 transition-all font-bold text-lg flex items-center space-x-3 shadow-xl"
            >
              <Search className="w-6 h-6" />
              <span>Find Help Now</span>
            </button>
            <button
              onClick={() => onNavigate('public-profile')}
              className="px-8 py-4 bg-[#2ECC71] text-white rounded-xl hover:bg-[#27AE60] transition-all font-bold text-lg flex items-center space-x-3 shadow-xl"
            >
              <User className="w-6 h-6" />
              <span>View My Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-[#1F2937] mb-1">{activeJobs.length}</div>
          <div className="text-sm text-[#6B7280]">Active Requests</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-10 h-10 text-[#2ECC71]" />
          </div>
          <div className="text-3xl font-bold text-[#1F2937] mb-1">
            {completedJobs.filter(j => j.status === 'completed').length}
          </div>
          <div className="text-sm text-[#6B7280]">Completed Jobs</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-10 h-10 text-[#FF6B35]" />
          </div>
          <div className="text-3xl font-bold text-[#1F2937] mb-1">{formatPrice(totalSpent)}</div>
          <div className="text-sm text-[#6B7280]">Total Spent</div>
        </div>
      </div>

      {recommendedHelpers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1F2937] flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-[#FF6B35]" />
              <span>Top Rated Helpers</span>
            </h2>
            <button
              onClick={() => onNavigate('marketplace')}
              className="text-sm text-[#FF6B35] hover:text-[#E5612F] font-medium"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedHelpers.map((helper) => (
              <div
                key={helper.id}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#FF6B35] hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onNavigate('marketplace')}
              >
                <div className="text-center">
                  {helper.profiles.avatar_url ? (
                    <img
                      src={helper.profiles.avatar_url}
                      alt={helper.profiles.full_name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-orange-100"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#E5612F] rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {helper.profiles.full_name?.charAt(0) || 'H'}
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold text-[#1F2937] mb-2 group-hover:text-[#FF6B35] transition-colors">
                    {helper.profiles.full_name}
                  </h3>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-[#1F2937]">
                      {helper.rating_average?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-xs text-[#6B7280]">({helper.rating_count})</span>
                  </div>
                  <p className="text-xs text-[#6B7280]">{helper.jobs_completed} jobs completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Active Requests</h2>

        {activeJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-[#6B7280] mb-4">No active requests</p>
            <button
              onClick={() => onNavigate('marketplace')}
              className="text-[#FF6B35] hover:text-[#E5612F] font-medium"
            >
              Browse available helpers
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeJobs.map((job) => {
              const statusBadge = getStatusBadge(job.status);
              const StatusIcon = statusBadge.icon;
              return (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F2937] mb-1">{job.title}</h3>
                      <p className="text-sm text-[#6B7280]">{job.services.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusBadge.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{statusBadge.text}</span>
                    </span>
                  </div>

                  {job.description && (
                    <p className="text-[#6B7280] mb-4">{job.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      {job.helper_profiles && (
                        <div className="flex items-center space-x-2">
                          {job.helper_profiles.profiles.avatar_url ? (
                            <img
                              src={job.helper_profiles.profiles.avatar_url}
                              alt={job.helper_profiles.profiles.full_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-[#FF6B35] text-sm font-bold">
                                {job.helper_profiles.profiles.full_name?.charAt(0) || 'H'}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#1F2937]">
                              {job.helper_profiles.profiles.full_name}
                            </p>
                            {job.helper_profiles.rating_average && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-[#6B7280]">
                                  {job.helper_profiles.rating_average.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <p className="text-sm text-[#6B7280]">
                        Posted: {new Date(job.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium text-[#FF6B35]">
                        {formatPrice(job.price_agreed)}
                      </p>
                    </div>

                    {job.helper_id && (
                      <button
                        onClick={() => onNavigate('messages')}
                        className="px-4 py-2 bg-orange-50 text-[#FF6B35] rounded-lg hover:bg-orange-100 transition-all font-medium flex items-center space-x-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Past Jobs</h2>

        {completedJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-[#6B7280]">No completed jobs yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedJobs.map((job) => {
              const statusBadge = getStatusBadge(job.status);
              const StatusIcon = statusBadge.icon;
              return (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-[#1F2937] mb-1">{job.title}</h3>
                          <p className="text-sm text-[#6B7280]">{job.services.name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusBadge.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{statusBadge.text}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="space-y-1">
                          {job.helper_profiles && (
                            <div className="flex items-center space-x-2">
                              {job.helper_profiles.profiles.avatar_url ? (
                                <img
                                  src={job.helper_profiles.profiles.avatar_url}
                                  alt={job.helper_profiles.profiles.full_name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                  <span className="text-[#FF6B35] text-sm font-bold">
                                    {job.helper_profiles.profiles.full_name?.charAt(0) || 'H'}
                                  </span>
                                </div>
                              )}
                              <p className="text-sm font-medium text-[#1F2937]">
                                {job.helper_profiles.profiles.full_name}
                              </p>
                            </div>
                          )}
                          <p className="text-sm text-[#6B7280]">
                            Completed: {job.completed_at ? new Date(job.completed_at).toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="text-sm font-medium text-[#FF6B35]">
                            {formatPrice(job.price_agreed)}
                          </p>
                        </div>

                        {job.status === 'completed' && (
                          <button className="px-4 py-2 bg-orange-50 text-[#FF6B35] rounded-lg hover:bg-orange-100 transition-all font-medium flex items-center space-x-2">
                            <Star className="w-4 h-4" />
                            <span>Leave Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


