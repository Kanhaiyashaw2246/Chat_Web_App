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
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    profile_picture:
      "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?w=740&t=st=1698412666~exp=1698413266~hmac=29320507a62fe0df4b146c11db0e43a2315e4f0ad6edaa19e6365bec099ce0bc",
  });
  const [loading, setloading] = useState(false);

  // --------------Alert states------------------
  const [warningAlert, setWarningAlert] = useState(null);
  const [errorAlert, setErrorAlert] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFileUpload = (event) => {
    setloading(true);
    const pic = event.target.files[0];
    console.log("pic", pic);

    if (pic === undefined) {
      setWarningAlert(
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Pic is undefined
        </Alert>
      );
      setTimeout(() => setWarningAlert(null), 3000);
      setloading(false);
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "Chat-App");
      data.append("cloud_name", "di8lyprtj");

      fetch("https://api.cloudinary.com/v1_1/di8lyprtj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setloading(false);
          setFormData({ ...formData, profile_picture: data.url.toString() });
          console.log(formData.profile_picture);
          console.log(data.url.toString());
        })
        .catch((err) => {
          setloading(false);
          console.error("Error", err);
        });
    } else {
      setWarningAlert(
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Please upload a valid image format (JPEG or PNG).
        </Alert>
      );
      setTimeout(() => setWarningAlert(null), 3000);
      setloading(false);
      return;
    }
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setloading(true);
    const name = formData.name;
    const email = formData.email;
    const password = formData.password;
    const pic = formData.profile_picture;

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.cpassword
    ) {
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
      setFormData({
        ...formData,
        email: "",
      });
      return;
    }

    if (formData.password !== formData.cpassword) {
      setErrorAlert(
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Passwords do not match
        </Alert>
      );
      setTimeout(() => setErrorAlert(null), 3000);
      setloading(false);
      setFormData({
        ...formData,
        password: "",
        cpassword: "",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      console.log("data", data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      // window.location.href = "/api/chat";
      navigate("/");
      setSuccessAlert(
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Successfully signed up
        </Alert>
      );
      setTimeout(() => setSuccessAlert(null), 3000);
      setFormData({
        name: "",
        email: "",
        password: "",
        cpassword: "",
      });
    } catch (err) {
      console.log(`Error : ${err}`);
      setloading(false);
      setErrorAlert(
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          An error occurred during signup
        </Alert>
      );
      setTimeout(() => setErrorAlert(null), 3000);
      setloading(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        cpassword: "",
      });
    }
  };

  return (
    <>
      {/* {JSON.stringify(formData)} */}
      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          <FormControl marginRight={2}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              type="text"
              autoComplete="off"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="email">Email address</InputLabel>
            <Input
              id="email"
              type="email"
              autoComplete="off"
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </FormControl>

          <FormControl marginRight={2}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              value={formData.password}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
              endAdornment={
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="cpassword">Confirm Password</InputLabel>
            <Input
              id="cpassword"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              value={formData.cpassword}
              onChange={(event) =>
                setFormData({ ...formData, cpassword: event.target.value })
              }
              endAdornment={
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
          </FormControl>

          <FormControl sx={{ padding: "1rem" }}>
            <label htmlFor="profile_picture">Upload your picture</label>
            <input
              type="file"
              id="profile_picture"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </FormControl>
          <Button
            variant="contained"
            id="signup_submit_btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </Button>
        </Stack>
      </Box>

      {warningAlert}
      {errorAlert}
      {successAlert}
    </>
  );
}

export default SignUp;
