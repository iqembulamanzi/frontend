import React, { useState, useEffect } from "react";
import '../Chatbot.css';

const Chatbot = () => {
  const [comment, setComment] = useState("");
  const [reportType, setReportType] = useState("pipe-burst");
  const [level, setLevel] = useState("low");
  const [location, setLocation] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  // Get user location safely
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setLocation(null);
        }
      );
    }
  }, []);

  // Handle file upload
  const handleFileChange = (event) => {
    setMediaFile(event.target.files[0]);
    setAudioURL(null); // reset audio preview if new file
  };

  // Toggle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      recorder?.stop();
      setIsRecording(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const newRecorder = new MediaRecorder(stream);
          setRecorder(newRecorder);
          const chunks = [];
          newRecorder.ondataavailable = (e) => chunks.push(e.data);
          newRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
            setAudioURL(URL.createObjectURL(blob));
            setMediaFile(blob);
          };
          newRecorder.start();
          setIsRecording(true);
        })
        .catch((err) => {
          console.error("Microphone access error:", err);
          setSubmitMessage("Microphone access denied.");
        });
    }
  };

  // Submit report - Note: Incidents are created via WhatsApp webhook, not direct API
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage("");

    // Since API doesn't have POST /api/incidents, display a message
    setSubmitMessage("Reports are submitted via WhatsApp. Please use the WhatsApp integration for incident reporting.");
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>New Report</h2>
        <p>Fill in the details below to submit a water pollution report.</p>
        {location && (
          <p>Your location: Lat {location.latitude.toFixed(2)}, Lon {location.longitude.toFixed(2)}</p>
        )}
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="report-type">Report Type</label>
          <select id="report-type" value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="pipe-burst">Pipe Burst</option>
            <option value="blockage">Blockage</option>
            <option value="spillage">Chemical Spillage</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Pollution Level</label>
          <div className="radio-group">
            {["low", "medium", "high"].map((lvl) => (
              <label key={lvl}>
                <input
                  type="radio"
                  name="level"
                  value={lvl}
                  checked={level === lvl}
                  onChange={(e) => setLevel(e.target.value)}
                />
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comments</label>
          <textarea
            id="comment"
            placeholder="Add detailed comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <div className="button-group">
          <label htmlFor="media-upload" className="media-button">
            Upload Picture/Video
            <input
              id="media-upload"
              type="file"
              accept="image/*,video/*"
              capture="camera"
              onChange={handleFileChange}
              className="hidden-input"
            />
          </label>

          <button
            type="button"
            className={`media-button ${isRecording ? "recording-active" : ""}`}
            onClick={toggleRecording}
          >
            {isRecording ? "Stop Recording" : "Record Voice Note"}
          </button>
        </div>

        {mediaFile && (
          <div className="file-preview">
            <span>Selected File: {mediaFile.name || "Voice Recording"}</span>
            {audioURL && <audio controls className="audio-player" src={audioURL} />}
          </div>
        )}

        {submitMessage && (
          <p className={submitMessage.startsWith("Error") ? "text-red-600" : "text-green-600"}>
            {submitMessage}
          </p>
        )}

        <button type="submit" className="submit-button">
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default Chatbot;