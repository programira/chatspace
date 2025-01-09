import React from 'react';

interface PreviewProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

const CustomPreview: React.FC<PreviewProps> = ({ title, description, image, url }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        width: '300px',
      }}
    >
      {image && (
        <img
          src={image}
          alt={title}
          style={{ width: '100%', borderRadius: '5px', marginBottom: '10px' }}
        />
      )}
      <strong style={{ fontSize: '16px', marginBottom: '5px' }}>{title}</strong>
      <p style={{ fontSize: '14px', color: '#555', marginBottom: '10px' }}>{description}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#007bff' }}>
        Visit
      </a>
    </div>
  );
};

export default CustomPreview;
