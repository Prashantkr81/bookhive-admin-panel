import {
  Bell,
  LogOut,
  Menu,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const { admin, logout } = useAuth();

  const [profileOpen, setProfileOpen] =
    useState(false);

  async function handleLogout() {
    await logout();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-sm font-medium text-slate-900">
            Admin Panel
          </p>

          <p className="hidden text-xs text-slate-400 sm:block">
            BookHive Management
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative">
          <button
            onClick={() =>
              setProfileOpen((value) => !value)
            }
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
          >
            <UserCircle
              size={30}
              className="text-slate-500"
            />

            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-slate-800">
                {admin?.name || "Admin"}
              </p>

              <p className="text-xs capitalize text-slate-400">
                {admin?.role?.replace("_", " ") || "Admin"}
              </p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-sm font-medium text-slate-900">
                  {admin?.name}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {admin?.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}