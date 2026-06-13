import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Clock, History, TrendingUp } from 'lucide-react';
import '../styles/Navigation.css';

const Navigation = ({ onSignOut }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Clock className="brand-icon" size={24} />
          Smart Reminder Agent
        </Link>

        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/history" className="nav-link" onClick={() => setIsOpen(false)}><History size={18} /> History</Link>
          <Link to="/insights" className="nav-link" onClick={() => setIsOpen(false)}><TrendingUp size={18} /> Insights</Link>
          <button onClick={onSignOut} className="nav-signout-btn">Sign Out</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;