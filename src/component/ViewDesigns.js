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
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Divider,
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
import Resizer from 'react-image-file-resizer';
import Spinner from "../Pages/Spinner"; // Make sure this path is correct
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

const AllEventDesigns = (eventId ) => {
  const classes = useStyles();
  const [eventDesignList, setEventDesignList] = useState([]);
  const [open, setOpen] = useState(false);
  
  const [selectedHeaderDesign, setSelectedHeaderDesign] = useState({
    images: [],
    // other fields if any
  });
  
  const [isAddMode, setIsAddMode] = useState(false);
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [imageBase64s, setImageBase64s] = useState([]);
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState({ images: '', });
  const [companyLogo, setCompanyLogo] = useState(null);
  const [selectedEventDesign, setSelectedEventDesign] = useState({
     logo: "footer_only",
  })
  const [selectedEventDesignupdate, setSelectedEventDesignupdate] = useState({
    
 })
 
    const [selectedEventDesigndelete, setSelectedEventDesigndelete] = useState({
        imagesToDelete: [], // Initialize to keep track of images to delete
    }); 
 

  const [selectedLogo, setSelectedLogo] = useState("footer_only");
  const [companyLogoHeader, setCompanyLogoHeader] = useState(null); 
  // const [status, setStatus] = useState('disabled');
  const [successMessage, setSuccessMessage] = useState('');
  const [previousImages, setPreviousImages] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [totalImageSize, setTotalImageSize] = useState(0); // State to hold total image size
  const MAX_TOTAL_SIZE_MB = 48; // Maximum allowed size in MB (change as needed)
  const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024; // Convert MB to bytes

  const handleLogoChange = (event) => {
    setSelectedLogo(event.target.value); // Update the selected value
  };
 
  const handleSubmit1 = async (eventDesign) => {
    console.log("eventDesign object:", eventDesign);

    // Check if design_id is properly passed
    if (!eventDesign || !eventDesign.design_id) {
      console.error("design_id is undefined");
      Swal.fire("Error", "Design ID is missing", "error");
      return;
    }

    try {
      const response = await Axios.put(`/event-design/${eventDesign.design_id}/logo`, {
        logo: selectedLogo,
      });
      console.log('API Response:', response.data);

      // Show success message with SweetAlert
      //Swal.fire("Success", "Logo settings updated successfully", "success");

      // Set the success message to display below the button
      setSuccessMessage(`${selectedLogo} set successfully`);

      // Optional: Reset the success message after a timeout
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error updating logo settings", error);
      // Show error message with SweetAlert
     // Swal.fire("Error", "Failed to update logo settings", "error");
    }
  };



  
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

  useEffect(() => {
    const fetchCompanyLogos = async () => {
      try {
        const response = await Axios.get("/auth/me");
        if (selectedEventDesign?.logo === "footer_only") {
          setCompanyLogo(response.data.company_logo || "no logo here");
        } else if (selectedEventDesign?.logo === "header_footer") {
          setCompanyLogoHeader(response.data.company_logo_header || "no logo here");
        } else {
          // Handle when the logo is 0 or undefined
          setCompanyLogo("no logo here");
          setCompanyLogoHeader("no logo here");
        }
      } catch (error) {
        console.error("Error fetching company logos", error);
      }
    };
  
    fetchCompanyLogos();
  }, [selectedEventDesign?.logo]);
  

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
      const images = response.data.images || []; // Make sure this is an array
  
      if (images.length === 0) {
        console.warn("No images found for the event design.");
      }
  
      const imagesBase64 = images.map((image) => ({
        src: `data:image/jpeg;base64,${image}`,
        isOld: true, // Mark as old images
      }));
  
      setSelectedEventDesign({
        ...eventDesign,
        images: imagesBase64,
        event_id: eventDesign.event_id,
      });
      
      console.log("Selected Event Design Images after edit:", imagesBase64);
      setImageBase64s(images);
      setIsAddMode(false);
      setOpen(true);
    } catch (error) {
      console.warn("Error in fetching design images", error);
    }
  };
  
  
  const handleAdd = () => {
    setSelectedEventDesign({
      event_id: "",
      title: "",
      description: "",
      images: [], // No images initially
    });
    setIsAddMode(true);
    setOpen(true);
  };

// const handleImageRemove = (index) => {
//     const imageToRemove = selectedEventDesign.images[index]; // Get the image being removed
//     const newImages = selectedEventDesign.images.filter((_, i) => i !== index);

