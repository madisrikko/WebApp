import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onFileUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/api/File/upload', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data);
            setUploadSuccess(true);
            setFile(null);
        } catch (error) {
            setMessage('Failed to upload file.');
        }
    };

    if (uploadSuccess) {
        window.location.reload();
    }

    return (
        <div>
            <h1>File Upload</h1>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>Upload!</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;