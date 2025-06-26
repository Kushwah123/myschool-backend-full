import React from 'react';
import { Button, Table, Card } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Receipts = ({ receipts }) => {
  const generatePDF = (receipt) => {
    const doc = new jsPDF();
    doc.text('Fee Receipt', 20, 20);
    doc.autoTable({
      head: [['Field', 'Details']],
      body: [
        ['Receipt No', receipt._id],
        ['Student', receipt.studentName],
        ['Amount', `₹ ${receipt.amount}`],
        ['Date', receipt.date],
        ['Parent Mobile', receipt.parentMobile],
      ],
    });
    doc.save(`receipt_${receipt._id}.pdf`);
  };

  return (
    <div className="container mt-4">
      <Card className="p-4 shadow-sm">
        <h4>Receipts</h4>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Receipt No</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {receipts?.map((receipt) => (
              <tr key={receipt._id}>
                <td>{receipt._id}</td>
                <td>{receipt.studentName}</td>
                <td>₹ {receipt.amount}</td>
                <td>{receipt.date}</td>
                <td>
                  <Button variant="success" size="sm" onClick={() => generatePDF(receipt)}>
                    PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default Receipts;
