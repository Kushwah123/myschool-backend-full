// src/parent/FeeDetails.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeeHistoryByParent } from '../../redux/slices/feeSlice';
import { Table, Container, Card } from 'react-bootstrap';

const FeeHistory = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { feeDetails } = useSelector((state) => state.fees);

  useEffect(() => {
    if (user?.children?.[0]?._id) {
      dispatch(fetchFeeHistoryByParent(user._id));
    }
  }, [user, dispatch]);

  return (
    <Container className="my-4">
      <Card className="p-4 shadow">
        <h4>💰 Fee Details</h4>
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Type</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {feeDetails?.map((fee) => (
              <tr key={fee._id}>
                <td>{fee.type}</td>
                <td>₹{fee.total}</td>
                <td>₹{fee.paid}</td>
                <td>₹{fee.total - fee.paid}</td>
                <td>{fee.dueDate?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default FeeHistory ;
