import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
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
import SignaturePad from "./SignaturePad";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

const EmployeeDashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaveType, setLeaveType] = useState("tahunan");
  const [reason, setReason] = useState("");
  const [workUnit, setWorkUnit] = useState("");
  const [workDuration, setWorkDuration] = useState("");
  const [leaveDuration, setLeaveDuration] = useState("");
  const [leaveAddress, setLeaveAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorNip, setSupervisorNip] = useState("");
  const [headOfficeName, setHeadOfficeName] = useState("");
  const [headOfficeNip, setHeadOfficeNip] = useState("");
  const [signature, setSignature] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setUserData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      if (!auth.currentUser) return;

      setLoading(true);
      try {
        const leaveRef = collection(db, "leave_requests");
        const q = query(leaveRef, where("userId", "==", auth.currentUser.uid));

        const querySnapshot = await getDocs(q);
        const leaves: LeaveRequest[] = [];

        querySnapshot.forEach((doc) => {
          leaves.push({ id: doc.id, ...doc.data() } as LeaveRequest);
        });

        setLeaveHistory(leaves);
      } catch (error) {
        console.error("Error fetching leave history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !auth.currentUser) return;

    try {
      const leaveRef = collection(db, "leave_requests");
      const newLeave = {
        userId: auth.currentUser.uid,
        userName: userData?.name,
        type: leaveType,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        status: "pending",
        reason,
        workUnit,
        workDuration,
        leaveDuration,
        leaveAddress,
        phoneNumber,
        supervisorName,
        supervisorNip,
        headOfficeName,
        headOfficeNip,
        signature,
        submissionDate: format(new Date(), "yyyy-MM-dd"),
        createdAt: Timestamp.now(),
      };

      await addDoc(leaveRef, newLeave);

      // Reset form
      setStartDate(undefined);
      setEndDate(undefined);
      setReason("");
      setLeaveType("tahunan");
      setWorkUnit("");
      setWorkDuration("");
      setLeaveDuration("");
      setLeaveAddress("");
      setPhoneNumber("");
      setSupervisorName("");
      setSupervisorNip("");
      setHeadOfficeName("");
      setHeadOfficeNip("");
      setSignature("");
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pengajuan Cuti</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulir Pengajuan Cuti</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Tanggal Pengajuan</Label>
                <Input value={format(new Date(), "yyyy-MM-dd")} disabled />
              </div>

              <div className="grid gap-2">
                <Label>Nama Pegawai</Label>
                <Input value={userData?.name || ""} disabled />
              </div>

              <div className="grid gap-2">
                <Label>Unit Kerja</Label>
                <Input
                  placeholder="Masukkan unit kerja"
                  value={workUnit}
                  onChange={(e) => setWorkUnit(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Masa Kerja</Label>
                <Input
                  placeholder="Masukkan masa kerja"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Jenis Cuti</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis cuti" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tahunan">Cuti Tahunan</SelectItem>
                    <SelectItem value="sakit">Cuti Sakit</SelectItem>
                    <SelectItem value="melahirkan">Cuti Melahirkan</SelectItem>
                    <SelectItem value="besar">Cuti Besar</SelectItem>
                    <SelectItem value="penting">Cuti Alasan Penting</SelectItem>
                    <SelectItem value="luar-tanggungan">
                      Cuti Luar Tanggungan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Alasan Cuti</Label>
                <Textarea
                  placeholder="Jelaskan alasan pengajuan cuti"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Lama Cuti (Hari)</Label>
                <Input
                  type="number"
                  placeholder="Masukkan lama cuti"
                  value={leaveDuration}
                  onChange={(e) => setLeaveDuration(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Tanggal Mulai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label>Tanggal Selesai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label>Alamat Selama Cuti</Label>
                <Textarea
                  placeholder="Masukkan alamat selama cuti"
                  value={leaveAddress}
                  onChange={(e) => setLeaveAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Nomor HP</Label>
                <Input
                  type="tel"
                  placeholder="Masukkan nomor HP"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Nama Atasan Langsung</Label>
                <Input
                  placeholder="Masukkan nama atasan langsung"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>NIP Atasan Langsung</Label>
                <Input
                  placeholder="Masukkan NIP atasan langsung"
                  value={supervisorNip}
                  onChange={(e) => setSupervisorNip(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Nama Kepala Kantor</Label>
                <Input
                  placeholder="Masukkan nama kepala kantor"
                  value={headOfficeName}
                  onChange={(e) => setHeadOfficeName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>NIP Kepala Kantor</Label>
                <Input
                  placeholder="Masukkan NIP kepala kantor"
                  value={headOfficeNip}
                  onChange={(e) => setHeadOfficeNip(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Tanda Tangan</Label>
                <SignaturePad onChange={setSignature} />
              </div>

              <Button type="submit" className="w-full">
                Ajukan Cuti
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengajuan Cuti</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis Cuti</TableHead>
                <TableHead>Tanggal Mulai</TableHead>
                <TableHead>Tanggal Selesai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Alasan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : leaveHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Tidak ada data cuti
                  </TableCell>
                </TableRow>
              ) : (
                leaveHistory.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{leave.startDate}</TableCell>
                    <TableCell>{leave.endDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={{
                          "bg-yellow-100 text-yellow-800":
                            leave.status === "pending",
                          "bg-green-100 text-green-800":
                            leave.status === "approved",
                          "bg-red-100 text-red-800":
                            leave.status === "rejected",
                        }}
                      >
                        {leave.status === "pending" && "Menunggu"}
                        {leave.status === "approved" && "Disetujui"}
                        {leave.status === "rejected" && "Ditolak"}
                      </Badge>
                    </TableCell>
                    <TableCell>{leave.reason}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
