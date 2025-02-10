import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface LeaveCardDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: "add" | "edit";
  initialData?: {
    employeeName: string;
    employeeId: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    reason: string;
  };
}

const LeaveCardDialog = ({
  open = true,
  onOpenChange = () => {},
  mode = "add",
  initialData = {
    employeeName: "",
    employeeId: "",
    leaveType: "",
    startDate: new Date(),
    endDate: new Date(),
    reason: "",
  },
}: LeaveCardDialogProps) => {
  const [startDate, setStartDate] = React.useState<Date>(initialData.startDate);
  const [endDate, setEndDate] = React.useState<Date>(initialData.endDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Tambah Kartu Cuti" : "Edit Kartu Cuti"}
          </DialogTitle>
          <DialogDescription>
            Isi detail di bawah untuk {mode === "add" ? "membuat" : "mengubah"}{" "}
            kartu cuti pegawai.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employeeName" className="text-right">
              Nama Pegawai
            </Label>
            <Input
              id="employeeName"
              defaultValue={initialData.employeeName}
              className="col-span-3"
              placeholder="Masukkan nama pegawai"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employeeId" className="text-right">
              NIP
            </Label>
            <Input
              id="employeeId"
              defaultValue={initialData.employeeId}
              className="col-span-3"
              placeholder="Masukkan NIP"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leaveType" className="text-right">
              Jenis Cuti
            </Label>
            <Select defaultValue={initialData.leaveType}>
              <SelectTrigger className="col-span-3">
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tanggal Mulai</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="col-span-3 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tanggal Selesai</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="col-span-3 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Alasan
            </Label>
            <Textarea
              id="reason"
              defaultValue={initialData.reason}
              className="col-span-3"
              placeholder="Masukkan alasan cuti"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit">{mode === "add" ? "Buat" : "Perbarui"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveCardDialog;
