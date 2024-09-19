import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Avatar, InputAdornment, Alert, CircularProgress } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import images3 from '../assets/logo.png';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';

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
  },
  spinner: {
    marginLeft: theme.spacing(1),
  },
}));

function VerifyOTP() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromParams = params.get('email');
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [location.search]);

  const showAlert = (text) => {
    Swal.fire({
      title: 'OOPS.',
      icon: 'warning',
      text: text,
      showConfirmButton: true,
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/forgot-pass`);
      }
    });
  };

  const showSuccessAlert = (text) => {
    Swal.fire({
      title: 'Success.',
      icon: 'success',
      text: text,
      showConfirmButton: true,
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true); // Set loading to true

    try {
      const response = await fetch('https://reiosglobal.com/Printsmy_Backend/api/verify-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Account has been successfully verified.');
        showSuccessAlert('Account has been successfully verified.');
      } else {
        setError(data.message || 'Invalid verification code. Please try again.');
        showAlert(data.message || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      console.error('Verification Error:', err);
      setError('Failed to verify account. Please try again later.');
      showAlert('Failed to verify account. Please try again later.');
    } finally {
      setLoading(false); // Reset loading to false
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
        <Typography component="h1" variant="h5">
          Verify Account
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Verification Code"
            variant="outlined"
            fullWidth
            margin="normal"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
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
          <Button variant="contained" color="primary" type="submit" fullWidth className={classes.submit} disabled={loading}>
            Verify Account
            {loading && <CircularProgress size={24} className={classes.spinner} />}
          </Button>
        </form>
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Container>
    </div>
  );
}

export default VerifyOTP;
