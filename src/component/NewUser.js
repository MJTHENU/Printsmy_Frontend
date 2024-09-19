import React, { useState } from "react";
import {
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Box
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "../Axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import '../css/admin.css';
import MobileDrawer from "../component/MobileDrawer";
import bg from "../assets/bg.png";
import { useEffect } from 'react';
import Spinner from "../Pages/Spinner"; 
const useStyles = makeStyles((theme) => ({
  "@keyframes glow": {
    "0%": {
      boxShadow: "0 0 5px rgba(0, 123, 255, 0.4)",
    },
    "50%": {
      boxShadow: "0 0 20px rgba(0, 123, 255, 0.8)",
    },
    "100%": {
      boxShadow: "0 0 5px rgba(0, 123, 255, 0.4)",
    },
  },
  
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white", 
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    width: "100%", 
    [theme.breakpoints.up("sm")]: {
      maxWidth: "600px", 
    },
  },
  formControlInline: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& > div": {
      width: "48%",
      marginBottom: theme.spacing(2), 
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column", 
      "& > div": {
        width: "100%", 
      },
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    transition: "background-color 0.3s, box-shadow 0.3s", 
    "&:hover": {
      animation: "$glow 1.5s infinite",
      backgroundColor: theme.palette.primary.dark,
    },
  },
  glowTypography: {
    "&:hover": {
      animation: "$glow 1.5s infinite",
      color: theme.palette.primary.main,
    },
  },
  fileInput: {
    display: 'none',
  },
  customFileUpload: {
    border: '1px solid #ccc',
    display: 'inline-block',
    padding: '6px 12px',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    height: '56px',
    borderRadius: '4px',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#888',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: '0.75rem',
    marginTop: theme.spacing(0.5),
  },
}));

