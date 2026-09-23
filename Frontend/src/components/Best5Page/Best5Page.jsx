import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; 
import "./Best5Page.css";

function Best5Page() {
  const [files, setFiles] = useState(null);
  const [bestResumes, setBestResumes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleBest5Submit = async () => {
    if (!files || files.length === 0) {
      alert("Please upload resumes first!");
      return;
    }
    setLoading(true);
    setError("");
    setBestResumes(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("resumes", files[i]);
    }

    try {
      const response = await axios.post("https://apiapp-3.onrender.com//best5", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBestResumes(response.data.best_resumes);
    } catch (error) {
      setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="best5-page">
      <motion.div className="text-align">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Find Resume Scores
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upload your resumes for analysis
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          This tool helps you identify the top scores in your resume.
        </motion.p>
      </motion.div>

      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        multiple
      />
      <motion.button
        onClick={handleBest5Submit}
        className="get-resumes-button"
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }} 
      >
        GET SCORE
      </motion.button>

      {loading && <p>Analyzing your resumes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {bestResumes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2>Top 5 Resumes:</h2>
          <ul>
            {bestResumes.map((resume, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3>{resume.filename}</h3>
                <p>Score: {resume.score}/100</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div
        className="tips"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {/* <h2>Tips for Uploading Resumes</h2> */}
        <ul>
          <li style={{color:"white"}}>Ensure your resumes are well-structured and formatted.</li>
          <li style={{color:"white"}}>Use clear headings and bullet points for better readability.</li>
          <li style={{color:"white"}}>Tailor your resumes to the job descriptions for the best results.</li>
          <li style={{color:"white"}}>Check for spelling and grammatical errors before uploading.</li>
        </ul>
      </motion.div>

      
    </div>
  );
}

export default Best5Page;
