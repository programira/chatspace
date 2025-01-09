declare module 'react-link-preview' {
    import React from 'react';
  
    interface LinkPreviewProps {
      url: string;
      descriptionLength?: number;
      fetcher?: (url: string) => Promise<unknown>; // Specify a different type instead of 'any'
      fallback?: React.ReactNode;
    }
  
    const LinkPreview: React.FC<LinkPreviewProps>;
  
    export { LinkPreview };
  }
  