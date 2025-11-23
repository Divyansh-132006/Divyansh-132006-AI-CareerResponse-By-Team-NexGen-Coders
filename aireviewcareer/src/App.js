// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AiResponse from "./pages/airesponse.js";
// import Login from "./pages/login.js";
// import Signup from "./pages/signup.js";
// import Profile from "./pages/profile.js";
// import History from "./pages/History.js";



// function App() {


//   console.log("Deploy fix: homepage removed");


//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AiResponse />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/history" element={<History />} />
//         <Route path="/user/history" element={<History />} />


//       </Routes>
//     </Router>
//   );
// }

// export default App;
















import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AiResponse from "./pages/airesponse.js";
import Login from "./pages/login.js";
import Signup from "./pages/signup.js";
import Profile from "./pages/profile.js";
import History from "./pages/History.js";
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AiResponse />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/user/history" 
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;