import React, { useState } from "react";
import { 
  ArrowLeft, 
  User as UserIcon, 
  Mail, 
  CheckCircle2, 
  Save, 
  X, 
  Info, 
  Lightbulb, 
  Pencil, 
  Check 
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { TRAVEL_AVATARS } from "../utils/avatars";
import { motion, AnimatePresence } from "motion/react";

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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col items-center justify-center p-6">
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
            className="px-6 py-2.5 bg-[#FF385C] text-white rounded-full font-bold text-sm hover:bg-[#E00B41] transition-all shadow-md"
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
      }, 1200);
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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Back Button */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </button>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Card: Profile Details & Active Avatar */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[28px] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col items-center justify-between text-center space-y-6">
            
            {/* Top Badge: PROFILE PAGE */}
            <div className="w-full text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider text-[#FF385C] uppercase">
                <UserIcon className="w-3.5 h-3.5 fill-[#FF385C]/20" />
                Profile Page
              </span>
            </div>

            {/* Profile Avatar Frame with Red Glowing Ring and Edit Pencil Button */}
            <div className="relative my-2">
              <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full p-1 ring-2 ring-[#FF385C] shadow-[0_0_35px_rgba(255,56,92,0.25)] flex items-center justify-center bg-white dark:bg-slate-900">
                <img
                  src={selectedAvatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Pencil Edit Badge */}
              <div 
                className="absolute bottom-1 right-2 w-9 h-9 rounded-full bg-gradient-to-r from-[#FF385C] to-[#E00B41] text-white flex items-center justify-center shadow-lg shadow-rose-500/35 border-2 border-white dark:border-slate-900 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                title="Select an avatar from the right"
              >
                <Pencil className="w-4 h-4 fill-white/20" />
              </div>
            </div>

            {/* User Name & Email Badge */}
            <div className="space-y-3 w-full">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-wide uppercase">
                {user.name || "SYSTEM ADMIN"}
              </h1>

              {/* Verified Email Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email || "admin@tiqsey.com"}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 text-white" />
              </div>
            </div>

            {/* Action Buttons (Save & Cancel) */}
            <div className="w-full pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="py-3 px-5 bg-gradient-to-r from-[#FF385C] to-[#E00B41] text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "SAVING..." : "SAVE"}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="py-3 px-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>CANCEL</span>
                </button>
              </div>
            </div>

            {/* Bottom Info Banner */}
            <div className="w-full bg-rose-50/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-3.5 flex items-start gap-2.5 text-left">
              <Info className="w-4 h-4 text-[#FF385C] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Changes to your avatar will be visible across the entire platform.
              </p>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-full shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Avatar updated successfully!
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right Card: Avatar Selection Grid */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[28px] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
            
            {/* Header Section */}
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <UserIcon className="w-6 h-6 fill-indigo-600/20" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-wider uppercase">
                    Select Your Avatar
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
                    Choose an avatar that represents you. You can change it anytime.
                  </p>
                </div>
              </div>

              {/* 24 Avatars in 6-Column Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6 py-2">
                {TRAVEL_AVATARS.map((avatar) => {
                  const isSelected = selectedAvatarUrl === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatarUrl(avatar.url)}
                      className={`relative aspect-square rounded-full p-1 transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer group ${
                        isSelected
                          ? "ring-[2.5px] ring-[#FF385C] ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105 shadow-md"
                          : "hover:scale-105 hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-700"
                      }`}
                      title={`${avatar.name} - ${avatar.role || "Avatar"}`}
                    >
                      {/* Avatar Image Circle */}
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className="w-full h-full rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF385C] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 z-10 animate-in zoom-in-50 duration-200">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Tip Footer */}
            <div className="flex items-center gap-2 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-normal text-slate-600 dark:text-slate-400">
              <Lightbulb className="w-4 h-4 text-indigo-500 shrink-0 fill-indigo-500/20" />
              <span>
                <strong className="font-bold text-slate-800 dark:text-slate-200">Tip:</strong> A clear avatar helps others recognize you easily.
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
