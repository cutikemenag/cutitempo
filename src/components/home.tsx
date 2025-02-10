import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import FilterSection from "./FilterSection";
import EmployeeLeaveTable from "./EmployeeLeaveTable";
import LeaveCardDialog from "./LeaveCardDialog";
import LeaveCardDetails from "./LeaveCardDetails";

const Home = () => {
  const [showLeaveCardDialog, setShowLeaveCardDialog] = useState(false);
  const [showLeaveCardDetails, setShowLeaveCardDetails] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  const handleAddNew = () => {
    setDialogMode("add");
    setShowLeaveCardDialog(true);
  };

  const handleEdit = (id: string) => {
    setSelectedLeaveId(id);
    setDialogMode("edit");
    setShowLeaveCardDialog(true);
  };

  const handleView = (id: string) => {
    setSelectedLeaveId(id);
    setShowLeaveCardDetails(true);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality
    console.log("Delete leave card:", id);
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
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />

      <main className="container mx-auto py-6 px-4">
        <FilterSection
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          onAddNew={handleAddNew}
        />

        <div className="mt-6">
          <EmployeeLeaveTable
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <LeaveCardDialog
          open={showLeaveCardDialog}
          onOpenChange={setShowLeaveCardDialog}
          mode={dialogMode}
        />

        <LeaveCardDetails
          open={showLeaveCardDetails}
          onOpenChange={setShowLeaveCardDetails}
        />
      </main>
    </div>
  );
};

export default Home;
