import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Context } from '../firebase/Context';

function Account() {
    const { currentUser } = useContext(Context);
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        if (currentUser && currentUser.id) {
            try {
                const response = await fetch(`http://localhost:3000/user/${currentUser.id}`);
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    if (!currentUser) {
        return <Navigate to='/' />;
    }

    const renderRenterContent = () => (
        <div>
            <h3>Renter Content</h3>
            {/* Render bookmarked apartments and reviews */}
        </div>
    );

    const renderLandlordContent = () => (
        <div>
            <h3>Landlord Content</h3>
            {/* Render building listings with edit/delete options */}
        </div>
    );

    const renderAdminContent = () => (
        <div>
            <h3>Admin Content</h3>
            {/* Render applications and reviews with approve/deny options */}
        </div>
    );

    return (
        <div>
            <h2>Account Page</h2>
            {userData?.accountType === 'renter' && renderRenterContent()}
            {userData?.accountType === 'landlord' && renderLandlordContent()}
            {userData?.accountType === 'admin' && renderAdminContent()}

            <Link to='/change-password' className='btn btn-primary'>
                Change Password
            </Link>
        </div>
    );
}

export default Account;
