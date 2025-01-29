import { jsPDF } from "jspdf";

// Interface for Payroll
interface Payroll {
  payDate: string;
  month: string;
  year: string;
  basicSalary: number;
  grossSalary: number;
  incentiveAmount: number;
  bonusPayable: number;
  totalDeductions: number;
  pf: number;
  professionalTax: number;
  esiFund: number;
  netSalary: number;
  paymentStatus: string;
  paymentMethod: string;
  employeeName: string;
  bankAccount: string;
  bankIfsc: string;
  uanNumber: string;
  esiAccount: string;
  pfAccount: string;
  _id: string;
  monthlyWorkingDays: number;
  totalMinutesRequiredForTheMonth: number;
  totalWorkedMinutes: number;
  totalPresentDays: number;
  totalAbsentDays: number;
  totalApprovedLeaves: number;
  approvedLeaveDaysMinutes: number;
  preApprovedLeavesPaidMinutes: number;
}

interface PayrollResponse {
  employeeId: string;
  message: string;
  success: boolean;
  companyName: string;
  payroll: Payroll[];
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Create a box in the PDF
const drawBox = (doc: jsPDF, x: number, y: number, width: number, height: number, fillColor: [number, number, number]) => {
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.setFillColor(...fillColor);
  doc.rect(x, y, width, height, 'FD');
};

// Create Header in PDF
const createHeader = (doc: jsPDF, label: string, y: number) => {
  doc.setFillColor(85, 105, 255); // Light Blue background for headers
  doc.rect(20, y - 5, 170, 8, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);  // Reduced font size
  doc.setTextColor(255, 255, 255); // White text color for header
  doc.text(label, 25, y);
};

// Create a Detail Row in PDF
const createDetailRow = (doc: jsPDF, label: string, value: string, y: number) => {
  doc.setFontSize(8);  // Reduced font size
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0); // Black text for content
  doc.text(label, 25, y);
  doc.text(value, 185, y, { align: 'right' });
};

// Create Financial Row in PDF
const createFinancialRow = (doc: jsPDF, label: string, value: string, y: number, isTotal: boolean = false) => {
  doc.setFontSize(isTotal ? 10 : 8); // Reduced font size
  doc.setFont("helvetica", isTotal ? "bold" : "normal");
  doc.setTextColor(isTotal ? 0 : 0, 0, 0); // Bold for totals with black text
  doc.text(label, 25, y);
  const valueWithoutSymbol = value.replace('₹', '').trim();
  doc.text(valueWithoutSymbol, 190, y, { align: 'right' });
};

