import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./components/ProfilePage";
import "./App.css";
import StoragePurchasePage from "./pages/StoragePurchasePage";
import LandingPage from "./pages/LandingPage";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";
import RegisterPage from "./pages/RegisterPage";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { SidebarLayout } from "./components/layout/SidebarLayout";
import Dashboard from "./pages/DashboardPage";
import RegisterSuccess from "./pages/RegisterSuccess";
//import RegisterSuccess from "./pages/RegisterSuccess";
//<Route path="/register/success" element={<RegisterSuccess />} />

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm/:token" element={<ConfirmEmailPage />} />
            <Route path="/register/success" element={<RegisterSuccess />} />

            <Route element={<SidebarLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/offers" element={<StoragePurchasePage />} />
            </Route>

            <Route path="*" element={<LoginPage />} />
          </Routes>
        </div>
        <Footer />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
