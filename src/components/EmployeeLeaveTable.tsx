import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

type LeaveType =
  | "tahunan"
  | "sakit"
  | "melahirkan"
  | "besar"
  | "penting"
  | "luar-tanggungan";

interface LeaveData {
  id: string;
  employeeName: string;
  nip: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

interface EmployeeLeaveTableProps {
  data?: LeaveData[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getLeaveTypeBadgeColor = (type: LeaveType) => {
  const colors = {
    tahunan: "bg-blue-100 text-blue-800",
    sakit: "bg-red-100 text-red-800",
    melahirkan: "bg-pink-100 text-pink-800",
    besar: "bg-purple-100 text-purple-800",
    penting: "bg-yellow-100 text-yellow-800",
    "luar-tanggungan": "bg-gray-100 text-gray-800",
  };
  return colors[type];
};

const getStatusBadgeColor = (status: string) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return colors[status as keyof typeof colors];
};

const defaultData: LeaveData[] = [
  {
    id: "1",
    employeeName: "John Doe",
    nip: "198501012010011001",
    department: "Administration",
    leaveType: "tahunan",
    startDate: "2024-03-01",
    endDate: "2024-03-05",
    status: "approved",
  },
  {
    id: "2",
    employeeName: "Jane Smith",
    nip: "198601022010012002",
    department: "Finance",
    leaveType: "sakit",
    startDate: "2024-03-10",
    endDate: "2024-03-12",
    status: "pending",
  },
  {
    id: "3",
    employeeName: "Alice Johnson",
    nip: "198701032010013003",
    department: "HR",
    leaveType: "melahirkan",
    startDate: "2024-04-01",
    endDate: "2024-07-01",
    status: "approved",
  },
];

const EmployeeLeaveTable = ({
  data = defaultData,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
}: EmployeeLeaveTableProps) => {
  return (
    <div className="w-full bg-white rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Pegawai</TableHead>
            <TableHead>NIP</TableHead>
            <TableHead>Departemen</TableHead>
            <TableHead>Jenis Cuti</TableHead>
            <TableHead>Tanggal Mulai</TableHead>
            <TableHead>Tanggal Selesai</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.employeeName}</TableCell>
              <TableCell>{row.nip}</TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>
                <Badge className={getLeaveTypeBadgeColor(row.leaveType)}>
                  {row.leaveType.charAt(0).toUpperCase() +
                    row.leaveType.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{row.startDate}</TableCell>
              <TableCell>{row.endDate}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(row.status)}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(row.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(row.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(row.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeLeaveTable;
