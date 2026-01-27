import { NavLink } from "react-router-dom";
import { Link } from 'react-router-dom'

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
            fontFamily: 'var(--font-geo)',
            // boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
            <Link to="/" className="tw:text-2xl tw:font-bold tw:text-orange-600" style={{ textDecoration: 'none' }}>Rin</Link>
            <div style={{ display: 'flex', gap: '2rem' }} className="tw:text-xl">
                <Link to="/experience" className="tw:font-bold tw:text-orange-600" style={{ textDecoration: 'none' }}>Experience</Link>
                <Link to="/projects" className="tw:font-bold tw:text-orange-600" style={{ textDecoration: 'none' }}>Projects</Link>
                <Link to="/about" className="tw:font-bold tw:text-orange-600" style={{ textDecoration: 'none' }}>About</Link>
                <Link to="/life" className="tw:font-bold tw:text-orange-600" style={{ textDecoration: 'none' }}>Life</Link>
                <Link to="/contact" className="tw:font-bold tw:text-orange-600" style={{ textDecoration: 'none' }}>Contact</Link>
            </div>
        </header>
    )
}

export default Navbar;