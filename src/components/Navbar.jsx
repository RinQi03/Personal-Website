import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="header" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            // backdropFilter: 'blur(1px)',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
            <a href="/" className="tw:text-2xl tw:font-bold tw:text-orange-600" style={{ textDecoration: 'none' }}>Rin</a>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <a href="/about" className="tw:text-2xl tw:font-bold tw:text-orange-600" style={{ textDecoration: 'none' }}>About</a>
                <a href="/projects" className="tw:text-2xl tw:font-bold tw:text-orange-600" style={{ textDecoration: 'none' }}>Projects</a>
                <a href="/contact" className="tw:text-2xl tw:font-bold tw:text-orange-600" style={{ textDecoration: 'none' }}>Contact</a>
            </div>
        </header>
    )
}

export default Navbar;