"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  IconHome,
  IconLogout,
  IconCategory,
  IconBoxSeam,
  IconTruck,
  IconUsers,
  IconMenu2,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function Navigation() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const pathname = usePathname();
  const { user, authLogout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    authLogout();
  };

  const NavigationLinks = () => (
    <ul className="menu menu-vertical lg:menu-horizontal gap-4">
      <li>
        <Link
          href="/"
          className={`flex items-center gap-2 ${
            isActive("/")
              ? "text-base-content font-semibold bg-primary/20 hover:bg-primary/25 underline underline-offset-4"
              : "text-base-content hover:bg-base-200"
          }`}
        >
          <IconHome className="h-4 w-4" />
          Home
        </Link>
      </li>

      {user && ["admin", "vendor"].includes(user.role) && (
        <li>
          <Link
            href="/categories"
            className={`flex items-center gap-2 ${
              isActive("/categories")
                ? "text-base-content font-semibold bg-primary/20 hover:bg-primary/25 underline underline-offset-4"
                : "text-base-content hover:bg-base-200"
            }`}
          >
            <IconCategory className="h-4 w-4" />
            Categories
          </Link>
        </li>
      )}

      {user &&
        (user.role === "vendor" ? (
          <li>
            <Link
              href="/assets"
              className={`flex items-center gap-2 ${
                isActive("/assets")
                  ? "text-base-content font-semibold bg-primary/20 hover:bg-primary/25 underline underline-offset-4"
                  : "text-base-content hover:bg-base-200"
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
                isActive("/assets")
                  ? "text-base-content font-semibold bg-primary/20 hover:bg-primary/25 underline underline-offset-4"
                  : "text-base-content hover:bg-base-200"
              }`}
            >
              <IconTruck className="h-4 w-4" />
              Assets
            </Link>
          </li>
        ))}

      {user && user.role === "admin" && (
        <li>
          <Link
            href="/users"
            className={`flex items-center gap-2 ${
              isActive("/users")
                ? "text-base-content font-semibold bg-primary/20 hover:bg-primary/25 underline underline-offset-4"
                : "text-base-content hover:bg-base-200"
            }`}
          >
            <IconUsers className="h-4 w-4" />
            Users
          </Link>
        </li>
      )}
    </ul>
  );

  return (
    <div className="drawer">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30">
          <div className="navbar-start">
            {user && (
            <label
              htmlFor="nav-drawer"
              className="btn btn-ghost drawer-button lg:hidden"
            >
              <IconMenu2 className="h-5 w-5 text-base-content" />
            </label>
            )}
            <Link href="/" className="flex items-center space-x-2">
              <IconTruck className="h-6 w-6 text-base-content" />
              <span className="text-xl font-bold text-base-content">
                Asset Management
              </span>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            {user && <NavigationLinks />}
          </div>

          <div className="navbar-end">
            <button
              onClick={toggleTheme}
              className="btn btn-circle btn-sm mr-2"
            >
              {theme === 'light' ? (
                <IconMoon className="h-4 w-4 text-base-content" />
              ) : (
                <IconSun className="h-4 w-4" />
              )}
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-base-content hidden sm:inline">
                  Welcome, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm text-error gap-2 hover:bg-error/10"
                >
                  <IconLogout className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <button className="btn btn-primary btn-sm">Login</button>
                </Link>
                <Link href="/register">
                  <button className="btn btn-primary btn-sm">Register</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="drawer-side z-40">
        <label htmlFor="nav-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200">
          {user && <NavigationLinks />}
        </div>
      </div>
    </div>
  );
}

export default Navigation;
