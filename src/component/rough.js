import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Collapse,
  IconButton,
  Typography,
  Button,
  Card,
  CardMedia,
  Dialog,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CardActions,
  MenuItem,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Axios from "../Axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import Logo from '../assets/logo1.png';
import { makeStyles } from "@material-ui/core/styles";
import Pagination from '@material-ui/lab/Pagination';
import ClearIcon from '@mui/icons-material/Clear';
import bg from "../assets/bg.png";
import MobileDrawer from "../component/MobileDrawer";

const useStyles = makeStyles({
  tableContainer: {
    maxHeight: 440,
    border: "1px solid #fff",
    borderRadius: "15px",
  },
  tableHeader: {
    backgroundColor: "#80223c",
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
    backgroundColor: "#a7a7a7",
    color: "#fff",
    '&:hover': {
      backgroundColor: "#777777",
    },
  },
});

function Row(props) {
  const { row, handleEdit, handleDelete, classes } = props;
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);

  const handleExpandClick = async () => {
    try {
      const response = await Axios.get(`/design-img/${row.design_id}`);
      setImages(response.data.images || []); 
      setOpen(!open);
    } catch (error) {
      console.error("Error fetching design images:", error);
    }
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell className={classes.tabledata}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleExpandClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className={classes.tabledata}>{row.title}</TableCell>
        <TableCell className={classes.tabledata}>{row.description}</TableCell>
        <TableCell className={classes.tabledata}>
          <Button className={classes.editButton} onClick={() => handleEdit(row)}>Edit</Button>
          <Button className={classes.deleteButton} onClick={() => handleDelete(row.design_id)}>Delete</Button>
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
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.tableHeader1}>Title</TableCell>
                    <TableCell>{row.title}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableHeader1}>Description</TableCell>
                    <TableCell>{row.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableHeader1}>Images</TableCell>
                    <TableCell>
                      {images.map((image, index) => (
                        <img key={index} src={`data:image/jpeg;base64,${image}`} alt="Event Design" style={{ width: '100px', margin: '5px' }} />
                      ))}
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
    design_id: PropTypes.number.isRequired,
    event_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const AllEventDesigns = () => {
  const classes = useStyles();
  const [eventDesignList, setEventDesignList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEventDesign, setSelectedEventDesign] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [imageBase64s, setImageBase64s] = useState([]);
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState({});

  const getEventDesignList = async (page = 1) => {
    try {
      const response = await Axios.get(`/event-designs?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setEventDesignList(response.data.Design);
      setPagination(response.data.pagination); 
    } catch (error) {
      console.warn("Error in getting event design list", error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    getEventDesignList(value);
  };

  useEffect(() => {
    getEventDesignList(page);
    getEvents();
  }, [page]);

  const getEvents = async () => {
    try {
      const response = await Axios.get("/events", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setEvents(response.data.events);
    } catch (error) {
      console.warn("Error in getting events list", error);
    }
  };

      const handleEdit = async (eventDesign) => {
        try {
          const response = await Axios.get(`/design-img/${eventDesign.design_id}`);
          const images = response.data.images || [];
          const imagesBase64 = images.map(image => `data:image/jpeg;base64,${image}`);
      
          setSelectedEventDesign({
            ...eventDesign,
            images: imagesBase64,
            event_id: eventDesign.event_id, 
          });
          setImageBase64s(images);
          setIsAddMode(false);
          setOpen(true);
        } catch (error) {
          console.warn("Error in fetching design images", error);
        }
      };


  const handleAdd = () => {
    setSelectedEventDesign({ event_id: "", title: "", description: "", images: [] });
    setIsAddMode(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`/event-designs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setEventDesignList(eventDesignList.filter((eventDesign) => eventDesign.design_id !== id));
      Swal.fire("Success", "Event design deleted successfully", "success");
    } catch (error) {
      console.warn("Error in deleting event design", error);
      Swal.fire("Error", "Failed to delete event design", "error");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEventDesign(null);
    setErrors({});
  };

  const handleSubmit = async () => {
    try {
        let response;
      const eventDesignToSubmit = {
        ...selectedEventDesign,
        images: selectedEventDesign.images.map(image => {
          if (image.startsWith('data:image')) {
            return image.split(',')[1]; 
          }
          return image; 
        }),
      };
  
      if (isAddMode) {
       

        response = await Axios.post("/event-designs", eventDesignToSubmit, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setEventDesignList([...eventDesignList, response.data]);
        Swal.fire("Success", "Event design added successfully", "success");
      } else {
        await Axios.put(`/event-designs/${selectedEventDesign.design_id}`, eventDesignToSubmit, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setEventDesignList(
          eventDesignList.map((eventDesign) =>
            eventDesign.design_id === selectedEventDesign.design_id ? selectedEventDesign : eventDesign
          )
        );
        Swal.fire("Success", "Event design updated successfully", "success");
      }
      setOpen(false);
      setSelectedEventDesign(null);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } 
      else {
        console.warn("Error in saving event design", error);
        Swal.fire("Error", "Failed to save event design", "error");
      }
     
    }
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    const fileReaders = [];
    let isCancel = false;
    const base64Strings = [];

    if (files.length) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e) => {
          base64Strings.push(e.target.result);
          if (base64Strings.length === files.length && !isCancel) {
            setSelectedEventDesign({
              ...selectedEventDesign,
              images: [...selectedEventDesign.images, ...base64Strings],
            });
          }
        };

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");

        reader.readAsDataURL(file);
        fileReaders.push(reader);
      }
    }

    return () => {
      isCancel = true;
      fileReaders.forEach((reader) => {
        if (reader.readyState === 1) {
          reader.abort();
        }
      });
    };
  };

  const handleImageRemove = (index) => {
    const newImages = selectedEventDesign.images.filter((_, i) => i !== index);
    setSelectedEventDesign({ ...selectedEventDesign, images: newImages });
  };

  return (
    <div>
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
        Add Event Design
      </Button>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeader}><img src={Logo} alt="Logo" style={{ width: '50px', height: '40px' }} /></TableCell>
              <TableCell className={classes.tableHeader}>Title</TableCell>
              <TableCell className={classes.tableHeader}>Description</TableCell>
              <TableCell className={classes.tableHeader}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventDesignList.map((eventDesign) => (
              <Row
                key={eventDesign.design_id}
                row={eventDesign}
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isAddMode ? "Add Event Design" : "Edit Event Design"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <FormLabel>Event</FormLabel>
            <TextField
              select
              value={selectedEventDesign?.event_id}
              name="event_id"
              onChange={(e) =>
                setSelectedEventDesign({ ...selectedEventDesign, event_id: e.target.value })
              }
              error={!!errors.event_id}
              helperText={errors.event_id}
            >
              {Array.isArray(events) && events.map((event) => (
                    <MenuItem key={event.id} value={event.id}>
                      {event.title}
                    </MenuItem>
                  ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <FormLabel>Images</FormLabel>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <TextField
                  error={!!errors.images}
                  helperText={errors.images}
            >
            </TextField>
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Upload
              </Button>
            </label>
          </FormControl>
          <Box display="flex" flexWrap="wrap" mt={2}>
            {selectedEventDesign?.images?.map((image, index) => (
              <Card key={index} style={{ margin: "5px" }}>
                <CardMedia
                  component="img"
                  alt={`Event Design ${index + 1}`}
                  height="140"
                  image={image}
                  title={`Event Design ${index + 1}`}
                />
                <CardActions>
                  <IconButton onClick={() => handleImageRemove(index)}>
                    <ClearIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isAddMode ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
      </Box>
    </div>
  );
};

export default AllEventDesigns;
