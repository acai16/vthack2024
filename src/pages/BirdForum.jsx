import React, { useState, useEffect } from 'react';
import { useAuthInfo, useRedirectFunctions } from '@propelauth/react';
import { DynamoDB } from 'aws-sdk';
// import Draggable from 'react-draggable';
import { Box, Button, Grid, Paper, Typography, Container, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery";
import forestVideo from "../assets/background/Aviate.mov";
// Configure AWS
const dynamoDB = new DynamoDB.DocumentClient({
  region: 'us-east-1',
  accessKeyId: 'AKIA3GMCHGGUVH2T3PFV',
  secretAccessKey: '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'
});

function BirdForum() {
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
    const { user, isLoggedIn } = useAuthInfo();
    const { redirectToLoginPage } = useRedirectFunctions();
    const [photos, setPhotos] = useState([]);
    const [captions, setCaptions] = useState({});
    
    useEffect(() => {
      if (isLoggedIn) {
        fetchPhotos();
      }
    }, [isLoggedIn]);
  
    const fetchPhotos = async () => {
      const params = {
        TableName: 'Aviate',
      };
  
      try {
        const result = await dynamoDB.scan(params).promise();
        const updatedPhotos = result.Items.map(photo => ({
          ...photo,
          likes: photo.likes || 0,
          likedBy: photo.likedBy || []
        }));
        setPhotos(updatedPhotos);
        const initialCaptions = {};
        updatedPhotos.forEach(photo => {
          initialCaptions[photo.photoId] = photo.caption || '';
        });
        setCaptions(initialCaptions);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };
  
    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
  
        const newPhoto = {
          userId: user.userId,
          uploaderName: user.email,
          photoId: Date.now().toString(),
          imageData: base64String,
          caption: '',
          likes: 0,
          likedBy: []
        };
  
        const params = {
          TableName: 'Aviate',
          Item: newPhoto
        };
  
        try {
          await dynamoDB.put(params).promise();
          setPhotos([...photos, newPhoto]);
          setCaptions({...captions, [newPhoto.photoId]: ''});
        } catch (error) {
          console.error('Error adding photo:', error);
        }
      };
      reader.readAsDataURL(file);
    };

    const handleDeletePhoto = async (photoId) => {
      const photo = photos.find(p => p.photoId === photoId);
      if (!photo) return;

      const params = {
        TableName: 'Aviate',
        Key: { userId: photo.userId, photoId: photoId }
      };
  
      try {
        await dynamoDB.delete(params).promise();
        setPhotos(photos.filter(p => p.photoId !== photoId));
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    };

    const handleCaptionChange = (photoId, newCaption) => {
      setCaptions({...captions, [photoId]: newCaption});
    };

    const saveCaption = async (photoId) => {
      const photo = photos.find(p => p.photoId === photoId);
      if (!photo) return;

      const params = {
        TableName: 'Aviate',
        Key: { userId: photo.userId, photoId: photoId },
        UpdateExpression: 'set caption = :caption',
        ExpressionAttributeValues: { ':caption': captions[photoId] }
      };
  
      try {
        await dynamoDB.update(params).promise();
        setPhotos(photos.map(p => 
          p.photoId === photoId ? { ...p, caption: captions[photoId] } : p
        ));
      } catch (error) {
        console.error('Error saving caption:', error);
      }
    };

    const handleLike = async (photoId) => {
      const photo = photos.find(p => p.photoId === photoId);
      if (!photo) return;

      const isLiked = photo.likedBy.includes(user.userId);
      const newLikes = isLiked ? photo.likes - 1 : photo.likes + 1;
      const newLikedBy = isLiked 
        ? photo.likedBy.filter(id => id !== user.userId)
        : [...photo.likedBy, user.userId];
  
      const params = {
        TableName: 'Aviate',
        Key: { userId: photo.userId, photoId: photoId },
        UpdateExpression: 'set likes = :likes, likedBy = :likedBy',
        ExpressionAttributeValues: { 
          ':likes': newLikes,
          ':likedBy': newLikedBy
        }
      };
  
      try {
        await dynamoDB.update(params).promise();
        setPhotos(photos.map(p => 
          p.photoId === photoId ? { ...p, likes: newLikes, likedBy: newLikedBy } : p
        ));
      } catch (error) {
        console.error('Error updating likes:', error);
      }
    };
  
    if (!isLoggedIn) {
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
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                py: 4,
              }}
            >
              <Container>
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography
                    variant="h1"
                    color="white"
                    mb={3}
                    sx={{
                      fontSize: isMdDown ? "3rem" : "4rem",
                      fontWeight: 700,
                    }}
                  >
                    Bird Forum
                  </Typography>
                  <Typography variant="h5" color="white" mb={4}>
                    Please log in to access the Bird Forum
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large" 
                    onClick={redirectToLoginPage}
                    sx={{
                      mt: 2,
                      backgroundColor: 'white',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      },
                    }}
                  >
                    Go to Login Page
                  </Button>
                </Box>
              </Container>
            </Box>
          </Box>
        );
      }
  
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
            justifyContent="flex-start"
            minHeight="100vh"
            position="relative"
            zIndex={1}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              py: 4,
              overflowY: 'auto',
            }}
          >
            <Container maxWidth="lg">
              <Box sx={{ py: 4 }}>
              <Typography
                    variant="h1"
                    color="white"
                    mb={3}
                    sx={{
                        fontSize: isMdDown ? "3rem" : "4rem",
                        fontWeight: 700,
                        textAlign: 'center',  // Center the text
                        width: '100%',        // Ensure the Typography takes full width
                    }}
>
                  Bird Book
                </Typography>
                
                <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 4 }} color="white">
                  Share and explore bird photos
                </Typography>
    
                <Grid container spacing={3}>
                  {photos.map((photo) => (
                    <Grid item key={photo.photoId} xs={12} sm={6} md={4}>
                      <Paper elevation={3} sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <img 
                          src={`data:image/jpeg;base64,${photo.imageData}`} 
                          alt="Bird" 
                          style={{ width: '100%', height: 'auto', marginBottom: '8px' }} 
                        />
                        <Typography variant="subtitle2" gutterBottom>Uploaded by: {photo.uploaderName}</Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          value={captions[photo.photoId] || ''}
                          onChange={(e) => handleCaptionChange(photo.photoId, e.target.value)}
                          placeholder="Add a caption"
                          sx={{ mt: 1, mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <IconButton onClick={() => saveCaption(photo.photoId)} size="small">
                            <SaveIcon />
                          </IconButton>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => handleLike(photo.photoId)} size="small">
                              {photo.likedBy.includes(user.userId) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                            </IconButton>
                            <Typography variant="body2">{photo.likes}</Typography>
                          </Box>
                          {photo.userId === user.userId && (
                            <IconButton onClick={() => handleDeletePhoto(photo.photoId)} size="small">
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
    
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span" size="large" sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}>
                      Upload New Bird Photo
                    </Button>
                  </label>
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>
    );
}

export default BirdForum;