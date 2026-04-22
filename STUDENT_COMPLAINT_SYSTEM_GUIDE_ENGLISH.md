# 🎓 School Management System - Student Complaint System Guide

## 📋 Overview
This guide will help you understand how student complaints are registered in the school system. This system is fully automated and sends notifications to students or their parents via WhatsApp.

---

## 👨‍🏫 1. Teacher: Raise Student Complaint

### 📍 Location: Teacher Panel → Complaint Form

### 🎯 Purpose:
Teacher raises a complaint against a student and automatically sends WhatsApp notification.

### 📝 How to Use:

#### **Step 1: Select Class**
```
Class: Class 6 A
```
- First select the class where the student is enrolled

#### **Step 2: Select Student**
```
Student: Rahul Kumar
```
- List of all students from selected class will appear

#### **Step 3: Choose Subject Template or Write Custom Subject**
**Pre-defined Templates:**
- Behavior issue (behavior related problem)
- Attendance concern (attendance related concern)
- Homework not submitted (not doing homework)
- Late arrival (coming late)
- Academic performance (academic performance)
- Uniform violation (uniform violation)
- Other (other)

**Or Custom Subject:**
```
Subject: Fighting in class
```

#### **Step 4: Write Detailed Description**
```
Description:
Rahul was fighting in class today. He physically assaulted his classmate and didn't listen to the teacher. This behavior violates school rules.
```

#### **Step 5: Click Create Complaint button**

### ✅ Result:
- Complaint is saved in database
- WhatsApp message is sent to student or parent
- Complaint status is set to "Open"

---

## 📱 2. WhatsApp Message Format

When complaint is raised, recipient receives this message:

```
*New Complaint Raised*

Student: Rahul Kumar
Teacher: Mr. Sharma (Mathematics Teacher)
Subject: Fighting in class
Description: Rahul was fighting in class today. He physically assaulted his classmate and didn't listen to the teacher. This behavior violates school rules.

Please respond to the teacher if needed.
```

---

## 📊 3. Complaint Status Tracking

### 📍 Status Types:

#### **🟢 Open**
- New complaint has been raised
- No action taken yet

#### **🟡 In Progress**
- Admin or teacher has started working on complaint
- Investigation is ongoing

#### **🔴 Resolved**
- Complaint has been resolved
- Case has been closed

---

## 🔍 4. Complaint Delivery System

### 📱 Priority Order:
1. **First Attempt:** Student's own mobile number
2. **Second Attempt:** Parent's mobile number (if student number not available)

### ✅ Success Conditions:
- Valid mobile number must be available
- WhatsApp service must be active
- Message must be delivered

### ❌ Failure Reasons:
- Student/Parent mobile number not registered
- Number invalid or wrong format
- WhatsApp service down
- Internet connection problem

---

## 👨‍💼 5. Admin: Complaint Management

### 📍 Location: Admin Panel → Complaints

### 🎯 Admin Role:
- View all complaints
- Update status
- Guide teachers
- Generate reports

### 📊 Dashboard:
```
📊 Complaint Statistics:
🟢 Open: 5
🟡 In Progress: 2
🔴 Resolved: 15
```

### 📋 Complaint Table:
| Student | Teacher | Subject | Status | Created | Actions |
|---------|---------|---------|--------|---------|---------|
| Rahul Kumar | Mr. Sharma | Fighting | 🟢 Open | 15/1/24 | 📄 View 🔄 Update |

### 🎯 Actions:
- **📄 View:** See full complaint details
- **🔄 Update:** Change status (Open → In Progress → Resolved)

---

## 📋 6. Complete Complaint Workflow

### 🎯 School complaint process:

```
1. Teacher raises complaint
   ├── Selects class and student
   ├── Writes subject and description
   ├── Presses Create Complaint button

2. System automatically:
   ├── Saves complaint in database
   ├── Finds student's mobile number
   ├── If not found, gets parent's number
   ├── Prepares WhatsApp message
   └── Sends message to recipient

3. Status tracking:
   ├── Initially: Open
   ├── Admin investigates: In Progress
   ├── Solution found: Resolved

4. WhatsApp delivery:
   ├── Success: Note in complaint record
   ├── Fail: Admin gets notified
   └── Manual follow-up done
```

---

## 🔧 7. Backend Architecture

