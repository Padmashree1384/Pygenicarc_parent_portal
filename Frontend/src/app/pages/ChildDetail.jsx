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
  Button,
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { getChildProfile } from "../services/api";

export default function ChildDetail() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [childId]);

  async function loadProfile() {
    setLoading(true);
    setError(null);

    const data = await getChildProfile(childId);
    console.log("Child profile data:", data);

    if (data) {
      setProfile(data);
    } else {
      setError("Failed to load student profile. Please try again.");
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard/children")} sx={{ mt: 2 }}>
          Back to Children
        </Button>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Alert severity="info">No student profile found.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard/children")} sx={{ mt: 2 }}>
          Back to Children
        </Button>
      </Box>
    );
  }

  const { personal_info, academic_info } = profile;

  return (
    <Box p={3}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard/children")} sx={{ mb: 2 }}>
        Back to Children
      </Button>

      <Typography variant="h4" gutterBottom>
        Student Profile
      </Typography>

      {/* Personal Information Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 56, height: 56 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h5">
                {personal_info.first_name} {personal_info.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Student ID: {personal_info.student_id}
              </Typography>
            </Box>
            <Box ml="auto">
              <Chip
                label={personal_info.status}
                color={personal_info.status === "active" ? "success" : "default"}
                size="small"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
            <PersonIcon sx={{ mr: 1 }} /> Personal Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1">
                {new Date(personal_info.date_of_birth).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body1">
                {personal_info.gender === "M" ? "Male" : personal_info.gender === "F" ? "Female" : "Other"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Contact Number
              </Typography>
              <Typography variant="body1">
                {personal_info.contact_number || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {personal_info.email || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">
                {personal_info.address || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Academic Information Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
            <SchoolIcon sx={{ mr: 1 }} /> Academic Information
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Class
              </Typography>
              <Typography variant="body1">
                {academic_info.class_name} - Section {academic_info.section}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Roll Number
              </Typography>
              <Typography variant="body1">
                {academic_info.roll_number}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Attendance
              </Typography>
              <Typography variant="body1" color={academic_info.attendance_percentage >= 75 ? "success.main" : "error.main"}>
                {academic_info.attendance_percentage}%
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Overall Grade
              </Typography>
              <Chip
                label={academic_info.overall_grade}
                color="primary"
                size="small"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Overall Performance Summary */}
          <Box sx={{ mb: 3, p: 2, bgcolor: "primary.light", borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Overall Performance
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Marks Obtained
                </Typography>
                <Typography variant="h6">
                  {academic_info.total_marks_obtained}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Marks
                </Typography>
                <Typography variant="h6">
                  {academic_info.total_marks}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Overall Percentage
                </Typography>
                <Typography variant="h6" color="primary">
                  {academic_info.overall_percentage}%
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Grades Table */}
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", mt: 3 }}>
            <GradeIcon sx={{ mr: 1 }} /> Subject-wise Performance
          </Typography>

          {academic_info.grades && academic_info.grades.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    <TableCell><strong>Subject</strong></TableCell>
                    <TableCell align="center"><strong>Marks Obtained</strong></TableCell>
                    <TableCell align="center"><strong>Total Marks</strong></TableCell>
                    <TableCell align="center"><strong>Percentage</strong></TableCell>
                    <TableCell align="center"><strong>Grade</strong></TableCell>
                    <TableCell><strong>Exam</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {academic_info.grades.map((grade, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{grade.subject}</TableCell>
                      <TableCell align="center">{grade.marks_obtained}</TableCell>
                      <TableCell align="center">{grade.total_marks}</TableCell>
                      <TableCell align="center">
                        <Typography
                          color={grade.percentage >= 60 ? "success.main" : grade.percentage >= 40 ? "warning.main" : "error.main"}
                        >
                          {grade.percentage}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={grade.grade}
                          color={
                            grade.grade.startsWith("A") ? "success" :
                            grade.grade.startsWith("B") ? "primary" :
                            grade.grade.startsWith("C") ? "warning" : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{grade.exam_name}</TableCell>
                      <TableCell>
                        {new Date(grade.exam_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No grades available yet.</Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}