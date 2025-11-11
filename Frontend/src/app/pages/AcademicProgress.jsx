import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { getStudentProfile } from "../services/api";

const AcademicProgress = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [selectedExam, setSelectedExam] = useState("all");
  const [downloadingReport, setDownloadingReport] = useState(false);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      const data = await getStudentProfile();
      
      if (!data) {
        setError("Failed to fetch academic data");
        return;
      }
      
      setStudentData(data);
      setError(null);
    } catch (err) {
      setError("Error loading academic progress");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      "A+": "success",
      A: "success",
      "B+": "info",
      B: "info",
      "C+": "warning",
      C: "warning",
      D: "error",
      F: "error",
    };
    return gradeColors[grade] || "default";
  };

  const getPerformanceIcon = (percentage) => {
    return percentage >= 75 ? (
      <TrendingUpIcon color="success" />
    ) : (
      <TrendingDownIcon color="error" />
    );
  };

  const downloadReportCard = async () => {
    try {
      setDownloadingReport(true);
      
      // Generate PDF report
      const reportContent = generateReportCardHTML();
      
      // Create a blob and download
      const blob = new Blob([reportContent], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Report_Card_${studentData.personal_info.student_id}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Failed to download report card");
    } finally {
      setDownloadingReport(false);
    }
  };

  const generateReportCardHTML = () => {
    const { personal_info, academic_info } = studentData;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Report Card - ${personal_info.first_name} ${personal_info.last_name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; border-bottom: 3px solid #1976d2; padding-bottom: 20px; margin-bottom: 30px; }
          .info-section { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #1976d2; color: white; }
          .summary { background-color: #f5f5f5; padding: 20px; margin-top: 30px; border-radius: 8px; }
          .grade-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; }
          .grade-A, .grade-A-plus { background-color: #4caf50; color: white; }
          .grade-B, .grade-B-plus { background-color: #2196f3; color: white; }
          .grade-C, .grade-C-plus { background-color: #ff9800; color: white; }
          .grade-D, .grade-F { background-color: #f44336; color: white; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>STUDENT REPORT CARD</h1>
          <p>Academic Year: ${new Date().getFullYear()}</p>
        </div>
        
        <div class="info-section">
          <h2>Student Information</h2>
          <p><strong>Student ID:</strong> ${personal_info.student_id}</p>
          <p><strong>Name:</strong> ${personal_info.first_name} ${personal_info.last_name}</p>
          <p><strong>Class:</strong> ${academic_info.class_name} - Section ${academic_info.section}</p>
          <p><strong>Roll Number:</strong> ${academic_info.roll_number}</p>
        </div>
        
        <div class="info-section">
          <h2>Academic Performance</h2>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Exam</th>
              </tr>
            </thead>
            <tbody>
              ${academic_info.grades.map(grade => `
                <tr>
                  <td>${grade.subject}</td>
                  <td>${grade.marks_obtained}</td>
                  <td>${grade.total_marks}</td>
                  <td>${grade.percentage}%</td>
                  <td><span class="grade-badge grade-${grade.grade.replace('+', '-plus')}">${grade.grade}</span></td>
                  <td>${grade.exam_name}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="summary">
          <h2>Overall Performance Summary</h2>
          <p><strong>Total Marks Obtained:</strong> ${academic_info.total_marks_obtained} / ${academic_info.total_marks}</p>
          <p><strong>Overall Percentage:</strong> ${academic_info.overall_percentage}%</p>
          <p><strong>Overall Grade:</strong> <span class="grade-badge grade-${academic_info.overall_grade.replace('+', '-plus')}">${academic_info.overall_grade}</span></p>
          <p><strong>Attendance:</strong> ${academic_info.attendance_percentage}%</p>
        </div>
        
        <div style="margin-top: 50px; text-align: center; color: #666;">
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>This is a computer-generated report card</p>
        </div>
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !studentData) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || "No academic data available"}</Alert>
      </Box>
    );
  }

  const { personal_info, academic_info } = studentData;

  // Get unique exam names
  const examNames = ["all", ...new Set(academic_info.grades.map(g => g.exam_name))];
  
  // Filter grades by selected exam
  const filteredGrades = selectedExam === "all" 
    ? academic_info.grades 
    : academic_info.grades.filter(g => g.exam_name === selectedExam);

  return (
    <Box p={3}>
      {/* Header Section */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            Academic Progress
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {personal_info.first_name} {personal_info.last_name} - {personal_info.student_id}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={downloadingReport ? <CircularProgress size={20} /> : <DownloadIcon />}
          onClick={downloadReportCard}
          disabled={downloadingReport}
        >
          Download Report Card
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    Overall Grade
                  </Typography>
                  <Typography variant="h4" component="div">
                    {academic_info.overall_grade}
                  </Typography>
                </Box>
                <SchoolIcon color="primary" sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    Overall Percentage
                  </Typography>
                  <Typography variant="h4" component="div">
                    {academic_info.overall_percentage}%
                  </Typography>
                </Box>
                {getPerformanceIcon(academic_info.overall_percentage)}
              </Box>
              <LinearProgress
                variant="determinate"
                value={academic_info.overall_percentage}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    Total Marks
                  </Typography>
                  <Typography variant="h4" component="div">
                    {academic_info.total_marks_obtained}/{academic_info.total_marks}
                  </Typography>
                </Box>
                <AssignmentIcon color="primary" sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    Attendance
                  </Typography>
                  <Typography variant="h4" component="div">
                    {academic_info.attendance_percentage}%
                  </Typography>
                </Box>
                {getPerformanceIcon(academic_info.attendance_percentage)}
              </Box>
              <LinearProgress
                variant="determinate"
                value={academic_info.attendance_percentage}
                sx={{ mt: 2 }}
                color={academic_info.attendance_percentage >= 75 ? "success" : "error"}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Exam Filter */}
      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Exam</InputLabel>
          <Select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            label="Filter by Exam"
          >
            {examNames.map((exam) => (
              <MenuItem key={exam} value={exam}>
                {exam === "all" ? "All Exams" : exam}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Grades Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Subject-wise Performance
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell><strong>Subject</strong></TableCell>
                  <TableCell align="center"><strong>Exam</strong></TableCell>
                  <TableCell align="center"><strong>Marks Obtained</strong></TableCell>
                  <TableCell align="center"><strong>Total Marks</strong></TableCell>
                  <TableCell align="center"><strong>Percentage</strong></TableCell>
                  <TableCell align="center"><strong>Grade</strong></TableCell>
                  <TableCell align="center"><strong>Performance</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGrades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="textSecondary">No grades available</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGrades.map((grade, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{grade.subject}</TableCell>
                      <TableCell align="center">{grade.exam_name}</TableCell>
                      <TableCell align="center">{grade.marks_obtained}</TableCell>
                      <TableCell align="center">{grade.total_marks}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          {grade.percentage}%
                          <Box ml={1}>
                            {getPerformanceIcon(grade.percentage)}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={grade.grade}
                          color={getGradeColor(grade.grade)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <LinearProgress
                          variant="determinate"
                          value={grade.percentage}
                          sx={{ width: "100px", margin: "0 auto" }}
                          color={grade.percentage >= 75 ? "success" : grade.percentage >= 50 ? "warning" : "error"}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Strong Subjects
              </Typography>
              {filteredGrades
                .filter(g => g.percentage >= 75)
                .slice(0, 3)
                .map((grade, index) => (
                  <Box key={index} mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{grade.subject}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {grade.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={grade.percentage}
                      color="success"
                    />
                  </Box>
                ))}
              {filteredGrades.filter(g => g.percentage >= 75).length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  No subjects with 75% or above
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Needs Improvement
              </Typography>
              {filteredGrades
                .filter(g => g.percentage < 60)
                .slice(0, 3)
                .map((grade, index) => (
                  <Box key={index} mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{grade.subject}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {grade.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={grade.percentage}
                      color="error"
                    />
                  </Box>
                ))}
              {filteredGrades.filter(g => g.percentage < 60).length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  All subjects performing well!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AcademicProgress;