import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CssBaseline,
  InputAdornment,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import Axios from '../Axios';
import ClearIcon from '@mui/icons-material/Clear';

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageBase64s, setImageBase64s] = useState([]);
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await Axios.get("events");
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];
    const newImageBase64s = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        newImageBase64s.push(reader.result.split(',')[1]); 
        if (newImages.length === files.length) {
          setSelectedImages((prevImages) => [...prevImages, ...newImages]);
          setImageBase64s((prevBase64s) => [...prevBase64s, ...newImageBase64s]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageBase64s((prevBase64s) => prevBase64s.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const data = {
      event_id: eventId,
      images: imageBase64s, 
    };

    try {
      const response = await Axios.post("event-designs", data);
      console.log("Upload success:", response.data);
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        mt: 4,
      }}
    >
      <CssBaseline />
      <Typography py={2} align="left" color="#fff" variant="h6" gutterBottom>
        Upload Image
      </Typography>
   

      <FormControl fullWidth sx={{ mb: 2 }}>

      <Select
        sx={{
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none', 
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none', 
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none', 
          },
        }}
        labelId="event-select-label"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        displayEmpty 
      >
        <MenuItem value="" disabled>
          Choose Event
        </MenuItem>
        {events.map((event) => (
          <MenuItem key={event.id} value={event.id}>
            {event.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
 
      <TextField
        variant="outlined"
        fullWidth
        value={selectedImages.map((_, i) => `Image ${i + 1}`).join(", ")}
        placeholder="Choose images..."
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="body1"
                component="label"
                sx={{
                  backgroundColor: "#014550 !important",
                  color: "#fff !important",
                  borderRadius: "0px !important",
                  "&:hover": {
                    backgroundColor: "#01343b !important",
                  },
                }}
              >
                Browse
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      {selectedImages.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {selectedImages.map((image, index) => (
            <Card key={index} sx={{ maxWidth: 150, position: "relative" }}>
              <CardMedia
                component="img"
                sx={{
                  height: 150,
                  objectFit: "cover",
                }}
                image={image}
                alt={`Selected ${index}`}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {`Image ${index + 1}`}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -1,
                    right: -6,
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "grey.200" },
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <ClearIcon sx={{color:'red'}} fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={imageBase64s.length === 0 || !eventId}
        sx={{ mt: 2 }}
      >
        Upload
      </Button>
    </Box>
  );
};

export default ImageUpload;
  