export const generatePayslip = (data: PayrollResponse): void => {
  try {
    const { companyName = "Company Name", employeeId = "EMP-ID", payroll: [payroll] } = data;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Company Header
    doc.setFillColor(10, 56, 102); // Dark blue header
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(20);  // Reduced font size
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // White text for company name
    doc.text(companyName, 105, 20, { align: 'center' });
    
    doc.setFontSize(16);  // Reduced font size
    doc.text('SALARY SLIP', 105, 32, { align: 'center' });

    // Month Year Strip
    doc.setFillColor(230, 230, 230); // Light grey background
    doc.rect(0, 40, 210, 10, 'F');
    doc.setFontSize(10);  // Reduced font size
    doc.setTextColor(0, 0, 0); // Black text color
    doc.text(`${payroll.month.toUpperCase()} ${payroll.year}`, 105, 47, { align: 'center' });

    let y = 55; // Adjusted Y position for further sections

    // Employee Details Section
    createHeader(doc, 'EMPLOYEE DETAILS', y);
    y += 15;
    drawBox(doc, 20, y - 8, 170, 45, [230, 230, 255]); // Light blue box for employee details
    
    createDetailRow(doc, 'Employee Name:', payroll.employeeName, y);
    y += 8;
    createDetailRow(doc, 'Employee ID:', employeeId, y);
    y += 8;
    createDetailRow(doc, 'UAN Number:', payroll.uanNumber, y);
    y += 8;
    createDetailRow(doc, 'PF Account:', payroll.pfAccount, y);
    y += 8;
    createDetailRow(doc, 'ESI Account:', payroll.esiAccount, y);

    // Bank Details
    y += 20;
    createHeader(doc, 'BANK DETAILS', y);
    y += 15;
    drawBox(doc, 20, y - 8, 170, 25, [255, 240, 240]); // Soft pink background for bank details
    
    createDetailRow(doc, 'Bank Account:', payroll.bankAccount, y);
    y += 8;
    createDetailRow(doc, 'IFSC Code:', payroll.bankIfsc, y);

    // Earnings Section
    y += 20;
    createHeader(doc, 'EARNINGS', y);
    y += 15;
    drawBox(doc, 20, y - 8, 170, 45, [230, 255, 230]); // Light green box for earnings
    
    doc.setFont("helvetica", "bold");
    doc.text("PARTICULARS", 25, y - 4);
    doc.text("AMOUNT (₹)", 160, y - 4);
    doc.setFont("helvetica", "normal");
    
    y += 4;
    createFinancialRow(doc, 'Basic Salary', formatCurrency(payroll.basicSalary), y);
    y += 8;
    createFinancialRow(doc, 'Incentives', formatCurrency(payroll.incentiveAmount), y);
    y += 8;
    createFinancialRow(doc, 'Bonus', formatCurrency(payroll.bonusPayable), y);
    y += 8;
    createFinancialRow(doc, 'Gross Salary', formatCurrency(payroll.grossSalary), y, true);

    // Deductions Section
    y += 20;
    createHeader(doc, 'DEDUCTIONS', y);
    y += 15;
    drawBox(doc, 20, y - 8, 170, 45, [255, 230, 230]); // Soft red background for deductions
    
    doc.setFont("helvetica", "bold");
    doc.text("PARTICULARS", 25, y - 4);
    doc.text("AMOUNT (₹)", 160, y - 4);
    doc.setFont("helvetica", "normal");
    
    y += 4;
    createFinancialRow(doc, 'PF', formatCurrency(payroll.pf), y);
    y += 8;
    createFinancialRow(doc, 'Professional Tax', formatCurrency(payroll.professionalTax), y);
    y += 8;
    createFinancialRow(doc, 'ESI', formatCurrency(payroll.esiFund), y);
    y += 8;
    createFinancialRow(doc, 'Total Deductions', formatCurrency(payroll.totalDeductions), y, true);

    // Net Salary Section
    y += 20;
    doc.setFillColor(255, 255, 204); // Light yellow for net salary
    doc.rect(20, y - 8, 170, 20, 'F');
    doc.setFontSize(11);  // Reduced font size
    doc.setFont("helvetica", "bold");
    createFinancialRow(doc, 'NET SALARY', formatCurrency(payroll.netSalary), y + 2, true);

    // Attendance and Leave Details Section
    y += 25;
    createHeader(doc, 'ATTENDANCE & LEAVE DETAILS', y);
    y += 15;
    drawBox(doc, 20, y - 8, 170, 45, [255, 255, 204]); // Light yellow box for attendance & leave details
    
    createDetailRow(doc, 'Monthly Working Days:', `${payroll.monthlyWorkingDays}`, y);
    y += 8;
    createDetailRow(doc, 'Total Minutes Required:', `${payroll.totalMinutesRequiredForTheMonth} min`, y);
    y += 8;
    createDetailRow(doc, 'Total Worked Minutes:', `${payroll.totalWorkedMinutes} min`, y);
    y += 8;
    createDetailRow(doc, 'Total Present Days:', `${payroll.totalPresentDays}`, y);
    y += 8;
    createDetailRow(doc, 'Total Absent Days:', `${payroll.totalAbsentDays}`, y);
    y += 8;
    createDetailRow(doc, 'Total Approved Leaves:', `${payroll.totalApprovedLeaves} days`, y);
    y += 8;
    createDetailRow(doc, 'Approved Leave Days Minutes:', `${payroll.approvedLeaveDaysMinutes} min`, y);
    y += 8;
    createDetailRow(doc, 'Pre-Approved Leaves Paid Minutes:', `${payroll.preApprovedLeavesPaidMinutes} min`, y);

    // Footer
    const footerY = y + 25;
    doc.setFillColor(245, 245, 245);
    doc.rect(0, footerY - 5, 210, 25, 'F');
    
    doc.setFontSize(8);  // Reduced font size
    doc.setFont("helvetica", "normal");
    doc.text(`Payment Status: ${payroll.paymentStatus}`, 25, footerY + 5);
    doc.text(`Payment Method: ${payroll.paymentMethod}`, 105, footerY + 5, { align: 'center' });
    doc.text(`Generated: ${new Date(payroll.payDate).toLocaleDateString()}`, 190, footerY + 5, { align: 'right' });

    doc.save('payroll-slip.pdf');
  } catch (error) {
    console.error('Error generating payslip:', error);
  }
};
