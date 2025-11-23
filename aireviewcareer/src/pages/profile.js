// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Profile() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//  useEffect(() => {
//   const storedUser = localStorage.getItem("user");

//   if (!storedUser) {
//     alert("Please login first.");
//     navigate("/login");
//     return;
//   }

//   try {
//     const parsedUser = JSON.parse(storedUser);
//     setUser(parsedUser);
//   } catch (error) {
//     console.error("Failed to parse user:", error);
//     localStorage.removeItem("user");
//     navigate("/login");
//   }
// }, [navigate]);

//   if (!user) return <div className="text-center p-10 text-white">Loading profile...</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-800">
//         <h1 className="text-xl font-bold mb-4">👤 Profile</h1>
//         <p><strong>Name:</strong> {user.name}</p>
//         <p><strong>Email:</strong> {user.email}</p>
//         <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

//         <button
//           onClick={() => {
//             localStorage.removeItem("user");
//             navigate("/login");
//           }}
//           className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Profile;









import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("user");
            navigate('/login');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center text-white p-4">
            <div className="bg-white text-gray-800 rounded-xl shadow-xl mt-20 w-full max-w-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-purple-700">Profile</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="text-purple-600 hover:text-purple-800 font-semibold"
                    >
                        ← Back to Home
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600">Name</label>
                        <p className="text-lg font-bold text-gray-800">{user.name}</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600">Email</label>
                        <p className="text-lg font-bold text-gray-800">{user.email}</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600">Member Since</label>
                        <p className="text-lg font-bold text-gray-800">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <button
                        onClick={() => navigate('/user/history')}
                        className="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded hover:bg-blue-700 transition-colors"
                    >
                        📋 View History
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 text-white font-semibold px-4 py-3 rounded hover:bg-red-700 transition-colors"
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;