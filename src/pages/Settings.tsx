import React from 'react';
import ThemeToggle from '../components/ThemeToggle';
import styles from '../styles/Settings.module.css';

const Settings: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2>Settings</h2>
      <ThemeToggle />
    </div>
  );
};

export default Settings;