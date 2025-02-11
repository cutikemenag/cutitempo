import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Pencil, Printer } from "lucide-react";

interface LeaveBalance {
  type: string;
  used: number;
  total: number;
}

interface EmployeeData {
  id: string;
  name: string;
  nip: string;
  department: string;
  leaveBalances: LeaveBalance[];
}

interface EmployeeLeaveTableProps {
  data?: EmployeeData[];
  onEdit?: (id: string) => void;
  onPrintLeaveCard?: (id: string) => void;
}

const defaultData: EmployeeData[] = [
  {
    id: "1",
    name: "John Doe",
    nip: "198501012010011001",
    department: "Administration",
    leaveBalances: [
      { type: "Cuti Tahunan", used: 5, total: 12 },
      { type: "Cuti Sakit", used: 2, total: 14 },
      { type: "Cuti Penting", used: 0, total: 10 },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    nip: "198601022010012002",
    department: "Finance",
    leaveBalances: [
      { type: "Cuti Tahunan", used: 8, total: 12 },
      { type: "Cuti Sakit", used: 0, total: 14 },
      { type: "Cuti Penting", used: 2, total: 10 },
    ],
  },
];

const EmployeeLeaveTable = ({
  data = defaultData,
  onEdit = () => {},
  onPrintLeaveCard = () => {},
}: EmployeeLeaveTableProps) => {
  return (
    <div className="w-full bg-white rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Pegawai</TableHead>
            <TableHead>NIP</TableHead>
            <TableHead>Departemen</TableHead>
            <TableHead>Sisa Cuti Tahunan</TableHead>
            <TableHead>Sisa Cuti Sakit</TableHead>
            <TableHead>Sisa Cuti Penting</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.nip}</TableCell>
              <TableCell>{row.department}</TableCell>
              {row.leaveBalances.map((balance) => (
                <TableCell key={balance.type}>
                  <span className="font-medium">
                    {balance.total - balance.used}
                  </span>
                  <span className="text-gray-500"> / {balance.total}</span>
                </TableCell>
              ))}
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(row.id)}
                    title="Edit Data Pegawai"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPrintLeaveCard(row.id)}
                    title="Cetak Kartu Cuti"
                  >
                    <Printer className="h-4 w-4" />
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
