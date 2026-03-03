import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import BillingPage from "./pages/BillingPage";
import InvoicePrintView from "./pages/InvoicePrintView";
import Login from "./pages/Login";
import Register from "./pages/Register";   // ✅ FIXED (was Signup)
import Invoices from "./pages/Invoices";
import AccountList from "./pages/AccountList";
import AddAccount from "./pages/AddAccount";
import EditAccount from "./pages/EditAccount";
import PurchaseEntry from "./pages/PurchaseEntry";
import ReceiptPayment from "./pages/ReceiptPayment";
import CashBook from "./pages/CashBook";
import StockStatus from "./pages/StockStatus";
import StockSummary from "./pages/StockSummary";
import SalesReports from "./pages/SalesReports";
import PurchaseReports from "./pages/PurchaseReports";
import StockDashboard from "./pages/StockDashboard";
import DummyBill from "./pages/DummyBill";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";

/* ---------------- PRIVATE ROUTE ---------------- */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

/* ---------------- PROTECTED LAYOUT ---------------- */
const ProtectedLayout = ({ children }) => (
  <PrivateRoute>
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
    </>
  </PrivateRoute>
);

/* ---------------- LOGIN / REGISTER REDIRECT ---------------- */
const AuthCheckRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  return user ? <Navigate to="/home" replace /> : children;
};

/* ---------------- ROUTES ---------------- */
const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <AuthCheckRedirect>
            <Login />
          </AuthCheckRedirect>
        }
      />
      <Route
        path="/register"
        element={
          <AuthCheckRedirect>
            <Register />
          </AuthCheckRedirect>
        }
      />

      {/* After Google login: complete firm details */}
      <Route path="/complete-profile" element={<ProtectedLayout><CompleteProfile /></ProtectedLayout>} />

      {/* Protected Routes */}
      <Route path="/home" element={<ProtectedLayout><Home /></ProtectedLayout>} />

      <Route path="/products" element={<ProtectedLayout><ProductList /></ProtectedLayout>} />
      <Route path="/products/new" element={<ProtectedLayout><AddProduct /></ProtectedLayout>} />
      <Route path="/products/:id/edit" element={<ProtectedLayout><EditProduct /></ProtectedLayout>} />

      <Route path="/dummybill" element={<DummyBill />} />

      <Route path="/accounts" element={<ProtectedLayout><AccountList /></ProtectedLayout>} />
      <Route path="/accounts/new" element={<ProtectedLayout><AddAccount /></ProtectedLayout>} />
      <Route path="/accounts/:id/edit" element={<ProtectedLayout><EditAccount /></ProtectedLayout>} />

      <Route path="/billing" element={<ProtectedLayout><BillingPage /></ProtectedLayout>} />
      <Route path="/invoices" element={<ProtectedLayout><Invoices /></ProtectedLayout>} />
      <Route path="/invoices/:id/print" element={<ProtectedLayout><InvoicePrintView /></ProtectedLayout>} />

      <Route path="/stock" element={<ProtectedLayout><StockDashboard /></ProtectedLayout>} />
      <Route path="/purchase" element={<ProtectedLayout><PurchaseEntry /></ProtectedLayout>} />

      <Route path="/finance" element={<ProtectedLayout><ReceiptPayment /></ProtectedLayout>} />
      <Route path="/cashbook" element={<ProtectedLayout><CashBook /></ProtectedLayout>} />

      <Route path="/reports/stock-status" element={<ProtectedLayout><StockStatus /></ProtectedLayout>} />
      <Route path="/reports/stock-summary" element={<ProtectedLayout><StockSummary /></ProtectedLayout>} />
      <Route path="/reports/sales" element={<ProtectedLayout><SalesReports /></ProtectedLayout>} />
      <Route path="/reports/purchase" element={<ProtectedLayout><PurchaseReports /></ProtectedLayout>} />

      <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

/* ---------------- MAIN APP ---------------- */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}