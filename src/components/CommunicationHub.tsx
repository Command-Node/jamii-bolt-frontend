import { MessageSquare, Bell, DollarSign, Inbox } from 'lucide-react';

type CommunicationHubProps = {
  onNavigate: (page: string) => void;
  unreadMessages?: number;
};

export function CommunicationHub({ onNavigate, unreadMessages = 0 }: CommunicationHubProps) {
  return (
    <div className="bg-[#1F2937] rounded-xl shadow-lg border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
        <MessageSquare className="w-6 h-6 text-[#FF6B35]" />
        <span>Communication Hub</span>
      </h2>

      <div className="space-y-4">
        <button
          onClick={() => onNavigate('messages')}
          className="w-full p-4 bg-[#374151] hover:bg-[#4B5563] rounded-lg transition-all border-2 border-transparent hover:border-[#FF6B35] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#FF6B35] bg-opacity-20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold group-hover:text-[#FF6B35] transition-colors">
                  New Messages
                </div>
                <div className="text-gray-400 text-sm">
                  {unreadMessages > 0 ? `${unreadMessages} unread` : 'No new messages'}
                </div>
              </div>
            </div>
            {unreadMessages > 0 && (
              <div className="w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-xs font-bold">
                {unreadMessages}
              </div>
            )}
          </div>
        </button>

        <button
          onClick={() => onNavigate('messages')}
          className="w-full p-4 bg-[#374151] hover:bg-[#4B5563] rounded-lg transition-all border-2 border-transparent hover:border-[#2ECC71] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#2ECC71] bg-opacity-20 rounded-full flex items-center justify-center">
                <Inbox className="w-5 h-5 text-[#2ECC71]" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold group-hover:text-[#2ECC71] transition-colors">
                  Customer Inquiries
                </div>
                <div className="text-gray-400 text-sm">Recent requests for your services</div>
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('messages')}
          className="w-full p-4 bg-[#374151] hover:bg-[#4B5563] rounded-lg transition-all border-2 border-transparent hover:border-blue-500 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold group-hover:text-blue-500 transition-colors">
                  Job Updates
                </div>
                <div className="text-gray-400 text-sm">Status changes and notifications</div>
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('messages')}
          className="w-full p-4 bg-[#374151] hover:bg-[#4B5563] rounded-lg transition-all border-2 border-transparent hover:border-[#2ECC71] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#2ECC71] bg-opacity-20 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#2ECC71]" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold group-hover:text-[#2ECC71] transition-colors">
                  Payment Notifications
                </div>
                <div className="text-gray-400 text-sm">Earnings and payment updates</div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}


