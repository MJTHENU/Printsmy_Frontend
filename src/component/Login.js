import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import images3 from "../assets/logo.png";
import Axios from "../Axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import '../css/login.css'; // Import your external CSS file
import Spinner from "../Pages/Spinner"; // Make sure this path is correct

function Signin() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState(["", "", "", ""]); // Initialize as an array with 4 empty slots
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false); // Loading state

  const handleLoginChange = (event) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (e, index) => {
    const value = e.target.value;
  
    // Update password array with the new character
    const updatedPassword = [...password];
    updatedPassword[index] = value;
  
    // Call your state update function
    setPassword(updatedPassword);
  
    // Automatically move to the next input if a character is entered
    if (value.length === 1 && index < password.length - 1) {
      const nextInput = document.getElementById(`password-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  
    // Move back to the previous input when backspace is pressed and field is empty
    if (e.key === "Backspace" && value === "" && index > 0) {
      const prevInput = document.getElementById(`password-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };
  

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { login: "", password: "" };
  
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
    const isMobile = /^\d{10}$/.test(login);
    const isBillNo = /^[A-Za-z]\d{4}$/.test(login);
  
    if (!login.trim()) {
      newErrors.login = "Email, Mobile, or Bill number is required";
      valid = false;
    } else if (!isEmail && !isMobile && !isBillNo) {
      newErrors.login = "Enter a valid Email, Mobile number, or Bill number";
      valid = false;
    }

    // Check if all characters are filled in
    if (password.join("").trim().length < 4) {
      newErrors.password = "Password must be at least 4 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const showAlert = (title, text, icon = "warning") => {
    Swal.fire({
      title: title,
      icon: icon,
      text: text,
      showConfirmButton: true,
      confirmButtonText: "OK",
    });
  };

  const showSuccessAlert = (text) => {
    Swal.fire({
      title: 'Welcome.',
      icon: 'success',
      text: text,
      showConfirmButton: true,
      confirmButtonText: "OK",
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true); // Start loading when the login process begins

    try {
      console.log("Attempting to login with:", { login, password });

      const response = await Axios.post("/auth/login", {
        login: login,
        password: password.join(""), // Join the password array into a string
      });

      console.log("API Response:", response);
      if (response?.status === 200) {
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("userId", response?.data?.id);

        if (response?.data?.role === "admin") {
          navigate("/all-users");
        } else {
          navigate("/EventsList");
        }
      } else {
        showAlert("Error", "Invalid response from server. Please try again later.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        if (error.response.status === 401) {
          if (error.response.data.error === "Unauthorized") {
            showAlert("Error", "Invalid email or password. Please try again.");
          } else if (error.response.data.error === "Incorrect password") {
            showAlert("Error", "Incorrect password. Please try again.");
          } else {
            showAlert("Error", `Error: ${error.response.data.error}`);
          }
        } else {
          showAlert("Warning", `${error.response.data.error}`);
        }
      } else if (error.request) {
        showAlert("Error", "No response from server. Please try again later.");
      } else {
        showAlert("Error", "An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false); // Stop loading when the login process ends
    }
  };

  const renderPassword = () => {
    return (
      <div className="passwordContainer">
        {password.map((char, index) => (
          <div key={index} className="passwordChar">
            {showPassword ? char : <div className="dot"></div>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#7f223d",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
    {loading && (
  <div className="spinnerContainer">
    <Spinner />
  </div>
)}

      <div className="logo">
        <img
          src={images3}
          alt="Custom Icon"
          className="img"
          style={{ display: "flex", justifyContent: "center", height: "150px", width: "150px" }}
        />
      </div>
      <Container component="main" maxWidth="xs" className="container">
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className="form" onSubmit={handleLoginSubmit}>
          <FormControl margin="normal" required fullWidth>
            <label htmlFor="login">Email or Mobile</label>
            <TextField
              id="login"
              name="login"
              value={login}
              onChange={handleLoginChange}
              variant="outlined"
              autoFocus
              error={!!errors.login}
              helperText={errors.login}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Avatar>
                      <AccountCircleIcon />
                    </Avatar>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <label htmlFor="password">Password</label>
            <div className="passwordContainer">
            {password.map((char, index) => (
                <input
                  key={index}
                  id={`password-${index}`}
                  type={showPassword ? "text" : "password"}
                  value={char}
                  onChange={(e) => handlePasswordChange(e, index)}
                  onKeyDown={(e) => handlePasswordChange(e, index)} // Listen for backspace key press
                  onFocus={(e) => e.target.select()} // Optional: Highlight the text when focused
                  className="passwordBox"
                  maxLength={1}
                  autoComplete="off"
                />
              ))}

              <IconButton
                onClick={handleClickShowPassword}
                className="eye_icon"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </div>
            {errors.password && (
              <Typography variant="body2" color="error">
                {errors.password}
              </Typography>
            )}
          </FormControl>

          <Typography variant="body2" style={{ marginBottom: '16px' }}>
            <Link to="/forgot-pass">
              Forgot password?
            </Link>
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="submit"
          >
            Sign In
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default Signin;
