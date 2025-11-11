import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  LinearProgress,
  Stack,
  Button,
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  AssignmentTurnedIn as AttendanceIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { getStudentProfile } from "../services/api";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError(null);
    
    const data = await getStudentProfile();
    console.log("Profile data:", data);
    
    if (data) {
      setProfile(data);
    } else {
      setError("Failed to load student profile. Please try again.");
    }
    
    setLoading(false);
  }

  function handleRefresh() {
    loadProfile();
  }

  // Calculate age from date of birth
  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Get attendance status color
  function getAttendanceColor(percentage) {
    if (percentage >= 90) return "success";
    if (percentage >= 75) return "warning";
    return "error";
  }

  // Get grade color
  function getGradeColor(grade) {
    if (grade.startsWith("A")) return "success";
    if (grade.startsWith("B")) return "primary";
    if (grade.startsWith("C")) return "warning";
    return "error";
  }

  // Get percentage color
  function getPercentageColor(percentage) {
    if (percentage >= 75) return "success.main";
    if (percentage >= 60) return "warning.main";
    if (percentage >= 40) return "warning.dark";
    return "error.main";
  }

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading Student Profile...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Alert severity="info">
          No student profile found. Please contact the school administrator.
        </Alert>
      </Box>
    );
  }

  const { personal_info, academic_info } = profile;

  return (
    <Box p={3}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Student Profile
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "primary.light", height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Overall Grade
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {academic_info.overall_grade}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  <GradeIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "success.light", height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Percentage
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {academic_info.overall_percentage}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56 }}>
                  <TrendingUpIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: academic_info.attendance_percentage >= 75 ? "success.light" : "warning.light", height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Attendance
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {academic_info.attendance_percentage}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: academic_info.attendance_percentage >= 75 ? "success.main" : "warning.main", width: 56, height: 56 }}>
                  <AttendanceIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "info.light", height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Class & Section
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {academic_info.class_name} - {academic_info.section}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "info.main", width: 56, height: 56 }}>
                  <SchoolIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Personal Information Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* Header with Avatar */}
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar 
              sx={{ 
                bgcolor: personal_info.gender === "M" ? "primary.main" : personal_info.gender === "F" ? "secondary.main" : "info.main",
                mr: 2, 
                width: 80, 
                height: 80,
                fontSize: "2rem"
              }}
            >
              {personal_info.first_name.charAt(0)}{personal_info.last_name.charAt(0)}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h4" fontWeight="bold">
                {personal_info.first_name} {personal_info.last_name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Student ID: {personal_info.student_id}
              </Typography>
            </Box>
            <Chip
              label={personal_info.status}
              color={personal_info.status === "active" ? "success" : personal_info.status === "inactive" ? "warning" : "default"}
              sx={{ textTransform: "capitalize", fontWeight: "bold" }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Personal Details Section */}
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <PersonIcon sx={{ mr: 1, color: "primary.main" }} /> Personal Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Date of Birth
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(personal_info.date_of_birth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Age: {calculateAge(personal_info.date_of_birth)} years
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Gender
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight="medium">
                  {personal_info.gender === "M" ? "Male" : personal_info.gender === "F" ? "Female" : "Other"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Contact Number
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight="medium">
                  {personal_info.contact_number || "Not provided"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Email Address
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight="medium" sx={{ wordBreak: "break-word" }}>
                  {personal_info.email || "Not provided"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1, height: "100%" }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <HomeIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight="medium">
                  {personal_info.address || "Not provided"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Academic Information Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <SchoolIcon sx={{ mr: 1, color: "primary.main" }} /> Academic Information
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: "primary.light", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Class & Section
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {academic_info.class_name}
                </Typography>
                <Typography variant="body1">
                  Section {academic_info.section}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Roll Number
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {academic_info.roll_number}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: getAttendanceColor(academic_info.attendance_percentage) + ".light", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Attendance
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {academic_info.attendance_percentage}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={academic_info.attendance_percentage} 
                  color={getAttendanceColor(academic_info.attendance_percentage)}
                  sx={{ mt: 1, height: 8, borderRadius: 1 }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: "success.light", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Overall Grade
                </Typography>
                <Chip
                  label={academic_info.overall_grade}
                  color={getGradeColor(academic_info.overall_grade)}
                  sx={{ fontSize: "1.25rem", fontWeight: "bold", height: 40, px: 2 }}
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Overall Performance Summary */}
          <Box sx={{ mb: 3, p: 3, bgcolor: "primary.light", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Overall Performance Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Marks Obtained
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {academic_info.total_marks_obtained}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Marks
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {academic_info.total_marks}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Overall Percentage
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {academic_info.overall_percentage}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={academic_info.overall_percentage} 
                  color="success"
                  sx={{ mt: 1, height: 10, borderRadius: 1 }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Grades Table */}
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", mt: 3, mb: 2 }}>
            <GradeIcon sx={{ mr: 1, color: "primary.main" }} /> Subject-wise Performance
          </Typography>

          {academic_info.grades && academic_info.grades.length > 0 ? (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.dark" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Subject</TableCell>
                    <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Marks Obtained</TableCell>
                    <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Total Marks</TableCell>
                    <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Percentage</TableCell>
                    <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Grade</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Exam</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {academic_info.grades.map((grade, index) => (
                    <TableRow 
                      key={index} 
                      hover
                      sx={{ 
                        "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                        "&:hover": { bgcolor: "action.hover" }
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight="medium">{grade.subject}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight="bold">{grade.marks_obtained}</Typography>
                      </TableCell>
                      <TableCell align="center">{grade.total_marks}</TableCell>
                      <TableCell align="center">
                        <Typography
                          fontWeight="bold"
                          color={getPercentageColor(grade.percentage)}
                        >
                          {grade.percentage}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={grade.grade}
                          color={getGradeColor(grade.grade)}
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell>{grade.exam_name}</TableCell>
                      <TableCell>
                        {new Date(grade.exam_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              No grades available yet. Grades will appear here once exams are conducted and results are published.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}