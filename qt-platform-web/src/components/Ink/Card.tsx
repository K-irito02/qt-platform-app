import React from 'react';
import { Card, CardProps } from 'antd';
import styles from './InkCard.module.css';

export const InkCard: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <Card
      {...props}
      className={`${styles.inkCard} ${className || ''}`}
      bordered={false}
    >
      {children}
    </Card>
  );
};
