import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import logo from '../assets/applogo.png'

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <header className="bg-wood text-parchment p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user ? "/diary" : "/"} className="flex items-center gap-3">
          <img src={logo} alt="The Narrative Weaver Logo" className="h-10 w-10 rounded-full object-cover mr-2" />

          {/* Application Title */}
          <h1 className="text-2xl md:text-3xl font-display text-white">
            The Narrative Weaver
          </h1>
        </Link>
        <nav className="flex items-center space-x-4 md:space-x-6">
          {user ? (
            <>
              <Link to="/journal" className="hover:text-gold transition-colors">Journal</Link>
              <Link to="/diary" className="hover:text-gold transition-colors">Diary</Link>
              <Link to="/summaries" className="hover:text-gold transition-colors">Summaries</Link>
              <Link to="/profile" className="hover:text-gold transition-colors">Profile</Link>
              <button onClick={onLogout} className="bg-gold text-ink font-bold py-2 px-4 rounded hover:bg-opacity-80 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gold transition-colors">Login</Link>
              <Link to="/register" className="hover:text-gold transition-colors">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;