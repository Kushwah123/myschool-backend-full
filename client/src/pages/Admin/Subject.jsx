import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../redux/slices/subjectSlice";
import { fetchClasses } from "../../redux/slices/classSlice";

const Subject = () => {
  const dispatch = useDispatch();
  const { subjects, status, error } = useSelector((state) => state.subject);
  const { classes } = useSelector((state) => state.class);

  const [showModal, setShowModal] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectClassId, setSubjectClassId] = useState("");
  const [editId, setEditId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchClasses());
  }, [dispatch]);

  const openModalForAdd = () => {
    setSubjectName("");
    setEditId(null);
    setShowModal(true);
  };

  const openModalForEdit = (subject) => {
    setSubjectName(subject.name);
    setSubjectClassId(subject.classId?._id || subject.classId || "");
    setEditId(subject._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubjectName("");
    setSubjectClassId("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectClassId) return;
    setLoadingAction(true);

    try {
      if (editId) {
        await dispatch(updateSubject({ id: editId, updates: { name: subjectName, classId: subjectClassId } })).unwrap();
      } else {
        await dispatch(createSubject({ name: subjectName, classId: subjectClassId })).unwrap();
      }
      closeModal();
    } catch (err) {
      console.error("Error creating/updating subject:", err);
    }
    setLoadingAction(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    setLoadingAction(true);
    try {
      await dispatch(deleteSubject(id)).unwrap();
    } catch (err) {
      console.error("Error deleting subject:", err);
    }
    setLoadingAction(false);
  };

  const renderError = () => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    return JSON.stringify(error);
  };

  return (
    <div className="container mt-4">
      <h3>Subject Management</h3>

      {error && <Alert variant="danger">{renderError()}</Alert>}

      <Button variant="primary" className="mb-3" onClick={openModalForAdd}>
        ➕ Add Subject
      </Button>

      {status === "loading" ? (
        <Spinner animation="border" />
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Subject Name</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length ? (
              subjects.map((subj, i) => {
                const classIdValue = subj.classId?._id || subj.classId;
                const classObj = classes.find((cls) => cls._id === classIdValue);
                const className = classObj?.name || subj.classId?.name || (typeof subj.classId === 'string' ? subj.classId : 'Unknown');
                return (
                  <tr key={subj._id}>
                    <td>{i + 1}</td>
                    <td>{subj.name}</td>
                    <td>{className}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => openModalForEdit(subj)}
                        className="me-2"
                        disabled={loadingAction}
                      >
                        ✏ Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={loadingAction}
                        onClick={() => handleDelete(subj._id)}
                      >
                        🗑 Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Subject" : "Add Subject"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="subjectName" className="mb-3">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
                autoFocus
                disabled={loadingAction}
              />
            </Form.Group>
            <Form.Group controlId="subjectClass" className="mb-3">
              <Form.Label>Class</Form.Label>
              <Form.Select
                value={subjectClassId}
                onChange={(e) => setSubjectClassId(e.target.value)}
                required
                disabled={loadingAction}
              >
                <option value="">Select class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {`${cls.name} ${cls.section || ''}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={loadingAction}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loadingAction}>
              {loadingAction ? (
                <Spinner animation="border" size="sm" />
              ) : editId ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Subject;
