import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Schedule as LateIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { getAttendanceData, getAttendanceNotifications, markNotificationRead } from "../services/api";

export default function AttendanceTracking() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [notifications, setNotifications] = useState([]);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);

  useEffect(() => {
    loadAttendanceData();
    loadNotifications();
  }, [selectedMonth, selectedYear]);

  async function loadAttendanceData() {
    setLoading(true);
    setError(null);
    
    const data = await getAttendanceData(selectedYear, selectedMonth + 1);
    
    if (data) {
      setAttendanceData(data);
    } else {
      setError("Failed to load attendance data. Please try again.");
    }
    
    setLoading(false);
  }

  async function loadNotifications() {
    const data = await getAttendanceNotifications();
    if (data && data.notifications) {
      setNotifications(data.notifications);
    }
  }

  function handleRefresh() {
    loadAttendanceData();
    loadNotifications();
  }

  async function handleMarkNotificationRead(notificationId) {
    const success = await markNotificationRead(notificationId);
    if (success) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "present":
        return "success";
      case "absent":
        return "error";
      case "late":
        return "warning";
      default:
        return "default";
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "present":
        return <PresentIcon />;
      case "absent":
        return <AbsentIcon />;
      case "late":
        return <LateIcon />;
      default:
        return null;
    }
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getMonthName(month) {
    return new Date(2000, month, 1).toLocaleString("default", { month: "long" });
  }

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading Attendance Data...</Typography>
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

  if (!attendanceData) {
    return (
      <Box p={3}>
        <Alert severity="info">
          No attendance data available.
        </Alert>
      </Box>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.is_read);

  return (
    <Box p={3}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight="bold">
          Attendance Tracking
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton 
            color="primary" 
            onClick={() => setNotificationDialogOpen(true)}
            sx={{ 
              bgcolor: unreadNotifications.length > 0 ? "error.light" : "grey.100",
              "&:hover": { bgcolor: unreadNotifications.length > 0 ? "error.main" : "grey.200" }
            }}
          >
            <Badge badgeContent={unreadNotifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Month/Year Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Month"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i} value={i}>
                      {getMonthName(i)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {attendanceData.student_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {attendanceData.class_name} - Section {attendanceData.section}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "success.light", height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Present
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.dark">
                    {attendanceData.summary.total_present}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    days
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56 }}>
                  <PresentIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "error.light", height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Absent
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error.dark">
                    {attendanceData.summary.total_absent}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    days
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "error.main", width: 56, height: 56 }}>
                  <AbsentIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "warning.light", height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Late
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.dark">
                    {attendanceData.summary.total_late}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    days
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "warning.main", width: 56, height: 56 }}>
                  <LateIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "primary.light", height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Attendance %
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.dark">
                    {attendanceData.summary.attendance_percentage}%
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                    {attendanceData.summary.attendance_percentage >= 75 ? (
                      <TrendingUpIcon fontSize="small" color="success" />
                    ) : (
                      <TrendingDownIcon fontSize="small" color="error" />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {attendanceData.summary.attendance_percentage >= 75 ? "Good" : "Needs Improvement"}
                    </Typography>
                  </Stack>
                </Box>
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  <CalendarIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Alert */}
      {attendanceData.summary.attendance_percentage < 75 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight="bold">
            Attention Required: Low Attendance
          </Typography>
          <Typography variant="body2">
            The student's attendance is below 75%. Please ensure regular attendance to maintain academic progress.
          </Typography>
        </Alert>
      )}

      {/* Monthly Calendar View */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
            Monthly Attendance Calendar - {getMonthName(selectedMonth)} {selectedYear}
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.dark" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Day</TableCell>
                  <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.records.map((record, index) => {
                  const date = new Date(record.date);
                  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
                  const isWeekend = dayName === "Saturday" || dayName === "Sunday";
                  
                  return (
                    <TableRow 
                      key={index}
                      hover
                      sx={{ 
                        "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                        bgcolor: isWeekend ? "grey.100" : "inherit",
                        opacity: isWeekend ? 0.6 : 1
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight="medium">
                          {date.toLocaleDateString("en-US", { 
                            month: "short", 
                            day: "numeric" 
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color={isWeekend ? "text.secondary" : "text.primary"}>
                          {dayName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {record.status ? (
                          <Chip
                            icon={getStatusIcon(record.status)}
                            label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            color={getStatusColor(record.status)}
                            size="small"
                            sx={{ fontWeight: "bold", minWidth: 100 }}
                          />
                        ) : (
                          <Chip
                            label={isWeekend ? "Weekend" : "No Record"}
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 100 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {record.remarks || "-"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Notifications Dialog */}
      <Dialog 
        open={notificationDialogOpen} 
        onClose={() => setNotificationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Attendance Notifications
            </Typography>
            <IconButton onClick={() => setNotificationDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {notifications.length === 0 ? (
            <Box textAlign="center" py={4}>
              <NotificationsIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
              <Typography color="text.secondary">
                No notifications at this time
              </Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.is_read ? "transparent" : "error.light",
                      borderRadius: 1,
                      mb: 1,
                    }}
                    secondaryAction={
                      !notification.is_read && (
                        <Button
                          size="small"
                          onClick={() => handleMarkNotificationRead(notification.id)}
                        >
                          Mark Read
                        </Button>
                      )
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography fontWeight={notification.is_read ? "normal" : "bold"}>
                          {notification.message}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={0.5} mt={1}>
                          <Typography variant="caption" color="text.secondary">
                            Date: {new Date(notification.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </Typography>
                          {notification.remarks && (
                            <Typography variant="caption" color="text.secondary">
                              Remarks: {notification.remarks}
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}