import React, { useState, useEffect } from 'react';
import styles from '../styles/ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.button} ${theme === 'light' ? styles.active : ''}`}
        onClick={toggleTheme}
      >
        Light
      </button>
      <button
        className={`${styles.button} ${theme === 'dark' ? styles.active : ''}`}
        onClick={toggleTheme}
      >
        Dark
      </button>
    </div>
  );
};

export default ThemeToggle;