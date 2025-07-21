"use client";

import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogPost } from "@/types";
import Loader from "@/components/Loader";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogCard({ blog }: { blog: BlogPost }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/blogs/${blog._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      setIsDialogOpen(false);
    },
  });

  const handleDeleteConfirm = () => {
    deleteMutation.mutate();
  };

  const handleDelete = () => {
    setIsDialogOpen(true);
  };

  const handleNavigate = (path: string) => {
    setIsNavigating(true);
    router.push(path);
    setTimeout(() => setIsNavigating(false), 300);
  };

  return (
    <>
      <div className="bg-depth-black rounded-xl shadow-[0_0_10px_rgba(0,200,255,0.2)] overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,200,255,0.5)]">
        <div className="p-6">
          <h2 className="text-2xl font-extrabold font-mono text-lumen-white tracking-tight mb-2 hover:text-lumen-cyan transition-colors duration-300 truncate animate-depthGlow">
            {blog.title}
          </h2>
          <p className="text-lumen-white/70 text-base font-light leading-relaxed mb-4 line-clamp-3">
            {blog.content}
          </p>
          <p className="text-sm text-lumen-white/50 font-light italic mb-4">
            By{" "}
            <span className="font-medium text-lumen-cyan hover:text-lumen-cyan/80 transition-colors duration-300">
              {blog.author?.username ?? "Unknown Author"}
            </span>{" "}
            on{" "}
            <span className="font-medium">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleNavigate(`/blogs/${blog._id}`)}
              className={`relative flex items-center px-4 py-2 rounded-full text-lumen-white font-medium transition-all duration-300 ${
                isNavigating
                  ? "bg-gray-600 opacity-50 cursor-not-allowed"
                  : "bg-[linear-gradient(45deg,rgba(0,200,255,0.5),rgba(0,255,200,0.5))] hover:bg-[linear-gradient(45deg,rgba(0,200,255,0.7),rgba(0,255,200,0.7))] hover:shadow-[0_0_10px_rgba(0,200,255,0.5)] hover:scale-105"
              }`}
              disabled={isNavigating}
            >
              {isNavigating ? <Loader /> : "Explore Post"}
              {!isNavigating && (
                <span className="absolute inset-0 rounded-full border border-lumen-cyan/40 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-quantumPulseBorder" />
              )}
            </button>
            {user?._id === blog.author?._id && (
              <>
                <button
                  onClick={() => handleNavigate(`/blogs/edit/${blog._id}`)}
                  className={`relative flex items-center px-4 py-2 rounded-full text-lumen-white font-medium transition-all duration-300 ${
                    isNavigating
                      ? "bg-gray-600 opacity-50 cursor-not-allowed"
                      : "bg-[linear-gradient(45deg,rgba(0,255,200,0.5),rgba(0,200,255,0.5))] hover:bg-[linear-gradient(45deg,rgba(0,255,200,0.7),rgba(0,200,255,0.7))] hover:shadow-[0_0_10px_rgba(0,255,200,0.5)] hover:scale-105"
                  }`}
                  disabled={isNavigating}
                >
                  {isNavigating ? <Loader /> : "Modify"}
                  {!isNavigating && (
                    <span className="absolute inset-0 rounded-full border border-lumen-cyan/40 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-quantumPulseBorder" />
                  )}
                </button>
                <button
                  onClick={handleDelete}
                  className={`relative flex items-center px-4 py-2 rounded-full text-lumen-white font-medium transition-all duration-300 ${
                    deleteMutation.isPending || isNavigating
                      ? "bg-gray-600 opacity-50 cursor-not-allowed"
                      : "bg-[linear-gradient(45deg,rgba(200,0,255,0.5),rgba(150,100,255,0.5))] hover:bg-[linear-gradient(45deg,rgba(200,0,255,0.7),rgba(150,100,255,0.7))] hover:shadow-[0_0_10px_rgba(200,0,255,0.5)] hover:scale-105"
                  }`}
                  disabled={deleteMutation.isPending || isNavigating}
                >
                  {deleteMutation.isPending ? <Loader /> : "Remove"}
                  {!deleteMutation.isPending && !isNavigating && (
                    <span className="absolute inset-0 rounded-full border border-lumen-magenta/40 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-quantumPulseBorder" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-depth-black rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.5)] p-6 w-full max-w-md transform transition-all duration-300 animate-fadeInUp">
            <h3 className="text-xl font-mono font-semibold text-lumen-white mb-4 animate-depthGlow">
              Confirm Removal
            </h3>
            <p className="text-lumen-white/70 font-light mb-6">
              Are you sure you want to remove{" "}
              <span className="font-medium text-lumen-cyan">
                &quot;{blog.title}&quot;
              </span>
              ? This action is permanent.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="relative px-4 py-2 rounded-full text-lumen-white font-medium bg-depth-black/50 border border-lumen-cyan/30 hover:bg-depth-black/70 hover:scale-105 transition-all duration-300"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className={`relative flex items-center px-4 py-2 rounded-full text-lumen-white font-medium transition-all duration-300 ${
                  deleteMutation.isPending
                    ? "bg-gray-600 opacity-50 cursor-not-allowed"
                    : "bg-[linear-gradient(45deg,rgba(200,0,255,0.5),rgba(150,100,255,0.5))] hover:bg-[linear-gradient(45deg,rgba(200,0,255,0.7),rgba(150,100,255,0.7))] hover:shadow-[0_0_10px_rgba(200,0,255,0.5)] hover:scale-105"
                }`}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <Loader /> : "Confirm"}
                {!deleteMutation.isPending && (
                  <span className="absolute inset-0 rounded-full border border-lumen-magenta/40 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-quantumPulseBorder" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(:root) {
          --depth-black: #0a0a0f;
          --lumen-white: #e0f0ff;
          --lumen-cyan: #00c8ff;
          --lumen-magenta: #ff00c8;
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes depthGlow {
          0%, 100% { text-shadow: 0 0 5px rgba(0, 200, 255, 0.3); }
          50% { text-shadow: 0 0 10px rgba(0, 200, 255, 0.5), 0 0 5px rgba(255, 0, 200, 0.5); }
        }
        @keyframes quantumPulseBorder {
          0% { border-color: rgba(0, 200, 255, 0.4); transform: translate(0, 0); }
          25% { border-color: rgba(255, 0, 200, 0.45); transform: translate(0.5px, -0.5px); }
          50% { border-color: rgba(0, 200, 255, 0.35); transform: translate(-0.5px, 0.5px); }
          75% { border-color: rgba(255, 0, 200, 0.4); transform: translate(0, 0.5px); }
          100% { border-color: rgba(0, 200, 255, 0.4); transform: translate(0, 0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.3s ease-out forwards; }
        .animate-depthGlow { animation: depthGlow 2s ease-in-out infinite; }
        .animate-quantumPulseBorder { animation: quantumPulseBorder 1.8s infinite ease-in-out; }
      `}</style>
    </>
  );
}