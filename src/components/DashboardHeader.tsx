import React, { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bell, LogOut, Menu, Plus } from "lucide-react";
import { auth } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DashboardHeaderProps {
  adminName?: string;
  adminRole?: string;
  onLogout?: () => void;
  onMenuClick?: () => void;
}

import AddEmployeeDialog from "./AddEmployeeDialog";

const DashboardHeader = ({
  adminName = "Admin User",
  adminRole = "System Administrator",
  onLogout = () => {
    auth.signOut();
    console.log("Logged out");
  },
  onMenuClick = () => console.log("Menu clicked"),
}: DashboardHeaderProps) => {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900">
              Kartu Cuti Digital
            </h1>
            <p className="text-sm text-gray-500">
              Kementerian Agama Kota Gorontalo
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminName}`}
                  alt={adminName}
                />
                <AvatarFallback>
                  {adminName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{adminName}</span>
                <span className="text-xs text-gray-500">{adminRole}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowAddEmployee(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Tambah Pegawai</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AddEmployeeDialog
        open={showAddEmployee}
        onOpenChange={setShowAddEmployee}
      />
    </header>
  );
};

export default DashboardHeader;
