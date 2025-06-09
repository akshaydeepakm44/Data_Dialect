import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./audio.css";
import Nav from "./nav";
import UserFooter from "./userfooter";

const Audio = () => {
    const navigate = useNavigate();
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({ name: "", dataType: "" }); // Initialize with empty name

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setFormData((prev) => ({ ...prev, name: storedUsername }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAudioBlob(null);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                
                // Convert WebM/OGG blob to WAV format
                const arrayBuffer = await blob.arrayBuffer();
                const wavBlob = webmToWav(arrayBuffer);

                setAudioBlob(wavBlob);
                stream.getTracks().forEach((track) => track.stop());
            };

            recorder.start();
            setMediaRecorder(recorder);
            setRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            setPopupMessage("Error accessing microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: "", dataType: "" });
        setAudioBlob(null);
        setSelectedFile(null);
        setPopupMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!audioBlob && !selectedFile) {
            setPopupMessage("Please record or upload an audio file.");
            return;
        }

        if (!formData.name || !formData.dataType) {
            setPopupMessage("Please fill in all required fields.");
            return;
        }

        setIsProcessing(true);

        const formPayload = new FormData();
        formPayload.append("name", formData.name);
        formPayload.append("dataType", formData.dataType);
        formPayload.append("submitted_by", formData.name);
        formPayload.append("user_input", formData.dataType);

        if (audioBlob) {
            formPayload.append("audio", audioBlob, "recording.wav");
        } else if (selectedFile) {
            formPayload.append("audio", selectedFile);
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/process-audio", {
                method: "POST",
                body: formPayload,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.message) {
                alert("Audio processed and saved successfully!");
                window.location.reload(); // Refresh the page
            } else {
                setPopupMessage(data.error || "Unexpected error occurred.");
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            setPopupMessage("Failed to process audio. Please try again later.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Utility functions for WAV conversion
    const webmToWav = (arrayBuffer) => {
        const pcmData = new Uint8Array(arrayBuffer);
        const wavBuffer = encodeWAV(pcmData);
        return new Blob([wavBuffer], { type: "audio/wav" });
    };

    const encodeWAV = (samples) => {
        const buffer = new ArrayBuffer(44 + samples.length);
        const view = new DataView(buffer);

        const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        // WAV header
        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + samples.length, true);
        writeString(view, 8, "WAVE");
        writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, 44100, true);
        view.setUint32(28, 44100 * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, "data");
        view.setUint32(40, samples.length, true);

        for (let i = 0; i < samples.length; i++) {
            view.setInt8(44 + i, samples[i]);
        }

        return buffer;
    };

    return (
        <>
            <Nav />
            <div className="audio-page">
                <div className="audio-card">
                    <div className="audio-form-section">
                        <h2>UPLOAD AUDIO DATA</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required readOnly /> {/* Make it non-editable */}

                            <label>Type of Data:</label>
                            <select name="dataType" value={formData.dataType} onChange={handleInputChange} required>
                                <option value="">Select</option>
                                <option value="Local Legends and Stories">Local Legends and Stories</option>
                                <option value="Cultural Explanations">Cultural Explanations</option>
                                <option value="Folk Songs">Folk Songs</option>
                                <option value="Language and Dialects">Language and Dialects</option>
                                <option value="Traditional Crop Information">Traditional Crop Information</option>
                            </select>

                            <label>Upload Audio:</label>
                            <input type="file" accept="audio/*" onChange={handleFileChange} disabled={recording || isProcessing} />
                            
                            <button type="button" onClick={recording ? stopRecording : startRecording} disabled={selectedFile || isProcessing}>
                                {recording ? "Stop Recording" : "Record Audio"}
                            </button>

                            <button type="submit" disabled={isProcessing || (!audioBlob && !selectedFile)}>
                                {isProcessing ? "Processing..." : "Submit"}
                            </button>
                            <button type="button" onClick={resetForm} disabled={isProcessing}>Reset</button>
                        </form>
                    </div>
                    <div className="audio-rules-section">
                        <h3>Rules and Constraints</h3>
                        <ul>
              <li>Ensure there is no background noise .</li>
              <li>Start the Audio by stating place of origin and your name(optional).</li>
              <li>If you want upload audio ensure that it is in WAV format.</li>
              <li>Keep the audio focused on the topic category you selected.</li>
              <li>Avoid any offensive or inappropriate visuals or content.</li>
            </ul>
                            
                    </div>
                </div>
            </div>
            <UserFooter />
        </>
    );
};

export default Audio;