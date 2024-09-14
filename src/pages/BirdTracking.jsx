import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

mapboxgl.accessToken = 'pk.eyJ1IjoicGRvbzIwMDQiLCJhIjoiY20xMWluN3puMHN5cTJqcTFyeGY2bG5tOSJ9.8E3KBwUMaJCyWD3uNh8M3w';

function BirdTracking() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(15);

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

      map.current.addControl(new mapboxgl.NavigationControl());

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
    </Box>
  );
}

export default BirdTracking;