"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { sendContactEmails } from "@/utils/emailService";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loadingStates, setLoadingStates] = useState({
    blogs: false,
    login: false,
    register: false,
    create: false,
    logout: false,
    home: false,
    contact: false,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("");
  const [riftPosition, setRiftPosition] = useState({ x: 50, y: 50 });
  const [riftParticles, setRiftParticles] = useState<React.ReactNode[]>([]);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particles = Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-lumen-cyan/50 rounded-full shadow-[0_0_5px_rgba(0,200,255,0.4)] animate-orbit"
        style={{
          left: `${riftPosition.x + Math.cos(i * 2.094) * 10}%`,
          top: `${riftPosition.y + Math.sin(i * 2.094) * 10}%`,
          animationDelay: `${i * 0.5}s`,
        }}
      />
    ));
    setRiftParticles(particles);
  }, [riftPosition]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setRiftPosition({
        x: Math.max(10, Math.min(90, x)),
        y: Math.max(10, Math.min(90, y)),
      });
    }
  };

  useEffect(() => {
    const isEditOrCreatePage =
      pathname === "/blogs/create" || pathname.startsWith("/blogs/edit");

    const preventAction = (e: Event) => {
      if (!isEditOrCreatePage) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: Event) => {
      if (!isEditOrCreatePage) {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", preventAction);
    document.addEventListener("cut", preventAction);
    document.addEventListener("paste", preventAction);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("cut", preventAction);
      document.removeEventListener("paste", preventAction);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [pathname]);

  const handleLogout = async () => {
    setLoadingStates((prev) => ({ ...prev, logout: true }));
    try {
      await logout();
      router.push("/");
    } catch (error) {
      // Explicitly using the error parameter to log the issue
      console.error("Logout failed:", error);
      // Optionally, you can set an error state to display to the user
      setFormStatus("Logout failed. Please try again.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, logout: false }));
    }
  };

  const handleNavigate = async (
    path: string,
    key: keyof typeof loadingStates
  ) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
    try {
      await router.push(path);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
      setIsMenuOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingStates((prev) => ({ ...prev, contact: true }));
    setFormStatus("Sending...");

    console.log("Form data being sent:", formData); // Debug log

    try {
      await sendContactEmails(formData);
      setFormStatus("Message sent successfully! We’ll respond soon.");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsContactModalOpen(false), 2000);
    } catch (error) {
       // Explicitly using the error parameter to log the issue
       console.error("Logout failed:", error);
      setFormStatus("Failed to send. Please try again later.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, contact: false }));
      setTimeout(() => setFormStatus(""), 3000);
    }
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 w-full h-[80px] bg-depth-black z-50 flex items-center justify-center">
        <Loader />
      </nav>
    );
  }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full h-[80px] bg-depth-black z-50 animate-slideIn overflow-visible shadow-[0_0_10px_rgba(0,200,255,0.2)]"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,10,15,0.95),rgba(20,20,30,0.9))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--rift-x)_var(--rift-y),rgba(0,200,255,0.15),transparent_60%)] animate-fluxPulse" />
          {riftParticles}
        </div>

        <div className="container mx-auto px-4 sm:px-6 h-full flex items-center justify-between relative z-10">
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 group shrink-0"
          >
            <Image
              src="/icons/logo.png"
              alt="NIVOX Logo"
              width={40}
              height={34}
              className="rounded-full transform group-hover:scale-110 transition-transform duration-300 shadow-[0_0_8px_rgba(0,200,255,0.3)]"
            />
            <span className="text-lg sm:text-xl font-mono font-semibold text-lumen-white tracking-tight animate-depthGlow group-hover:text-lumen-cyan transition-colors duration-300">
              NIVOX
            </span>
          </Link>

          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 absolute md:static top-[80px] left-0 w-full md:w-auto bg-depth-black/95 md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out z-10`}
          >
            <button
              onClick={() => handleNavigate("/blogs", "blogs")}
              className="relative w-full md:w-auto text-lumen-white font-bold px-4 py-2 bg-[linear-gradient(45deg,rgba(0,200,255,0.5),rgba(0,255,200,0.5))] hover:bg-[linear-gradient(45deg,rgba(0,200,255,0.7),rgba(0,255,200,0.7))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md text-center"
            >
              {loadingStates.blogs ? <Loader /> : "Blog Hub"}
              <span className="absolute inset-0 bg-lumen-cyan/20 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
              <span className="absolute inset-0 border border-lumen-cyan/40 rounded-md animate-quantumPulseBorder" />
            </button>

            {user ? (
              <>
                <button
                  onClick={() => handleNavigate("/blogs/create", "create")}
                  className="relative w-full md:w-auto text-lumen-white font-bold px-4 py-2 bg-[linear-gradient(45deg,rgba(0,200,255,0.5),rgba(0,255,200,0.5))] hover:bg-[linear-gradient(45deg,rgba(0,200,255,0.7),rgba(0,255,200,0.7))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md text-center"
                >
                  {loadingStates.create ? <Loader /> : "Create Post"}
                  <span className="absolute inset-0 bg-lumen-cyan/20 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
                  <span className="absolute inset-0 border border-lumen-cyan/40 rounded-md animate-quantumPulseBorder" />
                </button>
                <button
                  onClick={handleLogout}
                  className="relative w-full md:w-auto text-lumen-white font-bold px-4 py-2 bg-[linear-gradient(45deg,rgba(200,0,255,0.5),rgba(150,100,255,0.5))] hover:bg-[linear-gradient(45deg,rgba(200,0,255,0.7),rgba(150,100,255,0.7))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md text-center"
                >
                  {loadingStates.logout ? <Loader /> : "Sign Out"}
                  <span className="absolute inset-0 bg-lumen-magenta/20 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
                  <span className="absolute inset-0 border border-lumen-magenta/40 rounded-md animate-quantumPulseBorder" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigate("/auth/login", "login")}
                  className="relative w-full md:w-auto text-lumen-white font-bold px-4 py-2 bg-[linear-gradient(45deg,rgba(0,200,255,0.5),rgba(0,255,200,0.5))] hover:bg-[linear-gradient(45deg,rgba(0,200,255,0.7),rgba(0,255,200,0.7))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md text-center"
                >
                  {loadingStates.login ? <Loader /> : "Sign In"}
                  <span className="absolute inset-0 bg-lumen-cyan/20 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
                  <span className="absolute inset-0 border border-lumen-cyan/40 rounded-md animate-quantumPulseBorder" />
                </button>
                <button
                  onClick={() => handleNavigate("/auth/register", "register")}
                  className="relative w-full md:w-auto text-lumen-white font-bold px-4 py-2 bg-[linear-gradient(45deg,rgba(200,0,255,0.5),rgba(150,100,255,0.5))] hover:bg-[linear-gradient(45deg,rgba(200,0,255,0.7),rgba(150,100,255,0.7))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md text-center"
                >
                  {loadingStates.register ? <Loader /> : "Join Now"}
                  <span className="absolute inset-0 bg-lumen-magenta/20 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
                  <span className="absolute inset-0 border border-lumen-magenta/40 rounded-md animate-quantumPulseBorder" />
                </button>
              </>
            )}

            <button
              onClick={() => setIsContactModalOpen(true)}
              className="relative w-full md:w-auto text-lumen-white font-bold px-4 py-2 bg-[linear-gradient(45deg,rgba(0,200,255,0.5),rgba(0,255,200,0.5))] hover:bg-[linear-gradient(45deg,rgba(0,200,255,0.7),rgba(0,255,200,0.7))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md text-center"
            >
              {loadingStates.contact ? <Loader /> : "Support"}
              <span className="absolute inset-0 bg-lumen-cyan/20 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
              <span className="absolute inset-0 border border-lumen-cyan/40 rounded-md animate-quantumPulseBorder" />
            </button>
          </div>

          <button
            className="md:hidden focus:outline-none transition-colors duration-300 z-20 absolute top-1/2 right-4 transform -translate-y-1/2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ width: '45px', height: '45px', background: 'none', border: 'none' }}
          >
            <Image
              src={isMenuOpen ? "/icons/exit-icon.png" : "/icons/menu-icon.svg"}
              alt={isMenuOpen ? "Close Menu" : "Open Menu"}
              width={34}
              height={34}
              className="w-full h-full object-contain"
            />
          </button>
        </div>
      </nav>

      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-depth-black/98 p-6 rounded-xl max-w-md w-full mx-4 shadow-[0_0_20px_rgba(0,200,255,0.5)] animate-modalRise relative">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="focus:outline-none transition-colors duration-300 z-20 absolute top-2 right-2 hover:scale-110"
              style={{ width: '45px', height: '45px', background: 'none', border: 'none' }}
            >
              <Image
                src="/icons/exit-icon.png"
                alt="Close Modal"
                width={34}
                height={34}
                className="w-full h-full object-contain"
              />
            </button>
            <h2 className="text-2xl font-mono font-semibold text-lumen-white text-center mb-6 animate-depthGlow">Get Support</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-lumen-white text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full p-3 bg-depth-black/30 border border-lumen-cyan/30 rounded-md text-lumen-white placeholder-lumen-white/70 focus:outline-none focus:border-lumen-cyan transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lumen-white text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full p-3 bg-depth-black/30 border border-lumen-cyan/30 rounded-md text-lumen-white placeholder-lumen-white/70 focus:outline-none focus:border-lumen-cyan transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-lumen-white text-sm font-medium mb-2">Your Inquiry</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your inquiry or feedback"
                  className="w-full p-3 bg-depth-black/30 border border-lumen-cyan/30 rounded-md text-lumen-white placeholder-lumen-white/70 focus:outline-none focus:border-lumen-cyan transition-all duration-300 h-32 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[linear-gradient(45deg,#00C8FF,#FF00C8)] text-lumen-white font-bold rounded-md hover:bg-[linear-gradient(45deg,#00E0FF,#FF33D6)] hover:shadow-[0_0_15px_rgba(0,200,255,0.7)] transition-all duration-300 disabled:opacity-50"
                disabled={loadingStates.contact}
              >
                {loadingStates.contact ? <Loader /> : "Submit Inquiry"}
              </button>
              {formStatus && (
                <p className="text-center text-lumen-white/80 font-light">{formStatus}</p>
              )}
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(:root) {
          --depth-black: #0a0a0f;
          --lumen-white: #e0f0ff;
          --lumen-cyan: #00c8ff;
          --lumen-magenta: #ff00c8;
          --matte-black: #1a1a1a; /* Matte black color */
        }
        .bg-depth-black {
          background-color: var(--depth-black);
        }
        .text-lumen-white {
          color: var(--lumen-white);
        }
        .text-lumen-cyan {
          color: var(--lumen-cyan);
        }
        .text-lumen-magenta {
          color: var(--lumen-magenta);
        }
        .bg-lumen-cyan {
          background-color: var(--lumen-cyan);
        }
        .bg-lumen-magenta {
          background-color: var(--lumen-magenta);
        }

        @keyframes slideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fluxPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes orbit {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes quantumPulse {
          0% { transform: translate(0, 0) scale(1); opacity: 0.9; }
          30% { transform: translate(1px, -1px) scale(1.01); opacity: 0.95; }
          60% { transform: translate(-1px, 1px) scale(0.99); opacity: 0.85; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.9; }
        }
        @keyframes quantumPulseGlow {
          0% { transform: scale(0); opacity: 0.3; filter: blur(2px); }
          40% { transform: scale(1.1); opacity: 0.5; filter: blur(1px); }
          70% { transform: scale(0.9); opacity: 0.4; filter: blur(3px); }
          100% { transform: scale(1); opacity: 0.3; filter: blur(2px); }
        }
        @keyframes quantumPulseBorder {
          0% { border-color: rgba(0, 200, 255, 0.4); transform: translate(0, 0); }
          25% { border-color: rgba(255, 0, 200, 0.45); transform: translate(0.5px, -0.5px); }
          50% { border-color: rgba(0, 200, 255, 0.35); transform: translate(-0.5px, 0.5px); }
          75% { border-color: rgba(255, 0, 200, 0.4); transform: translate(0, 0.5px); }
          100% { border-color: rgba(0, 200, 255, 0.4); transform: translate(0, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalRise {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes depthGlow {
          0%, 100% { text-shadow: 0 0 5px rgba(0, 200, 255, 0.3); }
          50% { text-shadow: 0 0 10px rgba(0, 200, 255, 0.5), 0 0 5px rgba(255, 0, 200, 0.5); }
        }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
        .animate-fluxPulse {
          animation: fluxPulse 4s ease-in-out infinite;
          --rift-x: ${riftPosition.x}%;
          --rift-y: ${riftPosition.y}%;
        }
        .animate-orbit { animation: orbit 6s linear infinite; }
        .animate-quantumPulse { animation: quantumPulse 1.2s infinite ease-in-out; }
        .animate-quantumPulseGlow { animation: quantumPulseGlow 1.5s infinite ease-in-out; }
        .animate-quantumPulseBorder { animation: quantumPulseBorder 1.8s infinite ease-in-out; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in forwards; }
        .animate-modalRise { animation: modalRise 0.3s ease-out forwards; }
        .animate-depthGlow { animation: depthGlow 2s ease-in-out infinite; }
        button:hover .animate-quantumPulseGlow { transform: scale(125%); }

        @media (max-width: 767px) {
          nav { overflow: visible; }
          .flex-col {
            min-height: ${user ? "240px" : "200px"};
            width: 100%;
            box-shadow: 0 4px 10px rgba(0, 200, 255, 0.2);
          }
          button {
            width: 85%;
            margin-left: auto;
            margin-right: auto;
            font-size: 18px;
            padding: 12px;
            border-width: 3px;
            border-radius: 8px;
            transition: all 0.3s ease;
            color: var(--matte-black) !important; /* Matte black text */
            font-weight: 700; /* Bolder text */
          }
          /* Reset any inherited color classes */
          button.text-lumen-white {
            color: var(--matte-black) !important; /* Ensure override */
          }
          /* "Blog Hub" button */
          button:nth-child(1) {
            background-color: var(--lumen-cyan);
            border-color: var(--lumen-cyan);
          }
          button:nth-child(1):hover {
            background-color: #00e0ff;
            border-color: #00e0ff;
          }
          /* "Create Post" or "Sign In" button */
          button:nth-child(2) {
            background-color: var(--lumen-cyan);
            border-color: var(--lumen-cyan);
          }
          button:nth-child(2):hover {
            background-color: #00e0ff;
            border-color: #00e0ff;
          }
          /* "Sign Out" or "Join Now" button */
          button:nth-child(3) {
            background-color: var(--lumen-magenta);
            border-color: var(--lumen-magenta);
          }
          button:nth-child(3):hover {
            background-color: #ff33d6;
            border-color: #ff33d6;
          }
          /* "Support" button */
          button:nth-child(4) {
            background-color: var(--lumen-cyan);
            border-color: var(--lumen-cyan);
          }
          button:nth-child(4):hover {
            background-color: #00e0ff;
            border-color: #00e0ff;
          }
          button .animate-quantumPulseGlow { display: none; }
          button .animate-quantumPulseBorder { display: none; }
          button { box-shadow: 0 4px 6px rgba(0, 200, 255, 0.3); }
        }
      `}</style>
    </>
  );
}