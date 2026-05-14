import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Dashboard = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [successUrl, setSuccessUrl] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    setSuccessUrl('');
    
    // Structure data to match schema
    const invitationData = {
      cardId: data.cardId,
      templateId: data.templateId,
      couple: { bride: data.bride, groom: data.groom },
      event: { date: data.date, location: data.location },
      content: { welcomeText: data.welcomeText }
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/invitations', invitationData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const baseUrl = window.location.origin;
      setSuccessUrl(`${baseUrl}/v/${response.data.cardId}`);
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invitation');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-light text-gray-900 font-serif">Dashboard</h1>
            <p className="text-gray-400 mt-2 text-sm tracking-wide">Create and manage your digital invitations</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </header>

        <main className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card ID & Template */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-2">Basic Info</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Card Slug (Unique ID)</label>
                  <input
                    {...register('cardId', { required: 'Slug is required' })}
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 rounded-xl transition-all"
                    placeholder="e.g. john-and-jane-2024"
                  />
                  {errors.cardId && <p className="mt-1 text-xs text-red-500">{errors.cardId.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Select Template</label>
                  <select
                    {...register('templateId', { required: 'Template is required' })}
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 rounded-xl transition-all"
                  >
                    <option value="ethereal">Ethereal (Minimalist)</option>
                    <option value="lumina">Lumina (Glassmorphism)</option>
                    <option value="kinetic">Kinetic (Dynamic)</option>
                  </select>
                </div>
              </div>

              {/* Couple Info */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-2">The Couple</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Bride Name</label>
                    <input
                      {...register('bride', { required: 'Required' })}
                      className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 rounded-xl transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Groom Name</label>
                    <input
                      {...register('groom', { required: 'Required' })}
                      className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 rounded-xl transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-2">Event Details</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Event Date</label>
                  <input
                    {...register('date', { required: 'Required' })}
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 rounded-xl transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Location</label>
                  <input
                    {...register('location', { required: 'Required' })}
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 rounded-xl transition-all"
                    placeholder="e.g. Grand Plaza, NYC"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-2">Invitation Content</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Welcome Text</label>
                  <textarea
                    {...register('welcomeText', { required: 'Required' })}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 rounded-xl transition-all"
                    placeholder="We joyfully request the pleasure of your company..."
                  />
                </div>
              </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">{error}</div>}

            <button
              type="submit"
              className="w-full py-5 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all duration-300 font-medium tracking-widest shadow-xl shadow-gray-200 flex items-center justify-center space-x-2"
            >
              <span>Generate Invitation</span>
            </button>
          </form>

          {successUrl && (
            <div className="mt-12 p-8 bg-green-50 rounded-3xl border border-green-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h4 className="text-green-800 font-medium mb-2">Success! Invitation Created</h4>
              <p className="text-sm text-green-600 mb-6">Your digital invitation is ready at:</p>
              <a 
                href={successUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-6 py-3 bg-white text-green-700 border border-green-200 rounded-xl font-medium hover:bg-green-100 transition-colors truncate max-w-full"
              >
                {successUrl}
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
