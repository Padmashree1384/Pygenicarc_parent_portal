import { useEffect, useState } from "react";
import { getParentData } from "../services/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Avatar,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";

export default function ParentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getParentData()
      .then(setData)
      .catch((err) => {
        console.error("Error fetching parent data:", err);
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Failed to load dashboard data
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  Welcome back, {data.user.username}!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.user.email}
                </Typography>
              </Box>
            </Box>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Children Section */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        My Children
      </Typography>

      {data.children.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" textAlign="center" py={4}>
              No children registered yet. Please contact administration to add your children.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {data.children.map((child) => (
            <Grid item xs={12} md={6} lg={4} key={child.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      <SchoolIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {child.full_name}
                      </Typography>
                      <Chip
                        label={`Class ${child.student_class}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  {child.notes && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Notes:
                      </Typography>
                      <Typography variant="body2">{child.notes}</Typography>
                    </Box>
                  )}
                  
                  {/* Add more child details here as needed */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}