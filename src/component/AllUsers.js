import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  Box,
  Collapse,
  FormControl,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch
} from "@material-ui/core";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Axios from "../Axios";
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Logo from '../assets/logo1.png';
// import '../css/style.css';
import MobileDrawer from "../component/MobileDrawer";
import bg from "../assets/bg.png";
import Sidebar from "../component/Sidebar";
import Spinner from "../Pages/Spinner"; 
import Pagination from '@material-ui/lab/Pagination';


const useStyles = makeStyles({
  tableContainer: {
    marginTop: '60px',
    maxHeight: 440,
    border: "1px solid #fff",
    borderRadius: "15px",
    
  },
  tableHeader: {
    backgroundColor: "#80223c",
    color: "#fff",
    textAlign:'center'
  },
  tableHeader1: {
    fontWeight:600,
     textAlign:'center'
   },
  tableRow: {
    backgroundColor: "#f5f5f5",
  },
  tableCell: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  tableBorder: {
    borderColor: "#000",
  },
  tabledata:{
textAlign:'center'
  },
  editButton: {
    color: "white",
    backgroundColor: "green",
    padding: "7px !important",
    marginRight: "5px",
    '&:hover': {
      backgroundColor: "darkgreen",
    },
  },
  deleteButton: {
    color: "white",
    backgroundColor: "red",
    padding: "7px !important",
    '&:hover': {
      backgroundColor: "darkred",
    },
  },
});

