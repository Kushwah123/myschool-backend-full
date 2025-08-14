import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeesParentWise } from "../../redux/slices/feeSlice";
import { fetchVillages } from "../../redux/slices/villageSlice";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { FaWhatsapp, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FeeCollection from "./FeeCollection"; // <-- import your modal

const FeeHistory = () => {
  const dispatch = useDispatch();
  const { parentFees = [], loading } = useSelector((state) => state.fees || {});
  const { list: villages = [] } = useSelector((state) => state.village);

  const [search, setSearch] = useState("");
  const [villageFilter, setVillageFilter] = useState("");
  const [villageMap, setVillageMap] = useState({});
  const [showCollect, setShowCollect] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);

  useEffect(() => {
    dispatch(fetchFeesParentWise());
    dispatch(fetchVillages());
  }, [dispatch]);

  useEffect(() => {
    const map = {};
    villages.forEach((v) => {
      map[v._id] = v.villageName;
    });
    setVillageMap(map);
  }, [villages]);

  const getVillageName = (villageId) => {
    if (!villageId) return "N/A";
    if (typeof villageId === "object" && villageId.villageName) return villageId.villageName;
    return villageMap[villageId] || "N/A";
  };

  const filteredData = parentFees.filter((item) => {
    const parentName = (item.parentId?.fullName || "").toLowerCase();
    const parentMobile = (item.parentId?.mobile || "").toLowerCase();
    const villageName = getVillageName(item.villageId).toLowerCase();
    const studentNames = (item.parentId?.students || [])
      .map((s) => (s.fullName || "").toLowerCase())
      .join(" ");

    const searchText = search.toLowerCase();
    const matchesSearch =
      !searchText ||
      parentName.includes(searchText) ||
      parentMobile.includes(searchText) ||
      villageName.includes(searchText) ||
      studentNames.includes(searchText);

    const matchesVillage = !villageFilter || getVillageName(item.villageId) === villageFilter;
    return matchesSearch && matchesVillage;
  });

  const villageOptions = [
    ...new Set(parentFees.map((p) => getVillageName(p.villageId)).filter((name) => name !== "N/A")),
  ];

  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "A4" });
    doc.setFontSize(14);
    doc.text("📜 Assigned Fee History", 40, 40);

    const head = [["Parent Name", "Mobile", "Village", "Students", "Total Amount", "Opening Balance"]];
    const body = filteredData.map((item) => [
      item.parentId?.fullName || "N/A",
      item.parentId?.mobile || "N/A",
      getVillageName(item.villageId),
      (item.parentId?.students || []).map((s) => s.fullName).join(", "),
      `₹${item.totalAmount ?? 0}`,
      `₹${item.openingBalance ?? 0}`,
    ]);

    autoTable(doc, {
      startY: 60,
      head,
      body,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { left: 40, right: 40 },
    });

    doc.save("assigned-fees.pdf");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📜 Assigned Fee History</h3>

      {/* Search & Filter */}
      <Row className="align-items-center mb-3 g-2">
        <Col xs={12} sm={4}>
          <Form.Control
            size="sm"
            type="text"
            placeholder="Search by any field..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs={12} sm={4}>
          <Form.Select
            size="sm"
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          >
            <option value="">All Villages</option>
            {villageOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} sm={4}>
          <Button size="sm" variant="danger" onClick={exportPDF}>
            <FaFilePdf /> Export PDF
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Table striped bordered hover responsive size="sm" className="align-middle">
        <thead className="table-dark">
          <tr>
            <th>Parent Name</th>
            <th>Mobile</th>
            <th>Village</th>
            <th>Students</th>
            <th>Total Amount</th>
            <th>Opening Balance</th>
            <th>Installments</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, idx) => (
            <tr key={idx}>
              <td>{item.parentId?.fullName}</td>
              <td>{item.parentId?.mobile}</td>
              <td>{getVillageName(item.villageId)}</td>
              <td>
                <ul className="mb-0 ps-3">
                  {(item.parentId?.studentIds || []).map((student, si) => (
                    <li key={si}>{student.fullName}</li>
                  ))}
                </ul>
              </td>
              <td>₹{item.totalAmount}</td>
              <td>₹{item.openingBalance}</td>
              <td>
                {item.installments.map((inst, i) => (
                  <div key={i} className="d-flex align-items-center mb-1">
                    <span>
                      ₹{inst.amount} — {new Date(inst.dueDate).toLocaleDateString()}
                    </span>
                    {inst.status === "paid" && (
                      <span className="badge bg-success ms-2">Paid</span>
                    )}
                    {inst.status === "pending" && (
                      <span className="badge bg-warning ms-2">Pending</span>
                    )}
                    {inst.status === "overdue" && (
                      <span className="badge bg-danger ms-2">
                        Overdue + ₹{inst.lateFee} Late Fee
                      </span>
                    )}
                    {inst.status !== "paid" && (
                      <Button
                        size="sm"
                        className="ms-2"
                        onClick={() => {
                          setSelectedInstallment(inst);
                          setSelectedFeeId(item._id);
                          setSelectedParent(item.parentId);
                          setShowCollect(true);
                        }}
                      >
                        Collect
                      </Button>
                    )}
                  </div>
                ))}
              </td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => window.open(`https://wa.me/${item.parentId?.mobile}`, "_blank")}
                >
                  <FaWhatsapp /> Chat
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for collection */}
      {showCollect && (
        <FeeCollection
          show={showCollect}
          onHide={(didChange) => {
            setShowCollect(false);
            if (didChange) dispatch(fetchFeesParentWise());
          }}
          assignedFeeId={selectedFeeId}
          installment={selectedInstallment}
          parent={selectedParent}
        />
      )}
    </div>
  );
};

export default FeeHistory;
