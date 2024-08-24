import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'fileName', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');

    useEffect(() => {
        fetchFiles();
    }, [currentSearchTerm]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://localhost:7249/api/File', {
                params: { search: currentSearchTerm },
                withCredentials: true
            });
            setFiles(response.data);
        } catch (err) {
            setError('Failed to fetch files');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentSearchTerm(searchTerm);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7249/api/File/${id}`, { withCredentials: true });
            setFiles(files.filter(file => file.id !== id));
        } catch (err) {
            setError('Failed to delete file');
        }
    };

    const sortFiles = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedFiles = [...files].sort((a, b) => {
            if (key === 'uploadedAt') {
                return direction === 'ascending'
                    ? new Date(a[key]) - new Date(b[key])
                    : new Date(b[key]) - new Date(a[key]);
            }
            if (key === 'fileSize') {
                return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
            }
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setSortConfig({ key, direction });
        setFiles(sortedFiles);
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '^' : 'v';
        }
        return null;
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Uploaded Files</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button onClick={handleSearch}>Search</button>
                <p>Search Term: <span dangerouslySetInnerHTML={{ __html: currentSearchTerm }} /></p>
            </div>
            {files.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>
                                File Name
                                <button onClick={() => sortFiles('fileName')}>
                                    Sort by Name {getSortIndicator('fileName')}
                                </button>
                            </th>
                            <th>Content Type</th>
                            <th>
                                Upload Date
                                <button onClick={() => sortFiles('uploadedAt')}>
                                    Sort by Date {getSortIndicator('uploadedAt')}
                                </button>
                            </th>
                            <th>
                                File Size
                                <button onClick={() => sortFiles('fileSize')}>
                                    Sort by Size {getSortIndicator('fileSize')}
                                </button>
                            </th>
                            <th>Download</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr key={file.id}>
                                <td>{file.fileName}</td>
                                <td>{file.contentType}</td>
                                <td>{file.uploadedAt}</td>
                                <td>{file.fileSize}</td>
                                <td>
                                    <a href={`https://localhost:7249/api/File/download/${file.id}`} download>
                                        Download
                                    </a>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(file.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No files found</p>
            )}
        </div>
    );
};

export default FileList;