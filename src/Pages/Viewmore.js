// import React, { useState } from "react";
// import { Element } from 'react-scroll';
// import {
//   Box,
//   Card,
//   CardMedia,
//   TextField,
//   IconButton,
// } from '@mui/material';
// import { useLocation } from 'react-router-dom';
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import Sidebar from "../component/Sidebar";
// import cycleImage from "../assets/cycle day 001.jpg";
// import cycleImage1 from "../assets/cycle day 001.jpg";
// import cycleImage2 from "../assets/cycle day 002.jpg";
// import cycleImage3 from "../assets/cycle day 003.jpg";
// import cycleImage4 from "../assets/cycle day 004.jpg";
// import cycleImage5 from "../assets/cycle day 005.jpg";
// import cycleImage6 from "../assets/cycle day 006.jpg";
// import cycleImage7 from "../assets/cycle day 007.jpg";
// import cycleImage8 from "../assets/cycle day 008.jpg";
// import cycleImage9 from "../assets/cycle day 009.jpg";
// import cycleImage10 from "../assets/cycle day 010.jpg";
// import yohaImage from "../assets/yoha day 001.jpg";
// import yohaImage1 from "../assets/yoha day 001.jpg";
// import yohaImage2 from "../assets/yoha day 002.jpg";
// import yohaImage3 from "../assets/yoha day 003.jpg";
// import yohaImage4 from "../assets/yoha day 004.jpg";
// import yohaImage5 from "../assets/yoha day 005.jpg";
// import yohaImage6 from "../assets/yoha day 006.jpg";
// import yohaImage7 from "../assets/yoha day 007.jpg";
// import yohaImage8 from "../assets/yoha day 008.jpg";
// import yohaImage9 from "../assets/yoha day 009.jpg";
// import yohaImage10 from "../assets/yoha day 010.jpg";
// // import yohaImage11 from "../assets/yoga day 011.jpg";
// // // import yohaImage12 from "../assets/yoga day 012.jpg";
// // import yohaImage13 from "../assets/yoga day 013.jpg";

// const YogaDay = () => {
//   const [mainImage, setMainImage] = useState(cycleImage);
//   const [mainImage2, setMainImage2] = useState(yohaImage);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(0);

//   const handleImageClick = (newImage) => {
//     setMainImage(newImage);
//   };

//   const handleImageClick2 = (newImage2) => {
//     setMainImage2(newImage2);
//   };

//   const location = useLocation();
//   const id = location.state.id;
//   console.log("dfssdfsdf", id);

//   const smallImages = [
//     cycleImage1,
//     cycleImage2,
//     cycleImage3,
//     cycleImage4,
//     cycleImage5,
//     cycleImage6,
//     cycleImage7,
//     cycleImage8,
//     cycleImage9,
//     cycleImage10,
//   ];

//   const smallImages2 = [
//     yohaImage1,
//     yohaImage2,
//     yohaImage3,
//     yohaImage4,
//     yohaImage5,
//     yohaImage6,
//     yohaImage7,
//     yohaImage8,
//     yohaImage9,
//     yohaImage10,
//     // yohaImage11,
//     yohaImage10,
//     yohaImage9,
//     // yohaImage12,
//     // yohaImage13,
//   ];

//   const imagesPerPage = 10; // 4 images per row, 2 rows per page

//   const filteredImages = smallImages2.filter((image, index) =>
//     `yoha day ${String(index + 1).padStart(3, '0')}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handlePrevPage = () => {
//     if (page > 0) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if ((page + 1) * imagesPerPage < filteredImages.length) setPage(page + 1);
//   };

//   const displayImages = filteredImages.slice(page * imagesPerPage, (page + 1) * imagesPerPage);

//   return (
//     <>
//       <Sidebar />
//       <style>
//         {`
//           .yoga-section {
//             padding-left: 100px;
//             padding-top: -600px;
//           }
//           @media (min-width: 450px) {
//             .yoga-section {
//               padding-left: 230px;
//             }
//           }
//         `}
//       </style>

//       <div className="yoga-section">
//         <Element name="yoga-section">
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//                padding: 1,
//               flexDirection: 'column',
//               alignItems: 'center',
//               backgroundColor: '#A6787A',
//             }}
//           >
//            <TextField
//   variant="outlined"
//   value={searchTerm}
//   onChange={(e) => setSearchTerm(e.target.value)}
//   placeholder="Search"
//   InputLabelProps={{
//     shrink: false,
//   }}
//   sx={{
//     marginBottom: 1,
//     width: '500px',
//     borderRadius: '25px',  // Rounded corners
//     boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  // Subtle shadow
//     marginTop: '5px', // Adjusted marginTop value
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#ccc',  // Default border color
//       },
//       '&:hover fieldset': {
//         borderColor: '#aaa',  // Border color on hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#007BFF',  // Border color when focused
//       },
//       backgroundColor: '#fff',  // Background color
//       borderRadius: '25px',  // Rounded corners for the input
//     },
//     '& .MuiInputBase-input': {
//       fontFamily: 'Arial, sans-serif',  // Custom font
//       fontSize: '16px',  // Font size
//       color: '#333',  // Text color
//     },
//     '& .MuiInputBase-input::placeholder': {
//       color: '#aaa',  // Placeholder text color
//       opacity: 1,  // Ensures custom color is applied
//     },
//   }}
// />


