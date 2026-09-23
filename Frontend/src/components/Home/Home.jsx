import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token");

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="home">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <h2>AI Resume Comparison Tool</h2>
        </div>
        <div className="nav-links">
          <a className='Features-css' href='/score' >Resume Score</a>
          <a className='Features-css' href="#features">Features</a>
          <a className='Features-css' href="#how-it-works">How It Works</a>
          
          {/* Show Logout or Login button based on authentication */}
          {isLoggedIn ? (
            <button className='Features-css lgbtn' style={{marginTop:"0px"}} onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">
              <button className='Features-css lgbtn' style={{marginTop:"0px"}}>Login</button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: 'url(/images/download.jpeg)' }}>
        <div className="hero-content">
          <h1>Build a Professional Resume & Get Instant Score Insights</h1>
          <h1></h1>
          {/* <p>Your journey to a dream job starts here!  Create a standout resume with our easy-to-use builder.</p> */}
          <div className="hombtn">
            <Link to="/buildResume">
              <button className="primary-button">Start Building Your Resume</button>
            </Link>
            <Link to="/score">
              <button className="secondary-button">Resume Score & Suggestions</button>
            </Link>
            <Link to="/best5">
              <button className="third-button">Get Resumes Score Only</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features" id="features">
        <h2>Our Key Features</h2>
        <div className="feature-list">
          <div className="feature-item">
            <img src="/images/resume.avif" alt="Resume Builder Icon" />
            <h3>Smart Resume Builder</h3>
            <p>Create your resume from scratch or improve an existing one with professional layouts and guidance.</p>
            <Link to="/buildResume">
              <button className="feature-button">Build Resume</button>
            </Link>
          </div>
          <div className="feature-item">
            <img src="/images/resume-score-icon.png" alt="Resume Score Icon" />
            <h3>Instant Resume Score</h3>
            <p>Upload your resume to receive an instant score based on industry benchmarks and personalized feedback.</p>
            <Link to="/score">
              <button className="feature-button">Check Resume Score</button>
            </Link>
          </div>
          <div className="feature-item">
            <img src="/images/personal-feedback-icon.png" alt="Feedback Icon" />
            <h3>Personalized Feedback</h3>
            <p>Get actionable suggestions to boost your resume's impact and appeal to recruiters.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works" id="how-it-works">
        <h2>How It Works</h2>
        {/* <p>Our platform streamlines the resume-building process and evaluates your resume to make sure it shines.</p> */}
        <div className="steps">
          <div className="step">
            <h3>1. Build or Upload Your Resume</h3>
            <p>Start from scratch or upload an existing resume for improvement.</p>
          </div>
          <div className="step">
            <h3>2. Get Your Resume Score</h3>
            <p>Receive an instant score and personalized suggestions based on industry standards.</p>
          </div>
          <div className="step">
            <h3>3. Top 5 Filtering</h3>
            <p>Filter the best 5 resumes from the uploaded resumes.</p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="call-to-action">
        <h2 style={{color:'black'}}>Ready to Enhance Your Job Applications?</h2>
        <p>Get started today and make a memorable impression with a professional resume.</p>
        <Link to="/contact">
          <button className="contact-button">Contact Us</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
