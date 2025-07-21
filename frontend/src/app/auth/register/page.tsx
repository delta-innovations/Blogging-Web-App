"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterForm } from "@/utils/validation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

// Dynamic import for LottieButton
const LottieButton = dynamic(() => import("@/components/LottieButton"), {
  ssr: false,
});

interface AuthError {
  response?: {
    data?: {
      message?: string;
      errors?: string[];
    };
    status?: number;
  };
  message?: string;
}

export default function RegisterPage() {
  const { register: authRegister, isLoading } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    try {
      await authRegister(data.username, data.email, data.password);
      router.push("/blogs");
    } catch (error: unknown) {
      const authError = error as AuthError;
      const errorMessage =
        authError.response?.data?.message ||
        authError.response?.data?.errors?.[0] ||
        "Cosmic registration failed. Please try again.";
      setServerError(errorMessage);
      console.error("Registration failed:", {
        message: authError.message,
        response: authError.response?.data,
        status: authError.response?.status,
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 bg-depth-black flex flex-col overflow-hidden pt-[80px] z-10">
      {/* Infinite-Depth Lattice */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDrift">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDriftReverse" />
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-lumen-white/20 rounded-full animate-latticeNode"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Heading Section */}
      <div className="fixed top-[80px] left-0 w-full min-h-[60px] sm:min-h-[80px] bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(255,0,200,0.2))] p-4 sm:p-6 shadow-[0_0_15px_rgba(0,200,255,0.5)] animate-depthEdge flex items-center justify-between z-60 shrink-0">
        <LottieButton onClick={handleBack} path="/icons/Left-Arrow.json" />
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-semibold text-lumen-white tracking-tight animate-depthGlow text-center flex-1">
          Join the Cosmos
        </h1>
        <div className="w-[40px]" /> {/* Spacer adjusted for Lottie button */}
      </div>

      {/* Registration Form */}
      <div className="flex-1 w-full p-6 sm:p-8 overflow-y-auto z-10 mt-[120px] sm:mt-[140px] flex items-start justify-center">
        <div className="relative w-full max-w-md transform transition-all duration-500 animate-paneRise">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(255,0,200,0.2))] opacity-50 rounded-xl animate-paneTrail" />
          <div className="relative z-10 bg-depth-black/80 p-8 sm:p-10 rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.5)] hover:shadow-[0_0_30px_rgba(0,200,255,0.7)] transition-all duration-300">
            {serverError && (
              <p className="text-lumen-magenta mb-6 text-center font-semibold animate-pulse text-xl sm:text-2xl animate-depthGlow">
                {serverError}
              </p>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <label
                  htmlFor="username"
                  className="block text-lg sm:text-xl font-medium text-lumen-white/80 mb-2 tracking-tight"
                >
                  Username
                </label>
                <input
                  {...register("username")}
                  id="username"
                  placeholder="Choose your stellar username (letters, numbers, _)"
                  className={`w-full p-4 bg-depth-black text-lumen-white border border-lumen-cyan/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-cyan transition-all duration-300 ${
                    errors.username
                      ? "border-lumen-magenta"
                      : "hover:border-lumen-cyan/50"
                  }`}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-lumen-magenta text-lg sm:text-xl mt-2 animate-pulse">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-lg sm:text-xl font-medium text-lumen-white/80 mb-2 tracking-tight"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  placeholder="Enter your galactic email"
                  className={`w-full p-4 bg-depth-black text-lumen-white border border-lumen-cyan/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-cyan transition-all duration-300 ${
                    errors.email
                      ? "border-lumen-magenta"
                      : "hover:border-lumen-cyan/50"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-lumen-magenta text-lg sm:text-xl mt-2 animate-pulse">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg sm:text-xl font-medium text-lumen-white/80 mb-2 tracking-tight"
                >
                  Password
                </label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="Create your cosmic key (min 8 chars, 1 upper, 1 lower, 1 num, 1 special @#$!%*?&)"
                  className={`w-full p-4 bg-depth-black text-lumen-white border border-lumen-cyan/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-cyan transition-all duration-300 ${
                    errors.password
                      ? "border-lumen-magenta"
                      : "hover:border-lumen-cyan/50"
                  }`}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-lumen-magenta text-lg sm:text-xl mt-2 animate-pulse">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full relative flex justify-center items-center px-6 py-4 rounded-md text-lumen-white font-semibold transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-600/50 opacity-50 cursor-not-allowed"
                    : "bg-[linear-gradient(45deg,#00C8FF,#FF00C8)] hover:bg-[linear-gradient(45deg,#00E0FF,#FF33D6)] hover:shadow-[0_0_15px_rgba(0,200,255,0.7)] hover:text-shadow-[0_0_10px_rgba(255,255,255,0.8)] hover:scale-105"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader /> Registering...
                  </>
                ) : (
                  "Embark on Your Journey"
                )}
              </button>
            </form>
          </div>
          <div className="absolute inset-0 border border-lumen-cyan/20 rounded-xl animate-paneEdge" />
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        /* Custom Depth Colors */
        :global(:root) {
          --depth-black: #0A0A0F;
          --lumen-white: #E0F0FF;
          --lumen-cyan: #00C8FF;
          --lumen-magenta: #FF00C8;
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
        .border-lumen-cyan {
          border-color: var(--lumen-cyan);
        }
        .border-lumen-magenta {
          border-color: var(--lumen-magenta);
        }

        @keyframes latticeDrift {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 30px 30px;
          }
        }
        @keyframes latticeDriftReverse {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: -30px -30px;
          }
        }
        @keyframes latticeNode {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.5);
          }
        }
        @keyframes depthGlow {
          0%,
          100% {
            text-shadow: 0 0 5px rgba(0, 200, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 10px rgba(0, 200, 255, 0.5),
              0 0 5px rgba(255, 0, 200, 0.5);
          }
        }
        @keyframes depthEdge {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 25px rgba(0, 200, 255, 0.7),
              0 0 10px rgba(255, 0, 200, 0.7);
          }
        }
        @keyframes paneRise {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes paneTrail {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
        @keyframes paneEdge {
          0%,
          100% {
            border-color: rgba(0, 200, 255, 0.2);
          }
          50% {
            border-color: rgba(0, 200, 255, 0.4);
          }
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
        .animate-latticeDrift {
          animation: latticeDrift 25s linear infinite;
        }
        .animate-latticeDriftReverse {
          animation: latticeDriftReverse 25s linear infinite;
        }
        .animate-latticeNode {
          animation: latticeNode 3s ease-in-out infinite;
        }
        .animate-depthGlow {
          animation: depthGlow 2s ease-in-out infinite;
        }
        .animate-depthEdge {
          animation: depthEdge 3s ease-in-out infinite;
        }
        .animate-paneRise {
          animation: paneRise 0.5s ease-out forwards;
        }
        .animate-paneTrail {
          animation: paneTrail 1.5s ease-in-out infinite;
        }
        .animate-paneEdge {
          animation: paneEdge 2s ease-in-out infinite;
        }
        .animate-quantumPulse {
          animation: quantumPulse 1.2s infinite ease-in-out;
        }
        .animate-quantumPulseGlow {
          animation: quantumPulseGlow 1.5s infinite ease-in-out;
        }
        .animate-quantumPulseBorder {
          animation: quantumPulseBorder 1.8s infinite ease-in-out;
        }
        .group:hover .animate-quantumPulseGlow {
          transform: scale(125%);
        }
      `}</style>
    </div>
  );
}