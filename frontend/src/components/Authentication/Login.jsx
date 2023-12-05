import React, { useState } from "react";
import {
  Stack,
  Box,
  FormControl,
  InputLabel,
  Input,
  IconButton,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // State to manage password visibility
  const [showPassword, setShowPassword] = React.useState(false);

  // Loading state to handle form submission loading state
  const [loading, setloading] = useState(false);

  // State to manage form data (email and password)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  // Alert states for different scenarios
  const [warningAlert, setWarningAlert] = useState(null);
  const [errorAlert, setErrorAlert] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);

  // Function to toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Function to check if the email is valid using a basic regex
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email;
    const password = formData.password;

    setloading(true);

    // Validation checks
    if (!formData.email || !formData.password) {
      setWarningAlert(
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          All fields are required
        </Alert>
      );
      setTimeout(() => setWarningAlert(null), 3000);
      setloading(false);
      return;
    }

    if (!isEmailValid(formData.email)) {
      setWarningAlert(
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Please enter a valid email address
        </Alert>
      );
      setTimeout(() => setWarningAlert(null), 3000);
      setloading(false);
      return;
    }

    try {
      // API call to login
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      console.log("data", data);
      
      // Store user info in local storage
      localStorage.setItem("userInfo", JSON.stringify(data));

      setloading(false);
      setSuccessAlert(
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Successfully signed in
        </Alert>
      );
       setTimeout(() => setSuccessAlert(null), 3000);

      // Redirect to the '/chats' route
      setTimeout(() => {
        navigate("/chats");
      }, 500); 
    } catch (err) {
      console.log(`Error : ${err}`);
      setloading(false);
      setErrorAlert(
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Invalid User
        </Alert>
      );
      setTimeout(() => setErrorAlert(null), 3000);

      // Clear the form data in case of an error
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  // Function to handle the guest user button click
  const handleGuestUser = (e) => {
    e.preventDefault();

    // Set guest user credentials in the form data
    setFormData({
      ...formData,
      email: "guest@example.com",
      password: "12341234",
    });
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          {/* Email input */}
          <FormControl>
            <InputLabel htmlFor="email">Email address</InputLabel>
            <Input
              id="email"
              type="email"
              value={formData.email}
              autoComplete="off"
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </FormControl>

          {/* Password input */}
          <FormControl marginRight={2}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              autoComplete="off"
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
              endAdornment={
                // Password visibility toggle button
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
          </FormControl>

          {/* Login button */}
          <Button
            variant="contained"
            id="signup_submit_btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Guest user button */}
          <Button
            variant="contained"
            color="error"
            id="guest_user_btn"
            onClick={handleGuestUser}
          >
            Guest user
          </Button>
        </Stack>
      </Box>

      {/* Display alerts based on different scenarios */}
      {warningAlert}
      {errorAlert}
      {successAlert}
    </>
  );
};

export default Login;
