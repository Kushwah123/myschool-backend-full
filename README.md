<img width="1243" height="772" alt="Login" src="https://github.com/user-attachments/assets/91f8d687-8bd2-45d1-92f0-54326cf7810a" />

# 🏫 School Management System (MERN Stack)

A full-featured School Management Web Application built using **MERN Stack** with role-based login for Admin, Teacher, Student, and Parent. The system streamlines academic and administrative workflows including student management, attendance, marks, fee collection, and more.

---
<img width="1890" height="892" alt="Admin-Penal" src="https://github.com/user-attachments/assets/37c235a2-ebab-41d2-b04f-385b2c264773" />
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
- <img width="1894" height="883" alt="Teacher-Penal" src="https://github.com/user-attachments/assets/68f09ff2-afe5-42b5-a5f7-8dddb428aa4e" />


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
