import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import Speedometer from "../Speedometer/Speedometer"; 
import "./ScorePage.css";
import designnow from "../../images/rspng.png" 


function ScorePage() {
  const [files, setFiles] = useState(null);
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      if (!/\.pdf|\.doc|\.docx$/.test(file.name)) {
        alert("Please upload a valid resume file (.pdf, .doc, .docx)");
        setFiles(null);
      } else {
        setFiles(selectedFiles);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!files || files.length === 0) {
      alert("Please upload a resume first!");
      return;
    }
    setLoading(true);
    setError("");
    setScore(null);
    setSuggestions(null);

    const formData = new FormData();
    formData.append("resume", files[0]);

    try {
      const response = await axios.post("https://apiapp-3.onrender.com//score", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setScore(response.data.score);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "An unknown error occurred.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="score-page">
      {/* Home Button in the Top Left Corner */}
      <div className="home-button">
        <Link to="/home" className="home-link">Home</Link>
      </div>

      {/* Banner Section */}
      <div className="banner">
        <span style={{color: "rgb(162, 54, 105)",fontWeight: "600",marginTop:"10px"}}>Smart Resume Builder and Evaluation System and Optimize Your Resume</span>
      </div>

      {/* Main Content */}
      <div className="main-content container-image">
        <img src={designnow} alt="" />
        <div className="addnew-1">
        <p  className="colors-2">
          Boost your chances of landing the job with our ATS-friendly resume checker. 
          Upload your resume to receive a personalized score and actionable suggestions 
          to make your application stand out.
        </p>
        </div>
      </div>

      {/* Upload and View Section */}
      <form onSubmit={handleSubmit} className="form-container">
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".pdf,.doc,.docx" 
          className="upload-button" 
        />
        <button type="submit" className="view-button">Get My Score</button>
      </form>

      {/* Loading, Error, and Results */}
      {loading && <p className="loading-message">Analyzing your resume...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {score !== null && (
        <>
        <div className="result-container df-jc">

          <div className="dff">
          <h2 className="colors-2">Your Resume Score:</h2>
          <Speedometer score={score} /> {/* Pass score to Speedometer */}
          

          </div>
          <div className="df-jc-12">

          {/* Integrate Speedometer here */}
          <div className="suggestion-container">
          </div>
            <h3 style={{color:"#5CBD3F"}}>Suggestions to Improve:</h3>
            <ul className="suggestion-list">
              {suggestions && suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
        </>
      )}

      {/* Additional Content Section */}
      <div className="container2 newback">
      <div className="extra-info">
        <h2>Why Use Our Resume Evaluation?</h2>
        <ul>
          <li>1. Optimize keywords and phrases to pass ATS systems.</li>
          <li>2. Receive feedback on format, length, and clarity.</li>
          <li>3. Eliminate errors and enhance your professional impression.</li>
          <li>4. Get advice on highlighting achievements effectively.</li>
        </ul>

        <h2>How It Works:</h2>
        <p>
          Our Smart Resume Builder and Evaluation System transforms your resume! 
          Upload or create your resume using our professional templates, 
          score it against industry standards, and improve it with expert recommendations.
        </p>

        <h2>Pass the ATS Test</h2>
        <p>
          Worried your resume might not make it through the ATS? 
          Just paste the job ad, hit scan, and we’ll handle the rest. 
          If any tweaks are needed, we’ll guide you through them step by step.
        </p>

        <h2>Key Features of Our Service</h2>
        <ul>
          <li><strong>Formatting:</strong> Ensure your resume looks and feels right for both recruiters and ATS.</li>
          <li><strong>Word Choice:</strong> Craft concise and impactful sentences without unnecessary fillers.</li>
          <li><strong>Typos:</strong> Catch and correct typos to avoid rejection from employers.</li>
          <li><strong>Length:</strong> Get recommendations for the ideal resume length based on your industry and experience.</li>
          <li><strong>Customization:</strong> Select your job title and get a list of important skills to highlight.</li>
        </ul>

        <h2>Measurable Results</h2>
        <p>
          Highlight your achievements with concrete numbers and effective content 
          to present your accomplishments compellingly.
        </p>
      </div>
      </div>
    </div>
  );
}

export default ScorePage;
