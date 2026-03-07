const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const githubRoutes = require("./routes/githubRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* GitHub API routes */
app.use("/api/github", githubRoutes);

/* Test route */
app.get("/", (req, res) => {
  res.send("CI/CD Dashboard Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});