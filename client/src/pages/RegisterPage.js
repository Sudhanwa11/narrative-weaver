import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // You could use a toast notification here instead of an alert
      alert(message);
    }

    if (isSuccess || user) {
      navigate('/diary'); // Redirect to diary page on successful registration
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

    if (password !== password2) {
      alert('Passwords do not match');
    } else {
      const userData = {
        name,
        email,
        password,
      };
      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper spinner component later
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Create Your Account</h2>
        <p className="text-ink/80">Begin your journey of self-discovery</p>
      </div>
      <form onSubmit={onSubmit} className="bg-white/50 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-wood">
        <div className="mb-4">
          <label className="block text-ink text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-ink leading-tight focus:outline-none focus:shadow-outline focus:border-gold"
            id="name"
            type="text"
            placeholder="Your Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
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
        <div className="mb-6">
          <label className="block text-ink text-sm font-bold mb-2" htmlFor="password2">
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-ink mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-gold"
            id="password2"
            type="password"
            placeholder="******************"
            name="password2"
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-wood hover:bg-ink text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;