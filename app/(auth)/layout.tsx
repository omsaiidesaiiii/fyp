import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4 bg-light-300">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl bg-white ring-1 ring-black/5">
        
        {/* Left Side: Background & Branding */}
        <div className="hidden md:flex w-1/2 bg-[#050505] relative flex-col justify-between p-12 overflow-hidden">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] bg-gradient-radial from-brand/20 to-transparent blur-[100px] opacity-60" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          </div>

          <div className="relative z-10">
            {/* Inline Logo Replacement */}
            <div className="flex items-center gap-2 mb-8">
               <div className="w-10 h-10 bg-gradient-to-br from-brand to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                  </svg>
               </div>
               <span className="text-2xl font-bold text-white tracking-wide">Store<span className="text-brand">It</span></span>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white mt-4">
              Manage your files the best way.
            </h1>
            <p className="text-lg text-gray-400 mt-4 leading-relaxed">
              Securely store, organize, and access your documents from anywhere.
            </p>
          </div>

          <div className="relative z-10 mt-12 flex justify-center items-center">
             {/* Abstract CSS composition instead of Files Image */}
             <div className="relative w-64 h-64">
                <div className="absolute top-0 right-0 w-48 h-56 bg-gradient-to-bl from-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl transform rotate-6 z-10 flex flex-col p-4 backdrop-blur-md">
                   <div className="w-8 h-8 rounded-full bg-white/10 mb-4"></div>
                   <div className="w-full h-2 bg-white/10 rounded mb-2"></div>
                   <div className="w-3/4 h-2 bg-white/10 rounded mb-2"></div>
                </div>
                <div className="absolute top-4 left-4 w-48 h-56 bg-gradient-to-br from-brand to-rose-600 rounded-2xl shadow-2xl shadow-brand/20 transform -rotate-6 z-20 flex flex-col items-center justify-center p-6 border border-white/20">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-16 h-16 mb-4 drop-shadow-md">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                   </svg>
                   <div className="w-20 h-2 bg-white/30 rounded-full"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Panel Content (The Form) */}
        <div className="flex-1 flex flex-col justify-center bg-white p-8 md:p-12 lg:p-16 relative z-20">
             {/* Small logo for mobile */}
             <div className="mb-8 md:hidden flex justify-center">
              <Image
                src="/assets/icons/logo-full-brand.svg"
                alt="logo"
                width={160}
                height={55}
                className="h-auto"
              />
            </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
