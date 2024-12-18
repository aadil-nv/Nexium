// utils/generatePayslip.ts
import { jsPDF } from "jspdf";

const getMonthName = (monthNumber: string) =>
  [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][parseInt(monthNumber) - 1];

export const generatePayslip = (data: any) => {
  console.log("data from generate payslip", data);

  const employeeId = data.employeeId || "N/A";
  const employeeName = data.payroll[0].employeeName;
  const bankName = data.payroll[0].bankName || "N/A";
  const bankBranch = data.payroll[0].bankBranch || "N/A";
  const basicSalary = data.payroll[0].basicSalary ?? 0;
  const bonuses = data.payroll[0].bonuses ?? 0;
  const deductions = data.payroll[0].deductions ?? 0;
  const otherDeductions = data.payroll[0].otherDeductions ?? 0;
  const grossSalary = data.payroll[0].grossSalary ?? 0;
  const netSalary = data.payroll[0].netSalary ?? 0;
  const month = data.payroll[0].month || "0";
  const year = data.payroll[0].year || "0";
  const totalWorkedMinutes = data.payroll[0].totalWorkedMinutes || 0;
  const totalPresentDays = data.payroll[0].totalPresentDays || 0;
  const totalAbsentDays = data.payroll[0].totalAbsentDays || 0;
  const payDate = data.payroll[0].payDate || new Date().toISOString();

  const doc = new jsPDF();
  doc.setFont("Arial", "normal");

  // Title Section
  doc.setFontSize(18);
  doc.setTextColor(0, 102, 204); // Blue
  doc.text(`Payslip - ${employeeName}`, 105, 20, { align: "center" });

  // Employee Information Section
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(240, 240, 240); // Light Gray
  doc.rect(10, 30, 190, 50, "FD");
  doc.text("Employee Information", 15, 40);
  doc.text(`Employee Name: ${employeeName}`, 15, 50);
  doc.text(`Employee ID: ${employeeId}`, 15, 60);
  doc.text(`Bank Name: ${bankName}`, 15, 70);
  doc.text(`Bank Branch: ${bankBranch}`, 15, 80);

  // Pay Information Section
  doc.setFillColor(245, 245, 245);
  doc.rect(105, 30, 95, 50, "FD");
  doc.text("Pay Information", 150, 40, { align: "center" });
  doc.text(`Month: ${getMonthName(month)}`, 150, 50, { align: "center" });
  doc.text(`Year: ${year}`, 150, 60, { align: "center" });
  doc.text(`Basic Salary: $${basicSalary.toFixed(2)}`, 150, 70, { align: "center" });
  doc.text(`Bonuses: $${bonuses.toFixed(2)}`, 150, 80, { align: "center" });
  doc.text(`Deductions: $${deductions.toFixed(2)}`, 150, 90, { align: "center" });
  doc.text(`Other Deductions: $${otherDeductions.toFixed(2)}`, 150, 100, { align: "center" });

  // Salary Breakdown Section
  doc.setFontSize(12);
  doc.text("Salary Breakdown", 15, 110);
  doc.text(`Gross Salary: $${grossSalary.toFixed(2)}`, 15, 120);
  doc.text(`Net Salary: $${netSalary.toFixed(2)}`, 15, 130);

  // Attendance Section
  doc.setFillColor(220, 220, 220);
  doc.rect(105, 110, 95, 40, "F");
  doc.text("Attendance", 150, 120, { align: "center" });
  doc.text(`Total Worked Minutes: ${totalWorkedMinutes}`, 150, 130, { align: "center" });
  doc.text(`Total Present Days: ${totalPresentDays}`, 150, 140, { align: "center" });
  doc.text(`Total Absent Days: ${totalAbsentDays}`, 150, 150, { align: "center" });

  // Footer Section
  doc.setDrawColor(0, 0, 0);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, 160, 190, 20, 5, 5, "FD");
  doc.text(`Pay Date: ${new Date(payDate).toLocaleDateString()}`, 105, 170, { align: "center" });

  // Save the PDF
  doc.save(`${employeeName}-payslip-${month}-${year}.pdf`);
};
