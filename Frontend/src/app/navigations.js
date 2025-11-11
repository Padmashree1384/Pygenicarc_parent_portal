// app/navigations.js - Complete navigation configuration
export default [
  // ===============================================
  // DASHBOARD SECTION
  // ===============================================
  {
    label: "Dashboard",
    type: "label"
  },
  {
    name: "Default Dashboard",
    path: "/dashboard/default",
    icon: "dashboard"
  },
  
  // ===============================================
  // STUDENT SECTION
  // ===============================================
  {
    label: "Student Information",
    type: "label"
  },
  {
    name: "Student Profile",
    path: "/student/profile",
    icon: "person",
    badge: { title: "Main" }
  },
  {
    name: "My Children",
    path: "/dashboard/children",
    icon: "people"
  },
  
  // ===============================================
  // ACADEMICS SECTION
  // ===============================================
  {
    label: "Academics",
    type: "label"
  },
  {
    name: "Academic Progress",
    path: "/academics/progress",
    icon: "assessment",
    badge: { title: "New" }
  },
  
  // ===============================================
  // ATTENDANCE SECTION
  // ===============================================
  {
    label: "Attendance",
    type: "label"
  },
  {
    name: "Attendance Tracking",
    path: "/attendance",
    icon: "calendar_today"
  },
  
  // ===============================================
  // FUTURE FEATURES (Commented Out)
  // ===============================================
  
  // ADDITIONAL ACADEMICS
  // {
  //   name: "Exam Schedule",
  //   path: "/academics/exams",
  //   icon: "event"
  // },
  // {
  //   name: "Assignments",
  //   path: "/academics/assignments",
  //   icon: "assignment"
  // },
  
  // ATTENDANCE FEATURES
  // {
  //   name: "Leave Requests",
  //   path: "/attendance/leave",
  //   icon: "event_busy"
  // },
  
  // COMMUNICATION SECTION
  // {
  //   label: "Communication",
  //   type: "label"
  // },
  // {
  //   name: "Messages",
  //   path: "/communication/messages",
  //   icon: "message"
  // },
  // {
  //   name: "Notifications",
  //   path: "/communication/notifications",
  //   icon: "notifications"
  // },
  // {
  //   name: "Teacher Feedback",
  //   path: "/communication/feedback",
  //   icon: "feedback"
  // },
  
  // PAYMENTS SECTION
  // {
  //   label: "Payments",
  //   type: "label"
  // },
  // {
  //   name: "Fee Structure",
  //   path: "/payments/structure",
  //   icon: "receipt"
  // },
  // {
  //   name: "Payment History",
  //   path: "/payments/history",
  //   icon: "history"
  // },
  // {
  //   name: "Make Payment",
  //   path: "/payments/pay",
  //   icon: "payment"
  // },
  
  // SETTINGS SECTION
  // {
  //   label: "Settings",
  //   type: "label"
  // },
  // {
  //   name: "Profile Settings",
  //   path: "/settings/profile",
  //   icon: "settings"
  // },
  // {
  //   name: "Change Password",
  //   path: "/settings/password",
  //   icon: "lock"
  // },
];