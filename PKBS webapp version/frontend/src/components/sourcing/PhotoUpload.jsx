import React, { useState } from 'react';

const PhotoUploads = ({ onFilesChange, maxFiles = 5, maxFileSizeMB = 5 }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = e => {
    const selectedFiles = Array.from(e.target.files);
    let newFiles = [...files];
    setError('');

    // Check max files
    if (newFiles.length + selectedFiles.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} photos.`);
      return;
    }

    // Check size and file type (optional)
    for (const file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return;
      }
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`Each file must be smaller than ${maxFileSizeMB} MB.`);
        return;
      }
    }

    newFiles = newFiles.concat(selectedFiles);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleRemove = index => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="photo-uploads">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={files.length >= maxFiles}
      />
      {error && <p className="error">{error}</p>}

      <div className="preview-list">
        {files.map((file, index) => {
          const url = URL.createObjectURL(file);
          return (
            <div key={index} className="preview-item">
              <img src={url} alt={`upload-${index}`} />
              <button type="button" onClick={() => handleRemove(index)}>Remove</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhotoUploads;
