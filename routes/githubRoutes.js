const express = require("express");
const router = express.Router();
const axios = require("axios");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

const BASE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json"
};


/*
Get all workflow runs
*/
router.get("/workflows", async (req, res) => {
  try {

    const response = await axios.get(`${BASE_URL}/actions/runs`, {
      headers: headers
    });

    res.json(response.data);

  } catch (error) {

    console.error("Workflow Error:", error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to fetch workflows"
    });

  }
});

/*
Get latest pipeline run
*/
router.get("/latest-run", async (req, res) => {
  try {

    const response = await axios.get(`${BASE_URL}/actions/runs`, {
      headers: headers
    });

    const runs = response.data.workflow_runs;

    if (!runs.length) {
      return res.json({ message: "No pipeline runs yet" });
    }

    const latest = runs[0];

    res.json({
      status: latest.status,
      result: latest.conclusion,
      branch: latest.head_branch,
      runNumber: latest.run_number,
      createdAt: latest.created_at
    });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to fetch latest run",
      error: error.response?.data || error.message
    });

  }
});


/*
Pipeline summary
*/
router.get("/summary", async (req, res) => {
  try {

    const response = await axios.get(`${BASE_URL}/actions/runs`, {
      headers: headers
    });

    const runs = response.data.workflow_runs || [];

    let success = 0;
    let failed = 0;

    runs.forEach(run => {

      if (run.conclusion === "success") success++;
      else if (run.conclusion === "failure") failed++;

    });

    res.json({
      totalRuns: runs.length,
      success,
      failed
    });

  } catch (error) {

    console.error("Summary Error:", error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to fetch summary"
    });

  }
});

/*
Pipeline history
*/
router.get("/history", async (req, res) => {
  try {

    const response = await axios.get(`${BASE_URL}/actions/runs`, {
      headers: headers
    });

    const runs = response.data.workflow_runs || [];

    const history = runs.slice(0, 10).map(run => ({
      runNumber: run.run_number,
      status: run.status,
      result: run.conclusion || "pending",
      branch: run.head_branch
    }));

    res.json(history);

  } catch (error) {

    console.error("History Error:", error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to fetch history"
    });

  }
});
module.exports = router;