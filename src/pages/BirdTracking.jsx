import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

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
        // downloadBlob(audioBlob); // this is where is downloads tos
        
        const reader = new FileReader();

        reader.onload = () => {
          const base64String = reader.result;
          sendBase64BlobToFlask(base64String)
        }

        reader.readAsDataURL(audioBlob);
        
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing the microphone", err);
    }
  };

  function sendBase64BlobToFlask(blob) {
    const url = "http://localhost:5000/api/getblob";
    try {
      const response = fetch (url, 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body : JSON.stringify({blob})
      })
      .then(response => response.json())
      .then(data => console.log(data));
    }
    catch (error) {
      console.error('Error posting data:', error);
    }
  }
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

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      <Box 
        ref={mapContainer} 
        sx={{ 
          height: '100%',
          width: '100%',
        }} 
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(35, 55, 75, 0.9)',
          color: '#fff',
          padding: '6px 12px',
          fontFamily: 'monospace',
          zIndex: 1,
          borderRadius: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </Typography>
      </Box>
      <IconButton
        onClick={isRecording ? stopRecording : startRecording}
        sx={{
          position: 'absolute',
          bottom: 40,  // Moved higher
          left: 30,    // Moved more to the right
          backgroundColor: isRecording ? 'red' : 'white',
          color: isRecording ? 'white' : 'red',
          '&:hover': {
            backgroundColor: isRecording ? 'darkred' : 'lightgrey',
          },
          width: 64,   // Increased width
          height: 64,  // Increased height
          '& .MuiSvgIcon-root': {
            fontSize: 32,  // Increased icon size
          },
        }}
      >
        {isRecording ? <StopIcon /> : <MicIcon />}
      </IconButton>
    </Box>
  );
}
export default BirdTracking;