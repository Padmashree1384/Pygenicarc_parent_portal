import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
} from "@mui/material";
import { Person as PersonIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getChildren } from "../services/api";

export default function ChildrenList() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    setLoading(true);
    setError(null);

    const data = await getChildren();
    console.log("Children data:", data);

    if (data) {
      setChildren(data);
    } else {
      setError("Failed to load children. Please try again.");
    }

    setLoading(false);
  }

  function viewProfile(childId) {
    navigate(`/dashboard/student/${childId}`);
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
      </Box>
    );
  }

  if (!children || children.length === 0) {
    return (
      <Box p={3}>
        <Alert severity="info">No children found in your account.</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Children
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        View and manage your children's academic profiles
      </Typography>

      <Grid container spacing={3}>
        {children.map((child) => (
          <Grid item xs={12} sm={6} md={4} key={child.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="h6">
                      {child.first_name} {child.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {child.student_id}
                    </Typography>
                  </Box>
                  <Chip
                    label={child.status}
                    color={child.status === "active" ? "success" : "default"}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Class
                  </Typography>
                  <Typography variant="body1">
                    {child.class_name} - Section {child.section}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<VisibilityIcon />}
                  onClick={() => viewProfile(child.id)}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}