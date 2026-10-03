import React from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
// import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import { Portfolio, WorkDetail, Home, About, Projects, Contact, Test, Experience, Life } from "./pages";

// Component to conditionally render navbar
const AppContent = () => {
    const location = useLocation();
    const isPortfolioHome = location.pathname === "/";
    const isPortfolioCaseStudy = location.pathname.startsWith("/work/");
    const isLegacyHome = location.pathname === "/space";
    const usesOwnNavigation = isPortfolioHome || isPortfolioCaseStudy || isLegacyHome;

    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: isLegacyHome ? 'hidden' : 'visible' }}>
            {!usesOwnNavigation && <Navbar />}
            <main
                key={location.pathname}
                className={isPortfolioHome || isPortfolioCaseStudy ? "" : "tw:bg-slate-300/20 tw:overflow-x-hidden tw:w-full"}
                style={{ position: isLegacyHome ? 'absolute' : 'relative', top: isLegacyHome ? 0 : 'auto', left: isLegacyHome ? 0 : 'auto', minHeight: usesOwnNavigation ? '100vh' : 'auto' }}
                id="main-content"
            >
                <Routes>
                    <Route path="/" element={<Portfolio />} />
                    <Route path="/work/:slug" element={<WorkDetail />} />
                    <Route path="/space" element={<Home />} />
                    <Route path="/test" element={<Test />} />
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
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
};

export default App;
