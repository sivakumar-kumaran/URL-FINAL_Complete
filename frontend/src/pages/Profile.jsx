import React, { useState } from 'react';
import { User, Mail, Calendar, Save, X, Eye, EyeOff, Loader2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        toast.error('Current password is required to change password');
        return;
      }
      if (!formData.newPassword) {
        toast.error('New password is required');
        return;
      }
      if (formData.newPassword.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    setSubmitting(true);
    try {
      const updateData = {
        name: formData.name,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.password = formData.newPassword;
      }

      await updateProfile(updateData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setFormData({
        name: user?.name || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-in-down">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account information and security settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-in-up hover:shadow-2xl transition-all duration-300">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-600 dark:from-cyan-600 dark:via-teal-600 dark:to-emerald-700 p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-white mx-auto shadow-2xl">
              <User className="w-12 h-12" />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-8">
            {!isEditing ? (
              <>
                {/* View Mode */}
                <div className="space-y-6">
                  {/* Name */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-900/20">
                      <User className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Name</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {user?.name || 'Not set'}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-teal-100 dark:bg-teal-900/20">
                      <Mail className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {user?.email || 'Not set'}
                      </p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/20">
                      <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Member Since
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatDate(user?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500 transition-colors group-focus-within:text-teal-600" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                      Current Password <span className="text-xs text-slate-500">(only if changing password)</span>
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        name="currentPassword"
                        placeholder="Enter your current password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {showPassword.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                      New Password <span className="text-xs text-slate-500">(leave blank to keep current)</span>
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        name="newPassword"
                        placeholder="Enter new password (min. 8 characters)"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {showPassword.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  {formData.newPassword && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirm new password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              confirm: !prev.confirm,
                            }))
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          {showPassword.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
