import React from 'react';
import RoleLayout from './RoleLayout';
import Header from '../components/Header';
import SidebarWithSimSetup from '../pages/Admin/SidebarWithSimSetup';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <RoleLayout Sidebar={SidebarWithSimSetup} Header={Header}>
      <Outlet />
    </RoleLayout>
  );
};

export default AdminLayout;
