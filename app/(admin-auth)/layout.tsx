import React from "react";
import { Shield } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4 bg-[#f9fafb]">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl bg-white ring-1 ring-black/5">

        {/* Left Side: Admin Branding */}
        <div className="hidden md:flex w-1/2 bg-white relative flex-col justify-between p-12 overflow-hidden border-r border-gray-100">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] bg-gradient-radial from-red-500/10 to-transparent blur-[100px] opacity-40" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-100/50 blur-[120px] rounded-full" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
          </div>

          <div className="relative z-10">
            {/* Admin Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-dark-100 tracking-wide">
                  File<span className="text-red-500">Vault</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/80">
                  Admin Control
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-dark-100 mt-4">
              Secure Platform Management
            </h1>
            <p className="text-lg text-gray-500 mt-4 leading-relaxed font-medium">
              Monitor, moderate, and manage your platform with administrative precision.
            </p>
          </div>

          <div className="relative z-10 mt-12 flex justify-center items-center">
            {/* Abstract decoration */}
            <div className="relative w-64 h-64">
              <div className="absolute top-0 right-0 w-48 h-56 bg-white rounded-2xl border border-gray-100 shadow-2xl transform rotate-6 z-10 flex flex-col p-5 backdrop-blur-md">
                <div className="w-full h-2 bg-gray-100 rounded-full mb-3" />
                <div className="w-3/4 h-2 bg-gray-50 rounded-full mb-3" />
                <div className="flex gap-2 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100" />
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100" />
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100" />
                </div>
              </div>
              <div className="absolute top-4 left-4 w-48 h-56 bg-red-500 rounded-2xl shadow-2xl shadow-red-500/20 transform -rotate-6 z-20 flex flex-col items-center justify-center p-6 border border-white/20">
                <Shield className="w-16 h-16 text-white mb-4 drop-shadow-md" />
                <div className="w-20 h-2 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel Content (The Login Form) */}
        <div className="flex-1 flex flex-col justify-center bg-white p-8 md:p-12 lg:p-16 relative z-20">
          {/* Small logo for mobile */}
          <div className="mb-8 md:hidden flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-dark-100 tracking-wide">
                File<span className="text-red-500">Vault</span>
              </span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
