import React from 'react';
import { useAppSelector } from '../../store/hooks';

export const DynamicBackground: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const { background } = theme;

  if (background.type !== 'video') return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden w-full h-full">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        src={background.url}
      />
      {/* Optional Overlay if needed for contrast */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};
