// Base API URL - Update this to match your backend
const API_BASE_URL = "http://localhost:8000/api";

// Generic API call helper
async function apiCall(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("access");
    const headers = {
      "Content-Type": "application/json",
    };
    
    // Only add Authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers, // Allow overriding headers
      },
    });

    const data = await response.json();
    
    // For login, return data even if 400 (so caller can handle errors)
    // For other endpoints, return null on error
    if (!response.ok && endpoint !== "/accounts/token/") {
      console.error(`API Error: ${response.status}`, data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error);
    return null;
  }
}

// Login API
export async function login(credentials) {
  const res = await fetch(`${API_BASE_URL}/accounts/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials), // must be { username: email, password }
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// Signup API
export async function signup(userData) {
  return apiCall("/accounts/signup/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Get My Students API
export async function getMyStudents(accessToken) {
  const res = await fetch(`${API_BASE_URL}/students/my-students/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// Get Student Profile API - FIXED VERSION
export async function getStudentProfile() {
  const accessToken = localStorage.getItem("access");
  
  // Use the proper profile endpoint that includes grades
  const res = await fetch(`${API_BASE_URL}/students/profile/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!res.ok) {
    console.error("Failed to fetch student profile:", res.status);
    return null;
  }
  
  const data = await res.json().catch(() => null);
  console.log("Student Profile API Response:", data); // DEBUG
  
  return data;
}

// Get Attendance Data for a specific month
export async function getAttendanceData(year, month) {
  const accessToken = localStorage.getItem("access");
  
  const res = await fetch(
    `${API_BASE_URL}/students/attendance/?year=${year}&month=${month}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  if (!res.ok) {
    console.error("Failed to fetch attendance data:", res.status);
    return null;
  }
  
  const data = await res.json().catch(() => null);
  return data;
}

// Get Attendance Notifications (absence alerts)
export async function getAttendanceNotifications() {
  const accessToken = localStorage.getItem("access");
  
  const res = await fetch(`${API_BASE_URL}/students/notifications/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!res.ok) {
    console.error("Failed to fetch notifications:", res.status);
    return null;
  }
  
  const data = await res.json().catch(() => null);
  return data;
}

// Mark a notification as read
export async function markNotificationRead(notificationId) {
  const accessToken = localStorage.getItem("access");
  
  const res = await fetch(
    `${API_BASE_URL}/students/notifications/${notificationId}/read/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  return res.ok;
}