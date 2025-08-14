import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { collectInstallmentPayment } from '../../redux/slices/feeSlice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FeeCollection = ({ show, onHide, assignedFeeId, installment, parent }) => {
  const dispatch = useDispatch();
  const { loading, lastReceipt, error } = useSelector((state) => state.fees);

  const [paidAmount, setPaidAmount] = useState((installment?.amount || 0) + (installment?.lateFee || 0));
  const [paymentMode, setPaymentMode] = useState('cash');

  const handlePay = () => {
    dispatch(
      collectInstallmentPayment({
        assignedFeeId,
        installmentId: installment._id,
        paidAmount,
        paymentMode
      })
    );
  };

  useEffect(() => {
    if (lastReceipt) {
      generatePdf(lastReceipt);
      onHide(true); // Modal close and refresh
    }
  }, [lastReceipt]);

  const generatePdf = (receipt) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('School Name', 20, 20);

    doc.setFontSize(12);
    doc.text(`Receipt ID: ${receipt.receiptId}`, 20, 35);
    doc.text(`Parent: ${receipt.parent?.name || ''}`, 20, 45);
    doc.text(`Mobile: ${receipt.parent?.mobile || ''}`, 20, 55);
    doc.text(`Amount Paid: ₹${receipt.paidAmount}`, 20, 65);
    doc.text(`Late Fee: ₹${receipt.lateFee}`, 20, 75);
    doc.text(`Payment Mode: ${receipt.paymentMode}`, 20, 85);
    doc.text(`Date: ${new Date(receipt.paidDate).toLocaleString()}`, 20, 95);

    autoTable(doc, {
      startY: 105,
      head: [['Description', 'Amount']],
      body: [
        ['Installment Amount', (installment.amount || 0).toString()],
        ['Late Fee', (installment.lateFee || 0).toString()],
        ['Total Paid', (receipt.paidAmount || 0).toString()],
      ],
    });

    doc.save(`receipt-${receipt.receiptId}.pdf`);
  };

  if (!installment) return null;

  return (
    <Modal show={show} onHide={() => onHide(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Collect Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <p><strong>Parent:</strong> {parent?.fullName}</p>
        <p><strong>Due Date:</strong> {new Date(installment.dueDate).toLocaleDateString()}</p>
        <p><strong>Installment Amount:</strong> ₹{installment.amount}</p>
        <p><strong>Late Fee:</strong> ₹{installment.lateFee || 0}</p>

        <Form.Group className="mb-2">
          <Form.Label>Amount to collect</Form.Label>
          <Form.Control
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Payment Mode</Form.Label>
          <Form.Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onHide(false)}>Cancel</Button>
        <Button variant="primary" onClick={handlePay} disabled={loading}>
          {loading ? 'Processing...' : 'Collect & Generate Receipt'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FeeCollection;