//     // Update the state
//     setSelectedEventDesignupdate({
//         ...selectedEventDesign,
//         images: newImages.length > 0 ? newImages : [],
//         imagesToDelete: [...(selectedEventDesign.imagesToDelete || []), imageToRemove], // Add to delete list
//     });
// };
const handleImageChange = (event) => {
  const files = Array.from(event.target.files);
  const resizedImages = [];
  let currentSessionSize = 0;

  setErrors((prev) => ({ ...prev, images: '' }));

  files.forEach((file) => {
      if (file.size + totalImageSize + currentSessionSize <= MAX_TOTAL_SIZE_BYTES) {
          currentSessionSize += file.size;

          Resizer.imageFileResizer(
              file,
              400, // Resize width
              400, // Resize height
              "JPEG",
              100, // Quality
              0, // Rotation
              (uri) => {
                  resizedImages.push({ src: uri, isOld: false, size: file.size });

                  if (resizedImages.length === files.length) {
                      setSelectedEventDesign((prev) => ({
                          ...prev,
                          images: [...(prev.images || []), ...resizedImages],
                      }));

                      setSelectedEventDesignupdate(() => ({
                          images: resizedImages.length > 0 ? [...resizedImages] : [],
                      }));

                      setTotalImageSize((prevTotal) => {
                          const newTotal = prevTotal + currentSessionSize;
                          console.log(`Total file size: ${(newTotal / 1024 / 1024).toFixed(2)} MB`);
                          return newTotal;
                      });
                  }
              },
              "base64"
          );
      } else {
          setErrors((prev) => ({ ...prev, images: `Total image size exceeds ${MAX_TOTAL_SIZE_MB} MB!` }));
      }
  });
};

const handleImageRemove = (index) => {
  const imageToRemove = selectedEventDesign.images[index]; // Get the image to remove
  if (!imageToRemove) return; // Ensure image exists

  // Create a new array of images excluding the one to remove
  const newImages = selectedEventDesign.images.filter((_, i) => i !== index);

  // Update selectedEventDesign with remaining images
  setSelectedEventDesign((prev) => ({
      ...prev,
      images: newImages, // Set to the remaining images
  }));

  // Update imagesToDelete with the original filename
  setSelectedEventDesigndelete((prev) => ({
      ...prev,
      imagesToDelete: [
          ...(prev.imagesToDelete || []),
          imageToRemove.filename || imageToRemove.src, // Use filename or fallback to src
      ],
  }));

  // Log the original name of the image to be deleted
  console.log("Image to delete:", imageToRemove.filename || imageToRemove.src);

  // Update total image size based on the removed image size if needed
  const removedImageSize = imageToRemove.size || 0; // Ensure safe access
  setTotalImageSize((prevTotal) => prevTotal - removedImageSize);
};





const handleSubmit = async () => {
  setLoading(true);
  try {
      const payload = {
          event_id: selectedEventDesign.event_id,
      };

      // Extract new images that are in base64 format
      const newImages = selectedEventDesign.images
          .filter((image) => !image.isOld && image.src.startsWith("data:image"))
          .map((image) => image.src.split(",")[1]); // Extract base64 data

      // Extract images to delete (make sure they are valid filename strings)
      const imagesToDelete = selectedEventDesigndelete.imagesToDelete || [];

      // Log the images to be deleted
      console.log("Images to delete:", imagesToDelete); // Should show original filenames

      // Combine new images and ensure you don't include deleted ones
      if (imagesToDelete.length > 0) {
          payload.delete_images = imagesToDelete; // Only send original filenames
      }

      if (newImages.length > 0) {
          payload.images = newImages;
      }

      console.log("Payload being submitted:", payload);

      let response;
      if (selectedEventDesign.design_id) {
          response = await Axios.put(
              `/event-designs/${selectedEventDesign.design_id}`,
              payload,
              {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "application/json",
                  },
              }
          );
      } else {
          response = await Axios.post(
              `/event-designs`,
              payload,
              {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "application/json",
                  },
              }
          );
      }

      if (response.status === 200 || response.status === 201) {
          Swal.fire(
              "Success",
              selectedEventDesign.design_id
                  ? "Event design updated successfully"
                  : "Event design created successfully",
              "success"
          );
          handleClose();
      } else {
          console.warn("Unexpected response status:", response.status);
          Swal.fire("Error", "Failed to submit event design", "error");
      }
  } catch (error) {
      console.error("Error in submitting event design:", error);
      if (error.response) {
          console.error("Error response:", error.response.data);
          Swal.fire(
              "Error",
              error.response.data.message || "Failed to submit event design",
              "error"
          );
      } else {
          Swal.fire("Error", "Network error or server not responding", "error");
      }
  } finally {
      setLoading(false);
  }
};








  
 
  
  

      const handleEdit1 = async (eventDesign) => {
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


  const handleAdd1 = () => {
    setSelectedEventDesign({ event_id: "", title: "", description: "", images: [] });
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
    }
  };
  
  const handleClose = () => {
    setOpen(false);
    setSelectedEventDesign(null);
    setErrors({});
  };

  
 
  

 
  
  
  

  // const handleHeaderImageChange = (event) => {
  //   const files = event.target.files;
  
  //   if (files.length) {
  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  
  //       Resizer.imageFileResizer(
  //         file,
  //         1200, // maxWidth for high resolution
  //         1200, // maxHeight for high resolution
  //         'WEBP', // compress format
  //         90, // quality
  //         0, // rotation
  //         (uri) => {
  //           // Use the compressed image URI here
  //           setSelectedHeaderDesign((prevState) => ({
  //             ...prevState,
  //             images: prevState?.images ? [...prevState.images, uri] : [uri],
  //           }));
  //         },
  //         "base64" // Output format
  //       );
  //     }
  //   }
  // };
  
  //   const files = event.target.files;
  
  //   if (files.length > 0) {
  //     // Assuming you're storing images in selectedEventDesign.images
  //     const headerImageUrl = URL.createObjectURL(files[0]); // Create a URL for the selected image
  //     setSelectedEventDesign((prevState) => ({
  //       ...prevState,
  //       header_image: headerImageUrl, // Add the header image to the state
  //     }));
  //   }
  // };
  
