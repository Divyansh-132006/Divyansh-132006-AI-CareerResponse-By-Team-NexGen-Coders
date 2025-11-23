import { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
   const [showMenu, setShowMenu] = useState(false);


  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      alert("Please login to view your history.");
      return;
    }

   const fetchHistory = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/ai/user/history?email=${encodeURIComponent(user.email)}`);
    const data = await res.json();

    console.log("📦 Raw data received:", data);  // <-- Add this line

    if (data.success) {
      setHistory(data.history);
    } else {
      alert("Failed to fetch history.");
    }
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    alert("An error occurred.");
  } finally {
    setLoading(false);
  }

}
fetchHistory();
  })



  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-700 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white text-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-purple-700">🕓 Your Interaction History</h1>

        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">No interaction history found.</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="bg-purple-100 rounded p-4 shadow">
                <p className="text-sm text-purple-600 mb-1">
                  <strong>{item.type.toUpperCase()}</strong> | {new Date(item.timestamp).toLocaleString()}
                </p>
                <p><strong>Query:</strong> {item.query}</p>
                <p><strong>Response:</strong> {item.response}</p>
              </div>
            ))}
          </div>
        )}
      </div>
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
                                        window.location.href = '/';
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-purple-600 hover:bg-purple-50 transition-colors duration-150 font-medium"
                                >
                                    🏠 Home
                                </button>

                               
                            </div>
                        </div>
                    </>
                )}
    </div>
    </div>
  );
}

export default History;
