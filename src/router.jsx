// src/router.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from './components/MobileLayout';
import BottomNav from './components/BottomNav';

// Auth & Onboarding (no layout)
import VendorTitleScreen from './pages/VendorTitleScreen';
import VendorLogin from './pages/VendorLogin';
import VendorOtp from './pages/VendorOtp';
import VendorBasicOnboard from './pages/VendorBasicOnboard';
import VendorProfileSetup from './pages/VendorProfileSetup';
import CreateShop from './pages/CreateShop';

// Main App Pages
import VendorHome from './pages/VendorHome';
import VendorProfile from './pages/VendorProfile';
import Items from './pages/Items';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import BulkUpload from './pages/BulkUpload';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Chat from './pages/Chat';
import Wallet from './pages/Wallet';
import WalletHistory from './pages/WalletHistory';
import WalletWithdraw from './pages/WalletWithdraw';
import PayoutSetup from './pages/PayoutSetup';
import Support from './pages/Support';
import Analytics from './pages/Analytics';

// Utility layout wrapper with optional bottom nav
function PageWithLayout({ element, withNav = false }) {
  return (
    <MobileLayout>
      {element}
      {withNav && <BottomNav />}
    </MobileLayout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth & Onboarding Routes (no layout) */}
      <Route path="/" element={<VendorTitleScreen />} />
      <Route path="/login" element={<VendorLogin />} />
      <Route path="/otp" element={<VendorOtp />} />
      <Route path="/onboarding/basic" element={<VendorBasicOnboard />} />
      <Route path="/onboarding/profile" element={<VendorProfileSetup />} />
      <Route path="/create-shop" element={<CreateShop />} />

      {/* Main Routes WITH bottom nav */}
      <Route path="/home" element={<PageWithLayout element={<VendorHome />} withNav />} />
      <Route path="/items" element={<PageWithLayout element={<Items />} withNav />} />
      <Route path="/orders" element={<PageWithLayout element={<Orders />} withNav />} />
      <Route path="/profile" element={<PageWithLayout element={<VendorProfile />} withNav />} />
      <Route path="/wallet" element={<PageWithLayout element={<Wallet />} withNav />} />

      {/* Routes WITHOUT bottom nav */}
      <Route path="/items/add" element={<PageWithLayout element={<AddItem />} />} />
      <Route path="/items/:id/edit" element={<PageWithLayout element={<EditItem />} />} />
      <Route path="/items/bulk-upload" element={<PageWithLayout element={<BulkUpload />} />} />
      <Route path="/order/:id" element={<PageWithLayout element={<OrderDetail />} />} />
      <Route path="/order/:id/chat" element={<PageWithLayout element={<Chat />} />} />
      <Route path="/wallet/history" element={<PageWithLayout element={<WalletHistory />} />} />
      <Route path="/wallet/withdraw" element={<PageWithLayout element={<WalletWithdraw />} />} />
      <Route path="/payout-setup" element={<PageWithLayout element={<PayoutSetup />} />} />
      <Route path="/analytics" element={<PageWithLayout element={<Analytics />} />} />
      <Route path="/support" element={<PageWithLayout element={<Support />} />} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}