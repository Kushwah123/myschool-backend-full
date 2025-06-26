import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import { fetchStudentsByClass } from '../../redux/slices/studentSlice';
import { createMarks } from '../../redux/slices/marksSlice';

const Marks = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marks, setMarks] = useState([]);

  const { classes } = useSelector((state) => state.class);
  const { subjects } = useSelector((state) => state.subject);
  const { students } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (selectedClass) dispatch(fetchStudentsByClass(selectedClass));
  }, [dispatch, selectedClass]);

  const handleMarkChange = (studentId, value) => {
    setMarks((prev) =>
      prev.map((m) =>
        m.studentId === studentId ? { ...m, mark: value } : m
      )
    );
  };

  const initializeMarks = () => {
    const initial = students.map((s) => ({
      studentId: s._id,
      mark: '',
    }));
    setMarks(initial);
  };

  useEffect(() => {
    if (students.length > 0) initializeMarks();
  }, [students]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      classId: selectedClass,
      subjectId: selectedSubject,
      marks,
      teacherId: user._id, // ✅ save correct teacher ID
    };
    dispatch(createMarks(payload));
  };

  return (
    <div className="container mt-4">
      <h3>Enter Marks</h3>
      <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Class</label>
            <select
              className="form-control"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              required
            >
              <option value="">--Select Class--</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label>Subject</label>
            <select
              className="form-control"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
            >
              <option value="">--Select Subject--</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {students.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Student Name</th>
                  <th>Roll No.</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu, i) => (
                  <tr key={stu._id}>
                    <td>{stu.fullName}</td>
                    <td>{stu.rollNumber}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={
                          marks.find((m) => m.studentId === stu._id)?.mark || ''
                        }
                        onChange={(e) =>
                          handleMarkChange(stu._id, e.target.value)
                        }
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button type="submit" className="btn btn-primary mt-3">
          Submit Marks
        </button>
      </form>
    </div>
  );
};

export default Marks;
