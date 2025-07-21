"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, BlogForm } from "@/utils/validation";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

type BlogPost = {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; username: string; email: string };
};

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: string[];
    };
    status?: number;
  };
  message?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditBlogPage({ params }: { params: any }) {
  const { id } = params as { id: string }; // Safely cast params to expected shape
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [latticeNodes, setLatticeNodes] = useState<React.ReactNode[]>([]);

  // Generate lattice nodes only on client-side mount
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
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    if (blog) {
      reset({ title: blog.title, content: blog.content });
    }
  }, [blog, reset]);

  const mutation = useMutation({
    mutationFn: (data: BlogForm) => api.put(`/blogs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      router.push("/blogs");
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.response?.data?.errors?.[0] ||
        "Failed to refine your masterpiece";
      setServerError(errorMessage);
      console.error("Blog update failed:", {
        message: apiError.message,
        response: apiError.response?.data,
        status: apiError.response?.status,
      });
    },
  });

  const onSubmit = (data: BlogForm) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (user._id !== blog?.author._id) {
      setServerError("You are not authorized to edit this post");
      return;
    }
    setServerError(null);
    mutation.mutate(data);
  };

  const handleBack = () => {
    router.push("/blogs");
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
        Masterpiece not found or an error occurred
      </p>
    );
  }

  // Dynamic import for LottieButton to ensure it only loads on the client
  const LottieButton = dynamic(() => import("@/components/LottieButton"), {
    ssr: false, // Disable server-side rendering for this component
  });

  return (
    <div
      data-edit-page
      className="fixed inset-0 bg-depth-black flex flex-col overflow-hidden pt-[80px] z-10"
    >
      {/* Infinite-Depth Lattice */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDrift">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDriftReverse" />
        <div className="absolute inset-0">{latticeNodes}</div>
      </div>

      {/* Heading Section */}
      <div className="fixed top-[80px] left-0 w-full min-h-[60px] sm:min-h-[80px] bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(255,0,200,0.2))] p-4 sm:p-6 shadow-[0_0_15px_rgba(0,200,255,0.5)] animate-depthEdge flex items-center justify-between z-60 shrink-0">
        {/* Lottie Back Button */}
        <LottieButton onClick={handleBack} path="/icons/Left-Arrow.json" />
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-semibold text-lumen-white tracking-tight animate-depthGlow text-center flex-1">
          Refine Your Masterpiece
        </h1>
        <div className="w-[40px]" /> {/* Adjusted spacer for Lottie button */}
      </div>

      {/* Form */}
      <div className="flex-1 w-full p-6 sm:p-8 overflow-y-auto z-10 mt-[60px] sm:mt-[80px] flex items-center justify-center">
        <div className="relative w-full max-w-4xl transform transition-all duration-500 animate-paneRise">
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
                  htmlFor="title"
                  className="block text-lg sm:text-xl font-medium text-lumen-white/80 mb-2 tracking-tight"
                >
                  Masterpiece Title
                </label>
                <input
                  {...register("title")}
                  id="title"
                  placeholder="Refine the title of your masterpiece"
                  className={`w-full p-4 bg-depth-black text-lumen-white border border-lumen-cyan/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-cyan transition-all duration-300 ${
                    errors.title
                      ? "border-lumen-magenta"
                      : "hover:border-lumen-cyan/50"
                  }`}
                  disabled={mutation.isPending}
                />
                {errors.title && (
                  <p className="text-lumen-magenta text-lg sm:text-xl mt-2 animate-pulse">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-lg sm:text-xl font-medium text-lumen-white/80 mb-2 tracking-tight"
                >
                  Masterpiece Content
                </label>
                <textarea
                  {...register("content")}
                  id="content"
                  placeholder="Polish your story here (minimum 10 characters)"
                  className={`w-full p-4 bg-depth-black text-lumen-white border border-lumen-cyan/20 rounded-md h-60 focus:outline-none focus:ring-2 focus:ring-lumen-cyan transition-all duration-300 resize-y ${
                    errors.content
                      ? "border-lumen-magenta"
                      : "hover:border-lumen-cyan/50"
                  }`}
                  disabled={mutation.isPending}
                />
                {errors.content && (
                  <p className="text-lumen-magenta text-lg sm:text-xl mt-2 animate-pulse">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className={`w-full relative flex justify-center items-center px-6 py-4 rounded-md text-lumen-white font-semibold transition-all duration-300 ${
                  mutation.isPending
                    ? "bg-gray-600/50 opacity-50 cursor-not-allowed"
                    : "bg-[linear-gradient(45deg,#00C8FF,#FF00C8)] hover:bg-[linear-gradient(45deg,#00E0FF,#FF33D6)] hover:shadow-[0_0_15px_rgba(0,200,255,0.7)] hover:text-shadow-[0_0_10px_rgba(255,255,255,0.8)] hover:scale-105"
                }`}
              >
                {mutation.isPending ? (
                  <>
                    <Loader /> Saving...
                  </>
                ) : (
                  "Save Your Masterpiece"
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