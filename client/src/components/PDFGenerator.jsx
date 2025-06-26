// src/components/PDFGenerator.jsx
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PDFGenerator = ({ title, data, columns }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    doc.autoTable({ head: [columns], body: data });
    doc.save(`${title}.pdf`);
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={generatePDF}
    >
      Download PDF
    </button>
  );
};

export default PDFGenerator;
