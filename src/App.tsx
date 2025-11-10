/**
 * JAMII BOLT Frontend - Clean App
 * Only BOLT pages, no Lovable dependencies
 */
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { HelperDashboard } from './pages/HelperDashboard';
import { MessagesPage } from './pages/MessagesPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { JamiiShopPage } from './pages/JamiiShopPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { AuthProvider } from './contexts/AuthContext';

// Wrapper components to adapt BOLT pages to React Router
const LandingPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    switch (page) {
      case 'auth':
        navigate('/auth');
        break;
      case 'marketplace':
        navigate('/marketplace');
        break;
      case 'helper-dashboard':
        navigate('/dashboard/helper');
        break;
      case 'customer-dashboard':
        navigate('/dashboard/customer');
        break;
      case 'messages':
        navigate('/messages');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'payments':
        navigate('/payments');
        break;
      case 'jamii-shop':
        navigate('/shop');
        break;
      default:
        console.warn(`Unknown navigation: ${page}`);
    }
  };
  return <LandingPage onNavigate={handleNavigate} />;
};

const MarketplacePageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    switch (page) {
      case 'auth':
        navigate('/auth');
        break;
      case 'helper-dashboard':
        navigate('/dashboard/helper');
        break;
      case 'customer-dashboard':
        navigate('/dashboard/customer');
        break;
      case 'messages':
        navigate('/messages');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'payments':
        navigate('/payments');
        break;
      default:
        console.warn(`Unknown navigation: ${page}`);
    }
  };
  return <MarketplacePage onNavigate={handleNavigate} />;
};

const CustomerDashboardWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    switch (page) {
      case 'marketplace':
        navigate('/marketplace');
        break;
      case 'messages':
        navigate('/messages');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'payments':
        navigate('/payments');
        break;
      default:
        console.warn(`Unknown navigation: ${page}`);
    }
  };
  return <CustomerDashboard onNavigate={handleNavigate} />;
};

const HelperDashboardWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    switch (page) {
      case 'marketplace':
        navigate('/marketplace');
        break;
      case 'messages':
        navigate('/messages');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'payments':
        navigate('/payments');
        break;
      case 'jamii-shop':
        navigate('/shop');
        break;
      default:
        console.warn(`Unknown navigation: ${page}`);
    }
  };
  return <HelperDashboard onNavigate={handleNavigate} />;
};

const AuthPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    switch (page) {
      case 'helper-dashboard':
        navigate('/dashboard/helper');
        break;
      case 'customer-dashboard':
        navigate('/dashboard/customer');
        break;
      case 'marketplace':
        navigate('/marketplace');
        break;
      default:
        console.warn(`Unknown navigation: ${page}`);
    }
  };
  return <AuthPage onNavigate={handleNavigate} />;
};

const ProfileSettingsPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    switch (page) {
      case 'helper-dashboard':
        navigate('/dashboard/helper');
        break;
      case 'customer-dashboard':
        navigate('/dashboard/customer');
        break;
      default:
        console.warn(`Unknown navigation: ${page}`);
    }
  };
  return <ProfileSettingsPage onNavigate={handleNavigate} />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/auth" element={<AuthPageWrapper />} />
        <Route path="/marketplace" element={<MarketplacePageWrapper />} />
        <Route path="/dashboard/customer" element={<CustomerDashboardWrapper />} />
        <Route path="/dashboard/helper" element={<HelperDashboardWrapper />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/settings" element={<ProfileSettingsPageWrapper />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/shop" element={<JamiiShopPage onNavigate={(page) => console.log('Navigate:', page)} />} />
        <Route path="/profile/:id?" element={<PublicProfilePage onNavigate={(page) => console.log('Navigate:', page)} />} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Page Not Found</h1></div>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;

