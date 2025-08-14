import React from 'react';
import RoleLayout from './RoleLayout';
import Header from '../components/Header';
import Sidebar from '../pages/Parent/Sidebar';
import { Outlet } from 'react-router-dom';

const ParentLayout = ()  => {
  return (
    <RoleLayout Sidebar={Sidebar} Header={Header}>

      <Outlet />
    </RoleLayout>
  );
};

export default ParentLayout;
