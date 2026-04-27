import { jsPDF } from 'jspdf';

export interface TemplateData {
  id: string;
  title: string;
  category: string;
  description: string;
  language: 'en' | 'ms' | 'zh';
}

export function generateTemplatePDF(template: TemplateData): Blob {
  const doc = new jsPDF();
  
  // 设置字体和样式
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  
  // 标题
  doc.text(template.title, 20, 20);
  
  // 分隔线
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);
  
  // 文档信息
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Template ID: ${template.id}`, 20, 35);
  doc.text(`Category: ${template.category}`, 20, 42);
  doc.text(`Language: ${template.language.toUpperCase()}`, 20, 49);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 56);
  
  // 描述
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Description:', 20, 70);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const splitDescription = doc.splitTextToSize(template.description, 170);
  doc.text(splitDescription, 20, 78);
  
  // 根据分类添加具体内容
  let yPosition = 95;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Template Content:', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // 根据不同分类生成不同的内容
  if (template.category === 'employment') {
    const content = [
      '1. PARTIES TO THE AGREEMENT',
      '   Employer: _______________________',
      '   Employee: _______________________',
      '',
      '2. POSITION AND DUTIES',
      '   Position: _______________________',
      '   Department: _____________________',
      '   Reporting to: ___________________',
      '',
      '3. COMMENCEMENT DATE',
      '   Start Date: _____________________',
      '',
      '4. SALARY AND BENEFITS',
      '   Basic Salary: RM _______________',
      '   Allowances: _____________________',
      '   EPF Contribution: As per Malaysian law',
      '   SOCSO: As per Malaysian law',
      '',
      '5. WORKING HOURS',
      '   Monday to Friday: 9:00 AM - 6:00 PM',
      '   Lunch Break: 1 hour',
      '   Total: 40 hours per week',
      '',
      '6. ANNUAL LEAVE',
      '   As per Employment Act 1955',
      '',
      '7. TERMINATION',
      '   Notice Period: ___ months',
      '',
      '8. CONFIDENTIALITY',
      '   Employee agrees to maintain confidentiality',
      '',
      '9. GOVERNING LAW',
      '   This agreement is governed by Malaysian law',
      '',
      'Employer Signature: _______________  Date: __________',
      'Employee Signature: _______________  Date: __________',
    ];
    
    content.forEach((line) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
  } else if (template.category === 'property') {
    const content = [
      '1. PROPERTY DETAILS',
      '   Address: ________________________',
      '   Title Type: _____________________',
      '   Land Area: ______________________',
      '',
      '2. VENDOR DETAILS',
      '   Name: ___________________________',
      '   IC/Passport: ____________________',
      '   Address: ________________________',
      '',
      '3. PURCHASER DETAILS',
      '   Name: ___________________________',
      '   IC/Passport: ____________________',
      '   Address: ________________________',
      '',
      '4. PURCHASE PRICE',
      '   Total Price: RM _________________',
      '   Deposit: RM _____________________',
      '   Balance: RM _____________________',
      '',
      '5. PAYMENT TERMS',
      '   Booking Fee: RM _________________',
      '   Down Payment: RM ________________',
      '   Loan Amount: RM _________________',
      '',
      '6. COMPLETION DATE',
      '   Expected Date: __________________',
      '',
      '7. VACANT POSSESSION',
      '   Delivery Date: __________________',
      '',
      '8. LEGAL FEES',
      '   As per Malaysian law',
      '',
      '9. STAMP DUTY',
      '   As per Stamp Act 1949',
      '',
      'Vendor Signature: _________________  Date: __________',
      'Purchaser Signature: ______________  Date: __________',
    ];
    
    content.forEach((line) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
  } else if (template.category === 'tenancy') {
    const content = [
      '1. PROPERTY ADDRESS',
      '   _________________________________',
      '',
      '2. LANDLORD DETAILS',
      '   Name: ___________________________',
      '   IC: _____________________________',
      '   Contact: ________________________',
      '',
      '3. TENANT DETAILS',
      '   Name: ___________________________',
      '   IC: _____________________________',
      '   Contact: ________________________',
      '',
      '4. RENTAL TERMS',
      '   Monthly Rent: RM ________________',
      '   Security Deposit: RM ____________',
      '   Utility Deposit: RM _____________',
      '',
      '5. TENANCY PERIOD',
      '   Start Date: _____________________',
      '   End Date: _______________________',
      '   Duration: ___ months/years',
      '',
      '6. PAYMENT DUE DATE',
      '   Rent due on: ____ of each month',
      '',
      '7. UTILITIES',
      '   Water: Tenant/Landlord',
      '   Electricity: Tenant/Landlord',
      '   Internet: Tenant/Landlord',
      '',
      '8. MAINTENANCE',
      '   Landlord responsible for: ________',
      '   Tenant responsible for: __________',
      '',
      '9. TERMINATION',
      '   Notice Period: ___ months',
      '',
      'Landlord Signature: _______________  Date: __________',
      'Tenant Signature: _________________  Date: __________',
    ];
    
    content.forEach((line) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
  } else {
    // 通用模板内容
    const content = [
      'This is a legal document template for ' + template.category,
      '',
      'PARTIES:',
      'Party A: _________________________',
      'Party B: _________________________',
      '',
      'TERMS AND CONDITIONS:',
      '1. _______________________________',
      '2. _______________________________',
      '3. _______________________________',
      '',
      'EFFECTIVE DATE: __________________',
      '',
      'SIGNATURES:',
      'Party A: ______________  Date: ____',
      'Party B: ______________  Date: ____',
    ];
    
    content.forEach((line) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
  }
  
  // 添加页脚
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128);
    doc.text(
      `Page ${i} of ${pageCount} | LegalMY Template | www.legalmy.com`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // 返回Blob对象
  return doc.output('blob');
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
