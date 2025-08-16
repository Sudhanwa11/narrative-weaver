import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import logo from '../assets/applogo.png';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  // links to render
  const links = user
    ? [
        { to: '/', label: 'Home' },
        { to: '/journal', label: 'Journal' },
        { to: '/diary', label: 'New Entry' },
        { to: '/summaries', label: 'Summaries' },
        { to: '/profile', label: 'Profile' },
      ]
    : [
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Register' },
      ];

  return (
    <header className="bg-wood text-parchment shadow-lg sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Top Row: Centered Logo and Title */}
        <div className="flex justify-center items-center py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="The Narrative Weaver Logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="text-2xl md:text-3xl font-display text-white">
              The Narrative Weaver
            </h1>
          </Link>
        </div>

        {/* Divider line between title and nav */}
        <div className="w-full">
          {/* thin gold line — visible on wood background */}
          <div className="h-1 md:h-1 bg-gold/90 shadow-sm" />
        </div>

        {/* Bottom Row: Navigation stretched across full width */}
        <nav aria-label="Primary" className="w-full">
          <ul className="flex w-full items-center">
            {links.map((link) => (
              <li key={link.label} className="flex-1 text-center">
                <Link
                  to={link.to}
                  className="inline-block w-full py-3 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Logout occupies the final slot */}
            <li className="flex-1 text-center">
              {user ? (
                <button
                  onClick={onLogout}
                  className="inline-block w-4/5 py-2 px-3 rounded-md bg-gold text-ink font-semibold hover:opacity-90 transition"
                >
                  Logout
                </button>
              ) : (
                <span className="inline-block w-full py-3" />
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