function Row(props) {
  const { row, handleEdit, handleDelete, classes } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(row.status);
  const [errors, setErrors] = useState({});

  const handleStatusChange = async () => {
    try {
      const updatedStatus = status === 'active' ? 'inactive' : 'active';
      await Axios.put(`/auth/users/${row.id}/status`, { status: updatedStatus }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setStatus(updatedStatus);
    } catch (error) {
      console.warn("Error updating status", error);
    }finally {
      setLoading(false); // Set loading to false when the status change is complete
    }
  };

  return (
    
    <React.Fragment>
      {loading && (
      <div className="spinnerContainer">
        <Spinner />
      </div>
    )}
      <TableRow>
  
        <TableCell className={classes.tabledata}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className={classes.tabledata}>{row.Bill_no}</TableCell>
        <TableCell className={classes.tabledata}>{row.contact_name}</TableCell>
        <TableCell className={classes.tabledata}>{row.company_name}</TableCell>
        <TableCell className={classes.tabledata}>{row.email}</TableCell>
        <TableCell className={classes.tabledata}>{row.phone}</TableCell>
        <TableCell className={classes.tabledata}>{row.address1}</TableCell>
        <TableCell className={classes.tabledata}>
          <Button className={classes.editButton}  onClick={() => handleEdit(row)}>Edit</Button>
          <Button className={classes.deleteButton}  onClick={() => handleDelete(row.id)}>Delete</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 ,background:'#e9e9e9'}} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeader1}>Whatsapp</TableCell>
                    <TableCell className={classes.tableHeader1}>GST</TableCell>
                    <TableCell className={classes.tableHeader1}>City</TableCell>
                    <TableCell className={classes.tableHeader1}>Pincode</TableCell>
                    <TableCell className={classes.tableHeader1}>State</TableCell>
                    <TableCell className={classes.tableHeader1}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.tabledata}>{row.whatsapp}</TableCell>
                    <TableCell className={classes.tabledata}>{row.gst}</TableCell>
                    <TableCell className={classes.tabledata}>{row.city}</TableCell>
                    <TableCell className={classes.tabledata}>{row.pincode}</TableCell>
                    <TableCell className={classes.tabledata}>{row.state}</TableCell>
                    <TableCell className={classes.tabledata}>
                    <Switch
                  checked={status === 'active'}
                  onChange={handleStatusChange}
                  
                />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {/* <Table size="small" aria-label="details">
                <TableBody>
                  <TableRow>
                  <TableCell>Whatsapp</TableCell>
                  <TableCell>{row.whatsapp}</TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell>GST</TableCell>
                    <TableCell>{row.gst}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>City</TableCell>
                    <TableCell>{row.city}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pincode</TableCell>
                    <TableCell>{row.Pincode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>State</TableCell>
                    <TableCell>{row.State}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>
                    <Switch
                  checked={status === 'active'}
                  onChange={handleStatusChange}
                  
                />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table> */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    company_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address1: PropTypes.string.isRequired,
    whatsapp: PropTypes.string.isRequired,
    gst: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    pincode: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired, // Change this to string
  }).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const AllUsers = () => {
  const classes = useStyles();
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // const [newPassword, setNewPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({last_page: 1});
  const [page, setPage] = useState(1);
 

  useEffect(() => {
    const isFirstLoad = localStorage.getItem('firstLoad');
  
    if (!isFirstLoad) {
      // If it's the first time, set the flag and reload the page
      localStorage.setItem('firstLoad', 'true');
      window.location.reload(); // This will reload the page
    }
  }, []);
  
  useEffect(() => {
    // Clean up the flag after the first load to prevent continuous reloads
    return () => {
      localStorage.removeItem('firstLoad');
    };
  }, []);
  

  const getUserList = async (page = 1) => {
    try {
      const response = await Axios.get(`/auth/users?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        
      });
      console.log(response.data); // Add this line
      setUserList(response.data.users);
      setPagination(response.data.pagination); 
    } catch (error) {
      console.warn("Error in getting user list", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
    getUserList(value);
  };
 

  const handleEdit = (user) => {
    setSelectedUser(user);
    // setNewPassword('');
    // setConfirmPassword('');
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });
  
    if (result.isConfirmed) {
      try {
        await Axios.delete(`/auth/delete-user/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setUserList(userList.filter((user) => user.id !== id));
        // Swal.fire("Success", "User deleted successfully", "success");
      } catch (error) {
        console.warn("Error in deleting user", error);
        // Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async () => {
    // Reset errors at the start of submit
    setErrors({});
  
    // Check if password and confirm password match
    if (selectedUser.password || selectedUser.confirmPassword) {
      if (selectedUser.password !== selectedUser.confirmPassword) {
          setErrors((prevState) => ({
              ...prevState,
              confirmPassword: "Passwords is not match",
          }));
          Swal.fire("Error", "Passwords is not match", "error");
          return;
      }
  }
  // console.log("logo",selectedUser.logo);
  //   setSelectedUser((prevData) => ({
  //               ...prevData,
  //               company_logo: selectedUser.logo,
  //             }));
    
    try {
      await Axios.put(`/auth/users/${selectedUser.id}`, selectedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
  
      getUserList();
      handleClose();
     
      Swal.fire("Success", "User updated successfully", "success");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.warn("Error in updating user", error);
        Swal.fire("Error", "Failed to update user", "error");
      }
    }
  };
  
  

  useEffect(() => {
   
    getUserList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({
      ...selectedUser,
      [name]: value,
    });
  };

  const handleCompanyLogoChange = (event) => {
    const file = event.target.files[0];
    
    // Check if a file is selected
    if (file) {
      // Check file size (500 KB = 500 * 1024 bytes)
      if (file.size > 500 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          company_logo: "File size exceeds 500 KB", // Error message for file size
        }));
        return; // Exit the function early if file size is too large
      }
      
      // Convert the file to Base64
      convertFileToBase64(file)
        .then((base64) => {
          setSelectedUser((prevData) => ({
            ...prevData,
            company_logo: base64, // Store the Base64 string
          }));
          setErrors((prevErrors) => ({
            ...prevErrors,
            company_logo: "", // Clear any previous errors
          }));
        })
        .catch((error) => {
          console.error("Error converting file to base64:", error);
        });
    } else {
      // If no file is selected, clear the company_logo field
      setSelectedUser((prevData) => ({
        ...prevData,
        company_logo: "",
      }));
    }
  };
  

  const handleCompanyLogoheaderChange = (event) => {
    const file = event.target.files[0];
    
    // Check if a file is selected
    if (file) {
      // Check file size (500 KB = 500 * 1024 bytes)
      if (file.size > 500 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          company_logo_header: "File size exceeds 500 KB", // Error message for file size
        }));
        return; // Exit the function early if file size is too large
      }
      
      // Convert the file to Base64
      convertFileToBase64(file)
        .then((base64) => {
          setSelectedUser((prevData) => ({
            ...prevData,
            company_logo_header: base64, // Store the Base64 string
          }));
          setErrors((prevErrors) => ({
            ...prevErrors,
            company_logo_header: "", // Clear any previous errors
          }));
        })
        .catch((error) => {
          console.error("Error converting file to base64:", error);
        });
    } else {
      // If no file is selected, clear the company_logo field
      setSelectedUser((prevData) => ({
        ...prevData,
        company_logo_header: "",
      }));
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
  

 
  

  return (
    
    <>
   
   
    <Box sx={{ display: "flex", height: "100vh" }}>
   
    <MobileDrawer />
    
    <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          backgroundImage: `url(${bg})`,
          backgroundColor: "#a6787a",
          marginTop: 8, 
          marginLeft: 0, 
          overflow: "auto", 
        }}
      >
         
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader className={classes.tableBorder}>
          <TableHead>
            <TableRow>
            <TableCell className={classes.tableHeader}><img src={Logo} alt="Logo" style={{ width: '50px', height: '40px' }} /></TableCell>
            <TableCell className={classes.tableHeader}>BILL NO</TableCell>
              <TableCell className={classes.tableHeader}>NAME</TableCell>
              <TableCell className={classes.tableHeader}>COMPANY NAME</TableCell>
              <TableCell className={classes.tableHeader}>EMAIL ID</TableCell>
              <TableCell className={classes.tableHeader}>PHONE NO</TableCell>
              <TableCell className={classes.tableHeader}>ADDRESS</TableCell>
              <TableCell className={classes.tableHeader}>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList?.map((row, index) => (
              <Row key={index} row={row} handleEdit={handleEdit} handleDelete={handleDelete} classes={classes} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={pagination.last_page}
        page={page}
        onChange={handlePageChange}
        color="primary"
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
            <TextField
      label="Bill_no"
      name="Bill_no"
      value={selectedUser?.Bill_no}
      onChange={handleChange}
      variant="outlined"
      error={Boolean(errors.Bill_no)}
      helperText={errors.Bill_no && errors.Bill_no[0]}
      fullWidth
      margin="normal"
    />  
              <TextField
                autoFocus
                margin="dense"
                name="contact_name"
                label="Contact Name"
                type="text"
                fullWidth
                value={selectedUser.contact_name}
                onChange={handleChange}
                error={!!errors.contact_name}
                helperText={errors.contact_name}
              />
              
              <TextField
                margin="dense"
                name="company_name"
                label="Company Name"
                type="text"
                fullWidth
                value={selectedUser.company_name}
                onChange={handleChange}
                error={!!errors.company_name}
                helperText={errors.company_name}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"  
                fullWidth
                value={selectedUser.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
              <TextField
                margin="dense"
                name="phone"
                label="Phone"
                type="text"
                fullWidth
                value={selectedUser.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <TextField
                margin="dense"
                name="address1"
                label="Address"
                type="text"
                fullWidth
                value={selectedUser.address1}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
              />
              <TextField
                margin="dense"
                label="Address Line 2"
                name="address2"
                fullWidth
                value={selectedUser.address2}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
             />
             <TextField
                margin="dense"
                label="Pincode"
                name="pincode"
                value={selectedUser.pincode}
                fullWidth
                onChange={handleChange}
                error={!!(errors.pincode)}
                helperText={errors.pincode}
              />
               <TextField
                margin="dense"
                label="City"
                name="city"
                value={selectedUser.city}
                fullWidth
                onChange={handleChange}
                error={!!(errors.city)}
                helperText={errors.city}
              />
              <TextField
                margin="dense"
                label="GST"
                name="gst"
                value={selectedUser.gst}
                fullWidth
                onChange={handleChange}
                error={!!(errors.gst)}
                helperText={errors.gst}
              />
               <FormControl margin="normal"  fullWidth>
               <input
              accept="image/*"
              name="logo"  
              className={classes.fileInput}
             
              id="company-logo"
              type="file"
              onChange={handleCompanyLogoChange}
            />

                <label htmlFor="company-logo" className={classes.customFileUpload}>
                  <div className={classes.fileLabel}>Upload Company Logo</div>
                </label>
                {errors.company_logo && (
                <div style={{ marginTop: '8px' }}>
                  <Typography color="error" className={classes.errorText}>
                    {errors.company_logo}
                  </Typography>
                </div>
              )}
              </FormControl>
              <FormControl margin="normal"  fullWidth>
               <input
              accept="image/*"
              name="logo1"  
              className={classes.fileInput}
             
              id="company-logo-header"
              type="file"
              onChange={handleCompanyLogoheaderChange}
            />

                <label htmlFor="company-logo-header" className={classes.customFileUpload}>
                  <div className={classes.fileLabel}>Upload Company Logo with hedaer</div>
                </label>
                {errors.company_logo_header && (
                <div style={{ marginTop: '8px' }}>
                  <Typography color="error" className={classes.errorText}>
                    {errors.company_logo_header}
                  </Typography>
                </div>
              )}
              </FormControl>
              <TextField
                margin="dense"
                name="whatsapp"
                label="Whats App"
                type="text"
                fullWidth
                value={selectedUser.whatsapp}
                onChange={handleChange}
                error={!!errors.whatsapp}
                helperText={errors.whatsapp}
              />
              {/* Password fields */}
              <TextField
                margin="dense"
                name="password"
                label="New Password"
                type="password"
                fullWidth
                value={selectedUser.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || ''}
              />
              <TextField
                margin="dense"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
              
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword || ''}
              />

            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
      </Box>
    </>
  );
};

export default AllUsers;