### 📊 Database Schema (Complaint Model):
```javascript
{
  studentId: ObjectId (ref: 'Student'),
  teacherId: ObjectId (ref: 'User'),
  subject: String (required),
  description: String (required),
  status: Enum ['Open', 'In Progress', 'Resolved'],
  whatsappSent: Boolean,
  whatsappResult: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

### 🛠️ API Endpoints:

#### **POST /complaints**
- Creates complaint
- Sends WhatsApp notification
- Teacher access only

#### **GET /complaints**
- Lists all complaints
- Admin access only

#### **GET /complaints/student/:studentId**
- Specific student's complaints
- Admin access

#### **GET /complaints/teacher/:teacherId**
- Specific teacher's complaints
- Teacher and Admin access

---

## 📱 8. How WhatsApp Integration Works

### 🔧 Message Preparation Process:

1. **Collect complaint data:**
   ```javascript
   const complaintData = {
     studentName: student.fullName,
     teacherName: teacher.name,
     subject: complaint.subject,
     description: complaint.description
   }
   ```

2. **Create message format:**
   ```javascript
   const message = `*New Complaint Raised*\n\nStudent: ${studentName}\nTeacher: ${teacherName}\nSubject: ${subject}\nDescription: ${description}\n\nPlease respond to the teacher if needed.`
   ```

3. **Find phone number:**
   ```javascript
   // First: Student's number
   let phoneNumber = student.mobile

   // If not, parent's number
   if (!phoneNumber) {
     const parent = await Parent.findOne({ studentIds: student._id })
     phoneNumber = parent.mobile
   }
   ```

4. **Send via WhatsApp service:**
   ```javascript
   const result = await whatsappService.sendMessage(phoneNumber, message)
   ```

5. **Save result:**
   ```javascript
   complaint.whatsappSent = result.success
   complaint.whatsappResult = result
   ```

---

## ⚠️ 9. Important Rules & Caveats

### 📝 Complaint Creation Rules:

#### **✅ Required Fields:**
- Class (select class)
- Student (select student)
- Subject (template or custom)
- Description (detailed description)

#### **✅ Authorization:**
- Only teachers can raise complaints
- Admin can manage all complaints
- Students or parents cannot raise complaints

### 🚫 Restrictions:

#### **For Teacher:**
- Can only raise complaints for students in their class
- Can raise multiple complaints for same student
- Cannot change complaint status (only admin)

#### **For Admin:**
- Can view all complaints
- Can update status
- Cannot delete complaints (only update)

### 📊 WhatsApp Delivery:

#### **Delivery Priority:**
```
1. Student's mobile number
2. Parent's mobile number
3. If both not available, note in complaint record
```

#### **Success Rate Calculation:**
```
Total Complaints = All complaints
WhatsApp Sent = How many received message
WhatsApp Failed = How many didn't receive message
```

---

## 🆘 10. Common Problems & Solutions

### ❌ **Problem: Complaint not submitting**
**Solution:**
- Check if all fields are filled
- Check if class and student are selected
- Check if you are logged in

### ❌ **Problem: WhatsApp message not sent**
**Solution:**
- Check if student/parent mobile number is registered
- Check if WhatsApp service is ready
- Contact admin for manual notification

### ❌ **Problem: Student list not showing**
**Solution:**
- Check if class is selected
- Check if class has students
- Refresh the page

### ❌ **Problem: Subject template not working**
**Solution:**
- Select "Other" for custom subject
- Or use pre-defined templates

---

## 📞 11. Support & Help

### 🆘 If any problem occurs:

1. **For Teacher:**
   - Check complaint form
   - Fill all fields
   - Check WhatsApp status

2. **For Admin:**
   - Check complaint management page
   - Check WhatsApp service status
   - Validate mobile numbers

3. **Technical Support:**
   - Check server logs
   - Check WhatsApp connection
   - Check database connection

---

## 🎯 12. Best Practices

### 👨‍🏫 For Teacher:
- **Write clear subjects:** "Fighting in class" not "Bad behavior"
- **Give detailed description:** What happened, when, who was involved
- **Use templates:** Use pre-defined subjects where possible
- **Keep factual:** More observations than personal opinions

### 👨‍💼 For Admin:
- **Monitor regularly:** Check new complaints
- **Timely response:** Update status
- **Follow up:** Track resolved complaints
- **Generate reports:** Analyze complaint trends

### 📱 For WhatsApp:
- **Keep valid numbers updated:** Student and parent numbers
- **Monitor service:** Keep WhatsApp connection checked
- **Backup plan:** SMS or call if WhatsApp fails

---

## 📋 13. Complaint Category Guide

### 🎯 Common Complaint Types:

#### **📚 Academic:**
- Homework not submitted (not doing homework)
- Poor performance (poor performance)
- Not paying attention (not paying attention)

#### **👥 Behavioral:**
- Fighting in class (fighting in class)
- Bullying (bullying)
- Disrespect to teacher (disrespecting teacher)

#### **⏰ Attendance Related:**
- Late arrival (late arrival)
- Early departure (early departure)
- Absent without notice (absent without notice)

#### **👔 Disciplinary:**
- Uniform violation (uniform violation)
- Mobile phone usage (mobile phone usage)
- Breaking school rules (breaking school rules)

---

**🎉 Congratulations! Now you fully understand the school's complaint management system!** 🚀

**💡 Remember:** This system automatically notifies parents, which helps improve student behavior and keeps parents involved.</content>
<parameter name="filePath">d:\backend\myschool-backend-full\STUDENT_COMPLAINT_SYSTEM_GUIDE_ENGLISH.md