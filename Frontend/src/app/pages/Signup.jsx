import React, { useState } from "react";
import { Button, TextField, Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await signup({ username: email, email, password });
    if (res?.id) {
      alert("Account created! Please login.");
      navigate("/login");
    } else {
      alert("Signup failed");
    }
  }

  return (
    <Box maxWidth={420} mx="auto" mt={8}>
      <Typography variant="h5" mb={2}>Parent Signup</Typography>
      <form onSubmit={handleSubmit}>
        <TextField 
          fullWidth 
          label="Email" 
          margin="normal" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required
        />
        <TextField 
          fullWidth 
          label="Password" 
          type="password" 
          margin="normal" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
          Sign up
        </Button>
        <Box mt={2} textAlign="center">
          <Link component="button" type="button" onClick={() => navigate("/login")}>
            Already have an account? Login
          </Link>
        </Box>
      </form>
    </Box>
  );
}