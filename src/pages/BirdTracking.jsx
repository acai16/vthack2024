import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { useAuthInfo } from '@propelauth/react';


mapboxgl.accessToken = 'pk.eyJ1IjoicGRvbzIwMDQiLCJhIjoiY20xMWluN3puMHN5cTJqcTFyeGY2bG5tOSJ9.8E3KBwUMaJCyWD3uNh8M3w';


function BirdTracking() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { user, isLoggedIn, loading, error: authError } = useAuthInfo();
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(15);
  const [isRecording, setIsRecording] = useState(false);
  const [isHiking, setIsHiking] = useState(false);
  const [hikeStartTime, setHikeStartTime] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [birdName, setBirdName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!lng || !lat) return; // Wait for geolocation data to be available


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


      const navControl = document.querySelector('.mapboxgl-ctrl-top-right');
      if (navControl) {
        navControl.style.top = '60px';
      }


      map.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        pitch: 75,
        bearing: -45,
        essential: true,
        duration: 2000
      });


      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current);
    });
  }, [lng, lat]);


  useEffect(() => {
    if (!map.current) return;
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });


  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLng(position.coords.longitude);
          setLat(position.coords.latitude);
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Failed to access location. Please enable location services.');
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
      setError('Geolocation is not supported by your browser');
    }
  }, []);


  const startHike = async () => {
    if (!user) {
      console.error('No user information available.');
      setError('User not authenticated. Please log in.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5001/api/start_hike/${user.userId}`);
      setIsHiking(true);
      setHikeStartTime(Date.now());
      console.log(response.data.message);
    } catch (error) {
      console.error('Error starting hike:', error);
      setError('Failed to start hike. Please try again.');
    }
  };


  const endHike = async () => {
    if (!isHiking) return;
    const hikeLength = Math.round((Date.now() - hikeStartTime) / 1000);


    try {
      const response = await axios.get(`http://localhost:5001/api/end_hike/${user.userId}/${hikeLength}`);
      setIsHiking(false);
      setHikeStartTime(null);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error ending hike:', error);
      setError('Failed to end hike. Please try again.');
    }
  };


  const startRecording = async () => {
    if (!isHiking) {
      await startHike();
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);


      let recordingInterval = 10000;
      let interval = false;


      const stopAndSend = () => {
        mediaRecorder.current.stop();
      };


      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };


      mediaRecorder.current.onstop = () => {
        if (audioChunks.current.length > 0) {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            sendBase64BlobToFlask(base64String);
          };
          reader.readAsDataURL(audioBlob);
          audioChunks.current = [];
        }


        if (interval) {
          interval = false;
          mediaRecorder.current.start();
        }
      };


      mediaRecorder.current.start();


      const intervalId = setInterval(() => {
        if (mediaRecorder.current.state === "recording") {
          interval = true;
          stopAndSend();
        }
      }, recordingInterval);


      setIsRecording(true);


    } catch (err) {
      console.error("Error accessing the microphone", err);
    }
  };


  function sendBase64BlobToFlask(blob) {
    const url = "http://localhost:5001/api/getblob";
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blob })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.message && data.message != "Blob successfully received but not stored due to bird not detected") {
        addBirdToHike(data.message); // Call to add bird to hike
      }
    })
    .catch(error => console.error('Error posting data:', error));
  }


  const addBirdToHike = async (birdId) => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:5001/api/seen_bird/${user.userId}/${birdId}`);
      console.log('Bird added to hike:', response.data.message);
    } catch (error) {
      console.error('Error adding bird to hike:', error);
    }
  };


  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
   
    if (isHiking) {
      endHike();
    }
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
      if (response.data.birdId) {
        addBirdToHike(response.data.birdId);
      }
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
            playsInline
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