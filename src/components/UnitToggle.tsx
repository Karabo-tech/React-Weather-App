import React from 'react';
import styles from '../styles/UnitToggle.module.css';

interface UnitToggleProps {
  units: 'metric' | 'imperial';
  setUnits: (units: 'metric' | 'imperial') => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ units, setUnits }) => {
  return (
    <div className={styles.unitToggle}>
      <button
        className={`${styles.button} ${units === 'metric' ? styles.active : ''}`}
        onClick={() => setUnits('metric')}
      >
        °C
      </button>
      <button
        className={`${styles.button} ${units === 'imperial' ? styles.active : ''}`}
        onClick={() => setUnits('imperial')}
      >
        °F
      </button>
    </div>
  );
};

export default UnitToggle;