import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pengaturan</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifikasi</Label>
                <div className="text-sm text-gray-500">
                  Kirim notifikasi email untuk setiap pengajuan cuti baru
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifikasi Status</Label>
                <div className="text-sm text-gray-500">
                  Kirim notifikasi saat status cuti berubah
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kuota Cuti Default</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Cuti Tahunan</Label>
                <Input type="number" placeholder="12" />
              </div>
              <div className="grid gap-2">
                <Label>Cuti Sakit</Label>
                <Input type="number" placeholder="14" />
              </div>
              <div className="grid gap-2">
                <Label>Cuti Melahirkan</Label>
                <Input type="number" placeholder="90" />
              </div>
              <Button>Simpan Perubahan</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departemen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex gap-2">
                <Input placeholder="Nama departemen baru" />
                <Button>Tambah</Button>
              </div>
              <div className="space-y-2">
                {["IT", "HR", "Finance", "Marketing"].map((dept) => (
                  <div
                    key={dept}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span>{dept}</span>
                    <Button variant="destructive" size="sm">
                      Hapus
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
