"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BlogPost } from "@/types";
import dynamic from "next/dynamic";

// Dynamic import for LottieButton
const LottieButton = dynamic(() => import("@/components/LottieButton"), {
  ssr: false,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogPage({ params }: { params: any }) {
  const { id } = params as { id: string };
  const router = useRouter();
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

  const { data: blog, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data } = await api.get(`/blogs/${id}`);
      return data;
    },
  });

  const handleBack = () => {
    router.push("/blogs");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: `Check out this blog post: ${blog?.title}`,
        url: window.location.href,
      }).catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Blog post URL copied to clipboard!");
      }).catch((err) => console.error("Error copying URL:", err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-depth-black">
        <Loader />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <p className="text-center text-lumen-white animate-depthFade bg-depth-black h-screen flex items-center justify-center font-mono text-xl font-light animate-depthGlow">
        We couldn’t find this blog post. Please try again or return to the Blog Hub.
      </p>
    );
  }

  return (
    <div className="fixed inset-0 bg-depth-black flex flex-col overflow-hidden pt-[80px] z-10">
      {/* Infinite-Depth Lattice */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDrift">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(21, 21, 63, 0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDriftReverse" />
        <div className="absolute inset-0">{latticeNodes}</div>
      </div>

      {/* Heading Section */}
      <div className="fixed top-[80px] left-0 w-full min-h-[60px] sm:min-h-[80px] bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(255,0,200,0.2))] p-4 sm:p-6 shadow-[0_0_15px_rgba(0,200,255,0.5)] animate-depthEdge flex items-center justify-between z-60 shrink-0">
        <LottieButton onClick={handleBack} path="/icons/Left-Arrow.json" />
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-semibold text-lumen-white tracking-tight animate-depthGlow text-center flex-1 truncate hover:text-shadow-[0_0_10px_rgba(0,200,255,0.8)] transition-all duration-300">
          {blog.title}
        </h1>
        <div className="w-[40px]" /> {/* Spacer for Lottie button */}
      </div>

      {/* Blog Content */}
      <div className="flex-1 w-full p-4 sm:p-6 overflow-y-auto z-10 mt-[120px] sm:mt-[140px] flex items-start justify-center">
        <div className="relative w-full max-w-3xl transform transition-all duration-500 animate-paneRise">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(11, 44, 53, 0.2),rgba(255,0,200,0.2))] opacity-50 rounded-xl animate-paneTrail" />
          <div className="relative z-10 bg-depth-black/95 p-8 sm:p-10 rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.5)] hover:shadow-[0_0_30px_rgba(0,200,255,0.7)] transition-all duration-300">
            <div className="text-lumen-white/90 text-lg sm:text-xl font-light leading-loose tracking-wide mb-8">
              {blog.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="border-t border-lumen-cyan/20 my-6" />
            <div className="space-y-4">
              <p className="text-base text-lumen-white/50 font-light italic tracking-tight animate-depthGlow">
                Authored by{" "}
                <span className="font-medium text-lumen-cyan hover:text-lumen-cyan/80 transition-colors duration-300">
                  {blog.author?.username ?? "Unknown Author"}
                </span>{" "}
                on{" "}
                <span className="font-medium">
                  {new Date(blog.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </p>
              <button
                onClick={handleShare}
                className="text-lumen-cyan font-medium text-base italic hover:text-lumen-cyan/80 transition-colors duration-300 animate-depthGlow"
              >
                Share this Post
              </button>
            </div>
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
        @keyframes depthFade {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
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
          73% { border-color: rgba(255, 0, 200, 0.4); transform: translate(0, 0.5px); }
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
        .animate-depthFade {
          animation: depthFade 1.5s ease-in-out infinite;
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