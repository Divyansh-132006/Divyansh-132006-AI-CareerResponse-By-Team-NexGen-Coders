import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        try {
            const user = localStorage.getItem("user");
            
            if (!user) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            // Parse and validate user data
            const userData = JSON.parse(user);
            
            if (userData && userData.email && userData.name) {
                setIsAuthenticated(true);
            } else {
                // Invalid user data, clear localStorage
                localStorage.removeItem("user");
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("user");
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <div className="text-white text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/signup" replace />;
    }

    return children;
}

export default ProtectedRoute;