import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Alert, Avatar, InputAdornment, CircularProgress } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import images3 from '../assets/logo.png';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import "../css/style.css";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
  },
  logo: {
    position: 'absolute',
    top: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
  },
  img: {
    width: '50px',
    height: '50px',
    marginBottom: theme.spacing(1),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
    backgroundColor: '#7f223d !important',
    color: '#fff',
    fontSize: '18px',
    textTransform: 'capitalize',
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    right: theme.spacing(2),
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

function ForgotPassword() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const navigate = useNavigate();

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
      title: 'Success.',
      icon: 'success',
      text: text,
      showConfirmButton: true,
      confirmButtonText: "OK",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    let apiUrl = 'https://reiosglobal.com/Printsmy_Backend/api/send-otp'; // Default API for email-only
    const payload = { email };

    if (showPhone) {
      // When phone number is shown, change the API URL and payload
      apiUrl = 'https://reiosglobal.com/Printsmy_Backend/api/send-otp_with_phone';
      payload.phone = phone; // Add phone to payload
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      

      if (response.status === 404) {
        if (!showPhone) {
          // Switch to phone input if email not found
          setShowPhone(true);
        }
        throw new Error('Email not found. Please enter your phone number.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate OTP');
      }

      const data = await response.json();
      setOtp(data.otp);
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      showSuccessAlert('OTP has been generated and sent to your email.');
    } catch (err) {
      setError(` ${err.message}`);
      showAlert(`Failed to generate OTP. ${err.message}`);
    } finally {
      setLoading(false);
    }
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
      <div className={classes.logo}>
        <img src={images3} alt="Custom Icon" className={classes.img} style={{ display: "flex", justifyContent: "center", height: "150px", width: '150px' }} />
      </div>
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Typography component="h1" variant="h5" color="primary" sx={{ fontFamily: 'Montserrat' }}>
          Forgot Password
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          {showPhone && (
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          )}
          {/* Conditionally render the buttons based on the state */}
          {!showPhone ? (
            <Button id="OTP" variant="contained" color="primary" type="submit" fullWidth className={classes.submit} disabled={loading}>
              Generate OTP
              {loading && <CircularProgress size={24} className={classes.spinner} />}
            </Button>
          ) : (
            <Button id="OTP1" variant="contained" color="primary" type="submit" fullWidth className={classes.submit} disabled={loading}>
              Generate OTP with Phone
              {loading && <CircularProgress size={24} className={classes.spinner} />}
            </Button>
          )}
        </form>
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {otp && <Alert severity="info" sx={{ mt: 2 }}>Generated OTP: {otp}</Alert>}
      </Container>
    </div>
  );
}

export default ForgotPassword;
