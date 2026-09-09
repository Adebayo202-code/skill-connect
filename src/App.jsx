import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import FindProfessionals from "./pages/FindProfessionals";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Login from "./pages/Login"
import JoinNow from "./pages/JoinNow"
import CustomerRegister from "./pages/CustomerRegister";
import ProfessionalRegister from "./pages/ProfessionalRegister";
import ForgotPassword from "./pages/ForgetPassword";
import ProfessionalDashboard from "./pages/ProfessionalsDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerRequests from "./pages/CustomerRequests";
import CustomerMessages from "./pages/CustomerMessages";
import ProfessionalRequests from "./pages/ProfessionalRequests";
import ProfessionalMessages from "./pages/ProfessionalMessages";
import ProfessionalProfileDashboard from "./pages/ProfessionalProfileDashboard";
import BrandLoader from "./BrandLoader/BrandLoader";

function App() {
  return (
    <BrowserRouter>
      <BrandLoader>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/find-professionals"
          element={<FindProfessionals />}
        />
        <Route
          path="/professionals"
          element={<FindProfessionals />}
        />
        <Route
          path="/professional/:id"
          element={<ProfessionalProfile />}
        />
             <Route
          path="/login"
          element={<Login />}
         />
             <Route
          path="/join-now"
          element={<JoinNow />}
        />
         <Route
           path="/register/customer"
           element={<CustomerRegister />}
         />
        <Route
        path="/register/professional"
       element={<ProfessionalRegister />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/professional-dashboard"
          element={<ProfessionalDashboard />}
        />
        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />
        <Route
          path="/customer-profile"
          element={<CustomerProfile />}
        />
        <Route
          path="/customer-requests"
          element={<CustomerRequests />}
        />
        <Route
          path="/customer-messages"
          element={<CustomerMessages />}
        />
        <Route
          path="/professional-requests"
          element={<ProfessionalRequests />}
        />
        <Route
          path="/professional-messages"
          element={<ProfessionalMessages />}
        />
        <Route
          path="/professional-profile"
          element={<ProfessionalProfileDashboard />}
        />
        </Routes>
      </BrandLoader>
    </BrowserRouter>
  );
}

export default App;