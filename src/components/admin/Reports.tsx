import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";

const Reports = () => {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Laporan</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Cuti Pegawai</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Departemen</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih departemen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Departemen</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Periode</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "MMMM yyyy")
                    ) : (
                      <span>Pilih bulan</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Laporan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistik Cuti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-gray-500">
                    Total Cuti Diajukan
                  </div>
                  <div className="text-2xl font-bold">156</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-gray-500">Cuti Disetujui</div>
                  <div className="text-2xl font-bold text-green-600">142</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-gray-500">Cuti Ditolak</div>
                  <div className="text-2xl font-bold text-red-600">8</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-gray-500">
                    Menunggu Persetujuan
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">6</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
