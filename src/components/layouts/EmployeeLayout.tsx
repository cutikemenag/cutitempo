import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarDays, FileText, User, Menu, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";

const Sidebar = ({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: CalendarDays, label: "Pengajuan Cuti", path: "/employee" },
    { icon: FileText, label: "Riwayat Cuti", path: "/employee/history" },
    { icon: User, label: "Profil", path: "/employee/profile" },
  ];

  const MenuItem = ({
    icon: Icon,
    label,
    path,
  }: {
    icon: any;
    label: string;
    path: string;
  }) => {
    const isActive = location.pathname === path;

    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          isActive && "bg-gray-100",
          collapsed ? "px-2" : "px-4",
        )}
        onClick={() => navigate(path)}
      >
        <Icon className="h-5 w-5" />
        {!collapsed && <span>{label}</span>}
      </Button>
    );
  };

  return (
    <div
      className={cn(
        "fixed left-0 h-[calc(100vh-5rem)] border-r bg-white transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[240px]",
      )}
    >
      <div className="flex h-full flex-col gap-2 p-2">
        <Button
          variant="ghost"
          size="icon"
          className="self-end"
          onClick={onToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
          />
        ))}
        <div className="flex-1" />
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-red-600 hover:text-red-700",
            collapsed ? "px-2" : "px-4",
          )}
          onClick={() => auth.signOut()}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Keluar</span>}
        </Button>
      </div>
    </div>
  );
};

const EmployeeLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="h-20 bg-white border-b px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Portal Cuti Digital</h1>
            <p className="text-sm text-gray-500">
              Kementerian Agama Kota Gorontalo
            </p>
          </div>
        </div>
      </header>
      <div className="flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main
          className={cn(
            "flex-1 p-6 transition-all duration-300",
            sidebarCollapsed ? "ml-[60px]" : "ml-[240px]",
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
