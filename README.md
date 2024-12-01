# Routine Master App 📅

A productivity application designed to help users manage their daily routines and one-time tasks effectively, with additional features like alarms and a calendar view for better organization.

---

## **Features**

### 1. **User Authentication**  
   - **Sign In/Sign Up**:  
     Users can create an account or log in to an existing one using secure authentication.  
     - Firebase Authentication for email/password login.
     - OAuth support , Google.

---

### 2. **Daily Routine Management**  
   - Users can create, update, or delete daily routines.  
   - Routine tasks are displayed in an intuitive, organized format.  
   - Recurrent tasks are saved and displayed daily.

---

### 3. **One-Time Task Management**  
   - Add tasks that need to be completed on a specific date and time.  
   - Tasks are displayed on an interactive calendar for easy visualization.  
   - Users can view  present and future tasks on the calendar.

---

### 4. **Alarm Functionality**  
   - Alarms can be set for both daily routines and one-time tasks.    
   - Customizable alarm tones and snooze options.

---

## **Technical Stack**

| **Technology**    | **Purpose**                                 |
|--------------------|---------------------------------------------|
| **TypeScript**     | Core development for scalable logic.       |
| **JavaScript**     | Interactive functionality and dynamic UI.  |
| **Firebase**       | Backend services for authentication, database, and notifications. |
| **HTML/CSS**       | Frontend structure and styling.            |

---

## **Project Architecture**

```plaintext
src/
├── components/
│   ├── Auth/
│   │   ├── SignIn.js
│   │   ├── SignUp.js
│   └── Routine/
│       ├── DailyRoutine.js
│       ├── OneTimeTask.js
├── services/
│   ├── firebase.js
│   ├── alarmService.js
├── utils/
│   ├── calendarHelper.js
│   └── notificationHelper.js
├── App.js
├── index.js
```

## **Developer Contact Information**

- **Phone Number**: +91 9026425459  
- **Email**: devaaman8@gmail.com  
- **Address**: Rafiganj, Aurangabad, Bihar 824125  
- **Business Hours**: Monday to Friday, 10:00 AM to 6:00 PM IST

# **License**

## Copyright (C) Aman Deva 2024. All Rights Reserved.

This repository and its content are the proprietary property of Aman Deva. Unauthorized use, reproduction, or distribution of the content is strictly prohibited without prior written permission.

### **Terms of Use**
- The content in this repository is provided for personal viewing only.
- Copying, modifying, publishing, or redistributing any files from this repository is prohibited without explicit authorization.
- Commercial use of this repository or its content is strictly forbidden.

### **Permissions**
For permissions or inquiries, contact:  
**Email**: devaaman8@gmail.com  
**Phone**: +91 9026425459

---

### Disclaimer
This software is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the author be liable for any claim, damages, or other liability.
