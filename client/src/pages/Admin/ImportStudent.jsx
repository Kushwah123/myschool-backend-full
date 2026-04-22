import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { importStudents } from "../../redux/slices/studentSlice";
import { fetchClasses } from "../../redux/slices/classSlice";

const ImportStudent = () => {
  const [file, setFile] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.students);
  const { classes } = useSelector((state) => state.class);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an Excel file");
    if (!selectedClass) return alert('Please select a class for this import.');
    dispatch(importStudents({ file, classId: selectedClass }));
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Import Students from Excel</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Class *</label>
          <select
            className="form-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            required
          >
            <option value="">--Select Class--</option>
            {classes?.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2 form-control"
          required
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Importing..." : "Import"}
        </button>
      </form>
      <div className="mt-3">
        <p><strong>Supported Excel headers:</strong></p>
        <ul>
          <li><strong>Student's Name</strong> or <strong>Student Name</strong></li>
          <li><strong>Father's Name</strong> or <strong>Father Name</strong></li>
          <li><strong>Mother's Name</strong> or <strong>Mother Name</strong></li>
          <li><strong>Address</strong></li>
          <li><strong>Mobile No.</strong> or <strong>Mobile Number</strong> (optional)</li>
          <li><strong>Date of Birth</strong> or <strong>DOB</strong> (optional)</li>
        </ul>
        <p><strong>Optional columns:</strong> Gender, Blood Group, Category, Aadhar, VillageId.</p>
        <p>Class is selected above once for the full import; you do not need a ClassId column in Excel.</p>
      </div>
      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default ImportStudent;
