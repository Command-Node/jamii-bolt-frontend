import { useAuth } from '../contexts/AuthContext';
import { Search, DollarSign } from 'lucide-react';

type RoleSwitcherProps = {
  onNavigate: (page: string) => void;
};

export function RoleSwitcher({ onNavigate }: RoleSwitcherProps) {
  const { activeRole, setActiveRole } = useAuth();

  const handleRoleSwitch = (role: 'customer' | 'helper') => {
    setActiveRole(role);
    const targetPage = role === 'helper' ? 'helper-dashboard' : 'customer-dashboard';
    onNavigate(targetPage);
  };

  return (
    <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-1.5 shadow-lg border-2 border-gray-300">
      <button
        onClick={() => handleRoleSwitch('customer')}
        className={`px-6 py-3 rounded-lg text-sm font-extrabold transition-all duration-200 flex items-center space-x-2 ${
          activeRole === 'customer'
            ? 'bg-gradient-to-r from-[#FF6B35] to-[#E5612F] text-white shadow-xl scale-110 border-2 border-white'
            : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-white/50'
        }`}
      >
        <span className="text-lg">Q</span>
        <span className="whitespace-nowrap">NEIGHBOR MODE</span>
      </button>
      <button
        onClick={() => handleRoleSwitch('helper')}
        className={`px-6 py-3 rounded-lg text-sm font-extrabold transition-all duration-200 flex items-center space-x-2 ${
          activeRole === 'helper'
            ? 'bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white shadow-xl scale-110 border-2 border-white'
            : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-white/50'
        }`}
      >
        <span className="text-lg">$</span>
        <span className="whitespace-nowrap">HELPER MODE</span>
      </button>
    </div>
  );
}


