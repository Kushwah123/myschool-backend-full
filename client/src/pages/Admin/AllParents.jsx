import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchParents,
  deleteParent,
  updateParent,
} from "../../redux/slices/parentSlice";
import { Modal, Button, Table, Form, Row, Col } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const AllParents = () => {
  const dispatch = useDispatch();
  const { parents, loading, error } = useSelector((state) => state.parents);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);
  const [editData, setEditData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(fetchParents());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this parent?")) {
      dispatch(deleteParent(id));
    }
  };

  const handleEditSave = () => {
    dispatch(updateParent({ id: editData._id, data: editData }));
    setShowEditModal(false);
  };

  // ✅ Search filter
  const filteredParents = parents.filter((p) => {
    const studentNames = p.studentIds
      ?.map((s) => s.fullName)
      .join(" ")
      .toLowerCase();
    return (
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.villageId?.villageName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      studentNames?.includes(searchTerm.toLowerCase())
    );
  });

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Parents List", 14, 10);
    autoTable(doc, {
      head: [["Parent Name", "Village", "Students", "Mobile"]],
      body: filteredParents.map((p) => [
        p.fullName,
        p.villageId?.villageName || "",
        p.studentIds?.map((s) => s.fullName).join(", "),
        p.mobile,
      ]),
    });
    doc.save("ParentsList.pdf");
  };

  // ✅ Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredParents.map((p) => ({
        "Parent Name": p.fullName,
        Village: p.villageId?.villageName || "",
        Students: p.studentIds?.map((s) => s.fullName).join(", "),
        Mobile: p.mobile,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parents");
    XLSX.writeFile(wb, "ParentsList.xlsx");
  };

  if (loading) return <p className="text-center mt-4">Loading parents...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">👨‍👩‍👧 All Parents</h2>

      {/* ✅ Search & Export buttons */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search by parent, village, student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col className="text-end">
          <Button
            variant="success"
            className="me-2"
            size="sm"
            onClick={exportExcel}
          >
            Export Excel
          </Button>
          <Button variant="danger" size="sm" onClick={exportPDF}>
            Export PDF
          </Button>
        </Col>
      </Row>

      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Parent Name</th>
            <th>Village</th>
            <th>Phone</th>
            <th>Students</th>
            <th>WhatsApp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredParents.map((parent, index) => (
            <tr key={parent._id}>
              <td>{index + 1}</td>
              <td>{parent.fullName}</td>
              <td>{parent.villageId?.villageName || "N/A"}</td>
              <td>{parent.mobile}</td>
              <td>
                {parent.studentIds?.map((stu) => (
                  <div key={stu._id}>
                    {stu.fullName} ({stu.classId?.name || "No Class"})
                  </div>
                ))}
              </td>
              <td className="text-center">
                <a
                  href={`https://wa.me/${parent.mobile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-success fs-4"
                >
                  <FaWhatsapp />
                </a>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  className="me-2"
                  onClick={() => setSelectedParent(parent)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setEditData(parent);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(parent._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* View Modal */}
      <Modal show={!!selectedParent} onHide={() => setSelectedParent(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Parent Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedParent && (
            <>
              <p>
                <strong>Name:</strong> {selectedParent.fullName}
              </p>
              <p>
                <strong>Phone:</strong> {selectedParent.mobile}
              </p>
              <p>
                <strong>Village:</strong>{" "}
                {selectedParent.villageId?.villageName}
              </p>
              <hr />
              <h6>Students</h6>
              {selectedParent.studentIds?.length > 0 ? (
                <ul>
                  {selectedParent.studentIds.map((stu) => (
                    <li key={stu._id}>
                      {stu.fullName} — Class: {stu.classId?.name || "N/A"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No students assigned</p>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Parent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={editData.fullName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, fullName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                value={editData.mobile || ""}
                onChange={(e) =>
                  setEditData({ ...editData, mobile: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={editData.address || ""}
                onChange={(e) =>
                  setEditData({ ...editData, address: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllParents;
