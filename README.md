# 🏫 School Management System (MERN Stack)

A full-featured School Management Web Application built using **MERN Stack** with role-based login for Admin, Teacher, Student, and Parent. The system streamlines academic and administrative workflows including student management, attendance, marks, fee collection, and more.

---

## 🚀 Features

### ✅ **Multi-Role Authentication (JWT-based)**
- Admin, Teacher, Student, and Parent login
- Protected routes and role-based access control

### 🎓 **Student & Teacher Management**
- Register/update students and teachers
- Auto-generate roll numbers
- Assign students to classes and parents

### 📚 **Academic Modules**
- Class and subject creation
- Assign teachers to subjects/classes
- Mark attendance and assign marks
- Upload/view homework

### 💸 **Fees Management System**
- Create dynamic fee structures with installments
- Assign fee plans to students/parents
- Collect payments, generate PDF receipts
- Send SMS alerts on successful payment

### 🧾 **Parent Integration**
- Link one parent to multiple students
- Parents can view student progress and fees

### 📱 **Modern UI & UX**
- Fully responsive frontend built with **React-Bootstrap**
- Clean layout with reusable components
- Redux Toolkit for global state management

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Redux Toolkit, React-Bootstrap
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT (JSON Web Token)
- **Other Tools**: Cloudinary, Multer, PDFKit, SMS Gateway (mobile-based)

---

## 📁 Folder Structure Overview

```bash
project-root/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── redux/
├── backend/             # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middlewares/
