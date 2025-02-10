import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Download, Plus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FilterSectionProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (type: string) => void;
  onExport?: () => void;
  onAddNew?: () => void;
}

const FilterSection = ({
  onSearch = () => {},
  onFilterChange = () => {},
  onExport = () => {},
  onAddNew = () => {},
}: FilterSectionProps) => {
  const leaveTypes = [
    { value: "all", label: "Semua Jenis Cuti" },
    { value: "tahunan", label: "Cuti Tahunan" },
    { value: "sakit", label: "Cuti Sakit" },
    { value: "melahirkan", label: "Cuti Melahirkan" },
    { value: "besar", label: "Cuti Besar" },
    { value: "penting", label: "Cuti Alasan Penting" },
    { value: "luar-tanggungan", label: "Cuti Luar Tanggungan" },
  ];

  return (
    <div className="w-full bg-white p-4 border-b">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari berdasarkan nama, NIP, atau departemen..."
              className="pl-10"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Leave Type Filter */}
          <Select onValueChange={onFilterChange} defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Jenis Cuti" />
            </SelectTrigger>
            <SelectContent>
              {leaveTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {/* Export Button */}
          <Button
            variant="outline"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>

          {/* Add New Button */}
          <Button onClick={onAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Kartu Cuti
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
