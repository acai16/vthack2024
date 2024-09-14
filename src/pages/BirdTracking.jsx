import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoicGRvbzIwMDQiLCJhIjoiY20xMWluN3puMHN5cTJqcTFyeGY2bG5tOSJ9.8E3KBwUMaJCyWD3uNh8M3w';

function BirdTracking() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(15);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [birdName, setBirdName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      pitch: 75,
      bearing: -45,
    });

    map.current.on('load', () => {
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Adjust the position of the navigation control
      const navControl = document.querySelector('.mapboxgl-ctrl-top-right');
      if (navControl) {
        navControl.style.top = '60px';  // Adjust this value as needed
      }

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          const { longitude, latitude } = position.coords;
          setLng(longitude);
          setLat(latitude);
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            pitch: 75,
            bearing: -45,
            essential: true,
            duration: 2000
          });

          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);
        }, err => {
          console.error('Error getting location:', err);
        });
      } else {
        console.log('Geolocation is not supported by your browser');
      }
    });
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        downloadBlob(audioBlob);
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing the microphone", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const downloadBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = `bird_recording_${new Date().toISOString()}.wav`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const startCamera = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(videoStream);
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
    } catch (err) {
      console.error("Error accessing the camera", err);
      setError("Failed to access camera. Please ensure you've granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Blob created:', blob);
          sendPhotoToBackend(blob);
        } else {
          console.error('Failed to create blob');
          setError('Failed to capture image. Please try again.');
        }
      }, 'image/jpeg');
    }
  };

  const sendPhotoToBackend = async (blob) => {
    setIsLoading(true);
    setError(null);
    setBirdName(null);

    const formData = new FormData();
    formData.append('image', blob, 'bird_photo.jpg');

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-bird-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
      setBirdName(response.data.birdName);
    } catch (error) {
      console.error('Error sending photo to backend:', error);
      setError('Error analyzing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      <Box 
        ref={mapContainer} 
        sx={{ 
          height: '100%',
          width: '100%',
        }} 
      />
      {/* ... (longitude, latitude, zoom display remains the same) */}
      <Box sx={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        zIndex: 2,
      }}>
        <Box sx={{
          mb: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2,
          overflow: 'hidden',
          width: '200px',
          height: '150px',
        }}>
          <video 
            ref={videoRef} 
            style={{ width: '100%', height: '100%', display: stream ? 'block' : 'none' }} 
            autoPlay 
            playsInline  // Important for iOS
          />
          {!stream && (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body2">Camera Off</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{
          display: 'flex',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2,
          padding: 1,
        }}>
          <IconButton
            onClick={isRecording ? stopRecording : startRecording}
            sx={{
              backgroundColor: isRecording ? 'red' : 'white',
              color: isRecording ? 'white' : 'red',
              '&:hover': {
                backgroundColor: isRecording ? 'darkred' : 'lightgrey',
              },
              width: 48,
              height: 48,
              mr: 1,
            }}
          >
            {isRecording ? <StopIcon /> : <MicIcon />}
          </IconButton>
          <IconButton 
            onClick={stream ? stopCamera : startCamera}
            sx={{
              backgroundColor: stream ? 'blue' : 'white',
              color: stream ? 'white' : 'blue',
              '&:hover': {
                backgroundColor: stream ? 'darkblue' : 'lightgrey',
              },
              width: 48,
              height: 48,
            }}
          >
            <CameraAltIcon />
          </IconButton>
          {stream && (
            <IconButton 
              onClick={takePhoto}
              disabled={isLoading}
              sx={{
                backgroundColor: 'green',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'darkgreen',
                },
                width: 48,
                height: 48,
                ml: 1,
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : <CameraAltIcon />}
            </IconButton>
          )}
        </Box>
        {(birdName || error) && (
          <Box sx={{
            mt: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: 2,
            borderRadius: 2,
          }}>
            <Typography variant="body2" color={error ? 'error' : 'textPrimary'}>
              {error || `Detected: ${birdName}`}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default BirdTracking;