import React from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home, About, Projects, Contact, Test, Experience, Life } from "./pages";

// Component to conditionally render navbar
const AppContent = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {!isHomePage && <Navbar />}
            <main className="tw:bg-slate-300/20 tw:overflow-x-hidden tw:w-full tw:h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
                <Routes>
                    <Route path="/" element={<Test />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/life" element={<Life />} />
                </Routes>
            </main>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;