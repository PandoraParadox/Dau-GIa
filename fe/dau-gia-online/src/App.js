import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useMemo } from "react";
import Login from "./component/Login/index";
import HomePage from "./component/HomePage/index";
import Register from "./component/Register/index";
import HelpContact from "./component/HelpContact/index";
import MyProfile from "./component/MyProfile/index";
import Payment from "./component/Payment/index";
import ShoppingCart from "./component/ShoppingCart/index";
import DetailProduct from "./component/DetailProduct/index";
import TransactionHistory from "./component/TransactionHistory";
import TransactionSuccessful from "./component/TransactionSuccessful";
import OAuthSuccessful from "./component/OAuthSuccessful";
import ForgotPassword from "./component/ForgotPassword";
import LayoutDefault from "./LayoutDefault/index";
import { getToken } from "./service/AuthService";

const PrivateRoute = ({ children }) => {
  const { authToken } = useAuth();
  return authToken ? children : <Navigate to="/" replace />;
};

function App() {
  // Dùng useMemo để tránh gọi getToken() nhiều lần không cần thiết
  const token = useMemo(() => getToken(), []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={token ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/successful" element={<TransactionSuccessful />} />
        <Route path="/oauth/successful" element={<OAuthSuccessful />} />
        <Route path="payment" element={<Payment />} />


        {/* Nhóm các route private */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <LayoutDefault />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<HomePage />} />
          <Route path="help-contact" element={<HelpContact />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="payment/:id" element={<Payment />} />
          <Route path="shopping-cart" element={<ShoppingCart />} />
          <Route path="detail-product/:id" element={<DetailProduct />} />
          <Route path="transaction-history/:id" element={<TransactionHistory />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
