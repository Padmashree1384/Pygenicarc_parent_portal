import React, { useState } from "react";
import { Button, TextField, Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login, getMyStudents } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    console.log("Login attempt with:", { username: email, password });
    
    const payload = { username: email, password }; // IMPORTANT: send email as username
    const res = await login(payload);
    console.log("Login response:", res);
    
    if (!res.ok) {
      // show server message
      const msg = res.data?.detail || res.data?.username?.[0] || res.data?.errors || "Login failed";
      setError(Array.isArray(msg) ? msg[0] : msg);
      console.error("Login failed response:", res);
      setLoading(false);
      return;
    }

    // success
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    localStorage.setItem("user", JSON.stringify(res.data));
    
    // optional: verify students endpoint
    const studentsRes = await getMyStudents(res.data.access);
    console.log("Students response:", studentsRes);
    setLoading(false);
    navigate("/dashboard/default");
  }

  return (
    <Box maxWidth={420} mx="auto" mt={8}>
      <Typography variant="h5" mb={2}>Parent Login</Typography>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField 
          fullWidth 
          label="Email" 
          margin="normal" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required
          disabled={loading}
        />
        <TextField 
          fullWidth 
          label="Password" 
          type="password" 
          margin="normal" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required
          disabled={loading}
        />
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ mt: 2 }} 
          fullWidth
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Box mt={2} textAlign="center">
          <Link component="button" type="button" onClick={() => navigate("/signup")} disabled={loading}>
            Don't have an account? Sign up
          </Link>
        </Box>
      </form>
    </Box>
  );
}