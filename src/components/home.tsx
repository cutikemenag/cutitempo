import React, { useState } from "react";
import FilterSection from "./FilterSection";
import EmployeeLeaveTable from "./EmployeeLeaveTable";
import LeaveCardDialog from "./LeaveCardDialog";
import PrintLeaveCard from "./PrintLeaveCard";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        placeholder="Cari pegawai..."
        className="w-[300px] pl-9"
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  );
};

const Home = () => {
  const [showLeaveCardDialog, setShowLeaveCardDialog] = useState(false);
  const [showPrintLeaveCard, setShowPrintLeaveCard] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  const handleAddNew = () => {
    setDialogMode("add");
    setShowLeaveCardDialog(true);
  };

  const handleEdit = (id: string) => {
    setSelectedEmployeeId(id);
    setDialogMode("edit");
    setShowLeaveCardDialog(true);
  };

  const handlePrintLeaveCard = (id: string) => {
    setSelectedEmployeeId(id);
    setShowPrintLeaveCard(true);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const handleFilterChange = (type: string) => {
    console.log("Filter type:", type);
  };

  const handleExport = () => {
    console.log("Export to PDF");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Pegawai</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <FilterSection
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        onAddNew={handleAddNew}
      />

      <div className="mt-6">
        <EmployeeLeaveTable
          onEdit={handleEdit}
          onPrintLeaveCard={handlePrintLeaveCard}
        />
      </div>

      <LeaveCardDialog
        open={showLeaveCardDialog}
        onOpenChange={setShowLeaveCardDialog}
        mode={dialogMode}
      />

      <PrintLeaveCard
        open={showPrintLeaveCard}
        onOpenChange={setShowPrintLeaveCard}
      />
    </div>
  );
};

export default Home;
