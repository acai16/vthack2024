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
import News1Image from "../assets/images/News1.png"
import News2Image from "../assets/images/News2Image.jpg"
import News3Image from "../assets/images/News3Image.jpg"

function About() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const accordionData = [
    {
      title: "Our Mission",
      content: "At Aviate Ai, we are committed to enhancing the understanding and conservation of bird populations by leveraging cutting-edge technology to detect and analyze bird sounds and images."
    },
    {
      title: "Our Team",
      content: "Our diverse and passionate team consists of environmental scientists, software engineers, and bird enthusiasts dedicated to creating innovative solutions for environmental protection."
    },
    {
      title: "Our Values",
      content: "We value collaboration, innovation, and sustainability, and strive to empower local communities and agencies with real-time data to help preserve biodiversity and promote ecological balance."
    }
  ];

  const newsArticles = [
    {
      title: "Birds & Biodiversity",
      date: "June 15, 2024",
      summary: "At Aviate Ai, we are committed to enhancing the understanding and conservation of bird populations by leveraging cutting-edge technology to detect and analyze bird sounds..",
      imageUrl: News1Image,
      link: "https://global.canon/en/environment/bird-branch/bird-column/biodiversity2/index.html"
    },
    {
      title: "Birds Are a Key Investment for Protecting Biodiversity",
      date: "May 22, 2024",
      summary: "The State of the Birds 2022 report emphasizes that birds are vital for biodiversity conservation, serving as responsive indicators whose protection benefits numerous other species. Efforts to restore bird habitats, such as for the Kirtland's Warbler and Red-cockaded Woodpecker, have also aided other endangered species and demonstrate the interconnectedness of ecosystems.",
      imageUrl: News2Image,
      link: "https://www.stateofthebirds.org/2022/birds-investment-biodiversity/"
    },
    {
      title: "How Does Climate Change Impact Birds?",
      date: "April 10, 2024",
      summary: "The American Bird Conservancy highlights how climate change impacts birds both directly, by altering their habitats, migration patterns, and physical traits, and indirectly, through effects such as drought, wildfires, sea-level rise, and disease spread. It encourages people to help birds by reducing non-climate threats, cutting carbon emissions, and restoring bird habitats.",
      imageUrl: News3Image,
      link: "https://abcbirds.org/blog/climate-change-impact/"
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
            Learn more about Aviate and our commitment to innovation and conservation.
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
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: 250,  // Fixed height for all images
                      objectFit: 'cover',  // Ensure the image covers the area without distortion
                    }}
                    image={article.imageUrl}
                    alt={article.title}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {article.title}
                  </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {article.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {article.summary}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        size="small" 
                        color="primary"
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read More
                      </Button>
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