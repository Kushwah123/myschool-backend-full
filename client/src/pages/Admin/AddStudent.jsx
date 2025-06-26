import React, { useState, useEffect } from "react";
import {
  Form, Button, Container, Card, Spinner, Row, Col
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createStudent } from "../../redux/slices/studentSlice";
import { fetchClasses } from "../../redux/slices/classSlice";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

const AddStudent = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.class);
  const { loading } = useSelector((state) => state.students);

  const [formData, setFormData] = useState({
    fullName: "", gender: "", dob: "", aadharNumber: "", bloodGroup: "", category: "",
    photo: null, mobile: "", address: "", fatherName: "", motherName: "",
    classId: "", sectionId: "", transportMode: ""
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    setFormData((prev) => ({ ...prev, classId, sectionId: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) payload.append(key, value);
    });

    try {
      const student = await dispatch(createStudent(payload)).unwrap();
      toast.success("✅ Student registered successfully!");

      generatePDF(student, photoPreview);
    } catch (err) {
      toast.error(err.message || "❌ Registration failed");
    }
  };

  const generatePDF = async (data, photoPreview) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("🏫 SHRI S. R. CONVENT SCHOOL", 20, 20);
    doc.setFontSize(12);
    doc.text("Student Registration Receipt", 20, 30);

    // Add photo
    if (photoPreview) {
      try {
        const img = await getBase64(photoPreview);
        doc.addImage(img, "JPEG", 150, 20, 40, 40);
      } catch (e) {
        console.error("Photo error", e);
      }
    }

    // Add QR
    try {
      const qrText = `Admission No: ${data.admissionNumber}\nRoll No: ${data.rollNumber}\nMobile: ${data.mobile}`;
      const qrCode = await QRCode.toDataURL(qrText);
      doc.addImage(qrCode, "PNG", 150, 65, 40, 40);
    } catch (e) {
      console.error("QR error", e);
    }

    const tableData = [
      ["Full Name", data.fullName],
      ["Gender", data.gender],
      ["DOB", new Date(data.dob).toLocaleDateString()],
      ["Aadhaar", data.aadharNumber],
      ["Blood Group", data.bloodGroup],
      ["Category", data.category],
      ["Father's Name", data.fatherName],
      ["Mother's Name", data.motherName],
      ["Mobile", data.mobile],
      ["Address", data.address],
      ["Class", data.classId?.name || ""],
      ["Section", data.sectionId],
      ["Transport Mode", data.transportMode],
      ["Admission Number", data.admissionNumber],
      ["Roll Number", data.rollNumber],
      ["Password", "student123"],
    ];

    autoTable(doc, {
      startY: 110,
      head: [["Field", "Value"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.setFontSize(10);
    doc.text("This is a system-generated receipt.", 20, 290);

    // Show in new tab
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  };

  const getBase64 = (fileOrUrl) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = fileOrUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
    });

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg border-0">
        <h3 className="mb-4 text-center">🎓 Add Student</h3>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}><Form.Group><Form.Label>Full Name *</Form.Label>
              <Form.Control required name="fullName" onChange={handleChange} /></Form.Group></Col>
            <Col md={3}><Form.Group><Form.Label>Gender *</Form.Label>
              <Form.Select required name="gender" onChange={handleChange}>
                <option value="">Select</option><option>Male</option><option>Female</option>
              </Form.Select></Form.Group></Col>
            <Col md={3}><Form.Group><Form.Label>DOB *</Form.Label>
              <Form.Control type="date" required name="dob" onChange={handleChange} /></Form.Group></Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}><Form.Group><Form.Label>Father's Name</Form.Label>
              <Form.Control name="fatherName" onChange={handleChange} /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>Mother's Name</Form.Label>
              <Form.Control name="motherName" onChange={handleChange} /></Form.Group></Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}><Form.Group><Form.Label>Aadhaar Number</Form.Label>
              <Form.Control name="aadharNumber" maxLength={12} onChange={handleChange} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Blood Group</Form.Label>
              <Form.Control name="bloodGroup" onChange={handleChange} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Category</Form.Label>
              <Form.Control name="category" onChange={handleChange} /></Form.Group></Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}><Form.Group><Form.Label>Mobile Number *</Form.Label>
              <Form.Control required name="mobile" maxLength={10} onChange={handleChange} /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>Address *</Form.Label>
              <Form.Control as="textarea" required name="address" rows={1} onChange={handleChange} /></Form.Group></Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}><Form.Group><Form.Label>Class *</Form.Label>
              <Form.Select required name="classId" value={formData.classId} onChange={handleClassChange}>
                <option value="">Select</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </Form.Select></Form.Group></Col>

            <Col md={4}><Form.Group><Form.Label>Section *</Form.Label>
              <Form.Select required name="sectionId" value={formData.sectionId} onChange={handleChange}>
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </Form.Select></Form.Group></Col>

            <Col md={4}><Form.Group><Form.Label>Transport Mode</Form.Label>
              <Form.Select name="transportMode" onChange={handleChange}>
                <option value="">Select</option><option>Transport</option><option>Pedal</option>
              </Form.Select></Form.Group></Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}><Form.Group><Form.Label>Upload Photo</Form.Label>
              <Form.Control type="file" name="photo" accept="image/*" onChange={handleChange} />
              {photoPreview && (
                <img src={photoPreview} alt="preview" style={{ width: "80px", height: "80px", borderRadius: "50%", marginTop: "10px" }} />
              )}
            </Form.Group></Col>
          </Row>

          <div className="text-center">
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Register Student"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddStudent;
