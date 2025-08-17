import React from 'react';
import ThemeToggle from '../components/ThemeToggle';
import styles from '../styles/Settings.module.css';

const Settings: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Theme</h2>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Settings;