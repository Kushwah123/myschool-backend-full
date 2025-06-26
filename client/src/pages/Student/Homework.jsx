// src/pages/Student/Homework.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeworkByStudent } from '../../redux/slices/homeworkSlice';

const Homework = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { homeworkList } = useSelector((state) => state.homework);

  useEffect(() => {
    dispatch(fetchHomeworkByStudent(user._id));
  }, [dispatch, user]);

  return (
    <div className="container mt-4">
      <h3>Your Homework</h3>
      {homeworkList.length === 0 ? (
        <p>No homework assigned yet.</p>
      ) : (
        <ul className="list-group">
          {homeworkList.map((hw, index) => (
            <li key={index} className="list-group-item">
              <strong>{hw.subjectName}</strong>: {hw.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Homework;