import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Search } from "lucide-react";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LeaveRequest {
  id: string;
  userId: string;
  userName?: string;
  department?: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  adminNote?: string;
  createdAt: any;
}

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const leaveRef = collection(db, "leave_requests");
      const leaveSnapshot = await getDocs(leaveRef);
      const requests: LeaveRequest[] = [];

      for (const leaveDoc of leaveSnapshot.docs) {
        const leaveData = leaveDoc.data() as LeaveRequest;
        // Fetch user details
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", leaveData.userId));
        const userSnapshot = await getDocs(q);
        const userData = userSnapshot.docs[0]?.data();

        requests.push({
          id: leaveDoc.id,
          ...leaveData,
          userName: userData?.name || "Unknown",
          department: userData?.department || "Unknown",
        });
      }

      setLeaveRequests(requests);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    requestId: string,
    newStatus: "approved" | "rejected",
  ) => {
    try {
      const leaveRef = doc(db, "leave_requests", requestId);
      await updateDoc(leaveRef, {
        status: newStatus,
        adminNote: adminNote,
        updatedAt: new Date(),
      });

      // Update local state
      setLeaveRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? { ...request, status: newStatus, adminNote }
            : request,
        ),
      );

      // Update user's leave balance if approved
      if (newStatus === "approved" && selectedRequest) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", selectedRequest.userId));
        const userSnapshot = await getDocs(q);
        const userDoc = userSnapshot.docs[0];

        if (userDoc) {
          const userData = userDoc.data();
          const leaveType = selectedRequest.type;
          const startDate = new Date(selectedRequest.startDate);
          const endDate = new Date(selectedRequest.endDate);
          const duration =
            Math.ceil(
              (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
            ) + 1;

          const updatedBalance = {
            ...userData.leaveBalances,
            [leaveType]: {
              ...userData.leaveBalances[leaveType],
              used: userData.leaveBalances[leaveType].used + duration,
            },
          };

          await updateDoc(doc(db, "users", userDoc.id), {
            leaveBalances: updatedBalance,
          });
        }
      }

      setShowDetailDialog(false);
      setSelectedRequest(null);
      setAdminNote("");
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  };

  const handleViewDetail = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setAdminNote(request.adminNote || "");
    setShowDetailDialog(true);
  };

  const filteredRequests = leaveRequests
    .filter(
      (request) => statusFilter === "all" || request.status === statusFilter,
    )
    .filter(
      (request) =>
        request.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.department?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manajemen Cuti</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari nama pegawai..."
              className="pl-9 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengajuan Cuti</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead>Jenis Cuti</TableHead>
                <TableHead>Tanggal Mulai</TableHead>
                <TableHead>Tanggal Selesai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Tidak ada pengajuan cuti
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.userName}</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.startDate}</TableCell>
                    <TableCell>{request.endDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={{
                          "bg-yellow-100 text-yellow-800":
                            request.status === "pending",
                          "bg-green-100 text-green-800":
                            request.status === "approved",
                          "bg-red-100 text-red-800":
                            request.status === "rejected",
                        }}
                      >
                        {request.status === "pending" && "Menunggu"}
                        {request.status === "approved" && "Disetujui"}
                        {request.status === "rejected" && "Ditolak"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetail(request)}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan Cuti</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Nama Pegawai</Label>
                <div className="font-medium">{selectedRequest.userName}</div>
              </div>
              <div className="grid gap-2">
                <Label>Departemen</Label>
                <div className="font-medium">{selectedRequest.department}</div>
              </div>
              <div className="grid gap-2">
                <Label>Jenis Cuti</Label>
                <div className="font-medium">{selectedRequest.type}</div>
              </div>
              <div className="grid gap-2">
                <Label>Periode</Label>
                <div className="font-medium">
                  {selectedRequest.startDate} s/d {selectedRequest.endDate}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Alasan Cuti</Label>
                <div className="font-medium">{selectedRequest.reason}</div>
              </div>
              {selectedRequest.status === "pending" && (
                <div className="grid gap-2">
                  <Label>Catatan Admin</Label>
                  <Textarea
                    placeholder="Tambahkan catatan (opsional)"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>
              )}
              {selectedRequest.status !== "pending" &&
                selectedRequest.adminNote && (
                  <div className="grid gap-2">
                    <Label>Catatan Admin</Label>
                    <div className="font-medium">
                      {selectedRequest.adminNote}
                    </div>
                  </div>
                )}
              <DialogFooter className="flex gap-2">
                {selectedRequest.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(selectedRequest.id, "rejected")
                      }
                      className="bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Tolak
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusChange(selectedRequest.id, "approved")
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Setujui
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagement;
