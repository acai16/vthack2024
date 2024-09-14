import React from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles"

// Import your video file
import forestVideo from "../assets/background/Aviate.mov";  // Adjust the path as necessary

function About() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const accordionData = [
    {
      title: "Our Mission",
      content: "At Aviate, our mission is to revolutionize the way people interact with technology. We strive to create intuitive, powerful tools that enhance productivity and creativity in both personal and professional spheres."
    },
    {
      title: "Our Team",
      content: "Behind Aviate is a diverse team of passionate individuals, each bringing unique skills and perspectives to the table. From seasoned software engineers to creative designers and visionary product managers, our team is united by a common goal: to deliver exceptional user experiences."
    },
    {
      title: "Our Values",
      content: "Integrity, innovation, and user-centricity form the core of our values at Aviate. We believe in transparent communication, both within our team and with our users. We're committed to ethical practices in all aspects of our business."
    }
  ];

  const newsArticles = [
    {
      title: "Aviate Launches New AI-Powered Feature",
      date: "June 15, 2024",
      summary: "Aviate introduces a groundbreaking AI-powered feature that promises to transform user productivity.",
      imageUrl: "/api/placeholder/400/200"
    },
    {
      title: "Aviate Secures Series B Funding",
      date: "May 22, 2024",
      summary: "In a recent funding round, Aviate has secured $50 million in Series B funding to accelerate growth and innovation.",
      imageUrl: "/api/placeholder/400/200"
    },
    {
      title: "Aviate Partners with Tech Giants",
      date: "April 10, 2024",
      summary: "Aviate announces strategic partnerships with leading tech companies to enhance its ecosystem and reach.",
      imageUrl: "/api/placeholder/400/200"
    }
  ];

  const transparentWhite = 'rgba(255, 255, 255, 0.9)';

  return (
    <Box component="div" position="relative" overflow="hidden" minHeight="100vh">
      {/* Video background */}
      <Box
        component="video"
        src={forestVideo}
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      
      {/* Content overlay */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minHeight="100vh"
        position="relative"
        zIndex={1}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay
          py: 4, // Add some vertical padding
        }}
      >
        <Container>
        <Typography
                variant="h1"
                color="white"
                mb={3}
                sx={{
                  fontSize: isMdDown ? "3rem" : "4rem",
                  fontWeight: 700,
                }}
              >
            About Us
          </Typography>
          <Typography variant="body1" color="white" mb={4}>
            Learn more about Aviate and our commitment to innovation.
          </Typography>
          
          {/* Accordions */}
          <Grid container spacing={2} mb={6}>
            {accordionData.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Accordion
                  sx={{
                    backgroundColor: transparentWhite,
                    color: 'text.primary',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}-content`}
                    id={`panel${index + 1}-header`}
                  >
                    <Typography variant="h6">{item.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {item.content}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>

          {/* News Articles */}
          <Typography
                variant="h2"
                color="white"
                mb={3}
                sx={{
                  fontSize: isMdDown ? "3rem" : "4rem",
                  fontWeight: 700,
                }}
              >
            Latest News
          </Typography>
          <Grid container spacing={3}>
            {newsArticles.map((article, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%',
                    backgroundColor: transparentWhite,
                    borderRadius: '16px', // Increased border radius for more rounded corners
                    overflow: 'hidden', // Ensure content doesn't overflow rounded corners
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={article.imageUrl}
                    alt={article.title}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {article.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {article.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {article.summary}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button size="small" color="primary">Read More</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default About;