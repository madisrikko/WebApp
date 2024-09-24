import React, { useState, useEffect } from 'react';
import FileUpload from "../Components/FileUpload.tsx";
import FileList from "../Components/FileList.tsx";
import LogoutLink from "../Components/LogoutLink.tsx";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import ProfilePictureUpload from "../Components/ProfilePictureUpload.tsx";

function Home() {
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfilePictureUrl = async () => {
            const fetchUrl = 'http://localhost:8080/api/ProfilePicture/url';

            try {
                const response = await fetch(fetchUrl);
                if (response.ok) {
                    const result = await response.json();
                    if (result.profilePictureUrl) {
                        setProfilePictureUrl(result.profilePictureUrl);
                    }
                } else {
                    console.error('Failed to fetch profile picture URL');
                }
            } catch (error) {
                console.error('Error fetching profile picture URL:', error);
            }
        };

        fetchProfilePictureUrl();
    }, []);

    const handleProfilePictureUpload = async (file: File) => {
        const uploadUrl = 'http://localhost:8080/api/ProfilePicture/upload';
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setProfilePictureUrl(result.filePath);
            } else {
                console.error('File upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <AuthorizeView>
            <span><LogoutLink>Logout <AuthorizedUser value="email" /></LogoutLink></span>
            <ProfilePictureUpload onUpload={handleProfilePictureUpload} />
            {profilePictureUrl && (
                <div>
                    <h3>Profile Picture</h3>
                    <img
                        src={`http://localhost:8080${profilePictureUrl}`}
                        alt="Profile"
                        style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%' }}
                    />
                </div>
            )}
            <FileUpload />
            <FileList />
        </AuthorizeView>
    );
}

export default Home;