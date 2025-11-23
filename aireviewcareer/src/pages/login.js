import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            return alert("Email and Password are required");
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/ai/login', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success && data.user) {
                // Save user data to localStorage
                const userData = {
                    name: data.user.name,
                    email: data.user.email,
                    createdAt: data.user.createdAt
                };

                localStorage.setItem("user", JSON.stringify(userData));
                
                console.log("✅ Login successful, user saved:", userData);
                
                alert("Login successful!");
                navigate('/');
            } else {
                console.error("❌ Login failed:", data.message);
                alert(data.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center text-white p-4 relative">
            <div className="bg-white text-center text-gray-800 px-6 py-4 rounded-xl shadow-xl mt-8 w-full max-w-2xl animate-floatY">
                <h2 className="text-xl font-bold text-purple-600 mb-2">Welcome to Career Advisor</h2>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mt-6 w-full max-w-2xl">
                <p className="text-gray-500 text-sm mb-6">With AI suggestions, All things is sorted out</p>

                <label className="block mb-2 font-semibold text-gray-800">Email</label>
                <input
                    type="email"
                    className="w-full border rounded p-2 mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                <label className="block mb-2 font-semibold text-gray-800">Password</label>
                <input
                    type="password"
                    className="w-full border rounded p-2 mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className={`bg-purple-600 text-white font-semibold px-4 py-2 rounded w-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'
                    }`}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center text-gray-600 mt-4 text-sm">
                    Don't have an account?{' '}
                    <span
                        onClick={() => navigate('/signup')}
                        className="text-purple-600 font-semibold cursor-pointer hover:underline"
                    >
                        Sign up here
                    </span>
                </p>
            </div>

            {/* Fixed Mobile Menu */}
            <div className="fixed top-4 right-4 z-[9999]">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow-lg hover:bg-purple-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    {showMenu ? "✕" : "☰"}
                </button>

                {showMenu && (
                    <>
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 -z-10 md:hidden"
                            onClick={() => setShowMenu(false)}
                        />

                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                            <div className="py-2">
                                <button
                                    onClick={() => {
                                        navigate('/signup');
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors duration-150 font-medium"
                                >
                                    📝 Sign Up
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;