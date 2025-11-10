import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

type WelcomeBannerProps = {
  userName: string | null;
  availabilityStatus: string;
  role?: 'customer' | 'helper';
};

const HELPER_MOTIVATIONAL_MESSAGES = [
  "Bring back the UNITY in community - one service at a time.",
  "Your skills strengthen the bonds in our neighborhood.",
  "Every job you complete builds authentic connections.",
  "Help your neighbors thrive while building your business.",
  "You're not just earning - you're rebuilding community.",
  "Transform strangers into neighbors through great service.",
  "Keep money local, keep neighbors connected.",
  "Your work creates the unity our neighborhoods need.",
];

const CUSTOMER_MOTIVATIONAL_MESSAGES = [
  "Bring back the UNITY in community today.",
  "Support local neighbors and strengthen connections.",
  "Every service request builds neighborhood bonds.",
  "Find trusted help while rebuilding community unity.",
  "Your support helps neighbors thrive together.",
  "Transform your neighborhood through local support.",
  "Keep your dollars local, keep neighbors connected.",
  "Building authentic connections, one service at a time.",
];

export function WelcomeBanner({ userName, availabilityStatus, role = 'helper' }: WelcomeBannerProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const messages = role === 'helper' ? HELPER_MOTIVATIONAL_MESSAGES : CUSTOMER_MOTIVATIONAL_MESSAGES;

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const getFirstName = (fullName: string | null) => {
    if (!fullName) return 'there';
    return fullName.split(' ')[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available_now':
        return 'bg-[#2ECC71]';
      case 'available_today':
        return 'bg-[#FF6B35]';
      case 'by_appointment':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available_now':
        return 'Available Now';
      case 'available_today':
        return 'Available Today';
      case 'by_appointment':
        return 'By Appointment';
      default:
        return 'Offline';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FF6B35] via-[#E5612F] to-[#FF8C5A] rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {getFirstName(userName)}!
            </h1>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
            <div className={`w-3 h-3 ${getStatusColor(availabilityStatus)} rounded-full`}></div>
            <span className="text-white text-sm font-semibold">{getStatusText(availabilityStatus)}</span>
          </div>
        </div>

        <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white text-lg font-medium">
            {messages[messageIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}


