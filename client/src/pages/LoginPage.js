import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message); // In a real app, use a toast notification
    }

    if (isSuccess || user) {
      navigate('/diary'); // Redirect to the main diary page after login
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a spinner component
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Welcome Back</h2>
        <p className="text-ink/80">Continue your narrative</p>
      </div>
      <form onSubmit={onSubmit} className="bg-white/50 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-wood">
        <div className="mb-4">
          <label className="block text-ink text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-ink leading-tight focus:outline-none focus:shadow-outline focus:border-gold"
            id="email"
            type="email"
            placeholder="your@email.com"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-ink text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-ink mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-gold"
            id="password"
            type="password"
            placeholder="******************"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-wood hover:bg-ink text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors" type="submit">
            Sign In
          </button>
        </div>
         <div className="text-center mt-4">
            <p className="text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-wood hover:text-gold">
                    Sign Up
                </Link>
            </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;