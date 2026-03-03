import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AiFillHome } from "react-icons/ai";

export default function Register() {
  const { signup } = useAuth();   // 🔥 use signup (not register)
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    firmName: "",
    firmGst: "",
    firmAddress: "",
    firmPhone: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup(form);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-blue-100 relative items-center justify-center p-16">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Bill<span className="text-pink-600">Stocks</span>
          </h1>

          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            Smart Inventory Starts Here
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Create your account and start managing stock, billing and
            invoices efficiently with powerful insights.
          </p>
        </div>

        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-300 rounded-bl-full opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-pink-300 rounded-tr-full opacity-40"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center px-6">
        
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
          <div className="absolute top-4 left-6">
            <Link to="/">
              <AiFillHome className="text-pink-600 text-2xl hover:scale-110 transition cursor-pointer" />
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Create Your Account
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />

            <div className="pt-2 border-t border-gray-100" />

            <input
              name="firmName"
              placeholder="Firm / Business Name"
              value={form.firmName}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />

            <input
              name="firmGst"
              placeholder="Firm GSTIN"
              value={form.firmGst}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />

            <input
              name="firmPhone"
              placeholder="Firm Phone"
              value={form.firmPhone}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />

            <textarea
              name="firmAddress"
              placeholder="Firm Address (shown on invoice header)"
              value={form.firmAddress}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-400 outline-none min-h-[80px]"
              required
            />

            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold hover:opacity-90 transition"
            >
              Sign Up
            </button>

            <p className="text-xs text-gray-500 text-center">
              By signing up, you confirm that you've read and accepted our{" "}
              <span className="text-pink-500">Terms</span> and{" "}
              <span className="text-pink-500">Privacy Policy</span>
            </p>

            <div className="text-center text-gray-500 text-sm">
              Or Sign Up with
            </div>

            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  "http://localhost:5000/api/auth/google")
              }
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              Google
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-600 font-semibold">
                Sign In
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}