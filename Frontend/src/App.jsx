import React, { Profiler } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Error from "./pages/Errorpage";
import Calling from "./components/Video call/Calling";
import AboutUs from "./pages/About";
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {

  return (
    <>
  <Router>
    <Navbar /> 
    <ToastContainer />
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={< Calling/>} />
      {/* <Route path="/videocall/:id" element={< Calling/>} /> */}
      <Route path="/About" element={<AboutUs/>} />
      {/* <Route path="*" element={<Error />} /> */}
    </Routes>
  </Router>
    </>
  )
}

export default App



// import React, { useState } from 'react';
// import Broadcaster from './pages/videostream/Broadcaster';
// import Viewer from './pages/videostream/Viewer';

// const App = () => {
//     const [role, setRole] = useState(null); // 'broadcaster' or 'viewer'

//     return (
//         <div style={{ textAlign: 'center', marginTop: '50px' }}>
//             <h1>Live Streaming App</h1>
//             {!role && (
//                 <div>
//                     <button onClick={() => setRole('broadcaster')} style={{ marginRight: '20px' }}>
//                         Start Broadcasting
//                     </button>
//                     <button onClick={() => setRole('viewer')}>Watch Stream</button>
//                 </div>
//             )}

//             {role === 'broadcaster' && (
//                 <>
//                     <h2>Broadcaster Mode</h2>
//                     <Broadcaster />
//                     <button onClick={() => setRole(null)} style={{ marginTop: '20px' }}>
//                         Back to Home
//                     </button>
//                 </>
//             )}

//             {role === 'viewer' && (
//                 <>
//                     <h2>Viewer Mode</h2>
//                     <Viewer />
//                     <button onClick={() => setRole(null)} style={{ marginTop: '20px' }}>
//                         Back to Home
//                     </button>
//                 </>
//             )}
//         </div>
//     );
// };

// export default App;