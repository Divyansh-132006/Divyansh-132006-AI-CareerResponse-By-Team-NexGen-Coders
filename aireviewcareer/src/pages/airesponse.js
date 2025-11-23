
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useVoiceInput from './useVoiceInput';

function AiResponse() {
    const [goal, setgoal] = useState('');
    const [skills, setskills] = useState('');
    const [roadmap, setroadmap] = useState('');
    const [prompt, setPrompt] = useState("");
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [roadmaploading, setRoadmapLoading] = useState(false);
    const [showAskAnything, setShowAskAnything] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [file, setFile] = useState(null);
    const [userName, setUserName] = useState('');
    const [activeVoiceField, setActiveVoiceField] = useState(null); // 'goal', 'skills', 'prompt'
    const navigate = useNavigate();

    // Voice input hook
    const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } = useVoiceInput();

    useEffect(() => {
        // Get user info from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.name) {
            setUserName(user.name);
        }
    }, []);

    // Update field when voice transcript changes
    useEffect(() => {
        if (transcript && activeVoiceField) {
            if (activeVoiceField === 'goal') {
                setgoal(transcript);
            } else if (activeVoiceField === 'skills') {
                setskills(transcript);
            } else if (activeVoiceField === 'prompt') {
                setPrompt(transcript);
            }
        }
    }, [transcript, activeVoiceField]);

    const handleVoiceInput = (field) => {
        if (!isSupported) {
            alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (isListening && activeVoiceField === field) {
            // Stop listening
            stopListening();
            setActiveVoiceField(null);
        } else {
            // Start listening
            resetTranscript();
            setActiveVoiceField(field);
            startListening();
        }
    };

    const handleGenerate = async () => {
        if (!goal || !skills) {
            return alert("Please fill in both fields");
        }

        setRoadmapLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/ai/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal, skills })
            });

            const data = await response.json();
            setroadmap(data.roadmap);

            // Save to history in MongoDB
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.email) {
                await fetch('http://localhost:8080/api/ai/savehistory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userEmail: user.email,
                        query: `Goal: ${goal}, Skills: ${skills}`,
                        response: data.roadmap,
                        type: 'roadmap'
                    })
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Failed to generate roadmap. Please try again.");
        } finally {
            setRoadmapLoading(false);
        }
    };

    const handleAsk = async () => {
        if (!prompt) return alert("Please enter your question!");

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8080/api/ai/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: prompt }),
            });

            if (!res.ok) {
                throw new Error(`Server returned ${res.status}`);
            }

            const data = await res.json();
            setAnswer(data.answer);

            // Save to history
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.email) {
                await fetch("http://localhost:8080/api/ai/savehistory", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userEmail: user.email,
                        query: prompt,
                        response: data.answer,
                        type: 'question'
                    }),
                });
            }
        } catch (err) {
            console.error("Error during AI Ask:", err);
            setAnswer(`AI response failed 😢\nError: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleResumeAnalyze = async () => {
        if (!file) return alert("Please upload your resume!");

        const formData = new FormData();
        formData.append("resume", file);

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8080/api/ai/resume", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setroadmap(data.feedback);

            // Save to history
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.email) {
                await fetch('http://localhost:8080/api/ai/savehistory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userEmail: user.email,
                        query: `Resume Analysis`,
                        response: data.feedback,
                        type: 'resume'
                    })
                });
            }
        } catch (err) {
            console.error("Resume analysis error:", err);
            alert("Resume Analysis Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("user");
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center text-white p-4 relative">
            {showAskAnything ? (
                <div className="bg-white text-gray-800 px-6 py-4 rounded-xl shadow-xl mt-20 w-full max-w-2xl">
                    <h1 className="text-3xl font-bold mb-4 text-purple-700">Ask Anything 🤖</h1>
                    
                    <div className="relative">
                        <textarea
                            rows="4"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Type your question or click the microphone to speak..."
                            className="w-full border rounded p-2 mb-2 text-black pr-12"
                        />
                        
                        
                        <button
                            onClick={() => handleVoiceInput('prompt')}
                            className={`absolute right-2 top-2 p-2 rounded-full transition-all ${
                                isListening && activeVoiceField === 'prompt'
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            }`}
                            title={isListening && activeVoiceField === 'prompt' ? 'Stop recording' : 'Start voice input'}
                        >
                            {isListening && activeVoiceField === 'prompt' ? (
                                <span className="text-xl">⏹️</span>
                            ) : (
                                <span className="text-xl size-12">🎙</span>
                            )}
                        </button>
                    </div>

                    {isListening && activeVoiceField === 'prompt' && (
                        <p className="text-sm text-red-600 mb-2 animate-pulse">
                            🔴 Listening... Speak now!
                        </p>
                    )}

                    <button
                        onClick={handleAsk}
                        disabled={loading}
                        className={`bg-purple-600 text-white font-semibold px-4 py-2 rounded w-full ${
                            loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'
                        }`}
                    >
                        {loading ? "Thinking..." : "Ask"}
                    </button>

                    {answer && (
                        <div className="bg-white text-gray-800 mt-8 p-6 rounded-xl w-full shadow-md whitespace-pre-wrap">
                            <h3 className="text-lg font-bold mb-2 text-green-600">💬 AI Says:</h3>
                            {answer}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="bg-white text-center text-gray-800 px-6 py-4 rounded-xl shadow-xl mt-8 w-full max-w-2xl animate-floatY">
                        <h1 className="text-3xl font-bold mb-2">Find Your Career Path here</h1>
                        {userName && (
                            <p className="text-sm text-purple-600 font-semibold mb-2">
                                Welcome back, {userName}! 👋
                            </p>
                        )}
                        <p className="text-sm mb-4">AI powered career suggestions</p>
                        <div className='flex justify-center gap-2 mb-4 text-sm font-semibold'>
                            <span className="text-green-500">● Personalized</span>
                            <span className="text-blue-500">● AI-Powered</span>
                            <span className="text-purple-500">● Step-by-Step</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 mt-6 w-full max-w-2xl">
                        <h2 className="text-xl font-bold text-purple-600 mb-2">Tell me your career aspirations</h2>
                        <p className="text-gray-500 text-sm mb-6">Our AI will create a personalized roadmap just for you</p>
                        
                        <label className="block mb-2 font-semibold text-gray-800">What's your career goal</label>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                className="w-full border rounded p-2 text-gray-800 pr-12"
                                placeholder="e.g., Become a Software Engineer at Google"
                                value={goal}
                                onChange={(e) => setgoal(e.target.value)}
                            />
                            
                            {/* Voice Button for Goal */}
                            <button
                                onClick={() => handleVoiceInput('goal')}
                                className={`absolute right-2 top-2 p-1 rounded-full transition-all ${
                                    isListening && activeVoiceField === 'goal'
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                }`}
                                title={isListening && activeVoiceField === 'goal' ? 'Stop recording' : 'Start voice input'}
                            >
                                {isListening && activeVoiceField === 'goal' ? '⏹️' : '🎙'}
                            </button>
                        </div>

                        {isListening && activeVoiceField === 'goal' && (
                            <p className="text-sm text-red-600 mb-2 animate-pulse">
                                🔴 Listening... Speak your career goal!
                            </p>
                        )}
                        
                        <label className="block mb-2 font-semibold text-gray-800">What skills do you currently have?</label>
                        <div className="relative mb-4">
                            <textarea
                                rows="3"
                                className="w-full border rounded p-2 text-gray-800 pr-12"
                                placeholder="e.g., HTML, CSS, React, teamwork..."
                                value={skills}
                                onChange={(e) => setskills(e.target.value)}
                            />
                            
                            {/* Voice Button for Skills */}
                            <button
                                onClick={() => handleVoiceInput('skills')}
                                className={`absolute right-2 top-2 p-1 rounded-full transition-all ${
                                    isListening && activeVoiceField === 'skills'
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                }`}
                                title={isListening && activeVoiceField === 'skills' ? 'Stop recording' : 'Start voice input'}
                            >
                                {isListening && activeVoiceField === 'skills' ? '⏹️' : '🎙'}
                            </button>
                        </div>

                        {isListening && activeVoiceField === 'skills' && (
                            <p className="text-sm text-red-600 mb-2 animate-pulse">
                                🔴 Listening... Speak your skills!
                            </p>
                        )}
                        
                        <label className="block mb-2 font-semibold text-gray-800">Upload Resume (Optional)</label>
                        <input
                            type="file"
                            name="resume"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="mb-4 text-sm text-gray-800"
                        />
                        
                        {file && (
                            <button
                                onClick={handleResumeAnalyze}
                                disabled={loading}
                                className={`bg-blue-600 text-white px-4 py-2 mb-4 rounded w-full ${
                                    loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'
                                }`}
                            >
                                {loading ? 'Analyzing...' : 'Analyze Resume'}
                            </button>
                        )}
                        
                        <button
                            onClick={handleGenerate}
                            disabled={roadmaploading}
                            className={`bg-purple-600 text-white font-semibold px-4 py-2 rounded w-full transition-colors duration-200 ${
                                roadmaploading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'
                            }`}
                        >
                            {roadmaploading ? 'Thinking...' : 'Generate Roadmap'}
                        </button>
                    </div>

                    {roadmap && (
                        <div className="bg-white text-gray-800 mt-8 p-6 rounded-xl w-full max-w-3xl shadow-md whitespace-pre-wrap">
                            <h3 className="text-lg font-bold mb-2 text-green-600">🧠 AI Roadmap:</h3>
                            {roadmap}
                        </div>
                    )}
                </>
            )}

            {/* Voice Support Info Banner */}
            {!isSupported && (
                <div className="fixed bottom-4 left-4 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg text-sm">
                    ⚠️ Voice input not supported in this browser. Use Chrome/Edge/Safari.
                </div>
            )}

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
                                        setShowAskAnything(!showAskAnything);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-purple-600 hover:bg-purple-50 transition-colors duration-150 font-medium"
                                >
                                    {showAskAnything ? "🏠 Back to Roadmap" : "🤖 Ask Anything"}
                                </button>

                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-purple-600 hover:bg-purple-50 transition-colors duration-150 font-medium"
                                >
                                    👤 Profile
                                </button>

                                <button
                                    onClick={() => {
                                        navigate('/user/history');
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-purple-600 hover:bg-purple-50 transition-colors duration-150 font-medium"
                                >
                                    📋 History
                                </button>

                                <div className="border-t border-gray-200 my-1"></div>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 font-medium"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AiResponse;
