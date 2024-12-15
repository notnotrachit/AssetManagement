"use client";

import { useAuth } from "./context/AuthContext";
import { IconCategory, IconBoxSeam, IconTruck } from "@tabler/icons-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl font-bold text-base-content">
            Welcome to <span className="text-primary">Asset Management</span>
          </h1>
          <p className="text-lg text-base-content/80">
            Please login or register to access the platform
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-base-content">
          Welcome back, <span className="text-primary">{user.username}</span>!
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["admin", "vendor"].includes(user.role) && (
          <motion.div variants={item}>
            <div className="card bg-base-200 hover:bg-base-300 transition-colors duration-300 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <IconCategory className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="card-title text-base-content">Categories</h2>
                </div>
                <p className="text-base-content/80">Manage asset categories and types</p>
                <div className="card-actions justify-end">
                  <a href="/categories" className="btn btn-primary btn-sm">View Categories</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={item} className="">
          <div className="card bg-base-200 hover:bg-base-300 transition-colors duration-300 shadow-lg">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  {user.role === "vendor" ? (
                    <IconBoxSeam className="h-6 w-6 text-secondary" />
                  ) : (
                    <IconTruck className="h-6 w-6 text-secondary" />
                  )}
                </div>
                <h2 className="card-title text-base-content">
                  {user.role === "vendor" ? "My Assets" : "Assets"}
                </h2>
              </div>
              <p className="text-base-content/80">
                {user.role === "vendor"
                  ? "Manage your listed assets"
                  : "Browse available assets"}
              </p>
              <div className="card-actions justify-end">
                <a href="/assets" className="btn btn-secondary btn-sm">
                  {user.role === "vendor" ? "View My Assets" : "Browse Assets"}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
