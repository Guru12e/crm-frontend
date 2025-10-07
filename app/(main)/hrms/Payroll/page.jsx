"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Calculator, Users, Wallet } from "lucide-react";

export default function PayrollPage() {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [payroll, setPayroll] = useState({
    salary: 0,
    allowances: { HRA: 0, Bonus: 0 },
    deductions: { Tax: 0 },
  });

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("Employees")
      .select("*")
      .order("name");
    if (error) return console.error(error);
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("Employees")
      .update({
        salary: payroll.salary,
        allowances: payroll.allowances,
        deductions: payroll.deductions,
      })
      .eq("id", editing.id);

    if (error) {
      toast.error("Error saving payroll");
    } else {
      toast.success("Payroll updated!");
      fetchEmployees();
      setEditing(null);
    }
  };

  const calcTotals = () => {
    const base = Number(payroll.salary) || 0;
    const totalAllowances = Object.values(payroll.allowances || {}).reduce(
      (a, b) => a + Number(b || 0),
      0
    );
    const totalDeductions = Object.values(payroll.deductions || {}).reduce(
      (a, b) => a + Number(b || 0),
      0
    );

    const gross = base + totalAllowances;
    const pf = base * 0.12;
    const esi = gross < 21000 && employees.length > 10 ? gross * 0.0075 : 0;
    const net = gross - pf - esi - totalDeductions;

    return { gross, pf, esi, net };
  };

  const { gross, pf, esi, net } = calcTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Wallet className="w-8 h-8 text-blue-600" />
              Payroll Dashboard
            </h1>
            <p className="text-gray-500">
              Manage salaries, deductions, PF & ESI automatically
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-blue-600 font-semibold py-2 px-4 rounded-full"
          >
            Total Employees: {employees.length}
          </Badge>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <Card
              key={emp.id}
              className="shadow-lg border border-gray-100 backdrop-blur-md bg-white/70 hover:shadow-xl transition-all"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{emp.name}</span>
                  <Users className="w-5 h-5 text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-600">Base Salary: ₹{emp.salary || 0}</p>
                <p className="text-gray-600">
                  Last Paid:{" "}
                  {emp.last_paid || (
                    <span className="italic">Not Paid Yet</span>
                  )}
                </p>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        setEditing(emp);
                        setPayroll({
                          salary: emp.salary || 0,
                          allowances: emp.allowances || { HRA: 0, Bonus: 0 },
                          deductions: emp.deductions || { Tax: 0 },
                        });
                      }}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Edit Payroll
                    </Button>
                  </SheetTrigger>

                  <SheetContent className="p-6 space-y-6 max-w-md bg-white/90 backdrop-blur-md">
                    <SheetHeader>
                      <SheetTitle>Edit Payroll – {emp.name}</SheetTitle>
                    </SheetHeader>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Base Salary
                        </label>
                        <Input
                          type="number"
                          value={payroll.salary}
                          onChange={(e) =>
                            setPayroll({
                              ...payroll,
                              salary: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                          Allowances
                        </h3>
                        {Object.keys(payroll.allowances || {}).map((key) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 mb-2"
                          >
                            <label className="w-24 text-gray-600">{key}</label>
                            <Input
                              type="number"
                              value={payroll.allowances[key] ?? 0}
                              onChange={(e) =>
                                setPayroll({
                                  ...payroll,
                                  allowances: {
                                    ...payroll.allowances,
                                    [key]: Number(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                          Deductions
                        </h3>
                        {Object.keys(payroll.deductions || {}).map((key) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 mb-2"
                          >
                            <label className="w-24 text-gray-600">{key}</label>
                            <Input
                              type="number"
                              value={payroll.deductions[key] ?? 0}
                              onChange={(e) =>
                                setPayroll({
                                  ...payroll,
                                  deductions: {
                                    ...payroll.deductions,
                                    [key]: Number(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Summary Section */}
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>Gross Salary: ₹{gross.toFixed(2)}</p>
                      <p>PF (12% of salary): ₹{pf.toFixed(2)}</p>
                      <p>ESI (0.75% of gross): ₹{esi.toFixed(2)}</p>
                      <p className="font-semibold text-gray-800">
                        Net Pay: ₹{net.toFixed(2)}
                      </p>
                    </div>

                    <Button
                      onClick={handleUpdate}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:scale-[1.02] transition-transform"
                    >
                      Save Payroll
                    </Button>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
