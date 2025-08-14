import React from 'react';
import RoleLayout from './RoleLayout';
import Header from '../components/Header';
import Sidebar from '../pages/Teacher/Sidebar';
import { Outlet } from 'react-router-dom';

const TeacherLayout = ()  => {
  return (
    <RoleLayout Sidebar={Sidebar} Header={Header}>

      <Outlet />
    </RoleLayout>
  );
};

export default TeacherLayout;
