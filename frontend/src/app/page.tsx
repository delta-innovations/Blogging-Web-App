"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const [latticeNodes, setLatticeNodes] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const nodes = Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-lumen-white/20 rounded-full animate-latticeNode"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ));
    setLatticeNodes(nodes);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (homeRef.current) {
      const rect = homeRef.current.getBoundingClientRect();
      const cursorX = ((e.clientX - rect.left) / rect.width) * 100;
      const cursorY = ((e.clientY - rect.top) / rect.height) * 100;
      homeRef.current.style.setProperty("--cursor-x", `${cursorX}%`);
      homeRef.current.style.setProperty("--cursor-y", `${cursorY}%`);
    }
  };

  return (
    <div
      ref={homeRef}
      className="fixed inset-0 bg-depth-black flex flex-col overflow-y-auto pt-[80px] z-10"
      onMouseMove={handleMouseMove}
    >
      {/* Infinite-Depth Lattice */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDrift">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDriftReverse" />
        <div className="absolute inset-0">{latticeNodes}</div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--cursor-x)_var(--cursor-y),rgba(0,200,255,0.2),transparent_50%)] pointer-events-none animate-cursorGlow" />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex items-center justify-center z-10">
        <div className="relative max-w-4xl text-center transform transition-all duration-500 animate-paneRise">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(255,0,200,0.2))] opacity-50 rounded-xl animate-paneTrail" />
          <div className="relative z-10 bg-depth-black/80 p-8 rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.5)] hover:shadow-[0_0_30px_rgba(0,200,255,0.7)] transition-all duration-300">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-semibold text-lumen-white tracking-tight animate-depthGlow mb-6">
              Welcome to NIVOX Blog
            </h1>
            <p className="text-lg sm:text-xl text-lumen-white/80 font-light mb-8 leading-relaxed">
              Elevate your voice, inspire the world with every post.
            </p>
            <Link
              href="/blogs"
              className="relative inline-block px-6 py-3 bg-[linear-gradient(45deg,#00C8FF,#FF00C8)] text-lumen-white font-mono font-semibold rounded-md hover:bg-[linear-gradient(45deg,#00E0FF,#FF33D6)] hover:shadow-[0_0_15px_rgba(0,200,255,0.7)] hover:scale-105 transition-all duration-300"
            >
              Explore Blogs
            </Link>
          </div>
          <div className="absolute inset-0 border border-lumen-cyan/20 rounded-xl animate-paneEdge" />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full py-12 px-4 sm:px-6 bg-depth-black/90 z-10 border-t border-lumen-cyan/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Branding with Circular Logo */}
          <div className="text-center sm:text-left">
            <div className="flex justify-center sm:justify-start items-center mb-4">
              <Image
                src="/icons/logo.png"
                alt="NIVOX Logo"
                width={50}
                height={50}
                className="rounded-full shadow-[0_0_8px_rgba(0,200,255,0.3)] object-cover hover:scale-105 transition-transform duration-300"
              />
              <h3 className="text-xl font-mono font-semibold text-lumen-white ml-3">NIVOX Blog</h3>
            </div>
            <p className="text-sm text-lumen-white/70 font-light leading-relaxed">
              NIVOX Blog empowers creators to share innovative ideas and connect with a global audience. A hub for inspiration, creativity, and meaningful discourse.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-mono font-medium text-lumen-white mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-lumen-white/70 hover:text-lumen-cyan font-light transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-lumen-white/70 hover:text-lumen-cyan font-light transition-colors duration-300"
                >
                  Blog Hub
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-lumen-white/70 hover:text-lumen-cyan font-light transition-colors duration-300 flex items-center justify-center sm:justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12H8m4-4v8m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Support
                </Link>
                <p className="text-xs text-lumen-white/50 font-extralight mt-1">
                  Connect via the Support link in the navbar.
                </p>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-mono font-medium text-lumen-white mb-4">Connect</h4>
            <div className="flex justify-center sm:justify-start space-x-4 flex-wrap gap-y-3">
              <a href="https://www.facebook.com/sureshraj.menghwar" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} className="hover:brightness-125 transition-all duration-300" />
              </a>
              <a href="https://www.instagram.com/sain_suresh_barach/" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} className="hover:brightness-125 transition-all duration-300" />
              </a>
              <a href="https://www.linkedin.com/in/sureshkumarbarach" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} className="hover:brightness-125 transition-all duration-300" />
              </a>
              <a href="https://github.com/sureshbarach2001/" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/github.svg" alt="GitHub" width={24} height={24} className="hover:brightness-125 transition-all duration-300" />
              </a>
              <a href="https://www.youtube.com/@uniquemove8741" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} className="hover:brightness-125 transition-all duration-300" />
              </a>
              <a href="https://x.com/sainsuresh21?s=11" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/twitter.svg" alt="Twitter" width={24} height={24} className="hover:brightness-125 transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Credits */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-mono font-medium text-lumen-white mb-4">About</h4>
            <p className="text-sm text-lumen-white/70 font-light leading-relaxed">
              Crafted with passion by{" "}
              <a
                href="https://sureshkumar2001.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lumen-cyan hover:underline transition-all duration-300 font-medium"
              >
                Delta Innovations Team
              </a>
              , a visionary developers Team dedicated to empowering creative minds.
            </p>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-8 pt-8 border-t border-lumen-cyan/10 text-center">
          <p className="text-sm text-lumen-white/50 font-extralight">
            © {new Date().getFullYear()} NIVOX Blog. All rights reserved | Powered by Delta Innovation
          </p>
        </div>
      </footer>

      {/* Custom CSS */}
      <style jsx>{`
        :global(:root) {
          --depth-black: #0A0A0F;
          --lumen-white: #E0F0FF;
          --lumen-cyan: #00C8FF;
          --lumen-magenta: #FF00C8;
        }
        .bg-depth-black { background-color: var(--depth-black); }
        .text-lumen-white { color: var(--lumen-white); }
        .text-lumen-cyan { color: var(--lumen-cyan); }
        .text-lumen-magenta { color: var(--lumen-magenta); }
        .border-lumen-cyan { border-color: var(--lumen-cyan); }

        @keyframes latticeDrift { 0% { background-position: 0 0; } 100% { background-position: 30px 30px; } }
        @keyframes latticeDriftReverse { 0% { background-position: 0 0; } 100% { background-position: -30px -30px; } }
        @keyframes latticeNode { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.5); } }
        @keyframes cursorGlow { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes depthGlow { 0%, 100% { text-shadow: 0 0 5px rgba(0, 200, 255, 0.3); } 50% { text-shadow: 0 0 10px rgba(0, 200, 255, 0.5), 0 0 5px rgba(255, 0, 200, 0.5); } }
        @keyframes paneRise { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes paneTrail { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.02); } }
        @keyframes paneEdge { 0%, 100% { border-color: rgba(0, 200, 255, 0.2); } 50% { border-color: rgba(0, 200, 255, 0.4); } }
        .animate-latticeDrift { animation: latticeDrift 25s linear infinite; }
        .animate-latticeDriftReverse { animation: latticeDriftReverse 25s linear infinite; }
        .animate-latticeNode { animation: latticeNode 3s ease-in-out infinite; }
        .animate-cursorGlow { animation: cursorGlow 2s ease-in-out infinite; }
        .animate-depthGlow { animation: depthGlow 2s ease-in-out infinite; }
        .animate-paneRise { animation: paneRise 0.5s ease-out forwards; }
        .animate-paneTrail { animation: paneTrail 1.5s ease-in-out infinite; }
        .animate-paneEdge { animation: paneEdge 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}