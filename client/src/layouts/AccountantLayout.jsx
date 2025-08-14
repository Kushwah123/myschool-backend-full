import React from 'react';
import RoleLayout from './RoleLayout';
import Header from '../components/Header';
import Sidebar from '../pages/Accountant/Sidebar';
import { Outlet } from 'react-router-dom';

const AccountantLayout = ()  => {
  return (
    <RoleLayout Sidebar={Sidebar} Header={Header}>

      <Outlet />
    </RoleLayout>
  );
};

export default AccountantLayout;
