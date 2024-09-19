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
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Axios from "../Axios";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Logo from '../assets/logo1.png';
import MobileDrawer from "../component/MobileDrawer";
import bg from "../assets/bg.png";
import Pagination from '@material-ui/lab/Pagination';
const useStyles = makeStyles({
  tableContainer: {
    maxHeight: 440,
    border: "1px solid #fff",
    borderRadius: "15px",
  },
  tableHeader: {
    backgroundColor: "#014550",
    color: "#fff",
    textAlign: 'center',
  },
  tableHeader1: {
    fontWeight: 600,
    textAlign: 'center',
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
  tabledata: {
    textAlign: 'center',
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
  addButton: {
    marginBottom: 10,
    backgroundColor: "green",
    color: "#fff",
    '&:hover': {
      backgroundColor: "darkgreen",
    },
  },
});

function Row(props) {
  const { row, handleEdit, handleDelete, classes } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
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
        <TableCell className={classes.tabledata}>{row.title}</TableCell>
        <TableCell className={classes.tabledata}>{row.description}</TableCell>
        <TableCell className={classes.tabledata}>{row.event_date}</TableCell>
        <TableCell className={classes.tabledata}>{row.status}</TableCell>
        <TableCell className={classes.tabledata}>
          <Button className={classes.editButton} onClick={() => handleEdit(row)}>Edit</Button>
          <Button className={classes.deleteButton} onClick={() => handleDelete(row.id)}>Delete</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, background: '#e9e9e9' }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeader1}>Title</TableCell>
                    <TableCell className={classes.tableHeader1}>Description</TableCell>
                    <TableCell className={classes.tableHeader1}>Event Date</TableCell>
                    <TableCell className={classes.tableHeader1}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.tabledata}>{row.title}</TableCell>
                    <TableCell className={classes.tabledata}>{row.description}</TableCell>
                    <TableCell className={classes.tabledata}>{row.event_date}</TableCell>
                    <TableCell className={classes.tabledata}>{row.status}</TableCell>
                    <TableCell>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    event_date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const AllEvents = () => {
  const classes = useStyles();
  const [eventList, setEventList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusOptions, setStatusOptions] = useState(["soon", "start", "completed"]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const getEventList = async (page = 1) => {
    try {
      const response = await Axios.get(`/events?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setEventList(response.data.events);
      setPagination(response.data.pagination);
    } catch (error) {
      console.warn("Error in getting event list", error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    getEventList(value);
  };

  useEffect(() => {
    getEventList(page);
    
  }, [page]);

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsAddMode(false);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedEvent({ title: "", description: "", event_date: "", status: "soon" });
    setIsAddMode(true);
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
        await Axios.delete(`/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setEventList(eventList.filter((event) => event.id !== id));
        Swal.fire("Success", "Event deleted successfully", "success");
      } catch (error) {
        console.warn("Error in deleting event", error);
        Swal.fire("Error", "Failed to delete event", "error");
      }
    }
  };
  

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
    setErrors({});
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
  
      if (isAddMode) {
        await Axios.post("/store-events", selectedEvent, config);
        Swal.fire("Success", "Event added successfully", "success");
      } else {
        await Axios.put(`/events/${selectedEvent.id}`, selectedEvent, config);
        Swal.fire("Success", "Event updated successfully", "success");
      }
  
      getEventList();
      handleClose();
    } catch (error) {
      if (error.response) {
        if (error.response && error.response.status === 422) {
          const fieldErrors = error.response.data.errors || {};
          setErrors({
            ...fieldErrors,
            title: fieldErrors.title ? "Title is already taken. Try with another title." : "",
          });
        }else if (error.response.data.errors) {
          // Display other validation errors
          setErrors(error.response.data.errors);
        } else {
          // Handle other errors
          console.warn("Error in saving event", error);
          Swal.fire("Error", `Failed to ${isAddMode ? "add" : "update"} event`, "error");
        }
      } else {
        // Handle errors with no response
        console.warn("Error in saving event", error);
        Swal.fire("Error", `Failed to ${isAddMode ? "add" : "update"} event`, "error");
      }
    }
  };
  
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent({
      ...selectedEvent,
      [name]: value,
    });
  };

  useEffect(() => {
    getEventList();
  }, []);

  useEffect(() => {
    if (selectedEvent?.event_date) {
      const daysDifference = getDateDifference(selectedEvent.event_date);
      let options = [];
  
      if (daysDifference > 0) {
        // Event date is in the future
        options = ["soon", "start"];
      } else if (daysDifference === 0) {
        // Event date is today
        options = ["start"];
      } else {
        // Event date is in the past
        options = ["completed"];
      }
  
      setStatusOptions(options);
    }
  }, [selectedEvent?.event_date]);
  

  const getDateDifference = (eventDate) => {
    const eventDateTime = new Date(eventDate);
    const currentDateTime = new Date();
  
    // Adjust for time zones
    const timeDifference = eventDateTime.getTime() - currentDateTime.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
  
    return daysDifference;
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
            backgroundColor: "#014550",
            marginTop: '60px',
            marginLeft: 0,
            overflow: "auto",
          }}
        >
          <Button 
            variant="contained"
            className={classes.addButton}
            startIcon={<img src={Logo} alt="Logo" style={{ width: "24px", height: "24px" }} />}
            onClick={handleAdd}
          >
            Add Event
          </Button>
          <TableContainer className={classes.tableContainer} component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell className={classes.tableHeader}>Title</TableCell>
                  <TableCell className={classes.tableHeader}>Description</TableCell>
                  <TableCell className={classes.tableHeader}>Event Date</TableCell>
                  <TableCell className={classes.tableHeader}>Status</TableCell>
                  <TableCell className={classes.tableHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventList.map((event) => (
                  <Row
                    key={event.id}
                    row={event}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    classes={classes}
                  />
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
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose}>
  <DialogTitle>{isAddMode ? "Add Event" : "Edit Event"}</DialogTitle>
  <DialogContent>
  <TextField
  autoFocus
  margin="dense"
  name="title"
  label="Title"
  type="text"
  fullWidth
  variant="outlined"
  value={selectedEvent?.title || ""}
  onChange={handleChange}
  error={Boolean(errors.title)}  // This will display the error state
  helperText={errors.title || " "}  // This will display the error message below the TextField
/>


    <TextField
      margin="dense"
      name="description"
      label="Description"
      type="text"
      fullWidth
      variant="outlined"
      value={selectedEvent?.description || ""}
      onChange={handleChange}
      error={Boolean(errors.description)}
      helperText={errors.description || " "}
    />
    <TextField
      margin="dense"
      name="event_date"
      label="Event Date"
      type="date"
      fullWidth
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      value={selectedEvent?.event_date || ""}
      onChange={handleChange}
      error={Boolean(errors.event_date)}
      helperText={errors.event_date || " "}
    />
    <FormControl fullWidth margin="dense">
      <FormLabel>Status</FormLabel>
      <TextField
        select
        name="status"
        value={selectedEvent?.status || ""}
        onChange={handleChange}
        variant="outlined"
        error={Boolean(errors.status)}
        helperText={errors.status || " "}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleSubmit} color="primary">
      {isAddMode ? "Add" : "Update"}
    </Button>
  </DialogActions>
</Dialog>


    </>
  );
};

export default AllEvents;
