import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });
  const [employeeForm, setEmployeeForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent, isAdmin: boolean) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { email, password } = isAdmin ? adminForm : employeeForm;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      const isUserAdmin = user.email?.endsWith("@tolopani.net") || false;

      if (isAdmin && !isUserAdmin) {
        throw new Error("Unauthorized access to admin panel");
      }

      console.log("Login successful");
      navigate(isAdmin ? "/" : "/employee");
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.message === "Unauthorized access to admin panel") {
        setError("Anda tidak memiliki akses ke panel admin");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("Domain tidak diizinkan. Silakan hubungi administrator.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email tidak valid");
      } else if (err.code === "auth/user-disabled") {
        setError("Akun telah dinonaktifkan");
      } else if (err.code === "auth/user-not-found") {
        setError("Email tidak terdaftar");
      } else if (err.code === "auth/wrong-password") {
        setError("Password salah");
      } else {
        setError("Terjadi kesalahan: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const LoginForm = ({ isAdmin }: { isAdmin: boolean }) => {
    const { email, password } = isAdmin ? adminForm : employeeForm;
    const setForm = isAdmin ? setAdminForm : setEmployeeForm;

    const handleChange = useCallback(
      (field: "email" | "password", value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
      },
      [setForm],
    );

    return (
      <form onSubmit={(e) => handleLogin(e, isAdmin)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={isAdmin ? "admin-email" : "employee-email"}>
            Email
          </Label>
          <Input
            id={isAdmin ? "admin-email" : "employee-email"}
            type="email"
            placeholder={`Masukkan email ${isAdmin ? "admin" : "pegawai"}`}
            value={email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            autoComplete={isAdmin ? "admin-email" : "employee-email"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={isAdmin ? "admin-password" : "employee-password"}>
            Password
          </Label>
          <Input
            id={isAdmin ? "admin-password" : "employee-password"}
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            autoComplete={
              isAdmin ? "admin-current-password" : "current-password"
            }
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Memuat..." : "Masuk"}
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Sistem Kartu Cuti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employee" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="employee">Pegawai</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="employee" className="mt-0">
                <LoginForm isAdmin={false} />
              </TabsContent>
              <TabsContent value="admin" className="mt-0">
                <LoginForm isAdmin={true} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