function NewUser() {
  const classes = useStyles();

  const navigate = useNavigate();
  
  useEffect(() => {
    const auth = localStorage.getItem("token") ?? false;
    if (auth) {
      //alert('Welcome');
    } else {
      navigate('/');
    }
  }, [navigate]);

  const initialFormData = {
    Bill_no:"",
    contact_name: "",
    company_name: "",
    refemail: "testprintmyproject@gmail.com",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
    password_confirmation: "",
    gst: "",
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    state: "TamilNadu",
    status: "",
    role: "user",
    company_logo: null,
    company_logo_header: null,
    join_date: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPass = () => {
    setShowConfirm(!showConfirm);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownPassword1 = (event) => {
    event.preventDefault();
  };

  const handleCompanyLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      convertFileToBase64(file)
        .then((base64) => {
          setFormData((prevData) => ({
            ...prevData,
            company_logo: base64,
          }));
        })
        .catch((error) => {
          console.error("Error converting file to base64:", error);
        });
    }
  };


  const handleCompanyLogoheaderChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      convertFileToBase64(file)
        .then((base64) => {
          setFormData((prevData) => ({
            ...prevData,
            company_logo_header: base64,
          }));
        })
        .catch((error) => {
          console.error("Error converting file to base64:", error);
        });
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await Axios.post("/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("Success ========>", response);
      if (response?.status === 200) {
        localStorage.setItem("token", response?.data?.token);
        Swal.fire({
          icon: "success",
          title: "User created successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
        setFormData(initialFormData); 
        setErrors({}); 
        navigate("");
      } else {
        setErrors({ general: "Invalid response from server. Please try again later." });
      }
    } catch (error) {
      console.error("Error ========>", error);
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else if (error.response && error.response.status === 401) {
        setErrors({ general: "please Login again." });
      } else if (error.request) {
        setErrors({ general: "No response from server. Please try again later." });
      } else {
        setErrors({ general: "An error occurred. Please try again later." });
      }
    }finally{
      setLoading(false);
    }
  };

  let stateValue = 'TamilNadu';

  return (
   
    <div>
       {loading && (
      <div className="spinnerContainer">
        <Spinner />
      </div>
    )}
    <Box sx={{ display: "flex", height: "100vh" }}>
    <MobileDrawer />
    <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          backgroundImage: `url(${bg})`,
          backgroundColor: "#014550",
          marginTop: '60px', 
          marginLeft: 0, 
          overflow: "auto", 
        }}
      >
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Typography component="h1" variant="h5" className={classes.glowTypography}>
          Register
        </Typography>
        <form className={classes.form} onSubmit={handleRegister}>
          <div className={classes.formControlInline}>
          <FormControl margin="normal" required fullWidth>
              <TextField
                label="Company Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.company_name)}
                helperText={errors.company_name && errors.company_name[0]}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                label="Contact Name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.contact_name)}
                helperText={errors.contact_name && errors.contact_name[0]}
              />
            </FormControl>
          </div>
          <div className={classes.formControlInline}>
          <FormControl margin="normal" required fullWidth>
              <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.email)}
                helperText={errors.email && errors.email[0]}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
               
                type="email"
                name="refemail"
                value={formData.refemail}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.refemail)}
                helperText={errors.refemail && errors.refemail[0]}
                InputProps={{
                  readOnly: true, // Set as read-only
                }}
              />
            </FormControl>
        </div>

          <div className={classes.formControlInline}>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="Bill No"
              name="Bill_no"
              value={formData.Bill_no}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.Bill_no)}
              helperText={errors.Bill_no && errors.Bill_no[0]}
              fullWidth
              margin="normal"
            />
          </FormControl>
            <FormControl margin="normal" required>
              <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.phone)}
                helperText={errors.phone && errors.phone[0]}
              />
            </FormControl>
          </div>
          <div className={classes.formControlInline}>
            
            <FormControl margin="normal" required fullWidth>
              <TextField
                label="Whatsapp Number"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.whatsapp)}
                helperText={errors.whatsapp && errors.whatsapp[0]}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                label="GST No"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.gst)}
                helperText={errors.gst && errors.gst[0]}
              />
            </FormControl>
          </div>
          <div className={classes.formControlInline}>
          <FormControl margin="normal" required fullWidth>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.password)}
              helperText={errors.password && errors.password[0]}
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
          <FormControl margin="normal" required fullWidth>
            <TextField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.password_confirmation)}
              helperText={errors.password_confirmation && errors.password_confirmation[0]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowConfirmPass}
                      onMouseDown={handleMouseDownPassword1}
                    >
                      {showConfirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          </div>
            <FormControl margin="normal" fullWidth>
            <TextField
              label="Join Date"
              type="date"
              name="join_date"
              value={formData.join_date}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.join_date)}
              helperText={errors.join_date && errors.join_date[0]}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <FormControl margin="normal"  fullWidth>
            <input
              accept="image/*"
              className={classes.fileInput}
              id="company-logo"
              type="file"
              onChange={handleCompanyLogoChange}
            />
            <label htmlFor="company-logo" className={classes.customFileUpload}>
              <div className={classes.fileLabel}>Upload Company Logo</div>
            </label>
            {errors.company_logo && (
              <Typography color="error" className={classes.errorText}>
                {errors.company_logo[0]}
              </Typography>
            )}
          </FormControl>
          <FormControl margin="normal"  fullWidth>
            <input
              accept="image/*"
              className={classes.fileInput}
              id="company-logo-header"
              type="file"
              onChange={handleCompanyLogoheaderChange}
            />
            <label htmlFor="company-logo-header" className={classes.customFileUpload}>
              <div className={classes.fileLabel}>Upload Company Logo with header</div>
            </label>
            {errors.company_logo_header && (
              <Typography color="error" className={classes.errorText}>
                {errors.company_logo_header[0]}
              </Typography>
            )}
          </FormControl>
          <div className={classes.formControlInline}>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="Address Line 1"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.address1)}
              helperText={errors.address1 && errors.address1[0]}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="Address Line 2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.address2)}
              helperText={errors.address2 && errors.address2[0]}
            />
          </FormControl>
          </div>
          <div className={classes.formControlInline}>
            <FormControl margin="normal" fullWidth>
              <TextField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.city)}
                helperText={errors.city && errors.city[0]}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.pincode)}
                helperText={errors.pincode && errors.pincode[0]}
              />
            </FormControl>
          </div>
          <div className={classes.formControlInline}>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="State"
              name="state"
              value={stateValue}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.state)}
              helperText={errors.state && errors.state[0]}
              InputProps={{
                readOnly: true,
              }}
            />
          </FormControl>

            <FormControl margin="normal" fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.status)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
              {errors.status && (
                <Typography color="error" className={classes.errorText}>
                  {errors.status[0]}
                </Typography>
              )}
            </FormControl>
          </div>
          {errors.general && (
            <Typography color="error" className={classes.errorText}>
              {errors.general}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
          >
            Register
          </Button>
        </form>
      </Container>
      </Box>
      </Box>
    </div>
  );
}

export default NewUser;