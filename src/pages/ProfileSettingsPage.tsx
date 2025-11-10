import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Camera, Lock, Clock, DollarSign, Calendar, Shield, CheckCircle, Award, Upload, MapPinned } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SocialConnect } from '../components/SocialConnect';
import { ProfileCompleteness } from '../components/ProfileCompleteness';
import { WaveRating } from '../components/WaveRating';

// Safe supabase fallback
let supabase: any = null;
try {
  const supabaseModule = require('../../lib/supabase');
  supabase = supabaseModule.supabase;
} catch (err) {
  supabase = null;
}

type ProfileSettingsPageProps = {
  onNavigate: (page: string) => void;
};

export function ProfileSettingsPage({ onNavigate }: ProfileSettingsPageProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  });

  const [helperProfile, setHelperProfile] = useState<any>(null);
  const [helperFormData, setHelperFormData] = useState({
    bio: '',
    years_experience: 0,
    response_time_hours: 24,
    availability_status: 'available' as 'available' | 'busy' | 'away',
  });

  const [badges, setBadges] = useState<any[]>([]);
  const [stats, setStats] = useState({
    jobsCompleted: 0,
    repeatCustomers: 0,
    reviewCount: 0,
    averageRating: 0,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });

      if (profile.role === 'helper') {
        fetchHelperData();
      }
    }
  }, [profile]);

  const fetchHelperData = async () => {
    if (!user?.id || !supabase) return;

    try {
      const { data: helperData } = await supabase
      .from('helper_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (helperData) {
      setHelperProfile(helperData);
      setHelperFormData({
        bio: helperData.bio || '',
        years_experience: helperData.years_experience || 0,
        response_time_hours: helperData.response_time_hours || 24,
        availability_status: helperData.availability_status || 'available',
      });

      setStats({
        jobsCompleted: helperData.jobs_completed || 0,
        repeatCustomers: helperData.repeat_customers || 0,
        reviewCount: helperData.rating_count || 0,
        averageRating: helperData.rating_average || 0,
      });
    }

    const { data: badgesData } = await supabase
      .from('helper_badges')
      .select(`
        *,
        badges (
          name,
          icon,
          description,
          requires_verification
        )
      `)
      .eq('helper_id', user.id)
      .eq('verified', true);

    if (badgesData) {
      setBadges(badgesData);
    }
    } catch (error) {
      console.error('Error fetching helper data:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage({ type: 'error', text: 'Database not available' });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleHelperProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('helper_profiles')
        .update({
          bio: helperFormData.bio,
          years_experience: helperFormData.years_experience,
          response_time_hours: helperFormData.response_time_hours,
          availability_status: helperFormData.availability_status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await fetchHelperData();
      setMessage({ type: 'success', text: 'Helper profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update helper profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setMessage({ type: 'success', text: 'Profile photo updated!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload photo' });
    } finally {
      setLoading(false);
    }
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

  const getLastActive = () => {
    if (!helperProfile?.last_active) return 'Never';
    const now = new Date();
    const lastActive = new Date(helperProfile.last_active);
    const diffHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Active now';
    if (diffHours < 24) return 'Active today';
    if (diffHours < 48) return 'Active yesterday';
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-[#2ECC71]';
      case 'busy': return 'bg-[#FF6B35]';
      case 'away': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getAvailabilityLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'away': return 'Away';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Profile Settings</h1>
        <p className="text-[#6B7280]">Manage your account information and preferences</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200">
          <div className="relative">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'User'}
                className="w-24 h-24 rounded-full object-cover border-4 border-orange-100"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B35] to-[#E5612F] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-3xl font-bold">{getInitials(profile?.full_name || null)}</span>
              </div>
            )}
            <label htmlFor="photo-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center shadow-lg hover:bg-[#E5612F] transition-colors cursor-pointer">
              <Camera className="w-4 h-4 text-white" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-1">{profile?.full_name || 'User'}</h2>
            <p className="text-[#6B7280] mb-2">{profile?.email}</p>
            <span className="inline-block px-3 py-1 bg-orange-100 text-[#FF6B35] rounded-full text-sm font-medium capitalize">
              {profile?.role || 'User'}
            </span>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Personal Information</h3>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-[#6B7280] mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </div>
            </label>
            <input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#6B7280] mb-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </div>
            </label>
            <input
              id="email"
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-[#6B7280]">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#6B7280] mb-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Phone Number</span>
              </div>
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-[#6B7280] mb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Address</span>
              </div>
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate(profile?.role === 'helper' ? 'helper-dashboard' : 'customer-dashboard')}
              className="px-6 py-3 border border-gray-300 text-[#6B7280] rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E5612F] transition-all font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {profile?.role === 'helper' && helperProfile && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h3 className="text-lg font-semibold text-[#1F2937] mb-6 flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#FF6B35]" />
              <span>Community Stats & Credentials</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-700">{stats.jobsCompleted}</span>
                </div>
                <p className="text-sm font-medium text-blue-600">Jobs Completed</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <User className="w-6 h-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-700">{stats.repeatCustomers}</span>
                </div>
                <p className="text-sm font-medium text-green-600">Repeat Customers</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <WaveRating rating={stats.averageRating} size="sm" />
                </div>
                <p className="text-sm font-medium text-orange-600">{stats.reviewCount} Reviews</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-700">{badges.length}</span>
                </div>
                <p className="text-sm font-medium text-purple-600">Verified Badges</p>
              </div>
            </div>

            {badges.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#1F2937] mb-3">Your Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-full"
                      title={badge.badges.description}
                    >
                      <span className="text-xl">{badge.badges.icon}</span>
                      <span className="text-sm font-semibold text-blue-700">{badge.badges.name}</span>
                      {badge.badges.requires_verification && (
                        <CheckCircle className="w-4 h-4 text-[#2ECC71]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <form onSubmit={handleHelperProfileUpdate} className="space-y-6">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Helper Profile Information</h3>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-[#6B7280] mb-2">
                  Bio (250 characters)
                </label>
                <textarea
                  id="bio"
                  value={helperFormData.bio}
                  onChange={(e) => setHelperFormData({ ...helperFormData, bio: e.target.value.slice(0, 250) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
                  rows={4}
                  maxLength={250}
                  placeholder="Tell neighbors about yourself and your services..."
                />
                <p className="mt-1 text-xs text-[#6B7280] text-right">{helperFormData.bio.length}/250</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="years_experience" className="block text-sm font-medium text-[#6B7280] mb-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span>Years of Experience</span>
                    </div>
                  </label>
                  <input
                    id="years_experience"
                    type="number"
                    min="0"
                    max="50"
                    value={helperFormData.years_experience}
                    onChange={(e) => setHelperFormData({ ...helperFormData, years_experience: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="response_time" className="block text-sm font-medium text-[#6B7280] mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Response Time (hours)</span>
                    </div>
                  </label>
                  <select
                    id="response_time"
                    value={helperFormData.response_time_hours}
                    onChange={(e) => setHelperFormData({ ...helperFormData, response_time_hours: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  >
                    <option value="1">Within 1 hour</option>
                    <option value="2">Within 2 hours</option>
                    <option value="4">Within 4 hours</option>
                    <option value="8">Within 8 hours</option>
                    <option value="12">Within 12 hours</option>
                    <option value="24">Within 24 hours</option>
                    <option value="48">Within 48 hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-3">
                  Availability Status
                </label>
                <div className="flex flex-wrap gap-3">
                  {(['available', 'busy', 'away'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setHelperFormData({ ...helperFormData, availability_status: status })}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                        helperFormData.availability_status === status
                          ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]'
                          : 'border-gray-300 bg-white text-[#6B7280] hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(status)}`} />
                      <span className="capitalize">{getAvailabilityLabel(status)}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[#6B7280]">Last active: {getLastActive()}</p>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E5612F] transition-all font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Saving...' : 'Save Helper Profile'}</span>
                </button>
              </div>
            </form>
          </div>

          <ProfileCompleteness profile={profile} helperProfile={helperProfile} />
        </>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-6">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Social Media Connections</h3>
        {user && profile && (
          <SocialConnect
            userId={user.id}
            connections={{
              instagram_username: (profile as any).instagram_username || null,
              instagram_connected: (profile as any).instagram_connected || false,
              instagram_verified: (profile as any).instagram_verified || false,
              instagram_followers: (profile as any).instagram_followers || 0,
              facebook_username: (profile as any).facebook_username || null,
              facebook_connected: (profile as any).facebook_connected || false,
              linkedin_username: (profile as any).linkedin_username || null,
              linkedin_connected: (profile as any).linkedin_connected || false,
              tiktok_username: (profile as any).tiktok_username || null,
              tiktok_connected: (profile as any).tiktok_connected || false,
              tiktok_verified: (profile as any).tiktok_verified || false,
              tiktok_followers: (profile as any).tiktok_followers || 0,
              twitter_username: (profile as any).twitter_username || null,
              twitter_connected: (profile as any).twitter_connected || false,
            }}
            onUpdate={refreshProfile}
          />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Change Password</span>
          </h3>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-[#6B7280] mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#6B7280] mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
              className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E5612F] transition-all font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-5 h-5" />
              <span>{loading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


