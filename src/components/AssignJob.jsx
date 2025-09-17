import React, { useState, useEffect } from "react";
import './AssignJob.css';

const AssignJob = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [assignedTeam, setAssignedTeam] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");
        setJobs(data.jobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  // Assign new job
  const handleAssignJob = async (e) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription || !assignedTeam) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: jobTitle, description: jobDescription, team: assignedTeam }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign job");
      setJobs([...jobs, data.job]);
      setJobTitle("");
      setJobDescription("");
      setAssignedTeam("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="assign-job-container">
      <h2>Assign a New Job</h2>
      <form onSubmit={handleAssignJob} className="assign-job-form">
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Riverbank Cleanup"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="jobDescription">Description</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Provide a detailed description of the task."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="assignedTeam">Assign to Team</label>
          <select
            id="assignedTeam"
            value={assignedTeam}
            onChange={(e) => setAssignedTeam(e.target.value)}
            required
          >
            <option value="">Select a team</option>
            <option value="Team Alpha">Team Alpha</option>
            <option value="Team Beta">Team Beta</option>
            <option value="Team Gamma">Team Gamma</option>
          </select>
        </div>
        <button type="submit" className="assign-job-button">Assign Job</button>
      </form>

      <div className="current-jobs-section">
        <h3>Currently Assigned Jobs</h3>
        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job.id} className="job-item">
              <div className="job-info">
                <h4>{job.title}</h4>
                <p>{job.description}</p>
              </div>
              <span className="job-team">{job.team}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssignJob;
