import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { makeStyles } from "@material-ui/core/styles";
import images3 from "../assets/logo.png";
import images4 from "../assets/images.jpg";
import "../index.css";
import Axios from '../Axios';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
  fontSmall: {
    color: "#000000 !important",
    fontSize: "12px",
  },
  text: {
    paddingRight: "0px !important",
    backgroundColor: "#CDCDCD !important",
  },
  avatarStyle: {
    backgroundColor: "#ABABAB !important",
    width: "55px !important",
    height: "55px !important",
    borderRadius: "0px",
  },
  container: {
    marginTop: theme.spacing(15),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff", 
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    // backgroundImage:`url(${images4})`,
    // backgroundSize: 'cover', 
    // backgroundPosition: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
    backgroundColor: "#7f223d !important",
    color: "#fff",
    fontSize: "18px",
    textTransform: "capitalize",
  },
  img: {
    width: "50px",
    height: "50px",
    marginBottom: theme.spacing(1),
  },
  logo: {
    position: "absolute",
    top: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    width: "100%",
    zIndex: 1,
  },
}));

function AdminLogin() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [responsemessage, setResponseMessage] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const showAlert = (text) => {
    Swal.fire({
        title: 'OOPS.',
        icon: 'warning',
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

  const handleLogin = async (event) => {
      event.preventDefault();

      try {
        console.log("Attempting to login with:", { email, password });

        const response = await Axios.post("/auth/login", {
          email: email,
          password: password,
        });

        console.log("API Response:", response);
        if (response?.status === 200) {
          console.log(response);

          if (response?.data?.role === "admin") {
          localStorage.setItem("token", response?.data?.token);
          localStorage.setItem("userId", response?.data?.id);
            
            setResponseMessage("Login Successful");
            showSuccessAlert(responsemessage);
            navigate("/side"); 
          } else {
            setResponseMessage("You don't have permission to access this page.");
            showAlert(responsemessage);
          }
        } else {
          setResponseMessage("Invalid response from server. Please try again later.");
          showAlert(responsemessage);
        }
      } catch (error) {
        console.error("Login Error:", error);
        if (error.response) {
          if (error.response.status === 401) {
            setResponseMessage("Invalid email or password. Please try again.");
            showAlert(responsemessage);
          } else {
            setResponseMessage(`Error: ${error.response.statusText}`);
            showAlert(responsemessage);
          }
        } else if (error.request) {
          setResponseMessage("No response from server. Please try again later.");
          showAlert(responsemessage);
        } else {
          setResponseMessage("An error occurred. Please try again later.");
          showAlert(responsemessage);
        }
      }
  };



  return (
    <div
      style={{
         backgroundColor:"#7f223d",
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
     <div className={classes.logo}>
        <img src={images3} alt="Custom Icon" className={classes.img} style={{display:"flex", justifyContent:"center", height:"150px",width:'150px'}}/>
        </div>
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Typography component="h1" variant="h5">
        Admin Sign in
      </Typography>
      <form className={classes.form} onSubmit={handleLogin}>
        <FormControl margin="normal" required fullWidth>
          <label htmlFor="email">Email</label>
          <TextField
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            variant="outlined"
            autoFocus
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
          <TextField
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <Typography variant="body2">
          <Link href="#" onClick={() => console.log('Forgot password clicked')}>Forgot password?</Link>
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
        {/* <Grid item xs={12}>
                        <Typography>
                            Don't have an account? <RouterLink to="/signup">Signup</RouterLink>
                        </Typography>
                    </Grid> */}
      </form>
    </Container>
    </div>
  );
}

export default AdminLogin;
