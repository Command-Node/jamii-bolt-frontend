import { ReactNode } from 'react';
import { Menu, X, User, LogOut, Home, Bell, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RoleSwitcher } from './RoleSwitcher';

type LayoutProps = {
  children: ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
};

export function Layout({ children, onNavigate, currentPage }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, profile, signOut, activeRole } = useAuth();

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('landing');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#2ECC71] rounded-lg flex items-center justify-center shadow-md">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#1F2937]">JAMII</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {user && profile ? (
                <>
                  <button
                    onClick={() => onNavigate('marketplace')}
                    className={`text-sm font-semibold transition-colors ${
                      currentPage === 'marketplace' ? 'text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#FF6B35]'
                    }`}
                  >
                    Find Help
                  </button>
                  <button
                    onClick={() => onNavigate(activeRole === 'helper' ? 'helper-dashboard' : 'customer-dashboard')}
                    className={`text-sm font-semibold transition-colors ${
                      currentPage.includes('dashboard') ? 'text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#FF6B35]'
                    }`}
                  >
                    Dashboard
                  </button>
                  <RoleSwitcher onNavigate={onNavigate} />
                  <button
                    onClick={() => onNavigate('messages')}
                    className={`text-sm font-semibold transition-colors ${
                      currentPage === 'messages' ? 'text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#FF6B35]'
                    }`}
                  >
                    Messages
                  </button>
                  <button
                    onClick={() => onNavigate('payments')}
                    className={`text-sm font-semibold transition-colors ${
                      currentPage === 'payments' ? 'text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#FF6B35]'
                    }`}
                  >
                    Payments
                  </button>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onNavigate('messages')}
                      className="relative p-2 text-[#6B7280] hover:text-[#FF6B35] transition-colors"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B35] rounded-full"></span>
                    </button>

                    <button
                      onClick={() => onNavigate('settings')}
                      className="p-2 text-[#6B7280] hover:text-[#FF6B35] transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 focus:outline-none"
                      >
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name || 'User'}
                            className="w-9 h-9 rounded-full object-cover border-2 border-orange-100"
                          />
                        ) : (
                          <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B35] to-[#2ECC71] rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-sm font-bold">{getInitials(profile.full_name)}</span>
                          </div>
                        )}
                      </button>

                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-semibold text-[#1F2937]">{profile.full_name || 'User'}</p>
                            <p className="text-xs text-[#6B7280] mt-1">{profile.email}</p>
                          </div>
                          <button
                            onClick={() => {
                              onNavigate(activeRole === 'helper' ? 'helper-dashboard' : 'customer-dashboard');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-[#6B7280] hover:bg-gray-50 transition-colors"
                          >
                            Dashboard
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('settings');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-[#6B7280] hover:bg-gray-50 transition-colors"
                          >
                            Settings
                          </button>
                          <div className="border-t border-gray-200 mt-2 pt-2">
                            <button
                              onClick={() => {
                                handleSignOut();
                                setShowUserMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('marketplace')}
                    className="text-sm font-semibold text-[#6B7280] hover:text-[#FF6B35] transition-colors"
                  >
                    Browse Services
                  </button>
                  <button
                    onClick={() => onNavigate('auth')}
                    className="text-sm font-semibold text-[#6B7280] hover:text-[#FF6B35] transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onNavigate('auth')}
                    className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold shadow-md"
                  >
                    Get Started
                  </button>
                </>
              )}
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              {user && profile ? (
                <>
                  <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#2ECC71] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{profile.full_name || 'User'}</span>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('marketplace');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Find Help
                  </button>
                  <button
                    onClick={() => {
                      onNavigate(activeRole === 'helper' ? 'helper-dashboard' : 'customer-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('messages');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Messages
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onNavigate('marketplace');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Browse Services
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('auth');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('auth');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold text-center shadow-md"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#2ECC71] rounded-lg flex items-center justify-center shadow-md">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#1F2937]">JAMII</span>
              </div>
              <p className="text-sm font-bold mb-3">
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] bg-clip-text text-transparent">Bring Back the UNITY in Comm</span><span className="bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] bg-clip-text text-transparent font-extrabold">UNITY</span>
              </p>
              <p className="text-gray-600 text-sm max-w-md mb-4">
                <span className="font-semibold">JAMII</span> is our mission to rebuild the authentic neighborhood connections that make comm<span className="font-bold">UNITY</span> thrive. We keep money local, celebrate diverse skills, and transform strangers into neighbors.
              </p>
              <p className="text-gray-600 text-sm max-w-md italic">
                "One neighborhood at a time, one comm<span className="font-bold">UNITY</span> at a time"
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onNavigate('marketplace')} className="text-sm text-[#6B7280] hover:text-[#FF6B35]">
                    Find Help
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('auth')} className="text-sm text-[#6B7280] hover:text-[#FF6B35]">
                    Become a Helper
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Trust & Safety</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">ID Verified Helpers</li>
                <li className="text-sm text-gray-600">Secure Payments</li>
                <li className="text-sm text-gray-600">Comm<span className="font-bold">UNITY</span> Reviews</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              JAMII is a connector, not an employer. Helpers are independent entrepreneurs running their own local businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


