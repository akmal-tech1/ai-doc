// FileUpload.js
import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:8000/file_upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage(res.data.message);
        } catch (err) {
            setMessage("Error uploading file");
        }
    };

    return (
        <div>
            <h2>Upload PDF</h2>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
        </div>
    );
}

export default FileUpload;
