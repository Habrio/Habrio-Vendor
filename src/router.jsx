import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import all vendor components
import VendorTitleScreen from './pages/VendorTitleScreen.jsx';
import VendorLogin from './pages/VendorLogin.jsx';
import VendorOtp from './pages/VendorOtp.jsx';
import VendorBasicOnboard from './pages/VendorBasicOnboard.jsx';
import VendorProfileSetup from './pages/VendorProfileSetup.jsx';
import CreateShop from './pages/CreateShop.jsx';
import VendorHome from './pages/VendorHome.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetail from './OrderDetail.jsx';
import Chat from './pages/Chat.jsx';
import Items from './pages/Items.jsx';
import AddItem from './pages/AddItem.jsx';
import EditItem from './pages/EditItem.jsx';
import Wallet from './Wallet.jsx';
import WalletHistory from './WalletHistory.jsx';
import VendorProfile from './pages/VendorProfile.jsx';
import Support from './Support.jsx';
import Analytics from './pages/Analytics.jsx';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vendor Routes */}
        <Route path="/vendor" element={<VendorTitleScreen />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/otp" element={<VendorOtp />} />
        <Route path="/vendor/onboarding/basic" element={<VendorBasicOnboard />} />
        <Route path="/vendor/onboarding/profile" element={<VendorProfileSetup />} />
        <Route path="/vendor/create-shop" element={<CreateShop />} />
        <Route path="/vendor/home" element={<VendorHome />} />
        <Route path="/vendor/orders" element={<Orders />} />
        <Route path="/vendor/order/:id" element={<OrderDetail />} />
        <Route path="/vendor/order/:id/chat" element={<Chat />} />
        <Route path="/vendor/items" element={<Items />} />
        <Route path="/vendor/items/add" element={<AddItem />} />
        <Route path="/vendor/items/:id/edit" element={<EditItem />} />
        <Route path="/vendor/wallet" element={<Wallet />} />
        <Route path="/vendor/wallet/history" element={<WalletHistory />} />
        <Route path="/vendor/profile" element={<VendorProfile />} />
        <Route path="/vendor/support" element={<Support />} />
        <Route path="/vendor/analytics" element={<Analytics />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/vendor" replace />} />
      </Routes>
    </BrowserRouter>
  );
}