import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  UtensilsCrossed,
  PlusCircle,
  LogOut,
  Menu,
  X,
  ScrollText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-amber-700 to-amber-800 shadow-lg relative">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-white"
            onClick={closeMenu}
          >
            <UtensilsCrossed className="h-8 w-8" />
            <span className="hidden sm:inline font-serif">
              Kitchen Keepsakes
            </span>
          </NavLink>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 text-white hover:text-amber-200 transition-colors ${
                  isActive ? "text-amber-200 font-medium" : ""
                }`
              }
            >
              <ScrollText className="h-5 w-5" />
              <span>Recipes</span>
            </NavLink>

            <NavLink
              to="/add"
              className={({ isActive }) =>
                `flex items-center gap-2 text-white hover:text-amber-200 transition-colors ${
                  isActive ? "text-amber-200 font-medium" : ""
                }`
              }
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Recipe</span>
            </NavLink>

            {/* User info and logout */}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-amber-600/50">
              <span className="text-sm text-amber-100">{user?.username}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-white hover:text-amber-200 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-white hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile navigation */}
        <div
          className={`absolute left-0 right-0 bg-amber-800 md:hidden shadow-lg transition-all duration-300 z-50 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-amber-700/50 transition-colors ${
                  isActive ? "bg-amber-700/50 font-medium" : ""
                }`
              }
              onClick={closeMenu}
            >
              <ScrollText className="h-5 w-5" />
              <span>Recipes</span>
            </NavLink>

            <NavLink
              to="/add"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-amber-700/50 transition-colors ${
                  isActive ? "bg-amber-700/50 font-medium" : ""
                }`
              }
              onClick={closeMenu}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Recipe</span>
            </NavLink>

            {/* Mobile user info and logout */}
            <div className="border-t border-amber-700/50 pt-4 mt-4">
              <div className="px-4 py-2 text-amber-200 font-medium">
                {user?.username}
              </div>
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-white hover:bg-amber-700/50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
