import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [username, setusername] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!username || !email || !password || !confirmPassword) {
            return alert("All fields are required");
        }

        if (password !== confirmPassword) {
            return alert("Passwords do not match");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return alert("Please enter a valid email address");
        }

        // Password strength check
        if (password.length < 6) {
            return alert("Password must be at least 6 characters long");
        }

        setLoading(true);

        try {
            // Step 1: Sign up
            const signupResponse = await fetch('http://localhost:8080/api/ai/signup', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });

            const signupData = await signupResponse.json();

            if (signupData.success) {
                // Step 2: Auto login after successful signup
                const loginResponse = await fetch('http://localhost:8080/api/ai/login', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const loginData = await loginResponse.json();

                if (loginData.success && loginData.user) {
                    // Save user data to localStorage
                    const userData = {
                        name: loginData.user.name,
                        email: loginData.user.email,
                        createdAt: loginData.user.createdAt
                    };

                    localStorage.setItem("user", JSON.stringify(userData));
                    
                    alert("Account created successfully! Welcome aboard! 🎉");
                    navigate('/');  // Go directly to home page
                } else {
                    // Signup successful but auto-login failed
                    alert("Account created! Please login to continue.");
                    navigate('/login');
                }
            } else {
                alert("Signup failed: " + signupData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Signup failed, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center text-white p-4 relative">
            <div className="bg-white text-center text-gray-800 px-6 py-4 rounded-xl shadow-xl mt-8 w-full max-w-2xl animate-floatY">
                <h2 className="text-xl font-bold text-purple-600 mb-2">Welcome to Career Advisor</h2>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mt-6 w-full max-w-2xl">
                <p className="text-gray-500 text-sm mb-6">With AI suggestions, All things is sorted out</p>
                
                <label className="block mb-2 font-semibold text-gray-800">Name</label>
                <input
                    type="text"
                    className="w-full border rounded p-2 mb-2 text-gray-800"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                />
                
                <label className="block mb-2 font-semibold text-gray-800">Email</label>
                <input
                    type="email"
                    className="w-full border rounded p-2 mb-2 text-gray-800"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                />
                
                <label className="block mb-2 font-semibold text-gray-800">Password</label>
                <input
                    type="password"
                    className="w-full border rounded p-2 mb-2 text-gray-800"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                />
                
                <label className="block mb-2 font-semibold text-gray-800">Confirm Password</label>
                <input
                    type="password"
                    className="w-full border rounded p-2 mb-4 text-gray-800"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                
                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className={`bg-purple-600 text-white font-semibold px-4 py-2 rounded w-full transition-colors ${
                        loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'
                    }`}
                >
                    {loading ? 'Creating Account...' : 'Signup'}
                </button>
                
                <p className="text-center text-gray-600 mt-4 text-sm">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-purple-600 font-semibold cursor-pointer hover:underline"
                    >
                        Login here
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
                                        navigate('/login');
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors duration-150 font-medium"
                                >
                                    🔓 Login
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Signup;