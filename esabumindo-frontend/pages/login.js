import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return alert("Mohon isi semua data");

    setLoading(true);

    // Simulasi login
    setTimeout(() => {
      alert("Login berhasil! Redirecting...");
      setLoading(false);
    }, 2000);
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-5 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#060771] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ff4136] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#060771] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      {/* BAGIAN KIRI: BRANDING - 2 kolom di desktop */}
      <div className="relative lg:col-span-2 flex flex-col items-center justify-center p-8 lg:p-12 text-white bg-gradient-to-br from-[#060771] via-[#0808a0] to-[#060771] lg:min-h-screen">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff4136]/20 via-transparent to-[#ff4136]/10 animate-pulse"></div>

        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white/10 rounded-full animate-spin-slower"></div>

        <div className="relative z-10 text-center space-y-6 max-w-md animate-fade-in">
          {/* Logo with animation */}
          <div className="relative inline-block">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-4xl font-bold">E</span>
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#ff4136] animate-pulse" />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight animate-slide-up">
              PT ESABUMINDO
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-[#ff4136] to-transparent rounded-full"></div>
          </div>

          <p className="text-blue-100/90 text-sm lg:text-base leading-relaxed animate-slide-up animation-delay-200">
            Sistem Informasi Manajemen Terpadu untuk kemajuan bisnis yang
            berkelanjutan
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 justify-center pt-4 animate-slide-up animation-delay-400">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs border border-white/20">
              🔒 Secure
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs border border-white/20">
              ⚡ Fast
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs border border-white/20">
              🎯 Efficient
            </span>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff4136] to-transparent"></div>
      </div>

      {/* BAGIAN KANAN: FORM LOGIN - 3 kolom di desktop */}
      <div className="relative lg:col-span-3 flex flex-col justify-center px-6 py-12 lg:px-16 lg:py-20 bg-white/80 backdrop-blur-sm min-h-screen lg:min-h-0">
        <div className="w-full max-w-lg mx-auto space-y-8 animate-fade-in">
          {/* Header dengan animasi */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-1 bg-gradient-to-b from-[#ff4136] to-[#060771] rounded-full"></div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Selamat Datang
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Masuk untuk melanjutkan ke dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Input Email dengan animasi */}
            <div className="space-y-2 animate-slide-up animation-delay-200">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                Email Address
                {focusedInput === "email" && (
                  <span className="text-[#ff4136] animate-pulse">•</span>
                )}
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                    focusedInput === "email"
                      ? "text-[#ff4136]"
                      : "text-gray-400"
                  }`}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="nama@esabumindo.co.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:border-[#ff4136] focus:ring-4 focus:ring-[#ff4136]/10 focus:outline-none hover:border-gray-300"
                  required
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#ff4136]/0 via-[#ff4136]/5 to-[#060771]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
            </div>

            {/* Input Password dengan animasi */}
            <div className="space-y-2 animate-slide-up animation-delay-300">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                Password
                {focusedInput === "password" && (
                  <span className="text-[#060771] animate-pulse">•</span>
                )}
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                    focusedInput === "password"
                      ? "text-[#060771]"
                      : "text-gray-400"
                  }`}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:border-[#060771] focus:ring-4 focus:ring-[#060771]/10 focus:outline-none hover:border-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060771]/0 via-[#060771]/5 to-[#ff4136]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
            </div>

            {/* Tombol Login dengan animasi */}
            <div className="pt-4 animate-slide-up animation-delay-400">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="group relative w-full py-4 bg-gradient-to-r from-[#ff4136] to-[#e63329] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#ff4136]/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk ke Dashboard
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#e63329] to-[#ff4136] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400">
                  Powered by PT ESABUMINDO
                </span>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} PT ESABUMINDO. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slower {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-slower {
          animation: spin-slower 30s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
