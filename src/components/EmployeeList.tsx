import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Employee {
  id: string;
  name: string;
  nip: string;
  email: string;
  department: string;
  leaveBalances: {
    tahunan: { total: number; used: number };
    sakit: { total: number; used: number };
    penting: { total: number; used: number };
  };
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const employeeData: Employee[] = [];

        snapshot.forEach((doc) => {
          employeeData.push({ id: doc.id, ...doc.data() } as Employee);
        });

        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Memuat data pegawai...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>NIP</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Departemen</TableHead>
          <TableHead>Sisa Cuti Tahunan</TableHead>
          <TableHead>Sisa Cuti Sakit</TableHead>
          <TableHead>Sisa Cuti Penting</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              Belum ada data pegawai
            </TableCell>
          </TableRow>
        ) : (
          employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.nip}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                {employee.leaveBalances.tahunan.total -
                  employee.leaveBalances.tahunan.used}{" "}
                hari
              </TableCell>
              <TableCell>
                {employee.leaveBalances.sakit.total -
                  employee.leaveBalances.sakit.used}{" "}
                hari
              </TableCell>
              <TableCell>
                {employee.leaveBalances.penting.total -
                  employee.leaveBalances.penting.used}{" "}
                hari
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default EmployeeList;
