import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import DashboardHeader from "../DashboardHeader";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Users, CalendarDays, FileText, Settings, Menu } from "lucide-react";

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
    { icon: Users, label: "Data Pegawai", path: "/" },
    { icon: CalendarDays, label: "Manajemen Cuti", path: "/leave-management" },
    { icon: FileText, label: "Laporan", path: "/reports" },
    { icon: Settings, label: "Pengaturan", path: "/settings" },
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
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
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

export default AdminLayout;
