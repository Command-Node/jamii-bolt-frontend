import { CheckCircle, Circle } from 'lucide-react';

type ProfileCompletenessProps = {
  profile: any;
  helperProfile?: any;
};

export function ProfileCompleteness({ profile, helperProfile }: ProfileCompletenessProps) {
  const checklistItems = [
    { label: 'Profile photo', completed: !!profile?.avatar_url },
    { label: 'Full name', completed: !!profile?.full_name },
    { label: 'Phone number', completed: !!profile?.phone },
    { label: 'Address', completed: !!profile?.address },
    { label: 'Bio', completed: !!helperProfile?.bio },
    { label: 'At least one service', completed: helperProfile?.services_offered > 0 },
    { label: 'Social media connected', completed: profile?.instagram_username || profile?.facebook_username || profile?.tiktok_username },
    { label: 'ID verification', completed: !!profile?.id_verified },
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-[#1F2937]">Profile Completeness</h3>
          <span className="text-2xl font-bold text-[#FF6B35]">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-[#6B7280] mb-3">Complete profiles rank higher in search results</p>
        {checklistItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            {item.completed ? (
              <CheckCircle className="w-5 h-5 text-[#2ECC71] flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
            )}
            <span className={`text-sm ${item.completed ? 'text-[#1F2937] font-medium' : 'text-[#6B7280]'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


