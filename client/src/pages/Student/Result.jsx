// src/pages/Student/Result.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from '../../redux/slices/resultSlice';

const Result = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { results } = useSelector((state) => state.result);

  useEffect(() => {
    dispatch(fetchResults(user._id));
  }, [dispatch, user]);

  return (
    <div className="container mt-4">
      <h3>Your Results</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, index) => (
            <tr key={index}>
              <td>{r.subjectName}</td>
              <td>{r.mark}</td>
              <td>{r.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Result;
