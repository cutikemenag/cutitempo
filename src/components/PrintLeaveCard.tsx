import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Printer } from "lucide-react";

interface LeaveHistory {
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: "approved" | "rejected" | "pending";
}

interface PrintLeaveCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeData?: {
    name: string;
    nip: string;
    department: string;
    leaveHistory: LeaveHistory[];
  };
}

const PrintLeaveCard = ({
  open,
  onOpenChange,
  employeeData = {
    name: "John Doe",
    nip: "198501012010011001",
    department: "IT",
    leaveHistory: [
      {
        type: "Cuti Tahunan",
        startDate: "2024-01-15",
        endDate: "2024-01-20",
        duration: 5,
        status: "approved",
      },
      {
        type: "Cuti Sakit",
        startDate: "2024-02-10",
        endDate: "2024-02-12",
        duration: 2,
        status: "approved",
      },
    ],
  },
}: PrintLeaveCardProps) => {
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear().toString(),
  );

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year.toString();
  });

  const calculateTotalLeave = (type: string) => {
    return employeeData.leaveHistory
      .filter(
        (leave) =>
          leave.status === "approved" &&
          leave.type === type &&
          new Date(leave.startDate).getFullYear().toString() === selectedYear,
      )
      .reduce((acc, curr) => acc + curr.duration, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader>
          <DialogTitle>Kartu Cuti Pegawai</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Year Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tahun:</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <p className="text-sm text-gray-500">Nama Pegawai</p>
              <p className="font-medium">{employeeData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">NIP</p>
              <p className="font-medium">{employeeData.nip}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Departemen</p>
              <p className="font-medium">{employeeData.department}</p>
            </div>
          </div>

          {/* Leave Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-3">
              <p className="text-sm text-gray-500">Cuti Tahunan</p>
              <p className="text-xl font-bold">
                {calculateTotalLeave("Cuti Tahunan")} / 12
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-gray-500">Cuti Sakit</p>
              <p className="text-xl font-bold">
                {calculateTotalLeave("Cuti Sakit")} / 14
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-gray-500">Cuti Penting</p>
              <p className="text-xl font-bold">
                {calculateTotalLeave("Cuti Penting")} / 10
              </p>
            </div>
          </div>

          {/* Leave History */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              Riwayat Cuti {selectedYear}
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis Cuti</TableHead>
                  <TableHead>Tanggal Mulai</TableHead>
                  <TableHead>Tanggal Selesai</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeData.leaveHistory
                  .filter(
                    (leave) =>
                      new Date(leave.startDate).getFullYear().toString() ===
                      selectedYear,
                  )
                  .map((leave, index) => (
                    <TableRow key={index}>
                      <TableCell>{leave.type}</TableCell>
                      <TableCell>{leave.startDate}</TableCell>
                      <TableCell>{leave.endDate}</TableCell>
                      <TableCell>{leave.duration} hari</TableCell>
                      <TableCell>
                        <Badge
                          className={{
                            "bg-green-100 text-green-800":
                              leave.status === "approved",
                            "bg-yellow-100 text-yellow-800":
                              leave.status === "pending",
                            "bg-red-100 text-red-800":
                              leave.status === "rejected",
                          }}
                        >
                          {leave.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Cetak Kartu Cuti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintLeaveCard;
