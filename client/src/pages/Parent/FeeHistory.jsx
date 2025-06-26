// src/pages/Parent/FeeHistory.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeeHistoryByParent } from '../../redux/slices/feeSlice';

const FeeHistory = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { feeHistory } = useSelector((state) => state.fee);

  useEffect(() => {
    dispatch(fetchFeeHistoryByParent(user._id));
  }, [dispatch, user]);

  return (
    <div className="container mt-4">
      <h3>Fee History</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Mode</th>
          </tr>
        </thead>
        <tbody>
          {feeHistory.map((fee, i) => (
            <tr key={i}>
              <td>{fee.date}</td>
              <td>{fee.amount}</td>
              <td>{fee.mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeHistory;
