import React, { useState } from "react";
import { ArrowLeft, User as UserIcon, Check, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { TRAVEL_AVATARS, AvatarItem } from "../utils/avatars";
import { motion } from "motion/react";

interface ProfilePageProps {
  onBackToHome: () => void;
}

export default function ProfilePage({ onBackToHome }: ProfilePageProps) {
  const { user, updateProfile } = useAuth();
  const { t } = useSettings();

  // Selected avatar state (starts with the user's current avatar, or default to the first one)
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(
    user?.avatarUrl || TRAVEL_AVATARS[0].url
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-slate-100 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Sign-in Required</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please sign in to view and customize your travel profile and avatars.
          </p>
          <button
            onClick={onBackToHome}
            className="px-6 py-2 bg-brand text-white rounded-full font-bold text-sm hover:bg-brand/90 transition-all shadow-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(user.name, user.email, user.bio, selectedAvatarUrl);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onBackToHome();
      }, 1500);
    } catch (e) {
      console.error("Failed to update avatar", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert to user's original avatar URL
    setSelectedAvatarUrl(user.avatarUrl || TRAVEL_AVATARS[0].url);
    onBackToHome();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb & Back */}
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 mb-8 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </button>

        {/* Outer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-md flex flex-col items-center space-y-6 text-center h-full min-h-[480px]">
            <div className="w-full text-left">
              <h2 className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-4">
                Profile Page
              </h2>
            </div>

            {/* Profile Avatar Frame with highlight border */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand to-rose-500 opacity-20 blur-md group-hover:opacity-30 transition-opacity" />
              <div className="relative w-40 h-40 rounded-full p-1 bg-white dark:bg-slate-900 border-4 border-brand shadow-lg overflow-hidden flex items-center justify-center">
                <img
                  src={selectedAvatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* User Name */}
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {user.name}
              </h1>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                {user.email}
              </p>
            </div>

            {/* Buttons (Pill shaped as requested and shown in image) */}
            <div className="w-full pt-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full font-bold text-sm hover:bg-slate-800 dark:hover:bg-white transition-all disabled:opacity-50 active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
                >
                  {isSaving ? "Saving..." : "SAVE"}
                </button>
                <button
                  onClick={handleCancel}
                  className="py-2.5 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-full font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  CANCEL
                </button>
              </div>
            </div>

            {/* Success Toast Overlay */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-full shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Profile picture updated successfully!
              </motion.div>
            )}
          </div>

          {/* Right Column: Avatar Grid Card */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-md">
            <h2 className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-6">
              Select Your Avatar
            </h2>

            {/* Grid layout containing 24 travel avatars */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
              {TRAVEL_AVATARS.map((avatar) => {
                const isSelected = selectedAvatarUrl === avatar.url;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => {
                      setSelectedAvatarUrl(avatar.url);
                      setIsChanging(false);
                    }}
                    className={`relative aspect-square rounded-full p-1.5 transition-all duration-300 focus:outline-none flex items-center justify-center ${
                      isSelected
                        ? "bg-gradient-to-tr from-brand to-rose-500 scale-110 shadow-md rotate-2"
                        : "bg-slate-50 dark:bg-slate-800 hover:scale-105 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                    title={avatar.name}
                  >
                    {/* Inner avatar container */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center p-0.5">
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Selected state Check Indicator */}
                    {isSelected && (
                      <span className="absolute -bottom-1 -right-1 bg-brand text-white rounded-full p-1 shadow-sm border border-white dark:border-slate-900">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
