# Routine Master App 📅

A productivity application designed to help users manage their daily routines and one-time tasks effectively, with additional features like alarms and a calendar view for better organization.

---

## **Features**

### 1. **User Authentication**  
   - **Sign In/Sign Up**:  
     Users can create an account or log in to an existing one using secure authentication.  
     - Firebase Authentication for email/password login.
     - OAuth support (e.g., Google or Facebook login) can be integrated in future versions.

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
