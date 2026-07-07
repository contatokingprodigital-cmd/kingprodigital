import React, { useEffect } from 'react';
import { useSite } from './SiteContext';

const PixelInjector: React.FC = () => {
  const { pixels } = useSite();

  useEffect(() => {
    if (pixels.metaPixel) {
      const script = document.createElement('script');
      script.innerHTML = pixels.metaPixel.replace(/<script>|<\/script>/g, '');
      document.head.appendChild(script);
    }

    if (pixels.googlePixel) {
      const script = document.createElement('script');
      script.innerHTML = pixels.googlePixel.replace(/<script>|<\/script>/g, '');
      document.head.appendChild(script);
    }
  }, [pixels]);

  return null;
};

export default PixelInjector;