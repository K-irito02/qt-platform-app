import React from 'react';
import { useAppSelector } from '../../store/hooks';
import styles from './DynamicBackground.module.css';

export const DynamicBackground: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const { background } = theme;

  return (
    <div className={styles.backgroundContainer}>
      {background.type === 'video' && (
        <video 
          className={styles.videoBg} 
          src={background.url} 
          autoPlay 
          loop 
          muted 
          playsInline
        />
      )}
      {background.type === 'image' && (
        <div 
          className={styles.imageBg} 
          style={{ backgroundImage: `url(${background.url})` }} 
        />
      )}
      {background.overlay && (
          <div className={styles.overlay} style={{ backgroundImage: background.overlay }} />
      )}
    </div>
  );
};
