import React from 'react';
import RoleLayout from './RoleLayout';
import Header from '../components/Header';
import Sidebar from '../pages/Admin/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <RoleLayout Sidebar={Sidebar} Header={Header}>
      <Outlet />
    </RoleLayout>
  );
};

export default AdminLayout;
