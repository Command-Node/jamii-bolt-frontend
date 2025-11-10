import { Zap, User, Briefcase, MessageSquare } from 'lucide-react';

type QuickActionsPanelProps = {
  onNavigate: (page: string) => void;
  unreadMessages?: number;
  servicesCount?: number;
};

export function QuickActionsPanel({ onNavigate, unreadMessages = 0, servicesCount = 0 }: QuickActionsPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center space-x-2">
        <Zap className="w-5 h-5 text-[#FF6B35]" />
        <span>Quick Actions</span>
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('settings')}
          className="group bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl p-6 transition-all transform hover:scale-105 hover:shadow-md"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-[#1F2937]">Edit Profile</div>
              <div className="text-xs text-[#6B7280] mt-1">Update your info</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('helper-services')}
          className="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl p-6 transition-all transform hover:scale-105 hover:shadow-md"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-[#2ECC71] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative">
              <Briefcase className="w-6 h-6 text-white" />
              {servicesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {servicesCount}
                </span>
              )}
            </div>
            <div>
              <div className="font-semibold text-[#1F2937]">My Services</div>
              <div className="text-xs text-[#6B7280] mt-1">Manage offerings</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('messages')}
          className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 transition-all transform hover:scale-105 hover:shadow-md"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative">
              <MessageSquare className="w-6 h-6 text-white" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadMessages}
                </span>
              )}
            </div>
            <div>
              <div className="font-semibold text-[#1F2937]">Messages</div>
              <div className="text-xs text-[#6B7280] mt-1">Check inbox</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('marketplace')}
          className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-6 transition-all transform hover:scale-105 hover:shadow-md"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-[#1F2937]">Browse Jobs</div>
              <div className="text-xs text-[#6B7280] mt-1">Find opportunities</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}


