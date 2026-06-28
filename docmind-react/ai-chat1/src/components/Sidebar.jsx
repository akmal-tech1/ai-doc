import { useState, useRef } from "react";

export default function Sidebar({ docs, onUploadSuccess, apiBase }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ msg: "", type: "" });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadStatus({ msg: "", type: "" });
    } else {
      setUploadStatus({ msg: "Only PDF files are supported.", type: "error" });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadStatus({ msg: "Uploading and embedding…", type: "loading" });

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${apiBase}/file_upload`, { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        setUploadStatus({ msg: `✓ ${data.chunks_stored} chunks stored`, type: "success" });
        onUploadSuccess(data.filename, data.chunks_stored);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setUploadStatus({ msg: "Upload failed. Check the server.", type: "error" });
      }
    } catch {
      setUploadStatus({ msg: "Cannot reach server at localhost:8000", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-label">Documents</div>

      <div
        className={`file-zone ${isDragging ? "dragging" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file"
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
      >
        <UploadIcon />
        <span>{selectedFile ? selectedFile.name : "Drop PDF here or click to browse"}</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />
      </div>

      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
      >
        <ArrowUpIcon />
        {isUploading ? "Uploading…" : "Upload PDF"}
      </button>

      {uploadStatus.msg && (
        <div className={`upload-status ${uploadStatus.type}`}>{uploadStatus.msg}</div>
      )}

      <div className="divider" />

      <div className="sidebar-label">Loaded files</div>

      {docs.length === 0 ? (
        <p className="no-docs">No documents yet. Upload a PDF to begin.</p>
      ) : (
        <ul className="doc-list" aria-label="Uploaded documents">
          {docs.map((doc, i) => (
            <li key={i} className="doc-item">
              <PdfIcon />
              <span title={doc.filename}>{doc.filename}</span>
              <span className="chunks">{doc.chunks}c</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
