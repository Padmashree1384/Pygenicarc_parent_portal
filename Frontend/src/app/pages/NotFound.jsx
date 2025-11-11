import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      textAlign="center"
    >
      <ErrorOutlineIcon sx={{ fontSize: 100, color: "error.main", mb: 2 }} />
      <Typography variant="h3" fontWeight={600} gutterBottom>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" size="large" onClick={() => navigate("/")}>
        Go to Dashboard
      </Button>
    </Box>
  );
}