//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 width: '100%',
//                 marginTop: 0,
//               }}
//             >
//               <IconButton onClick={handlePrevPage} disabled={page === 0} sx={{ marginRight: '20px' }}> {/* Increase the margin bottom */}
//                 <ArrowBackIosNewIcon />
//             </IconButton>
//               <Box
//                 sx={{
//                   display: 'grid',
//                   gridTemplateColumns: 'repeat(5, minmax(10px, 1fr))', 
//                   gap: '15px',  // Adjusted gap between images
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   height :'60%',
//                   width: '60%',
//                 }}
//               >
//                 {displayImages.map((smallImage2, index2) => (
//                   <Card
//                   key={index2}
//                   sx={{
//                     width: '100%',  // Set a fixed width
//                     height: '100%', // Set a fixed height to maintain aspect ratio
//                     cursor: 'pointer',
//                     display: 'flex',
//                     // justifyContent: 'center',
//                     alignItems: 'center',
//                     marginLeft:'10px',
//                   }}
//                   onClick={() => handleImageClick2(smallImage2)}
//                 >
//                   <CardMedia
//                     component="img"
//                     alt={`small-images-${index2}`}
//                     image={smallImage2}
//                     title={`small-images-${index2}`}
//                     sx={{
//                       maxWidth: '100%', // Ensure image fits within the card
//                       maxHeight: '100%', // Ensure image fits within the card
//                       objectFit: 'cover', // Maintain aspect ratio and cover the card
//                     }}
//                   />
//                 </Card>
                
//                 ))}
//               </Box>
//               <IconButton onClick={handleNextPage} disabled={(page + 1) * imagesPerPage >= filteredImages.length} sx={{ marginLeft: '30px' }}> {/* Increase the margin bottom */}
//                     <ArrowForwardIosIcon />
//                 </IconButton>
//             </Box>
//           </Box>
//         </Element>
//       </div>
//     </>
//   );
// };

// export default YogaDay;

import React, { useState, useEffect } from "react";
import { Card, CardMedia, IconButton, Box, CircularProgress, Alert, useMediaQuery, Button } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import DownloadIcon from "@mui/icons-material/Download";
import { Element } from "react-scroll";
import Sidebar from "../component/Sidebar";
import Status from "../assets/ststus advertisment.png";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import Axios from "../Axios";

