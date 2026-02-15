import React, { useState } from 'react';
import { Button, ButtonProps } from 'antd';
import styles from './InkButton.module.css';

interface InkButtonProps extends ButtonProps {
  stampText?: string;
}

export const InkButton: React.FC<InkButtonProps> = ({ children, className, stampText, ...props }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1000);
    if (props.onClick) props.onClick(e);
  };

  return (
    <Button
      {...props}
      className={`${styles.inkButton} ${clicked ? styles.clicked : ''} ${className || ''}`}
      onClick={handleClick}
    >
      {children}
      <div className={styles.stamp}>
          {/* Stamp content can be empty if SVG has text, or overlay text */}
      </div>
    </Button>
  );
};
