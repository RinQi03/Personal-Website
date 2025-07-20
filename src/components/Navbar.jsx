import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="header" style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 9999,
            backdropFilter: 'blur(10px)',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
            <NavLink to="/" className="tw:text-2xl tw:font-bold tw:text-orange-600">Rin</NavLink>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <NavLink to="/about" className="tw:text-2xl tw:font-bold tw:text-orange-600">About</NavLink>
                <NavLink to="/projects" className="tw:text-2xl tw:font-bold tw:text-orange-600">Projects</NavLink>
                <NavLink to="/contact" className="tw:text-2xl tw:font-bold tw:text-orange-600">Contact</NavLink>
            </div>
        </header>
    )
}

export default Navbar;