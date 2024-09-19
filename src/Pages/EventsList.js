import React, { useState, useEffect } from "react";
import { Card, CardMedia, CardContent, IconButton, Box } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Element } from "react-scroll";
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import Sidebar from "../component/Sidebar";
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';
import Axios from '../Axios'; // Make sure Axios is properly configured
import { useMediaQuery } from '@mui/material'; 
import "../css/eventlist.css";
import '../css/yoga.css';
import Spinner from "../Pages/Spinner";
import { useNavigate } from 'react-router-dom';

const EventList = () => {
  const [imagesData, setImagesData] = useState([]);
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyLogoheader, setCompanyLogoheader] = useState("");
  const [sliderIndex, setSliderIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { id } = useLocation().state || {};
  const [error, setError] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null); // State for zoomed image
  const isMobile = useMediaQuery('(max-width: 600px)');
  const slidesToShow = 3;
  const centerIndex = Math.floor(slidesToShow / 2);
  const [headerImage, setHeaderImage] = useState(""); 
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const navigate = useNavigate();
  const [logo, setLogo] = useState(""); // Save the logo type here
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchImages = async (eventId) => {
      try {
        setLoading(true);
        const response = await Axios.get(`event-designs/${eventId}`);
        console.log("API Response:", response.data);

        console.log("Logo type:", response.data.logo);
        setLogo(response.data.logo); 
        if (response.data.images && response.data.images.length > 0) {
          setImagesData(response.data.images);
          setHeaderImage(response.data.header_image || "");
          setTitle(response.data.title || "Untitled"); // Capture the title from the API response
        } else if(response.data.status === 'failed'){
          setError(response.data.message || "No images found");
          alert("no data found");
          setImagesData([]);
        } else {
          setError("No images found");
          console.log("No image data found.");
          alert("no data found");
        }
      } catch (error) {
        setError("Failed to fetch images");
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
      
    };


  
  const fetchUserData = async () => {
    try {
      const response = await Axios.get('auth/me');
      
      console.log("User Response:", response.data); // Log the entire response for debugging
      
      // Destructure from response.data, not response
      const {company_logo, company_logo_header } = response.data; // Correct destructuring

  
      console.log("company_logo_header:", company_logo_header);
      console.log("company_logo:", company_logo);
      console.log("Logo:", logo); 
      // Check for logo type and set the company logo accordingly
      if (logo === "header_footer") {
        console.log("company_logo_header:", company_logo_header);
        // setCompanyLogo(company_logo_header);
        setCompanyLogo(company_logo_header ? `data:image/png;base64,${company_logo_header}` : ""); 
      } else if (logo === "footer_only") {
        console.log("company_logo:", company_logo);
        setCompanyLogo(company_logo ? `data:image/png;base64,${company_logo}` : ""); 
      }
      
    } catch (error) {
      setError("Failed to fetch user data");
      console.error("Failed to fetch user data", error);
    }
  };
  
 

    const fetchFirstEventAfterCurrentDate = async () => {
      try {
        const response = await Axios.get("/events");
        const currentDate = new Date();
        
        const upcomingEvents = response.data.events.filter(event => new Date(event.event_date) > currentDate);
        upcomingEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    
        console.log('Sorted upcoming events:', upcomingEvents);
    
        if (upcomingEvents.length > 0) {
          const firstUpcomingEventId = upcomingEvents[0].id;
          await fetchImages(firstUpcomingEventId);
        } else {
          setError("No upcoming events found");
         
          console.log("No upcoming events found.");
        }
      } catch (error) {
        setError("Failed to fetch events");
   
        console.error("Error fetching events:", error);
      }
    };

    if (id) {
      fetchImages(id);
    } else {
      fetchFirstEventAfterCurrentDate();
    }

    fetchUserData();
  }, [id,logo]);

  const handleNextSlide = () => {
    setSliderIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % imagesData.length;
      return newIndex;
    });
  };

  const handlePrevSlide = () => {
    setSliderIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + imagesData.length) % imagesData.length;
      return newIndex;
    });
  };


  const downloadImage = async () => {
    const elements = document.getElementsByClassName('card-center');
    if (!elements || elements.length === 0) {
      console.error("Element 'card-center' not found");
      return;
    }
  
    // Access the first element in the collection
    const element = elements[0];
  
    // Store the original border-radius
    const originalBorderRadius = window.getComputedStyle(element).getPropertyValue('border-radius');
  
    // Hide the zoom icon before capturing the canvas
    const zoomIcon = element.querySelector('.zoom-icon');
    if (zoomIcon) {
      zoomIcon.style.display = 'none';
    }
  
    // Temporarily remove the border-radius using !important
    element.style.setProperty('border-radius', '0px', 'important');
  
    try {
      const canvas = await html2canvas(element, { scale: 15 });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      //link.download = 'combined-image.png';
      link.download = `${title || 'default'}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating canvas or downloading image:", error);
    } finally {
      // Show the zoom icon again after capturing the canvas
      if (zoomIcon) {
        zoomIcon.style.display = '';
      }
  
      // Revert the border-radius back to its original state
      element.style.setProperty('border-radius', originalBorderRadius, 'important');
    }
  };
  
  const duplicatedImages = [...imagesData, ...imagesData];

  const handleZoom = (base64Image) => {
    console.log("Zoom image:", base64Image);
    setZoomedImage(base64Image);


    // setIsZoomedIn(true);
   
    // window.history.pushState({ zoomed: true }, '');
  };

  const resetZoom = () => {
    setZoomedImage(null);


    // setIsZoomedIn(false);
   
    // window.history.back(); 
  };



  //  useEffect(() => {
  //   const handlePopState = (event) => {
  //     if (event.state && event.state.zoomed) {
       
  //       setIsZoomedIn(false);
  //     } else {
      
  //       navigate('/EventsList'); 
  //     }
  //   };

  //   window.addEventListener('popstate', handlePopState);

   
  //   return () => {
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, [navigate]);
  


  // const handleImageClick = (clickedIndex) => {
  //   const newSliderIndex = sliderIndex + clickedIndex - centerIndex;
  //   setSliderIndex(newSliderIndex);
  // };

  const handleImageClick = (clickedIndex) => {
    const newIndex = sliderIndex + (clickedIndex - centerIndex);
  
    // Adjust newIndex to ensure it's within bounds
    if (newIndex < 0) {
      setSliderIndex(imagesData.length - slidesToShow + newIndex);
    } else if (newIndex >= imagesData.length) {
      setSliderIndex(newIndex % imagesData.length);
    } else {
      setSliderIndex(newIndex);
    }
  };
  
  return (
    <>
      <Sidebar />
      <style>
        {`
          .yoga-section {
            padding-left: 0px;
            padding-top: -600px;
            
          }
          @media (min-width: 450px) {
            .yoga-section {
              padding-left: 240px;
            }
          }

          .spinner-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.3);
            z-index: 9999;
          }
          
        `}
      </style>
      {loading && (
        <div className="spinner-overlay">
          <Spinner />
        </div>
      )}
      <div className="mainsection">
        <div className="yoga-section">
          <Element name="yoga-section">
            <Box className="card-container"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: 3,
                flexDirection: 'column',
                backgroundColor: '#A6787A',
              }}
              >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // padding: 2,
                }}
              >
                <IconButton onClick={handlePrevSlide} sx={{ fontSize: 30 }}>
                  <KeyboardDoubleArrowLeftIcon className="arrow" sx={{ fontSize: 60 }} />
                </IconButton>
                <Box className="card-container"
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    overflow: 'hidden',
                    width: '100%',
                    justifyContent: 'center',
                    gap: 7,
                  }}
                >
                  {imagesData.slice(sliderIndex, sliderIndex + slidesToShow).map((base64Image, index) => {
                    const isCenter = index === centerIndex;
                    return (
                      <Box key={index} sx={{ position: 'relative' }}>
                      <Card
                  className={`card ${isCenter ? 'card-center' : 'card-non-center'}`}
                  onClick={() => handleImageClick(index)}
                      >
                          <CardMedia
                            className="card-media"
                            component="img"
                            src={`data:image/png;base64,${base64Image}`}
                            title="main image"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              position: 'relative',
                              backgroundColor: 'transparent',
                            }}
                            alt="Event Design"
                          />
                          {headerImage && isCenter && (
                            <CardMedia
                              className="card-logo"
                              component="img"
                              src={`data:image/png;base64,${headerImage}`} // Use the header image here
                              alt="Header Image"
                              sx={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'contain',
                                position: 'absolute',
                                top: 5,
                                left: 5,
                              }}
                              />
                            )}
                            
                            {companyLogo && (
                            <CardMedia
                            className="card-logo"
                            component="img"
                            src={companyLogo}
                            title="status image"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              position: 'absolute',
                              bottom: 0,
                              // backgroundColor: 'transparent', // Ensure background is transparent
                            }}
                            alt="Company Logo"
                          />
                          
                          )}


                          {isMobile && ( // Render the zoom icon only on mobile

                            <IconButton
                              className="zoom-icon"
                              sx={{
                                position: 'absolute',
                                bottom: '5px',
                                right: '25px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                zIndex: 2,
                              }}
                              onClick={() => handleZoom(base64Image)}
                            >
                              <AspectRatioIcon />
                            </IconButton>
                          )}
                        </Card>
                        {isCenter && (
                          <CardContent
                            sx={{
                              display: 'flex',
                              gap: 2,
                              marginTop: 1,
                            }}
                          >
                            <IconButton className="download-btn" aria-label="download" onClick={downloadImage}>
                              DOWNLOAD<DownloadIcon sx={{color:"white"}}/>
                            </IconButton>
                          </CardContent>
                        )}
                      </Box>
                    );
                  })}
                </Box>
                <IconButton onClick={handleNextSlide} sx={{ fontSize: 30 }}>
                  <KeyboardDoubleArrowRightIcon className="arrow" sx={{ fontSize: 60 }} />
                </IconButton>
              </Box>
            </Box>
          </Element>
        </div>
      </div>
      {/* Zoom Modal */}
      {zoomedImage && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={resetZoom}
        >
         <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              borderRadius: '16px',
              padding: '16px',
            }}
          >
            <img src={`data:image/png;base64,${zoomedImage}`} alt="Zoomed Event Design" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '16px' }} />
            {companyLogo && (
              <img
                className="zoompic"
                src={companyLogo}
                alt="Zoomed Company Logo"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                }}
              />
            )}
               {/* Use the back button to zoom out */}
            {/* <IconButton
              onClick={resetZoom}
              sx={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                color: 'white',
              }}
            >
              <KeyboardDoubleArrowLeftIcon />
            </IconButton> */}
          </Box>
        </Box>
      )}
    </>
  );
};

export default EventList;
