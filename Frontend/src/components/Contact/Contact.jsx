import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="contact">
      <h2>Contact Us</h2>
      <p>If you have any questions, feel free to reach out to me!</p>

      <div className="social-links">
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
          <i className='bx bxl-instagram' style={{ color: '#E1306C' }}></i> Instagram
        </a>

        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
          <i className='bx bxl-linkedin' style={{ color: '#0A66C2' }}></i> LinkedIn
        </a>

        {/* <a href="https://github.com/RamanKishore08" target="_blank" rel="noopener noreferrer" className="social-link">
          <i className='bx bxl-github' style={{ color: '#ffffff' }}></i> GitHub
        </a> */}

        <a href="" target="_blank" rel="noopener noreferrer" className="social-link">
          <i className='bx bxl-gmail' style={{ color: '#D14836' }}></i> Email
        </a>
      </div>

      <button onClick={() => navigate('/home')}>Back to Home</button>
    </div>
  );
};

export default Contact;
