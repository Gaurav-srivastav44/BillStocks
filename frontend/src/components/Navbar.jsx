import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/home", label: "Dashboard" },
  { to: "/accounts", label: "Accounts" },
  { to: "/products", label: "Products" },
  { to: "/stock", label: "Stock" },
  { to: "/billing", label: "Billing" },
  { to: "/purchase", label: "Purchase" },
  { to: "/reports/sales", label: "Sales Reports" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (to) =>
    to === "/home"
      ? location.pathname === "/home" || location.pathname === "/dashboard"
      : location.pathname.startsWith(to);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
<header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 fixed top-0 left-0 z-50 shadow-sm">
  <div className="px-6 lg:px-12">
    <div className="h-16 flex items-center justify-between">

      {/* Brand */}
      <button onClick={() => navigate("/")} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-lg">B</span>
        </div>
        <div className="hidden sm:block">
          <div className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">BillStocks</div>
          <div className="text-xs text-gray-500 -mt-0.5">Inventory & Billing</div>
        </div>
      </button>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
        {NAV_LINKS.map(link => {
          const active = isActive(link.to);
          return (
            <Link key={link.to} to={link.to} className="relative px-4 py-2 text-sm font-medium group">
              <span className={`absolute inset-0 rounded-lg p-[1.5px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 animate-gradient ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`}>
                <span className="block w-full h-full bg-white rounded-lg"></span>
              </span>
              <span className={`relative z-10 ${active ? "text-black font-semibold" : "text-gray-700 group-hover:text-black"} transition`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="text-sm text-gray-600 hover:text-black">Hi, <span className="font-semibold">{user.name}</span></Link>
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Login</button>
              <button onClick={() => navigate("/register")} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-md hover:scale-105 transition rounded-lg">Get Started</button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(s => !s)} className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  <div className={`${open ? "block" : "hidden"} md:hidden border-t border-gray-200 bg-white`}>
    <div className="px-6 py-4 space-y-2">
      {NAV_LINKS.map(link => (
        <Link
          key={link.to}
          to={link.to}
          onClick={() => setOpen(false)}
          className={`relative block px-4 py-2 text-sm font-medium group ${isActive(link.to) ? "text-black font-semibold" : "text-gray-700"}`}
        >
          <span className={`absolute inset-0 rounded-md p-[1.5px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 animate-gradient ${isActive(link.to) ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`}>
            <span className="block w-full h-full bg-white rounded-md"></span>
          </span>
          <span className="relative z-10">{link.label}</span>
        </Link>
      ))}

      <div className="pt-4 border-t border-gray-200">
        {user ? (
          <>
            <Link to="/profile" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-600">Hi, {user.name}</Link>
            <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full mt-2 py-2 text-sm font-semibold bg-gray-100 rounded-md">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => { setOpen(false); navigate("/login"); }} className="w-full py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">Login</button>
            <button onClick={() => { setOpen(false); navigate("/register"); }} className="w-full mt-2 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-md">Get Started</button>
          </>
        )}
      </div>
    </div>
  </div>
</header>
  );
}