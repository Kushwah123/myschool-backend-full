import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchStudentsByClass } from '../../redux/slices/studentSlice';
import { markAttendance } from '../../redux/slices/attendanceSlice';

const Attendance = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [selectedClass, setSelectedClass] = useState('');
  const [attendance, setAttendance] = useState([]);

  const { classes } = useSelector((state) => state.class);
  const { students } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedClass) dispatch(fetchStudentsByClass(selectedClass));
  }, [dispatch, selectedClass]);

  useEffect(() => {
    const initial = students.map((s) => ({
      studentId: s._id,
      status: 'Present',
    }));
    setAttendance(initial);
  }, [students]);

  const handleChange = (studentId, status) => {
    setAttendance((prev) =>
      prev.map((a) =>
        a.studentId === studentId ? { ...a, status } : a
      )
    );
  };

  const handleAttendanceSubmit = () => {
    const data = {
      classId: selectedClass,
      date: new Date().toISOString().split('T')[0],
      records: attendance,
      teacherId: user._id, // ✅ Save teacher ID
    };
    dispatch(markAttendance(data));
  };

  return (
    <div className="container mt-4">
      <h3>Mark Attendance</h3>
      <div className="card p-3 shadow-sm">
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
        </div>

        {students.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Roll No.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu._id}>
                    <td>{stu.fullName}</td>
                    <td>{stu.rollNumber}</td>
                    <td>
                      <select
                        className="form-select"
                        value={
                          attendance.find((a) => a.studentId === stu._id)
                            ?.status || 'Present'
                        }
                        onChange={(e) =>
                          handleChange(stu._id, e.target.value)
                        }
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button className="btn btn-success mt-3" onClick={handleAttendanceSubmit}>
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendance;
