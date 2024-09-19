import React, { useEffect } from 'react';
import { Grid, Card, CardMedia } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import print from "../assets/img1.png";
import status from "../assets/img2.png";
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: theme.spacing(2),
    },
    card: {
        height: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative', // Make the card position relative
    },
    statusCard: {
        backgroundColor: '#7f223d', // Set your desired color for the status card
    },
    printCard: {
        backgroundColor: '#FEE2D6', // Set your desired color for the print card
    },
    buttonContainer: {
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

const Status = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const handleStatusClick = () => {
        navigate('/dashboard-copy');
    }

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            await axios.post('http://127.0.0.1:8000/api/auth/logout', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            // Clear token from localStorage or perform any other logout-related actions
            localStorage.removeItem("token");
            // Redirect or perform any other action after logout
            navigate('/'); // Redirect to login page
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6}>
                    <Card className={`${classes.card} ${classes.printCard}`}>
                        <CardMedia
                            component="img"
                            alt="Print Image"
                            height={200}
                            style={{ width: 200 }}
                            image={print}
                            title="Print Image"
                            onClick={handleStatusClick}
                        />
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card className={`${classes.card} ${classes.statusCard}`}>
                        <div className={classes.buttonContainer}>
                            <Button
                                variant="contained"
                                endIcon={<LoginIcon />}
                                onClick={handleLogout}
                                sx={{
                                    backgroundColor: 'transparent',
                                    color: '#fff',
                                    border: 'none',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        boxShadow: 'none',
                                    },
                                    '& .MuiButton-endIcon': {
                                        color: '#fff',
                                        backgroundColor: 'red',
                                        borderRadius: '50%',
                                        padding: '4px', // Adjust padding as needed
                                    },
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                        <CardMedia
                            component="img"
                            alt="Status Image"
                            height={200}
                            style={{ width: 200 }}
                            image={status}
                            title="Designs Image"
                            
                        />
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default Status;
