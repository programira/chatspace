import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LINK_PREVIEW_API_KEY } from '../../config/constants';

interface CustomPreviewProps {
  url: string;
}

const CustomPreview: React.FC<CustomPreviewProps> = ({ url }) => {
  const [preview, setPreview] = useState<{ title: string; description: string; image: string } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`https://api.linkpreview.net/?key=${LINK_PREVIEW_API_KEY}&q=${url}`);
        const data = await response.json();
        setPreview({
          title: data.title,
          description: data.description,
          image: data.image,
        });
      } catch (error) {
        console.error('Failed to fetch preview:', error);
      }
    };

    fetchMetadata();
  }, [url]);

  return (
    <Box
      component="span"
      sx={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#1976d2' }}>
        {url}
      </a>
      {isHovered && preview && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: 250,
            padding: 1,
            boxShadow: 3,
            backgroundColor: '#fff',
            zIndex: 10,
          }}
        >
          {preview.image && (
            <img src={preview.image} alt={preview.title} style={{ width: '100%', borderRadius: 4 }} />
          )}
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>
            {preview.title}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'gray' }}>
            {preview.description}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CustomPreview;
