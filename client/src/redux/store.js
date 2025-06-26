// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import teacherReducer from './slices/teacherSlice';
import feeReducer from './slices/feeSlice';
import attendanceReducer from './slices/attendanceSlice';
import marksReducer from './slices/marksSlice';
import parentReducer from './slices/parentSlice';
import accountantReducer from './slices/accountantSlice';
import classReducer from './slices/classSlice'; // ✅ Add this
import homeworkReducer from './slices/homeworkSlice';
import subjectReducer from './slices/subjectSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    teachers: teacherReducer,
    fee: feeReducer,
    attendance: attendanceReducer,
    marks: marksReducer,
    parents: parentReducer,
    accountant: accountantReducer,
    class: classReducer,
    homework: homeworkReducer,
    subject: subjectReducer,
  },
});

export default store;
