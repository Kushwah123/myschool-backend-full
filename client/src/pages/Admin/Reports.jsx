// // src/pages/Admin/Reports.jsx
// import React, { useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchFeeStructures } from '../../redux/slices/feeSlice';
// import { fetchResults } from '../../redux/slices/resultSlice';
// import { Card, Table, Button } from 'react-bootstrap';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
// import { useReactToPrint } from 'react-to-print';
// import * as XLSX from 'xlsx';

// const Reports = () => {
//   const dispatch = useDispatch();
//   const { feeStructures } = useSelector((state) => state.fees);
//   const { results } = useSelector((state) => state.results);
//   const printRef = useRef();

//   useEffect(() => {
//     dispatch(fetchFeeStructures());
//     dispatch(fetchResults());
//   }, [dispatch]);

//   const handlePrint = useReactToPrint({ content: () => printRef.current });

//   const handleExportExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(feeStructures);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'FeeReports');
//     XLSX.writeFile(workbook, 'Fee_Report.xlsx');
//   };

//   return (
//     <div className="container mt-4" ref={printRef}>
//       <h2 className="mb-4">Reports</h2>

//       <Card className="mb-4">
//         <Card.Header>Fee Structures</Card.Header>
//         <Card.Body>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Class</th>
//                 <th>Type</th>
//                 <th>Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {feeStructures.map((fee, index) => (
//                 <tr key={index}>
//                   <td>{fee.className || fee.classId?.name}</td>
//                   <td>{fee.type}</td>
//                   <td>₹{fee.amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>

//       <Card className="mb-4">
//         <Card.Header>Result Statistics</Card.Header>
//         <Card.Body style={{ height: 300 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={results}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="studentName" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="percentage" fill="#007bff" />
//             </BarChart>
//           </ResponsiveContainer>
//         </Card.Body>
//       </Card>

//       <div className="d-flex gap-3">
//         <Button onClick={handlePrint}>Download PDF</Button>
//         <Button onClick={handleExportExcel} variant="success">Export Excel</Button>
//       </div>
//     </div>
//   );
// };

// export default Reports;