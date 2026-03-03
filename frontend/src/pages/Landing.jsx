import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import management from "../assets/management.png";
import billing from "../assets/billing.png";
import {FiBarChart2, FiCheckCircle, FiPackage, FiFileText} from "react-icons/fi";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } } };

export default function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <div className="bg-[#FAF7F0] text-[#1A1A1A] min-h-screen font-sans">
      <Navbar />

      <section className="relative pt-32 pb-28 px-6 bg-[#FCFBF8] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-16 relative z-10">

          {/* LEFT */}
          <div>
            <motion.p variants={itemVariants} className="text-xs uppercase font-semibold tracking-[0.3em] text-gray-500 mb-6">
              Smart ERP For Retailers
            </motion.p>

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold leading-[1.05] mb-8 text-gray-900">
              Manage your{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">inventory</span>
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-orange-100 -z-10 rounded-md"></div>
              </span>{" "}
              & billing smarter
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-600 text-lg mb-10 max-w-xl leading-relaxed">
              BillStocks ERP helps you track stock, generate invoices, monitor profits and manage operations — all in one simple and powerful dashboard.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-5 items-center">
              <button onClick={() => navigate("/register")} className="px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-200/50 hover:scale-105 hover:shadow-orange-300/60 transition-all duration-300">
                Get Started
              </button>
              <button onClick={() => navigate("/login")} className="px-8 py-4 rounded-full font-semibold bg-white/70 backdrop-blur-md border border-gray-200 text-gray-800 hover:bg-white hover:shadow-md transition-all duration-300">
                Login
              </button>
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div style={{ scale }} className="relative flex justify-center items-center">
            <div className="absolute w-[550px] h-[550px] bg-gradient-to-br from-orange-50 to-yellow-50 rounded-full blur-3xl opacity-60 -z-10"></div>

            <motion.img initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} src={management} alt="Inventory Management" className="relative z-0 w-full max-w-[600px] rounded-3xl shadow-2xl" />

            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -top-10 left-16 bg-white px-4 py-3 rounded-xl shadow-md border border-gray-200 w-[170px]">
              <p className="text-xs text-gray-500 mb-2">Profit Trend</p>
              <svg viewBox="0 0 120 40" className="w-full h-10">
                <line x1="0" y1="35" x2="120" y2="35" stroke="#E5E7EB" strokeWidth="1" />
                <polyline fill="none" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points="0,30 20,22 40,26 60,15 80,20 100,10 120,14" />
              </svg>
            </motion.div>

            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -right-10 top-2/3 bg-gray-50 px-5 py-4 rounded-xl shadow-md border border-gray-200 space-y-3 w-[220px]">
              <div>
                <p className="text-[11px] text-gray-500">Current Stock</p>
                <p className="text-base font-semibold text-gray-900">12,450 <span className="text-xs text-gray-500">Units</span></p>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <p className="text-[11px] text-gray-500">Today's Sales</p>
                <p className="text-base font-semibold text-gray-900">₹2,53,980</p>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <p className="text-[11px] text-gray-500">Active Products</p>
                <p className="text-base font-semibold text-gray-900">875</p>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-8 left-0 bg-white px-4 py-3 rounded-xl shadow-md border border-gray-200 hidden md:flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold">₹</div>
              <div>
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-base font-semibold text-black">₹1,28,430</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
        <section className="relative py-16 px-6 bg-white overflow-hidden font-sans">

  {/* Subtle Dotted Background */}
  <div className="absolute inset-0 
    bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] 
    [background-size:22px_22px] opacity-[0.03] z-0" />

  {/* Descending Dotted Vertical Lines */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

    <motion.div
      animate={{ y: [0, 250] }}
      transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
      className="absolute left-16 -top-10 w-[2px] h-[160%]
      bg-[radial-gradient(circle,#f97316_1px,transparent_1px)]
      [background-size:6px_20px] opacity-20"
    />

    <motion.div
      animate={{ y: [0, 280] }}
      transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
      className="absolute left-1/2 -top-10 w-[2px] h-[160%]
      bg-[radial-gradient(circle,#f59e0b_1px,transparent_1px)]
      [background-size:6px_22px] opacity-15"
    />

    <motion.div
      animate={{ y: [0, 230] }}
      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      className="absolute right-20 -top-10 w-[2px] h-[160%]
      bg-[radial-gradient(circle,#fb923c_1px,transparent_1px)]
      [background-size:6px_18px] opacity-20"
    />

    {/* Decorative Dotted Circles */}
    <div className="absolute top-20 left-10 w-28 h-28 
      bg-[radial-gradient(circle,#fb923c_2px,transparent_2px)] 
      [background-size:10px_10px] opacity-10 rounded-full" />

    <div className="absolute bottom-10 right-10 w-32 h-32 
      bg-[radial-gradient(circle,#f59e0b_2px,transparent_2px)] 
      [background-size:12px_12px] opacity-10 rounded-full" />

  </div>

  {/* Floating Light Blobs (Smaller) */}
  <motion.div
    animate={{ y: [0, -15, 0] }}
    transition={{ duration: 8, repeat: Infinity }}
    className="absolute -top-24 -left-24 w-[280px] h-[280px] 
    bg-orange-100 blur-3xl opacity-30 rounded-full z-0"
  />

  <motion.div
    animate={{ y: [0, 15, 0] }}
    transition={{ duration: 10, repeat: Infinity }}
    className="absolute -bottom-24 -right-24 w-[280px] h-[280px] 
    bg-yellow-100 blur-3xl opacity-30 rounded-full z-0"
  />

  {/* Heading */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="max-w-6xl mx-auto text-center mb-12 relative z-10"
  >
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-gray-900">
      Powerful Features For Your Business
    </h2>
    <p className="text-gray-500 text-base max-w-2xl mx-auto">
      Everything you need to automate, optimize and scale your retail store.
    </p>
  </motion.div>

  {/* Feature Cards */}
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
    className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 relative z-10"
  >
    {[
      {
        title: "Inventory Tracking",
        desc: "Monitor stock levels in real time and prevent stock loss.",
        icon: <FiPackage size={24} />
      },
      {
        title: "Smart Billing",
        desc: "Generate invoices instantly with automated tax calculation.",
        icon: <FiFileText size={24} />
      },
      {
        title: "Profit Analytics",
        desc: "Analyze sales performance with detailed financial reports.",
        icon: <FiBarChart2 size={24} />
      }
    ].map((item, index) => (
      <motion.div
        key={index}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="group relative p-6 bg-[#FAF7F0] rounded-3xl 
        border border-gray-100 shadow-sm hover:shadow-lg 
        transition-all duration-300 overflow-hidden"
      >

        <div className="w-12 h-12 flex items-center justify-center 
        rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 
        text-white shadow-md mb-4 group-hover:scale-110 transition">
          {item.icon}
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          {item.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed">
          {item.desc}
        </p>

        <div className="absolute bottom-0 left-0 w-0 h-[3px] 
        bg-gradient-to-r from-orange-500 to-amber-500 
        group-hover:w-full transition-all duration-500 rounded-full" />
      </motion.div>
    ))}
  </motion.div>

</section>
      {/* BILLING */}
      <section className="relative py-24 px-6 overflow-hidden bg-[#FCFBF8]">

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Floating Soft Gradients */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-orange-100 blur-3xl opacity-30 rounded-full" />
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-yellow-100 blur-3xl opacity-30 rounded-full" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

            {/* Image Side */}
            <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
            >
            <div className="absolute -inset-6 bg-black/5 blur-3xl rounded-full -z-10"></div>
            <motion.img
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
                src={billing}
                alt="Billing"
                className="w-full rounded-3xl shadow-2xl"
            />
            </motion.div>

            {/* Content Side */}
            <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
            >
            <motion.h2
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                className="text-4xl font-bold mb-6 text-gray-900 leading-tight"
                >
                Generate{" "}
                <span
                    className="relative inline-block text-orange-500 text-5xl"
                    style={{ fontFamily: '"Brush Script MT", cursive' }}
                >
                    Professional
                    <span className="absolute left-0 -bottom-2 w-full h-2 bg-orange-200 rounded-full"></span>
                </span>{" "}
                Invoices
                </motion.h2>

            <motion.p variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }} className="text-gray-500 mb-8 text-lg leading-relaxed">
                Create clean, printable invoices in seconds with automatic tax calculation and real-time stock deduction.
            </motion.p>

            <motion.ul className="space-y-4">
                {[
                "Instant invoice generation",
                "Automatic stock update",
                "Download & print support",
                "Customer data tracking"
                ].map((item, index) => (
                <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-gray-700 group"
                >
                    <div className="text-orange-500 group-hover:scale-110 transition">
                    <FiCheckCircle size={20} />
                    </div>
                    <span>{item}</span>
                </motion.li>
                ))}
            </motion.ul>
            </motion.div>

        </div>
        </section>

      {/* STATS */}
        <section className="relative py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-950 text-white overflow-hidden">
        {/* ===== Radial Light Overlay ===== */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.25),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(34,211,238,0.2),transparent_40%)]"></div>

        {/* ===== Circular Pattern Grid ===== */}
        <div className="absolute inset-0 opacity-10 
            bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)]
            [background-size:40px_40px]">
        </div>

        {/* ===== Floating Ring Effects ===== */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -left-40 w-[500px] h-[500px] border border-blue-400/20 rounded-full"
        />
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] border border-cyan-400/20 rounded-full"
        />

        <div className="relative z-10 overflow-hidden">

            {/* ===== Section Heading ===== */}
            <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Trusted by Growing Retail Businesses
            </h2>
            <p className="text-blue-200 mt-4 max-w-xl mx-auto">
                Powerful billing performance with enterprise-grade reliability and secure infrastructure.
            </p>
            </div>

            {/* ===== Infinite Scroll Stats ===== */}
            <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex gap-10 w-max"
            >
            {[
                { value:"99%", label:"Billing Accuracy" },
                { value:"24/7", label:"Cloud Access" },
                { value:"1000+", label:"Products Managed" },
                { value:"5000+", label:"Invoices Generated" },
                { value:"₹2Cr+", label:"Monthly Transactions" },
                { value:"300+", label:"Retailers Trust Us" },
                { value:"GST Ready", label:"Tax Compliant" },
                { value:"Secure", label:"Encrypted Data" }
            ]
            .concat([
                { value:"99%", label:"Billing Accuracy" },
                { value:"24/7", label:"Cloud Access" },
                { value:"1000+", label:"Products Managed" },
                { value:"5000+", label:"Invoices Generated" },
                { value:"₹2Cr+", label:"Monthly Transactions" },
                { value:"300+", label:"Retailers Trust Us" },
                { value:"GST Ready", label:"Tax Compliant" },
                { value:"Secure", label:"Encrypted Data" }
            ])
            .map((item,index)=>(
                <motion.div
                key={index}
                whileHover={{ scale: 1.07 }}
                className="min-w-[290px] px-10 py-10 rounded-3xl 
                bg-gradient-to-br from-white/10 to-white/5
                backdrop-blur-2xl 
                border border-white/15
                shadow-[0_15px_50px_rgba(0,0,0,0.6)]
                hover:shadow-cyan-500/30 
                transition-all duration-500"
                >
                <h3 className="text-5xl font-extrabold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    {item.value}
                </h3>
                <p className="text-blue-200 mt-4 tracking-widest text-xs uppercase">
                    {item.label}
                </p>
                </motion.div>
            ))}
            </motion.div>
        </div>
        </section>
{/* CTA */}
<section className="relative py-24 text-center px-6 bg-[#FFF8F1] overflow-hidden">

  {/* Background Glow */}
  <motion.div
    animate={{ y: [0, -15, 0] }}
    transition={{ duration: 8, repeat: Infinity }}
    className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-200 blur-3xl opacity-30 rounded-full"
  />

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="relative z-10"
  >
    <h2 className="text-4xl font-bold mb-6 text-gray-900">
      Ready to grow your business?
    </h2>

    <button
      onClick={() => navigate("/register")}
      className="px-10 py-4 rounded-full font-bold text-white 
      bg-gradient-to-r from-orange-500 to-amber-500 
      shadow-lg shadow-orange-200/50 
      hover:scale-105 hover:shadow-orange-300/60 
      transition-all duration-300"
    >
      Start Using BillStocks
    </button>
  </motion.div>
</section>

{/* ================= FOOTER ================= */}
<footer className="relative bg-[#0F172A] text-gray-300 pt-20 pb-10 px-6 overflow-hidden">

  {/* Soft Glow */}
  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/10 blur-3xl rounded-full"></div>

  <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

    {/* Brand */}
    <div>
      <h3 className="text-2xl font-bold text-white mb-4">BillStocks</h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        Smart ERP & inventory platform inspired by industry leaders like Zoho, Salesforce and SAP — built for modern Indian retailers.
      </p>
    </div>

    {/* Product */}
    <div>
      <h4 className="text-white font-semibold mb-4">Product</h4>
      <ul className="space-y-3 text-sm">
        <li className="hover:text-white transition cursor-pointer">Inventory Management</li>
        <li className="hover:text-white transition cursor-pointer">GST Billing System</li>
        <li className="hover:text-white transition cursor-pointer">Sales Analytics</li>
        <li className="hover:text-white transition cursor-pointer">Cloud ERP Dashboard</li>
      </ul>
    </div>

    {/* Integrations */}
    <div>
      <h4 className="text-white font-semibold mb-4">Integrations</h4>
      <ul className="space-y-3 text-sm">
        <li className="hover:text-white transition cursor-pointer">Zoho Books</li>
        <li className="hover:text-white transition cursor-pointer">Salesforce CRM</li>
        <li className="hover:text-white transition cursor-pointer">Tally Prime</li>
        <li className="hover:text-white transition cursor-pointer">QuickBooks</li>
      </ul>
    </div>

    {/* Company */}
    <div>
      <h4 className="text-white font-semibold mb-4">Company</h4>
      <ul className="space-y-3 text-sm">
        <li className="hover:text-white transition cursor-pointer">About BillStocks</li>
        <li className="hover:text-white transition cursor-pointer">Careers</li>
        <li className="hover:text-white transition cursor-pointer">Privacy Policy</li>
        <li className="hover:text-white transition cursor-pointer">Terms & Conditions</li>
      </ul>
    </div>
  </div>

  {/* Bottom */}
  <div className="border-t border-gray-700 mt-16 pt-6 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} BillStocks ERP. All rights reserved.
    <span className="block mt-2 text-gray-400">
      Designed & Developed by <span className="text-orange-400 font-semibold">Gaurav Srivatav</span>
    </span>
  </div>
</footer>
    </div>
  );
}