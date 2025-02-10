import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CalendarDays, Clock, FileText, User } from "lucide-react";

interface LeaveHistory {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "approved" | "pending" | "rejected";
  duration: number;
  reason: string;
}

interface LeaveBalance {
  type: string;
  n: number; // Current year balance
  nMinus1: number; // Previous year balance
  nMinus2: number; // Two years ago balance
  total: number;
}

interface LeaveCardDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  employeeName?: string;
  employeeId?: string;
  department?: string;
  leaveHistory?: LeaveHistory[];
  leaveBalance?: LeaveBalance[];
}

const defaultLeaveHistory: LeaveHistory[] = [
  {
    id: "1",
    type: "Cuti Tahunan",
    startDate: "2024-03-01",
    endDate: "2024-03-05",
    status: "approved",
    duration: 5,
    reason: "Liburan keluarga",
  },
  {
    id: "2",
    type: "Cuti Sakit",
    startDate: "2024-02-15",
    endDate: "2024-02-16",
    status: "approved",
    duration: 2,
    reason: "Demam",
  },
];

const defaultLeaveBalance: LeaveBalance[] = [
  { type: "Cuti Tahunan", n: 12, nMinus1: 6, nMinus2: 0, total: 18 },
  { type: "Cuti Sakit", n: 12, nMinus1: 0, nMinus2: 0, total: 12 },
  { type: "Cuti Melahirkan", n: 90, nMinus1: 0, nMinus2: 0, total: 90 },
  { type: "Cuti Besar", n: 90, nMinus1: 0, nMinus2: 0, total: 90 },
  { type: "Cuti Alasan Penting", n: 60, nMinus1: 0, nMinus2: 0, total: 60 },
  { type: "Cuti Luar Tanggungan", n: 365, nMinus1: 0, nMinus2: 0, total: 365 },
];

const LeaveCardDetails = ({
  open = true,
  onOpenChange,
  employeeName = "John Doe",
  employeeId = "198501012015051001",
  department = "Administrasi",
  leaveHistory = defaultLeaveHistory,
  leaveBalance = defaultLeaveBalance,
}: LeaveCardDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle>Detail Kartu Cuti</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Employee Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Pegawai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Pegawai</p>
                  <p className="font-medium">{employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NIP</p>
                  <p className="font-medium">{employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departemen</p>
                  <p className="font-medium">{department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Sisa Cuti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {leaveBalance.map((balance) => (
                  <div key={balance.type} className="p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-500">
                      {balance.type}
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>N (Tahun ini):</span>
                        <span className="font-medium">{balance.n} hari</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>N-1 (Tahun lalu):</span>
                        <span className="font-medium">
                          {balance.nMinus1} hari
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>N-2 (2 tahun lalu):</span>
                        <span className="font-medium">
                          {balance.nMinus2} hari
                        </span>
                      </div>
                      <div className="pt-1 border-t">
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Total:</span>
                          <span>{balance.total} hari</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leave History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Riwayat Cuti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {leaveHistory.map((history) => (
                    <div key={history.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{history.type}</h4>
                          <p className="text-sm text-gray-500">
                            {history.startDate} - {history.endDate} (
                            {history.duration} hari)
                          </p>
                        </div>
                        <Badge className={getStatusColor(history.status)}>
                          {history.status}
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-500 mt-1" />
                        <p className="text-sm text-gray-600">
                          {history.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveCardDetails;
