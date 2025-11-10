import { useState } from 'react';
import { Instagram, Facebook, Linkedin, Twitter, Check, X, Users, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'twitter';

type SocialConnection = {
  platform: SocialPlatform;
  username: string | null;
  connected: boolean;
  verified?: boolean;
  followers?: number;
};

type SocialConnectProps = {
  userId: string;
  connections: {
    instagram_username: string | null;
    instagram_connected: boolean;
    instagram_verified: boolean;
    instagram_followers: number;
    facebook_username: string | null;
    facebook_connected: boolean;
    linkedin_username: string | null;
    linkedin_connected: boolean;
    tiktok_username: string | null;
    tiktok_connected: boolean;
    tiktok_verified: boolean;
    tiktok_followers: number;
    twitter_username: string | null;
    twitter_connected: boolean;
  };
  onUpdate: () => void;
};

const platformConfig = {
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'from-purple-500 to-pink-500',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    placeholder: 'username',
    baseUrl: 'https://instagram.com/',
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'from-blue-600 to-blue-700',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    placeholder: 'username',
    baseUrl: 'https://facebook.com/',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'from-blue-700 to-blue-800',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    placeholder: 'username',
    baseUrl: 'https://linkedin.com/in/',
  },
  tiktok: {
    name: 'TikTok',
    icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
      </svg>
    ),
    color: 'from-black to-gray-800',
    textColor: 'text-black',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    placeholder: 'username',
    baseUrl: 'https://tiktok.com/@',
  },
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: 'from-black to-gray-900',
    textColor: 'text-black',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    placeholder: 'username',
    baseUrl: 'https://x.com/',
  },
};

export function SocialConnect({ userId, connections, onUpdate }: SocialConnectProps) {
  const [editMode, setEditMode] = useState<{ [key in SocialPlatform]?: boolean }>({});
  const [inputValues, setInputValues] = useState<{ [key in SocialPlatform]?: string }>({});
  const [loading, setLoading] = useState<{ [key in SocialPlatform]?: boolean }>({});

  const handleConnect = async (platform: SocialPlatform) => {
    const config = platformConfig[platform];
    const username = inputValues[platform]?.trim().replace(/^@/, '');

    if (!username) return;

    setLoading({ ...loading, [platform]: true });

    try {
      const updateData = {
        [`${platform}_username`]: username,
        [`${platform}_connected`]: true,
        social_last_synced: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;

      setEditMode({ ...editMode, [platform]: false });
      setInputValues({ ...inputValues, [platform]: '' });
      onUpdate();
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
    } finally {
      setLoading({ ...loading, [platform]: false });
    }
  };

  const handleDisconnect = async (platform: SocialPlatform) => {
    setLoading({ ...loading, [platform]: true });

    try {
      const updateData = {
        [`${platform}_username`]: null,
        [`${platform}_connected`]: false,
        [`${platform}_verified`]: false,
        [`${platform}_followers`]: 0,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;

      onUpdate();
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
    } finally {
      setLoading({ ...loading, [platform]: false });
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const renderPlatform = (platform: SocialPlatform) => {
    const config = platformConfig[platform];
    const Icon = config.icon;
    const username = connections[`${platform}_username` as keyof typeof connections] as string | null;
    const connected = connections[`${platform}_connected` as keyof typeof connections] as boolean;
    const verified = connections[`${platform}_verified` as keyof typeof connections] as boolean;
    const followers = connections[`${platform}_followers` as keyof typeof connections] as number;
    const isEditing = editMode[platform];
    const isLoading = loading[platform];

    return (
      <div
        key={platform}
        className={`border-2 ${connected ? config.borderColor : 'border-gray-200'} rounded-xl p-6 transition-all ${
          connected ? config.bgColor : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center shadow-md`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#1F2937]">{config.name}</h3>
              {connected && username ? (
                <div className="flex items-center space-x-1">
                  <span className={`text-sm font-semibold ${config.textColor}`}>
                    @{username}
                  </span>
                  {verified && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              ) : (
                <span className="text-sm text-[#6B7280]">Not connected</span>
              )}
            </div>
          </div>
          {connected && (
            <button
              onClick={() => handleDisconnect(platform)}
              disabled={isLoading}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {connected && followers > 0 && (
          <div className="flex items-center space-x-2 mb-4 text-sm text-[#6B7280]">
            <Users className="w-4 h-4" />
            <span>{formatFollowers(followers)} followers</span>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={inputValues[platform] || ''}
              onChange={(e) => setInputValues({ ...inputValues, [platform]: e.target.value })}
              placeholder={`Enter ${config.placeholder}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleConnect(platform)}
                disabled={isLoading || !inputValues[platform]?.trim()}
                className={`flex-1 px-4 py-2 bg-gradient-to-r ${config.color} text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Connecting...' : 'Connect'}
              </button>
              <button
                onClick={() => {
                  setEditMode({ ...editMode, [platform]: false });
                  setInputValues({ ...inputValues, [platform]: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-[#6B7280] rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : !connected ? (
          <button
            onClick={() => setEditMode({ ...editMode, [platform]: true })}
            className="w-full px-4 py-2 bg-white border-2 border-gray-300 text-[#1F2937] rounded-lg hover:border-[#FF6B35] transition-all font-semibold"
          >
            Connect {config.name}
          </button>
        ) : (
          <div className="flex space-x-2">
            <a
              href={`${config.baseUrl}${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-[#1F2937] rounded-lg hover:border-[#FF6B35] transition-all font-medium flex items-center justify-center space-x-2"
            >
              <span>View Profile</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => {
                setInputValues({ ...inputValues, [platform]: username || '' });
                setEditMode({ ...editMode, [platform]: true });
              }}
              className="px-4 py-2 bg-orange-50 text-[#FF6B35] rounded-lg hover:bg-orange-100 transition-all font-medium"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-[#1F2937] mb-1">Quick Social Connect</h4>
          <p className="text-sm text-[#6B7280]">
            Just enter your username and we'll create a direct link to your profile. Visitors can click the icon to view your social media.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderPlatform('instagram')}
        {renderPlatform('facebook')}
        {renderPlatform('tiktok')}
        {renderPlatform('linkedin')}
        {renderPlatform('twitter')}
      </div>

      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm text-[#6B7280] text-center">
          Your social profiles help build trust with your community. Connected profiles will appear as clickable icons on your public profile.
        </p>
      </div>
    </div>
  );
}


