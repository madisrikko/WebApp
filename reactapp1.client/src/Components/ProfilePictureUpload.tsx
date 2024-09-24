import React, { useState } from 'react';

interface ProfilePictureUploadProps {
    onUpload: (file: File) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleUploadClick = () => {
        if (selectedFile) {
            onUpload(selectedFile);
        } else {
            console.error('No file selected');
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            <button onClick={handleUploadClick} disabled={!selectedFile}>
                Upload Profile Picture
            </button>
        </div>
    );
};

export default ProfilePictureUpload;