const YogaDay = () => {
  const [imagesData, setImagesData] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { id } = useLocation().state || {};
  const [error, setError] = useState(null);
  const [companyLogo, setCompanyLogo] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);
  const isMobileView = useMediaQuery("(max-width:600px)");

  const slidesToShow = isMobileView ? 1 : 3;
  const centerIndex = Math.floor(slidesToShow / 2);

  const fetchImages = async (eventId) => {
    try {
      setLoading(true);
      const response = await Axios.get(`event-designs/${eventId}`);
      console.log("API Response:", response.data);

      if (response.data.images && response.data.images.length > 0) {
        setImagesData(response.data.images);
      } else if (response.data.status === "failed") {
        setImagesData([]);
        setError(response.data.message);
      } else {
        setImagesData([]);
        setError("No Data Found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("No Data Found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchImages(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await Axios.get('auth/me');
        setCompanyLogo(userResponse.data.company_logo);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    const fetchFirstEventAfterCurrentDate = async () => {
      try {
        const response = await Axios.get("/events");
        const currentDate = new Date();

        const upcomingEvents = response.data.events.filter(event => new Date(event.event_date) > currentDate);

        // Sort the upcoming events by date in ascending order
        upcomingEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

        console.log('Sorted upcoming events:', upcomingEvents);

        if (upcomingEvents.length > 0) {
          const firstUpcomingEventId = upcomingEvents[0].id;
          await fetchImages(firstUpcomingEventId);
        } else {
          console.log("No upcoming events found.");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchUserData();
    fetchFirstEventAfterCurrentDate();
  }, []);

  const handleNextSlide = () => {
    setSliderIndex((prevIndex) => (prevIndex + 1) % imagesData.length);
  };

  const handlePrevSlide = () => {
    setSliderIndex((prevIndex) => (prevIndex - 1 + imagesData.length) % imagesData.length);
  };

  const downloadImage = async () => {
    const element = document.getElementById("combined-image");
    const canvas = await html2canvas(element, { scale: 10 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png", 1.0);
    link.download = "combined-image.png";
    link.click();
  };

  const handleZoom = (base64Image) => {
    console.log("Zoom image:", base64Image);
    setZoomedImage(base64Image);
  };

  const resetZoom = () => {
    setZoomedImage(null);
  };

  const duplicatedImages = [...imagesData, ...imagesData];

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
              // padding-left: 240px;
              width:100%;
            }
          }
          .css-m72epa-MuiCardContent-root {
              display: flex;
              justify-content: end;
              margin-right: -6%;
              padding: 10px;
              padding-top: 15px;
          }
          .css-f8rsqd-MuiButtonBase-root-MuiIconButton-root {
              display: flex;
              justify-content: center;
              padding: 10px;
              position: absolute;
              bottom: 22px;
              right: 2px;              
              background-color:white;
          }
          @media (min-width: 768px) {
            .hide-above-772 {
              display: none;
            }
          }
        `}
      </style>

      <div className="yoga-section">
        <Element name="yoga-section">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: 3,
              flexDirection: "column",
              backgroundColor: "#A6787A",
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                  }}
                >
                  <IconButton onClick={handlePrevSlide} sx={{ fontSize: 30 }}>
                    <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 60 }} />
                  </IconButton>
                  <Box
                    sx={{
                      display: "flex",
                      //overflow: "hidden",
                      // width: "100%",
                      // marginLeft:"100px",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    {duplicatedImages.slice(sliderIndex, sliderIndex + slidesToShow).map((base64Image, index) => {
                      const isCenter = index === centerIndex;
                      return (
                        <Box key={index}>
                          <Card
                            id={isCenter ? "combined-image" : ""}
                            sx={{
                              marginTop: "80px",
                              width: isCenter ? "200px" : "150px",
                              height: isCenter ? "300px" : "250px",
                              position: "relative",
                              borderRadius: "16px",
                              transition: "all 0.3s ease-in-out",
                              transform: isCenter ? "scale(1.1)" : "scale(1)",
                              zIndex: 0,
                            }}
                          >
                            <CardMedia
                              component="img"
                              alt="Yoga event design"
                              src={`data:image/png;base64,${base64Image}`}
                              title="Yoga event design"
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover", // Ensures the entire image fits within the dimensions
                                borderRadius: "16px",
                                zIndex: 1,
                              }}
                              onClick={() => handleZoom(base64Image)}
                            />
                            <CardMedia
                              component="img"
                              alt="status image"
                              image={Status}
                              title="status image"
                              sx={{
                                width: '100%',
                                height: '85%',
                                objectFit: 'contain',
                                position: 'absolute',
                                bottom: -2,
                              }}
                            />
                            {isCenter && isMobileView && (
                              <IconButton
                                className="hide-above-768"
                                sx={{
                                  position: "absolute",
                                  bottom: "5px",
                                  right: "5px",
                                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                                  zIndex: 2,
                                }}
                                onClick={() => handleZoom(base64Image)}
                              >
                                <AspectRatioIcon />
                              </IconButton>
                            )}
                          </Card>
                        </Box>
                      );
                    })}
                  </Box>
                  <IconButton onClick={handleNextSlide} sx={{ fontSize: 30 }}>
                    <KeyboardDoubleArrowRightIcon sx={{ fontSize: 60 }} />
                  </IconButton>
                </Box>
                {zoomedImage && (
                  <Box
                    sx={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      zIndex: 9999,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={resetZoom}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "80%",
                        maxWidth: "800px",
                        maxHeight: "80%",
                      }}
                    >
                      <img
                        src={`data:image/png;base64,${zoomedImage}`}
                        alt="Zoomed Yoga event design"
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          zIndex: 1,
                        }}
                      />
                      <img
                        src={Status}
                        alt="status advertisement"
                        style={{
                          width: "50%",
                          height: "auto",
                          position: "absolute",
                          bottom: 0,
                          zIndex: 2,
                        }}
                      />
                    </Box>
                  </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
                  <Button
                    className="hide-above-768"
                    sx={{
                      color: "white",
                      backgroundColor: "#7f223d",
                      padding: 1,
                      marginTop: "10px",
                      borderRadius: 10,
                      "&:hover": {
                        backgroundColor: "darkgreen", // Keep the same color on hover
                      },
                    }}
                    onClick={downloadImage}
                  >
                    Download <DownloadIcon sx={{ marginLeft: 1 }} />
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Element>
      </div>
    </>
  );
};

export default YogaDay;