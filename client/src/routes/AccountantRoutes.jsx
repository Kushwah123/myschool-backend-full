import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AccountantDashboard from '../pages/Accountant/Dashboard';
import FeeCollection from '../pages/Accountant/FeeCollection';
import Receipts from '../pages/Accountant/Receipts';
import AssignFee from '../pages/Accountant/AssignFee';
import AddParent from "../pages/Admin/AddParent";
import AddStudent from '../pages/Admin/AddStudent';
import AllStudents from '../pages/Admin/AllStudents';
import FeeStructure from '../pages/Admin/FeeStructure';



const AccountantRoutes = () => {
  return ( 
    <Routes>
      <Route path="/dashboard" element={<AccountantDashboard />} />
      <Route path="/collect-fee" element={<FeeCollection />}  />
      <Route path="/receipts" element={<Receipts />} />
      <Route  path="/assign-fee"  element={<AssignFee />}/>
      <Route path="/add-student" element={<AddStudent />} />
      <Route path="/add-parent" element={<AddParent />} />
      <Route path="/all-students" element={<AllStudents />} />
      <Route path="/fee-structure" element={<FeeStructure />} />
      
    </Routes>
  );
};

export default AccountantRoutes;
