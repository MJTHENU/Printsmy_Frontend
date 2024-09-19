import React, { useState } from "react";
import {
  Button,
  Container,
  FormControl,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "../Axios";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    width: "50%",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControlInline: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& > div": {
      width: "48%",
    },
  },
}));

function AddFestival() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [statusOptions, setStatusOptions] = useState([
    { value: "soon", label: "Soon" },
    { value: "start", label: "Start" },
    { value: "complete", label: "Complete" },
  ]);

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    event_date: "",
    status: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "event_date") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      // Set the time of the selected date and current date to 00:00:00 to avoid timezone issues
      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      const diffDays = Math.ceil((selectedDate - currentDate) / (1000 * 60 * 60 * 24));

      if (diffDays <= 30) {
        setStatusOptions([
          { value: "soon", label: "Soon" },
          { value: "start", label: "Start" },
        ]);
        setInputs((prevInputs) => ({
          ...prevInputs,
          status: "soon", // Automatically select "Soon" when within 30 days
        }));
      } else {
        setStatusOptions([
          { value: "soon", label: "Soon" },
          { value: "start", label: "Start" },
          { value: "complete", label: "Complete" },
        ]);
        setInputs((prevInputs) => ({
          ...prevInputs,
          status: "", // Clear the status when it's not within 30 days
        }));
      }
    }

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleEvent = async (event) => {
    event.preventDefault();

    const data = {
      title: inputs.title,
      description: inputs.description,
      event_date: inputs.event_date,
      status: inputs.status,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setResponseMessage("No token found. Please log in.");
        throw new Error("No token found");
      }
      const response = await Axios.post("store-events", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 201) {
        alert("Event created successfully.");
        navigate("/image-upload");
      } else {
        setResponseMessage("Invalid response from server. Please try again later.");
      }
    } catch (error) {
      console.error("Error ========>", error);
      if (error.response) {
        if (error.response.status === 401) {
          setResponseMessage("Unauthorized access. Please log in again.");
        } else if (error.response.status === 422) {
          setResponseMessage("Validation error: " + error.response.data.message);
        } else if (error.response.status === 404) {
          setResponseMessage("Endpoint not found. Please check the URL.");
        } else {
          setResponseMessage("Server error: " + error.response.status);
        }
      } else if (error.request) {
        setResponseMessage("No response from server. Please try again later.");
      } else {
        setResponseMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: "transparent",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Typography component="h1" variant="h5">
          Add Festival
        </Typography>
        <form className={classes.form} onSubmit={handleEvent}>
          <div className={classes.formControlInline}>
            <FormControl margin="normal" required fullWidth>
              <TextField
                label="Title"
                name="title"
                onChange={handleChange}
                variant="outlined"
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                label="Description"
                name="description"
                onChange={handleChange}
                variant="outlined"
              />
            </FormControl>
          </div>
          <div className={classes.formControlInline}>
            <FormControl margin="normal" required fullWidth>
              <TextField
                type="date"
                name="event_date"
                onChange={handleChange}
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal">
              <Select
                onChange={handleChange}
                variant="outlined"
                name="status"
                value={inputs.status}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Status
                </MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Add
          </Button>
          {responseMessage && <p>{responseMessage}</p>}
        </form>
      </Container>
    </div>
  );
}

export default AddFestival;
