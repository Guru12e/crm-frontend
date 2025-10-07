"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

export default function PayrollPage() {
  const [employees, setEmployees] = useState([]);
  const [editingPayrollId, setEditingPayrollId] = useState(null);
  const [payrollData, setPayrollData] = useState({});

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("Employees")
      .select("*")
      .order("name");

    if (error) return console.error("Error fetching employees:", error);
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const startEditPayroll = (emp) => {
    setEditingPayrollId(emp.id);
    setPayrollData({
      salary: emp.salary || 0,
      allowances: emp.allowances || { HRA: 0, Bonus: 0 },
      deductions: emp.deductions || { PF: 0, Tax: 0 },
      pf: 0,
      esi: 0,
    });
  };

  const updatePayrollField = (type, field, value) => {
    setPayrollData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: Number(value) },
    }));
  };

  // Calculate PF and ESI
  const calculatePFandESI = () => {
    const baseSalary = payrollData.salary || 0;
    const totalAllowances = Object.values(payrollData.allowances || {}).reduce(
      (a, b) => a + b,
      0
    );
    const totalDeductions = Object.values(payrollData.deductions || {}).reduce(
      (a, b) => a + b,
      0
    );
    const grossSalary = baseSalary + totalAllowances - totalDeductions;

    const pf = 0.12 * baseSalary;

    const esi =
      grossSalary < 21000 && employees.length > 10 ? 0.0075 * grossSalary : 0;

    return { pf, esi, grossSalary };
  };

  const savePayroll = async () => {
    const { pf, esi } = calculatePFandESI();
    if (!editingPayrollId) return;

    const { error } = await supabase
      .from("Employees")
      .update({ ...payrollData, pf, esi })
      .eq("id", editingPayrollId);

    if (error) toast.error("Error updating payroll");
    else {
      toast.success("Payroll updated!");
      setEditingPayrollId(null);
      fetchEmployees();
    }
  };

  const totalPay = (pay) =>
    (pay.salary || 0) +
    Object.values(pay.allowances || {}).reduce((a, b) => a + b, 0) -
    Object.values(pay.deductions || {}).reduce((a, b) => a + b, 0) -
    (pay.pf || 0) -
    (pay.esi || 0);

  const { pf, esi } = calculatePFandESI();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payroll Management</h1>

      <Card className="p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Employee</th>
              <th>Salary</th>
              <th>Last Paid</th>
              <th>Net Pay</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const empTotalPay =
                (emp.salary || 0) +
                Object.values(emp.allowances || {}).reduce((a, b) => a + b, 0) -
                Object.values(emp.deductions || {}).reduce((a, b) => a + b, 0) -
                (emp.pf || 0) -
                (emp.esi || 0);
              return (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{emp.name}</td>
                  <td>₹{emp.salary || 0}</td>
                  <td>{emp.last_paid || "Not Paid"}</td>
                  <td>₹{empTotalPay}</td>
                  <td>
                    <Button
                      size="sm"
                      className="mr-2 bg-blue-600 text-white"
                      onClick={() =>
                        editingPayrollId === emp.id
                          ? setEditingPayrollId(null)
                          : startEditPayroll(emp)
                      }
                    >
                      {editingPayrollId === emp.id ? "Close" : "Edit"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 text-white"
                      onClick={() => toast.info("Payslip generated (mock)")}
                    >
                      Generate Payslip
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {editingPayrollId && (
        <Card className="p-4 space-y-4 bg-gray-50 shadow-md">
          <h2 className="text-lg font-semibold">Edit Payroll Details</h2>

          <Input
            type="number"
            label="Salary"
            value={payrollData.salary}
            onChange={(e) =>
              setPayrollData({ ...payrollData, salary: Number(e.target.value) })
            }
          />

          <div>
            <h3 className="font-semibold">Allowances</h3>
            {Object.keys(payrollData.allowances).map((key) => (
              <Input
                key={key}
                type="number"
                label={key}
                value={payrollData.allowances[key]}
                onChange={(e) =>
                  updatePayrollField("allowances", key, e.target.value)
                }
              />
            ))}
          </div>

          <div>
            <h3 className="font-semibold">Deductions</h3>
            {Object.keys(payrollData.deductions).map((key) => (
              <Input
                key={key}
                type="number"
                label={key}
                value={payrollData.deductions[key]}
                onChange={(e) =>
                  updatePayrollField("deductions", key, e.target.value)
                }
              />
            ))}
          </div>

          <div className="space-y-1">
            <p>PF (12% of salary): ₹{pf.toFixed(2)}</p>
            <p>ESI (0.75% of gross): ₹{esi.toFixed(2)}</p>
            <p>
              <strong>
                Net Pay: ₹
                {(
                  payrollData.salary +
                  Object.values(payrollData.allowances).reduce(
                    (a, b) => a + b,
                    0
                  ) -
                  Object.values(payrollData.deductions).reduce(
                    (a, b) => a + b,
                    0
                  ) -
                  pf -
                  esi
                ).toFixed(2)}
              </strong>
            </p>
          </div>

          <Button
            className="bg-green-600 text-white w-full"
            onClick={savePayroll}
          >
            Save Payroll
          </Button>
        </Card>
      )}
    </div>
  );
}
