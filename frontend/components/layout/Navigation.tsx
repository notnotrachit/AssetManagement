"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { IconHome, IconLogout, IconCategory, IconBoxSeam, IconTruck, IconUsers } from "@tabler/icons-react";

export function Navigation() {
  const pathname = usePathname();
  const { user, authLogout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    authLogout();
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="navbar-start">
        <Link href="/" className="flex items-center space-x-2">
          <IconTruck className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-base-content">
            Asset Management
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        {user && (
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link
                href="/"
                className={`flex items-center gap-2 ${
                  isActive("/") ? "text-primary font-semibold bg-primary/10" : "text-base-content hover:text-primary hover:bg-primary/5"
                }`}
              >
                <IconHome className="h-4 w-4" />
                Home
              </Link>
            </li>

            {["admin", "vendor"].includes(user.role) && (
              <li>
                <Link
                  href="/categories"
                  className={`flex items-center gap-2 ${
                    isActive("/categories") ? "text-primary font-semibold bg-primary/10" : "text-base-content hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <IconCategory className="h-4 w-4" />
                  Categories
                </Link>
              </li>
            )}

            {user.role === "vendor" ? (
              <li>
                <Link
                  href="/assets"
                  className={`flex items-center gap-2 ${
                    isActive("/assets") ? "text-primary font-semibold bg-primary/10" : "text-base-content hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <IconBoxSeam className="h-4 w-4" />
                  My Assets
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  href="/assets"
                  className={`flex items-center gap-2 ${
                    isActive("/assets") ? "text-primary font-semibold bg-primary/10" : "text-base-content hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <IconTruck className="h-4 w-4" />
                  Assets
                </Link>
              </li>
            )}

            {user.role === "admin" && (
              <li>
                <Link
                  href="/users"
                  className={`flex items-center gap-2 ${
                    isActive("/users") ? "text-primary font-semibold bg-primary/10" : "text-base-content hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <IconUsers className="h-4 w-4" />
                  Users
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-base-content">
              Welcome, {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm text-error gap-2 hover:bg-error/10"
            >
              <IconLogout className="h-4 w-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login">
              <button className="btn btn-ghost btn-sm">Login</button>
            </Link>
            <Link href="/register">
              <button className="btn btn-primary btn-sm">Register</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
