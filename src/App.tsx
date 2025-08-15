import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <Link to="/settings">Settings</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;