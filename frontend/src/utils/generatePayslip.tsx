import { jsPDF } from "jspdf";

interface PayrollData {
  employeeId: string;
  payroll: [{
    employeeName: string;
    bankName: string;
    bankBranch: string;
    basicSalary: number;
    bonuses: number;
    deductions: number;
    otherDeductions: number;
    grossSalary: number;
    netSalary: number;
    month: string;
    year: string;
    totalWorkedMinutes: number;
    totalPresentDays: number;
    totalAbsentDays: number;
    payDate: string;
  }];
}

const setColor = (doc: jsPDF, r: number, g: number, b: number) => {
  doc.setTextColor(r, g, b);
  doc.setFillColor(r, g, b);
};

export const generatePayslip = (data: PayrollData): void => {
  const {
    employeeId = "N/A",
    payroll: [{
      employeeName,
      bankName = "N/A",
      bankBranch = "N/A",
      basicSalary = 0,
      bonuses = 0,
      deductions = 0,
      otherDeductions = 0,
      grossSalary = 0,
      netSalary = 0,
      month = "0",
      year = "0",
      totalWorkedMinutes = 0,
      totalPresentDays = 0,
      totalAbsentDays = 0,
      payDate = new Date().toISOString()
    }]
  } = data;

  const doc = new jsPDF();
  
  // Header
  setColor(doc, 0, 82, 165);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(`PAYSLIP - ${getMonthName(month)} ${year}`, 105, 25, { align: "center" });

  // Employee Details
  setColor(doc, 242, 242, 242);
  doc.roundedRect(10, 50, 190, 45, 3, 3, "F");
  doc.setFontSize(12);
  doc.setTextColor(64, 64, 64);
  
  doc.text("Employee Name:", 20, 65);
  doc.text(employeeName, 100, 65);
  doc.text("Employee ID:", 20, 75);
  doc.text(employeeId, 100, 75);
  doc.text("Bank Name:", 20, 85);
  doc.text(bankName, 100, 85);

  // Salary Components
  setColor(doc, 242, 242, 242);
  doc.roundedRect(10, 105, 190, 70, 3, 3, "F");
  doc.setTextColor(64, 64, 64);
  
  doc.text("Basic Salary:", 20, 120);
  doc.text(`$${basicSalary.toFixed(2)}`, 100, 120);

  doc.setTextColor(46, 125, 50);
  doc.text("Bonuses:", 20, 130);
  doc.text(`$${bonuses.toFixed(2)}`, 100, 130);

  doc.setTextColor(198, 40, 40);
  doc.text("Deductions:", 20, 140);
  doc.text(`$${deductions.toFixed(2)}`, 100, 140);
  doc.text("Other Deductions:", 20, 150);
  doc.text(`$${otherDeductions.toFixed(2)}`, 100, 150);

  doc.setTextColor(64, 64, 64);
  doc.text("Gross Salary:", 20, 160);
  doc.text(`$${grossSalary.toFixed(2)}`, 100, 160);
  doc.text("Net Salary:", 20, 170);
  doc.text(`$${netSalary.toFixed(2)}`, 100, 170);

  // Attendance
  setColor(doc, 242, 242, 242);
  doc.roundedRect(10, 185, 190, 45, 3, 3, "F");
  doc.setTextColor(64, 64, 64);
  
  doc.text("Total Worked Minutes:", 20, 200);
  doc.text(totalWorkedMinutes.toString(), 100, 200);
  doc.text("Present Days:", 20, 210);
  doc.text(totalPresentDays.toString(), 100, 210);
  doc.text("Absent Days:", 20, 220);
  doc.text(totalAbsentDays.toString(), 100, 220);

  // Footer
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date(payDate).toLocaleDateString()}`, 105, 250, { align: "center" });

  doc.save(`${employeeName.replace(/\s+/g, "-")}-payslip-${month}-${year}.pdf`);
};

function getMonthName(month: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[parseInt(month) - 1] || "";
}