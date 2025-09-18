import React, { useState, useEffect } from "react";
import '../AssignJob.css';

const AssignJob = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [assignedTeam, setAssignedTeam] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Note: Job assignment API not implemented in backend
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="assign-job-container">
      <h2>Job Assignment</h2>
      <p>Job assignment functionality is not currently implemented in the backend API.</p>
    </div>
  );
};

export default AssignJob;