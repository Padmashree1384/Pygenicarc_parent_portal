import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "./components/Loadable";
import ParcLayout from "./components/ParcLayout/ParcLayout";

// ============= BASE TEMPLATE PAGES (KEEP ALL) =============
const Dashboard = Loadable(lazy(() => import("./views/dashboard/Dashboard")));

// ============= YOUR EXISTING AUTH PAGES =============
const Login = Loadable(lazy(() => import("./pages/Login")));
const Signup = Loadable(lazy(() => import("./pages/Signup")));
const StudentProfile = Loadable(lazy(() => import("./pages/StudentProfile")));
const ChildrenList = Loadable(lazy(() => import("./pages/ChildrenList")));
const ChildDetail = Loadable(lazy(() => import("./pages/ChildDetail")));
const AttendanceTracking = Loadable(lazy(() => import("./pages/AttendanceTracking")));
const AcademicProgress = Loadable(lazy(() => import("./pages/AcademicProgress")));
const NotFound = Loadable(lazy(() => import("./pages/NotFound")));

// ============= PROTECTED ROUTE WRAPPER =============
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" replace />;
}

// ============= ROUTES CONFIGURATION =============
const routes = [
  // ========== PUBLIC ROUTES (No Layout) ==========
  { 
    path: "/login", 
    element: <Login /> 
  },
  { 
    path: "/signup", 
    element: <Signup /> 
  },
  
  // ========== ROOT REDIRECT ==========
  { 
    path: "/", 
    element: <Navigate to="/login" replace /> 
  },
  
  // ========== PROTECTED ROUTES (With ParcLayout Base Template) ==========
  {
    element: <ParcLayout />,
    children: [
      // BASE TEMPLATE - Default Dashboard
      { 
        path: "/dashboard/default", 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      
      // STUDENT PROFILE - Main profile page (first child or selected child)
      { 
        path: "/student/profile", 
        element: (
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        )
      },
      
      // CHILDREN LIST - All children cards
      { 
        path: "/dashboard/children", 
        element: (
          <ProtectedRoute>
            <ChildrenList />
          </ProtectedRoute>
        )
      },
      
      // SPECIFIC CHILD DETAIL - Individual child profile with ID parameter
      { 
        path: "/dashboard/student/:childId", 
        element: (
          <ProtectedRoute>
            <ChildDetail />
          </ProtectedRoute>
        )
      },

      // ATTENDANCE TRACKING - View attendance details
      { 
        path: "/attendance", 
        element: (
          <ProtectedRoute>
            <AttendanceTracking />
          </ProtectedRoute>
        )
      },

      // ACADEMIC PROGRESS - View marks, grades, and download report cards
      { 
        path: "/academics/progress", 
        element: (
          <ProtectedRoute>
            <AcademicProgress />
          </ProtectedRoute>
        )
      },
      
      // LEGACY ROUTES - Redirects for backward compatibility
      { 
        path: "/parent/dashboard", 
        element: <Navigate to="/dashboard/children" replace />
      },
    ]
  },
  
  // ========== 404 HANDLING ==========
  { 
    path: "/404", 
    element: <NotFound /> 
  },
  { 
    path: "*", 
    element: <Navigate to="/404" replace /> 
  }
];

export default routes;