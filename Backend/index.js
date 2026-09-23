require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// MongoDB Connection
mongoose
  .connect("mongodb+srv://Santhosh:Santhosh%40platy@cluster0.kui1x.mongodb.net/authDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", UserSchema);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ===========================
// Authentication Routes
// ===========================

// Register
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ message: "User already exists or an error occurred" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Middleware for Protected Routes
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ===========================
// Resume Scoring Logic
// ===========================

function isResume(text) {
  const requiredKeywords = [
    "education", "experience", "skills", "summary", "projects",
    "certifications", "awards", "languages", "contact",
    "qualification", "internships", "work experience",
    "certificates", "courses completed", "achievements",
    "volunteering", "languages known", "contact me"
  ];
  return requiredKeywords.some(keyword => text.toLowerCase().includes(keyword));
}

function analyzeResume(text) {
  let score = 0;
  const suggestions = [];

  if (/education|qualification/i.test(text)) {
    score += 20;
  } else {
    suggestions.push({ suggestion: "Add an Education or Qualification section", priority: 1 });
  }

  if (/experience|internship|work experience/i.test(text)) {
    score += 25;
  } else {
    suggestions.push({ suggestion: "Add a Work Experience or Internships section", priority: 1 });
  }

  const skillsKeywords = ["java", "python", "c++", "c", "full stack", "react", "angular", "mern"];
  const skillsFound = skillsKeywords.filter(skill => text.toLowerCase().includes(skill));
  if (skillsFound.length > 0) {
    score += Math.min(skillsFound.length * 5, 35);
  }

  if (/projects/i.test(text)) {
    score += 12;
  } else {
    suggestions.push({ suggestion: "Mention relevant projects", priority: 2 });
  }

  if (/certifications|courses completed/i.test(text)) {
    score += 8;
  } else {
    suggestions.push({ suggestion: "Add certifications or completed courses relevant to the field", priority: 3 });
  }

  if (/awards|achievements|volunteering/i.test(text)) {
    score += 6;
  } else {
    suggestions.push({ suggestion: "Include any awards, achievements, or volunteering experience", priority: 3 });
  }

  if (/languages|languages known/i.test(text)) {
    score += 6;
  } else {
    suggestions.push({ suggestion: "Mention languages you are proficient in", priority: 3 });
  }

  if (/contact|email|phone/i.test(text)) {
    score += 7;
  } else {
    suggestions.push({ suggestion: "Provide contact information", priority: 1 });
  }

  if (text.length < 500) {
    suggestions.push({ suggestion: "The resume is too short. Add more content.", priority: 3 });
  } else if (text.length > 5000) {
    suggestions.push({ suggestion: "The resume is too long. Keep it concise.", priority: 2 });
  }

  score = Math.min(score, 95);
  return { score, suggestions };
}

// Protected Resume Scoring Route
app.post("/score", authenticate, (req, res) => {
  if (!req.files || !req.files.resume) {
    return res.status(400).json({ error: "No resume uploaded" });
  }

  const resume = req.files.resume;
  const filePath = path.join(uploadDir, resume.name);

  resume.mv(filePath, async (err) => {
    if (err) return res.status(500).json({ error: "Error saving file" });

    try {
      const buffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(buffer);
      const text = pdfData.text;

      if (!isResume(text)) {
        return res.status(400).json({ error: "Uploaded file is not a valid resume." });
      }

      const { score, suggestions } = analyzeResume(text);
      res.json({ score, suggestions });
    } catch (e) {
      res.status(500).json({ error: "Error processing resume." });
    } finally {
      fs.unlinkSync(filePath);
    }
  });
});

app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});