//   const handleImageRemove = (index) => {
//     const newImages = selectedEventDesign.images.filter((_, i) => i !== index);
//     setSelectedEventDesign({ ...selectedEventDesign, images: newImages.length > 0 ? newImages : [] });
//   };


  
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
    {loading && (
  <div className="spinnerContainer">
    <Spinner />
  </div>
)}
<DialogContent>
  {/* Event Field */}
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

  {/* Images Field */}
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
      InputProps={{
        readOnly: true,
      }}
    />
    <label htmlFor="raised-button-file">
      <Button variant="contained" component="span">
        Upload
      </Button>
    </label>
  </FormControl>

  {/* Image Preview */}
  {/* <Box display="flex" flexWrap="wrap" mt={2}>
    {selectedEventDesign?.images?.map((image, index) => (
      <Card key={index} style={{ margin: "5px" }}>
        <CardMedia
          component="img"
          alt={Event Design ${index + 1}}
          height="140"
          image={image}
          title={Event Design ${index + 1}}
        />
        <CardActions>
          <IconButton onClick={() => handleImageRemove(index)}>
            <ClearIcon />
          </IconButton>
        </CardActions>
      </Card>
    ))}
  </Box> */}
<Box display="flex" flexWrap="wrap" mt={2}>
  {selectedEventDesign?.images?.map((image, index) => {
    if (!image || !image.src) {
      console.warn(`Image at index ${index} is undefined or has no src.`);
      return null; // Skip rendering if the image is invalid
    }

    return (
      <Card key={index} style={{ margin: "5px" }}>
        <CardMedia
          component="img"
          alt={`Event Design ${index + 1}`}
          height="140"
          image={image.src} // Access the src property
          title={`Event Design ${index + 1}`}
        />
        <CardActions>
          <IconButton onClick={() => handleImageRemove(index)}>
            <ClearIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  })}
</Box>






  <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />

  <div style={{ display: 'flex', alignItems: 'center' }}>
      <FormControl component="fieldset" margin="dense">
        <FormLabel component="legend">Logo</FormLabel>
        <RadioGroup row name="logo" value={selectedLogo} onChange={handleLogoChange}>
          <FormControlLabel
            value="footer_only"
            control={<Radio />}
            label="Footer Only"
          />
          <FormControlLabel
            value="header_footer"
            control={<Radio />}
            label="Header with Footer"
          />
        </RadioGroup>
      </FormControl>

      <button onClick={() => handleSubmit1(selectedEventDesign)}>OK</button>

      
      {successMessage && (
        <div style={{ color: 'green', marginLeft: '10px' }}>{successMessage}</div>
      )}
    </div>

</DialogContent>


   
    

    {/* <FormControl fullWidth margin="dense">
    <FormLabel>Header Image</FormLabel>
  <Switch
    checked={status === 'active'}
    onChange={handleStatusChange}
  />
 {status === 'active' && (
  <>
    <input type="file" accept="image/*" onChange={handleHeaderImageChange} />
    {selectedHeaderDesign?.header_image && (
      <Box mt={2}>
        <img src={selectedHeaderDesign.header_image} alt="Header" style={{ width: "200px", objectFit: "cover" }} />
      </Box>
    )}
    <label htmlFor="raised-button-header-file">
      <Button variant="contained" component="span">
        Upload Header Image
      </Button>
    </label>
  </>
)}

</FormControl> */}

  
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleSubmit} color="primary">
      {isAddMode ? "Save" : "Save"}
    </Button>
  </DialogActions>
</Dialog>

      </Box>
      </Box>
    </div>
  );
};

export default AllEventDesigns;