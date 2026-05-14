import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError('root', { 
        message: err.response?.data?.message || 'Login failed. Please try again.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-light tracking-tight text-gray-900 font-serif">
            Admin Access
          </h2>
          <p className="mt-4 text-sm text-gray-500 uppercase tracking-widest">
            TechLab Digital Invitations
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 rounded-lg transition-all duration-300"
                placeholder="admin@techlab.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 rounded-lg transition-all duration-300"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          {errors.root && (
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-red-600 text-center">{errors.root.message}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium tracking-wide shadow-lg shadow-gray-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
