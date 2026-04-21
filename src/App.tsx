import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Compass, 
  Trophy, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  Zap, 
  Globe, 
  Code,
  User,
  Search,
  Bell,
  ArrowRight,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import { generateAIResponse } from "./lib/gemini";
import { INSTITUTIONS, MISSIONS, OPPORTUNITIES, LANGUAGES } from "./constants";
import { useProfile, UserProfile } from "./hooks/useProfile";
import { AuthScreen } from "./components/Auth";
import { translations } from "./lib/translations";

// --- Components ---

const IntroScreen = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[100] flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full flex flex-col items-center"
      >
        <div className="flex items-center gap-0.5 mb-8">
          <span className="text-5xl font-black tracking-tighter text-slate-900">Pathbridge</span>
          <span className="text-5xl font-black text-orange-500">.</span>
        </div>
        <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-blue-600"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, profile, logout, language }: any) => {
  const t = translations[language] || translations.en;
  const menuItems = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
    { id: "study", label: t.study, icon: BookOpen },
    { id: "career", label: t.career, icon: Compass },
    { id: "community", label: t.community, icon: Users },
    { id: "missions", label: t.missions, icon: Trophy },
    { id: "opportunities", label: t.opportunities, icon: Briefcase },
    { id: "assistant", label: t.assistant, icon: MessageSquare },
    { id: "profile", label: t.profile, icon: User },
    { id: "setting", label: t.settings, icon: Settings },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className="fixed lg:static inset-y-0 left-0 w-64 bg-[#1a1a1a] text-white z-50 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0"
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Zap className="text-white fill-white" size={24} />
            </div>
            <div className="flex items-center gap-0.5">
              <h1 className="text-xl font-bold tracking-tight">Pathbridge</h1>
              <span className="text-xl font-bold text-orange-500">.</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed || profile.name}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#1a1a1a] rounded-full"></div>
            </div>
            <div className="text-center min-w-0 w-full">
              <h2 className="text-sm font-bold truncate">{profile.name || "Student"}</h2>
              <p className="text-[10px] text-slate-500 truncate">{profile.university}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? "text-white" : ""} />
              <span className="font-medium text-xs">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-2 border-t border-white/5">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors text-xs font-medium"
          >
            <LogOut size={16} />
            <span>{t.logout}</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

const Header = ({ activeTab, setIsOpen, language, setLanguage, profile, logout, setActiveTab, updateProfile }: any) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const t = translations[language] || translations.en;

  const avatars = [
    "Felix", "Aneka", "Max", "Luna", "Oliver", "Maya", "Leo", "Zoe", 
    "Jack", "Sasha", "Jasper", "Nala", "Milo", "Bella", "Coco", "Bear"
  ];

  return (
    <header className="h-20 bg-transparent px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t.search} 
            className="w-full bg-white border-none rounded-2xl pl-12 pr-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <div className="hidden md:flex flex-col items-end">
          <h3 className="text-sm font-bold text-slate-800">PathBridge AI</h3>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Bridging Learning to Earning</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2.5 text-slate-500 bg-white shadow-sm rounded-xl relative transition-all hover:bg-slate-50`}
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-800">{t.notifications}</h4>
                    <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full">New</span>
                  </div>
                  <div className="py-8 text-center space-y-2">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                      <Bell size={24} />
                    </div>
                    <p className="text-sm text-slate-500">{t.noNotifications}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 bg-white shadow-sm rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed || profile.name}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100 mb-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{profile.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{profile.email}</p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { setActiveTab("profile"); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                    >
                      <User size={14} /> {t.profile}
                    </button>
                    <button 
                      onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Zap size={14} /> Change Avatar
                      </div>
                      <ChevronRight size={12} className={`transition-transform ${isAvatarPickerOpen ? "rotate-90" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isAvatarPickerOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-4 gap-2 p-2 bg-slate-50 rounded-xl mt-1">
                            {avatars.map(seed => (
                              <button 
                                key={seed}
                                onClick={() => {
                                  updateProfile({ avatarSeed: seed });
                                  setIsAvatarPickerOpen(false);
                                  setIsProfileOpen(false);
                                }}
                                className={`w-10 h-10 rounded-lg border-2 transition-all overflow-hidden ${profile.avatarSeed === seed ? "border-blue-600" : "border-transparent hover:border-slate-300"}`}
                              >
                                <img 
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
                                  alt={seed}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-2 border-t border-slate-100 mt-2">
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <LogOut size={14} /> {t.logout}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Tab Content Components ---

const Resources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resources")
      .then(res => res.json())
      .then(data => {
        setResources(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch resources:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading resources...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {resources.map(res => (
        <a 
          key={res.id} 
          href={res.link}
          className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-500 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full">{res.category}</span>
            <ArrowRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={16} />
          </div>
          <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{res.title}</h4>
        </a>
      ))}
    </div>
  );
};

const Dashboard = ({ setActiveTab, profile, language }: any) => {
  const t = translations[language] || translations.en;
  const xpToNextLevel = profile.level === 1 ? 200 : profile.level === 2 ? 500 : 1000;
  const progress = (profile.points / xpToNextLevel) * 100;
  
  // Career progress simulation
  const careerProgress = Math.min(100, (profile.questionsAsked + profile.studySessions + profile.readingSessions + profile.careerPathsGenerated) * 2);

  const stats = [
    { label: "XP Points", value: profile.points, icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    { label: t.missions, value: profile.missionsCompleted, icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Streak", value: `${profile.streak} Days`, icon: Star, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Level", value: profile.level, icon: LayoutDashboard, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Gamification Header */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {profile.isFirstLogin ? `${t.welcome}, ${profile.name.split(' ')[0]}!` : `${t.welcomeBack}, ${profile.name.split(' ')[0]}!`} 👋
            </h2>
            <p className="text-slate-500 font-medium">You are {careerProgress}% toward becoming a professional.</p>
          </div>
          <div className="flex items-center gap-4 bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-xs font-black text-orange-800 uppercase tracking-widest">{profile.streak} Day Streak</p>
              <p className="text-[10px] font-bold text-orange-600 uppercase">Keep it up!</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase">Level {profile.level}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress to Level {profile.level + 1}</span>
            </div>
            <span className="text-xs font-black text-slate-900">{profile.points} / {xpToNextLevel} XP</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, progress)}%` }}
              className="h-full bg-blue-600 rounded-full shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Career Progress */}
        <section className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">Career Readiness</h3>
            <Compass className="text-blue-600" size={24} />
          </div>
          
          <div className="relative h-48 flex items-center justify-center mb-8">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-100"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={440}
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * careerProgress) / 100 }}
                className="text-emerald-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{careerProgress}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ready</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-xs font-bold text-blue-800 leading-relaxed">
              💡 <span className="font-black uppercase tracking-widest mr-1">Next Step:</span> 
              {careerProgress < 30 ? "Complete 1 mission to level up" : careerProgress < 60 ? "Use Study Helper to improve" : "Generate a career path"}
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="lg:col-span-5 space-y-4">
          <h3 className="text-xl font-black text-slate-900 mb-4">Quick Actions</h3>
          <button 
            onClick={() => setActiveTab("assistant")}
            className="w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-500 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <MessageSquare size={24} />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-900">Ask Assistant</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Get instant AI help</p>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab("career")}
            className="w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-500 transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Compass size={24} />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-900">Career Path</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Simulate your future</p>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab("missions")}
            className="w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-orange-500 transition-all group"
          >
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
              <Trophy size={24} />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-900">Daily Missions</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Earn XP & Rewards</p>
            </div>
          </button>
        </section>
      </div>

      {/* Custom API Resources Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Latest from PathBridge</h3>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Live Updates</span>
        </div>
        <Resources />
      </section>
    </div>
  );
};

const StudyPlatform = ({ updateStats, showReward, profile }: any) => {
  const [activeSubTab, setActiveSubTab] = useState("helper");

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveSubTab("helper")}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeSubTab === "helper" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            Study Helper
          </button>
          <button 
            onClick={() => setActiveSubTab("reading")}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeSubTab === "reading" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            Reading Assistant
          </button>
          <button 
            onClick={() => setActiveSubTab("discover")}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeSubTab === "discover" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            Discover Skills
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === "helper" && <StudyHelper updateStats={updateStats} showReward={showReward} />}
          {activeSubTab === "reading" && <ReadingAssistant updateStats={updateStats} showReward={showReward} />}
          {activeSubTab === "discover" && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Skill Discovery</h3>
              <p className="text-slate-500 max-w-md mx-auto font-medium">
                Essential skills for a <span className="text-blue-600 font-black">{profile.careerPath || "Professional"}</span> in the digital workforce.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {(profile.careerPath.toLowerCase().includes("tech") || profile.careerPath.toLowerCase().includes("engineer") || profile.careerPath.toLowerCase().includes("developer")) ? (
                  <>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                      <p className="font-black text-slate-900 text-sm mb-1">Cloud Computing</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">AWS, Azure, GCP</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                      <p className="font-black text-slate-900 text-sm mb-1">Data Structures</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Algorithms & Logic</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                      <p className="font-black text-slate-900 text-sm mb-1">Cybersecurity</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Network Security</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                      <p className="font-black text-slate-900 text-sm mb-1">Digital Marketing</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">SEO, SEM, Social</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                      <p className="font-black text-slate-900 text-sm mb-1">Project Management</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Agile, Scrum</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                      <p className="font-black text-slate-900 text-sm mb-1">Business Analytics</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Data-Driven Decisions</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Assistant = ({ updateStats, showReward }: any) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your PathBridge AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    updateStats("questionsAsked");
    showReward("+10 XP");

    const response = await generateAIResponse(input);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-slate-100 text-slate-800 rounded-tl-none shadow-sm border border-slate-200"
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const StudyHelper = ({ updateStats, showReward }: any) => {
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    updateStats("studySessions");
    showReward("+20 XP");
    
    const prompt = `Explain the following topic step-by-step for a Nigerian university student: ${topic}. Use relatable examples.
    
    Return ONLY a JSON object with this structure:
    {
      "title": "Topic Title",
      "overview": "Brief overview of the topic",
      "steps": [
        { "title": "Step Title", "content": "Detailed explanation", "example": "Relatable Nigerian example" }
      ]
    }`;

    try {
      const response = await generateAIResponse(prompt, "You are a Study Helper. Return ONLY valid JSON.");
      const cleanJson = response.replace(/```json|```/g, "").trim();
      setExplanation(JSON.parse(cleanJson));
    } catch (error) {
      console.error("Failed to parse explanation:", error);
      setExplanation({ overview: "Failed to generate a structured explanation. Please try again." });
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Study Helper</h3>
        <p className="text-slate-500 mb-6 font-medium">Enter a topic or problem you're struggling with, and I'll break it down for you.</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, Supply and Demand, Calculus..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button 
            onClick={handleExplain}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap"
          >
            {isLoading ? "Thinking..." : "Explain It"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {explanation && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {explanation.title && (
              <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen size={24} className="text-blue-200" />
                  <h4 className="text-2xl font-black">{explanation.title}</h4>
                </div>
                <p className="text-blue-100 font-medium leading-relaxed">{explanation.overview}</p>
              </div>
            )}

            <div className="space-y-4">
              {explanation.steps?.map((step: any, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl border border-blue-100">
                    {index + 1}
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-lg font-black text-slate-900">{step.title}</h5>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.content}</p>
                    {step.example && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic text-xs text-slate-500">
                        <span className="font-black text-blue-600 uppercase tracking-widest mr-2">Example:</span>
                        {step.example}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReadingAssistant = ({ updateStats, showReward }: any) => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    updateStats("readingSessions");
    showReward("+15 XP");
    
    const prompt = `Summarize and simplify the following text for a student. Highlight key terms and takeaways: ${text}
    
    Return ONLY a JSON object with this structure:
    {
      "summary": "Main summary paragraph",
      "keyTerms": [
        { "term": "Term Name", "definition": "Simplified definition" }
      ],
      "takeaways": ["Key point 1", "Key point 2"]
    }`;

    try {
      const response = await generateAIResponse(prompt, "You are a Reading Assistant. Return ONLY valid JSON.");
      const cleanJson = response.replace(/```json|```/g, "").trim();
      setSummary(JSON.parse(cleanJson));
    } catch (error) {
      console.error("Failed to parse summary:", error);
      setSummary({ summary: "Failed to generate a structured summary. Please try again." });
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Reading Assistant</h3>
        <p className="text-slate-500 mb-6 font-medium">Paste a long article or textbook passage below to get a simplified summary.</p>
        
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none mb-4"
        />
        
        <button 
          onClick={handleSummarize}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-600/20"
        >
          {isLoading ? "Analyzing Text..." : "Summarize & Simplify"}
        </button>
      </div>

      <AnimatePresence>
        {summary && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-blue-600">
                <FileText size={24} />
                <h4 className="text-xl font-black">Simplified Summary</h4>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">{summary.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h5 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Zap size={18} className="text-blue-600" /> Key Terms
                </h5>
                <div className="space-y-3">
                  {summary.keyTerms?.map((item: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="font-black text-blue-600 text-xs uppercase tracking-widest mb-1">{item.term}</p>
                      <p className="text-xs text-slate-600 font-medium">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h5 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Star size={18} className="text-emerald-500" /> Key Takeaways
                </h5>
                <ul className="space-y-3">
                  {summary.takeaways?.map((point: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                      <div className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CareerSimulator = ({ updateStats, showReward, profile }: any) => {
  const [goal, setGoal] = useState(profile.careerPath || "");
  const [roadmap, setRoadmap] = useState<any>(() => {
    const saved = localStorage.getItem("pathbridge_roadmap");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState<number[]>(() => {
    const saved = localStorage.getItem("pathbridge_completed_milestones");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const [isTipLoading, setIsTipLoading] = useState(false);

  useEffect(() => {
    if (roadmap) localStorage.setItem("pathbridge_roadmap", JSON.stringify(roadmap));
  }, [roadmap]);

  useEffect(() => {
    localStorage.setItem("pathbridge_completed_milestones", JSON.stringify(completedMilestones));
  }, [completedMilestones]);

  const handleSimulate = async () => {
    if (!goal.trim()) return;
    setIsLoading(true);
    setRoadmap(null);
    setCompletedMilestones([]);
    updateStats("careerPathsGenerated");
    showReward("+50 XP");

    const prompt = `Create a detailed, high-level career roadmap for a student in Nigeria wanting to become a ${goal}. 
    The student is interested in: ${profile.interests.join(", ")}.
    
    Return ONLY a JSON object with this structure:
    {
      "role": "Specific Job Title",
      "overview": "Brief overview of the role in Nigeria",
      "skills": [
        { "name": "Skill Name", "level": "Beginner/Intermediate/Advanced" }
      ],
      "milestones": [
        { 
          "id": 1, 
          "title": "Milestone Title", 
          "description": "Actionable steps", 
          "timeframe": "0-3 months",
          "icon": "BookOpen" 
        }
      ],
      "certifications": ["Cert 1", "Cert 2"],
      "localOpportunities": ["Company/Sector 1", "Company/Sector 2"]
    }
    
    Use Lucide icon names for icons: BookOpen, Code, Zap, Briefcase, Globe, Users, Trophy, Star, Compass, MessageSquare.`;

    try {
      const response = await generateAIResponse(prompt, "You are a Career Path Simulator. Return ONLY valid JSON.");
      const cleanJson = response.replace(/```json|```/g, "").trim();
      setRoadmap(JSON.parse(cleanJson));
    } catch (error) {
      console.error("Failed to parse roadmap:", error);
      setRoadmap({ overview: "Failed to generate a structured roadmap. Please try again." });
    }
    setIsLoading(false);
  };

  const toggleMilestone = (id: number) => {
    setCompletedMilestones(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
    if (!completedMilestones.includes(id)) {
      showReward("+10 XP Progress!");
    }
  };

  const handleGetTip = async (milestoneTitle: string) => {
    setIsTipLoading(true);
    const prompt = `Give a quick, actionable tip for a Nigerian student working on this milestone: ${milestoneTitle}. Keep it under 100 words and very practical.`;
    const tip = await generateAIResponse(prompt);
    setActiveTip(tip);
    setIsTipLoading(false);
  };

  const progress = roadmap?.milestones 
    ? (completedMilestones.length / roadmap.milestones.length) * 100 
    : 0;

  const IconComponent = ({ name, size = 20, className = "" }: any) => {
    const icons: any = { BookOpen, Code, Zap, Briefcase, Globe, Users, Trophy, Star, Compass, MessageSquare };
    const Icon = icons[name] || Star;
    return <Icon size={size} className={className} />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Compass size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Career Path Simulator</h3>
        </div>
        <p className="text-slate-500 mb-6 font-medium">Tell me your dream job, and I'll build a bridge to get you there.</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Software Engineer, Doctor, Accountant..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10"
            />
            {goal && (
              <button 
                onClick={() => setGoal("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button 
            onClick={handleSimulate}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Building Path...
              </>
            ) : "Generate Roadmap"}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
              <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Analyzing Career Trends...</p>
          </motion.div>
        )}

        {roadmap && (
          <motion.div 
            key="roadmap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header & Progress */}
            <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-2 block">Your Personalized Path</span>
                    <h4 className="text-4xl font-black mb-2">{roadmap.role}</h4>
                    <p className="text-blue-100 font-medium leading-relaxed max-w-2xl">{roadmap.overview}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[120px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Completion</p>
                    <p className="text-3xl font-black">{Math.round(progress)}%</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-24 -mb-24 blur-2xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Milestones Timeline */}
              <div className="lg:col-span-8 space-y-6">
                <h5 className="font-black text-slate-900 flex items-center gap-2 text-lg">
                  <Star size={20} className="text-emerald-500" /> Roadmap Milestones
                </h5>
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="space-y-4"
                >
                  {roadmap.milestones?.map((m: any, i: number) => {
                    const isCompleted = completedMilestones.includes(m.id);
                    const isCurrent = !isCompleted && (i === 0 || completedMilestones.includes(roadmap.milestones[i-1].id));
                    
                    return (
                      <motion.div 
                        key={m.id || i}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                        className={`group p-6 rounded-3xl border transition-all flex gap-6 cursor-pointer relative overflow-hidden ${
                          isCompleted 
                            ? "bg-slate-50 border-slate-200 opacity-75" 
                            : isCurrent
                              ? "bg-white border-blue-500 shadow-lg ring-2 ring-blue-500/10"
                              : "bg-white border-slate-100 hover:border-blue-500 shadow-sm hover:shadow-md"
                        }`}
                        onClick={() => toggleMilestone(m.id)}
                      >
                        {isCurrent && (
                          <div className="absolute top-0 right-0">
                            <div className="bg-blue-600 text-white text-[8px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-sm">
                              Current Task
                            </div>
                          </div>
                        )}
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-600"
                            : isCurrent
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                        }`}>
                          {isCompleted ? <Trophy size={24} /> : <IconComponent name={m.icon} size={24} />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h6 className={`font-black text-lg ${isCompleted ? "text-slate-400 line-through" : "text-slate-900"}`}>
                              {m.title}
                            </h6>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">
                              {m.timeframe}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">{m.description}</p>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                isCompleted 
                                  ? "bg-emerald-500 border-emerald-500 text-white" 
                                  : "border-slate-200"
                              }`}>
                                {isCompleted && <ChevronRight size={12} />}
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {isCompleted ? "Completed" : "Mark as Complete"}
                              </span>
                            </div>

                            {isCurrent && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGetTip(m.title);
                                }}
                                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                              >
                                <Zap size={12} /> Start Learning
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 space-y-6">
                {/* Skills */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h5 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Zap size={18} className="text-blue-600" /> Essential Skills
                  </h5>
                  <div className="space-y-4">
                    {roadmap.skills?.map((skill: any, i: number) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-700">{skill.name}</span>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{skill.level}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: skill.level === "Advanced" ? "100%" : skill.level === "Intermediate" ? "65%" : "35%" }}
                            className="h-full bg-blue-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h5 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Trophy size={18} className="text-orange-500" /> Top Certifications
                  </h5>
                  <div className="space-y-3">
                    {roadmap.certifications?.map((cert: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                        <Star size={14} className="text-orange-500" />
                        <span className="text-xs font-bold text-slate-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opportunities */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h5 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Briefcase size={18} className="text-emerald-600" /> Local Market
                  </h5>
                  <div className="space-y-2">
                    {roadmap.localOpportunities?.map((opp: string, i: number) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
                        {opp}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeTip && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6"
            onClick={() => setActiveTip(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveTip(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-4">Quick Learning Tip</h4>
              <p className="text-slate-600 leading-relaxed font-medium mb-8">{activeTip}</p>
              <button 
                onClick={() => setActiveTip(null)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20"
              >
                Got it, Let's go!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isTipLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-[2px] z-[120] flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
            <RefreshCw size={24} className="text-blue-600 animate-spin" />
            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Generating Tip...</p>
          </div>
        </div>
      )}
    </div>
  );
};


const Missions = ({ updateStats, showReward, profile }: any) => {
  const [completed, setCompleted] = useState<string[]>([]);

  // Tailor missions based on interests
  const tailoredMissions = MISSIONS.filter(m => 
    profile.interests.some((interest: string) => 
      m.category.toLowerCase().includes(interest.toLowerCase()) || 
      m.title.toLowerCase().includes(interest.toLowerCase())
    )
  ).slice(0, 5);

  // Fallback if no matches
  const displayMissions = tailoredMissions.length > 0 ? tailoredMissions : MISSIONS.slice(0, 5);

  const handleComplete = (mission: any) => {
    if (completed.includes(mission.id)) return;
    setCompleted(prev => [...prev, mission.id]);
    updateStats("missionsCompleted");
    updateStats("points", mission.points);
    showReward(`+${mission.points} XP`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Tailored Missions</h3>
        <p className="text-slate-500 mb-6 font-medium">Tasks specifically selected based on your interests in {profile.interests.join(", ")}.</p>
        
        <div className="space-y-4">
          {displayMissions.map((mission) => (
            <div 
              key={mission.id} 
              className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                completed.includes(mission.id) 
                  ? "bg-slate-50 border-slate-200 opacity-60" 
                  : "bg-white border-slate-100 hover:border-blue-200 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-slate-900">{mission.title}</h4>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-full">{mission.category}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{mission.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-blue-600">+{mission.points} XP</span>
                <button 
                  onClick={() => handleComplete(mission)}
                  disabled={completed.includes(mission.id)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    completed.includes(mission.id)
                      ? "bg-slate-200 text-slate-500"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                  }`}
                >
                  {completed.includes(mission.id) ? "Completed" : "Complete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Community = ({ language }: any) => {
  const t = translations[language] || translations.en;
  
  const groups = [
    { id: 1, name: "Tech Innovators Nigeria", members: 1250, category: "Tech", icon: Zap },
    { id: 2, name: "Future Doctors Network", members: 850, category: "Medicine", icon: Star },
    { id: 3, name: "Business Leaders Hub", members: 2100, category: "Business", icon: Briefcase },
    { id: 4, name: "Creative Arts Collective", members: 600, category: "Arts", icon: Star },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-blue-600 p-8 lg:p-12 rounded-[2.5rem] text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl lg:text-4xl font-black mb-4 leading-tight">Join the PathBridge Community</h2>
          <p className="text-blue-100 text-lg mb-8 font-medium">Connect with thousands of students across Nigeria. Share resources, find study partners, and grow together.</p>
          <a 
            href="https://discord.gg/pathbridge" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl"
          >
            <MessageSquare size={20} /> {t.discord}
          </a>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Users size={400} className="translate-x-1/4 -translate-y-1/4" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900">{t.activeGroups}</h3>
            <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {groups.map(group => (
              <div key={group.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <group.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{group.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{group.members} {t.members} • {group.category}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white text-blue-600 border border-blue-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  {t.joinGroup}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
            <Globe size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">National Network</h3>
            <p className="text-slate-500 font-medium max-w-xs">You are connected to students from over 140 institutions across Nigeria.</p>
          </div>
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" referrerPolicy="no-referrer" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
              +10k
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ profile, updateProfile, language, reset }: any) => {
  const t = translations[language] || translations.en;
  const stats = [
    { label: "Questions Asked", value: profile.questionsAsked, icon: MessageSquare },
    { label: "Study Sessions", value: profile.studySessions, icon: BookOpen },
    { label: "Reading Sessions", value: profile.readingSessions, icon: FileText },
    { label: "Career Paths", value: profile.careerPathsGenerated, icon: Compass },
    { label: "Missions Done", value: profile.missionsCompleted, icon: Trophy },
    { label: "Current Level", value: profile.level, icon: Zap },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2rem] bg-blue-600 flex items-center justify-center text-4xl font-bold overflow-hidden shadow-2xl shadow-blue-600/20">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed || profile.name}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-blue-600">
              <Zap size={20} />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-1">{profile.name}</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{profile.university}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Level {profile.level} Professional</span>
              <span className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black rounded-full uppercase tracking-widest">🔥 {profile.streak} Day Streak</span>
              <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-widest capitalize">{profile.gender || "Not Specified"}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/hello");
                const data = await res.json();
                alert(`API Response: ${data.message}`);
              } catch (err) {
                alert("Failed to call API. Make sure the server is running.");
              }
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-100 transition-all border border-blue-100"
          >
            <Globe size={18} /> Test Custom API
          </button>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to reset the platform? This will clear all your progress, XP, and settings.")) {
                reset();
              }
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all border border-red-100"
          >
            <RefreshCw size={18} /> Reset Platform Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <Settings size={20} className="text-blue-600" /> Account Settings
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Language</label>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => updateProfile({ language: lang.code })}
                    className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all ${
                      profile.language === lang.code
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
              <div className="flex gap-2">
                {["male", "female", "other"].map(g => (
                  <button
                    key={g}
                    onClick={() => updateProfile({ gender: g })}
                    className={`flex-1 px-4 py-3 rounded-xl text-xs font-bold border capitalize transition-all ${
                      profile.gender === g
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <Trophy size={20} className="text-orange-500" /> Platform Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div className="w-8 h-8 bg-white text-slate-400 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <stat.icon size={16} />
                </div>
                <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RewardSystem = ({ message, onComplete }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -50 }}
      onAnimationComplete={() => setTimeout(onComplete, 2000)}
      className="fixed bottom-8 right-8 z-[100] bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-blue-400"
    >
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <Zap size={24} className="fill-white" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Reward Earned!</p>
        <p className="text-xl font-black">{message}</p>
      </div>
    </motion.div>
  );
};

const Opportunities = ({ profile, language }: any) => {
  const t = translations[language] || translations.en;
  // Filter opportunities based on career path or interests
  const filteredOpps = OPPORTUNITIES.filter(opp => 
    opp.title.toLowerCase().includes(profile.careerPath.toLowerCase()) ||
    opp.company.toLowerCase().includes(profile.careerPath.toLowerCase()) ||
    profile.interests.some((interest: string) => 
      opp.title.toLowerCase().includes(interest.toLowerCase()) ||
      opp.type.toLowerCase().includes(interest.toLowerCase())
    )
  );

  const displayOpps = filteredOpps.length > 0 ? filteredOpps : OPPORTUNITIES;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-2">{t.opportunities}</h3>
        <p className="text-slate-500 mb-8 font-medium">Recommendations based on your goal to become a {profile.careerPath}.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayOpps.map((opp) => (
            <div key={opp.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full">{opp.type}</span>
                <Briefcase className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-1">{opp.title}</h4>
              <p className="text-sm font-bold text-slate-600 mb-4">{opp.company}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">📍 {opp.location}</span>
                <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">{t.applyNow}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { profile, login, logout, updateStats, updateProfile, reset } = useProfile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [reward, setReward] = useState<string | null>(null);

  const language = profile.language || "en";
  const setLanguage = (lang: string) => updateProfile({ language: lang });

  const showReward = (message: string) => {
    setReward(message);
  };

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />
      ) : !profile.isLoggedIn ? (
        <AuthScreen key="auth" onAuth={login} />
      ) : (
        <div key="app" className="flex min-h-screen bg-[#f5f7fa] text-slate-900 font-sans">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
            profile={profile}
            logout={logout}
            language={language}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <Header 
              activeTab={activeTab} 
              setIsOpen={setIsSidebarOpen} 
              language={language}
              setLanguage={setLanguage}
              profile={profile}
              logout={logout}
              setActiveTab={setActiveTab}
              updateProfile={updateProfile}
            />

            <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} profile={profile} language={language} />}
                    {activeTab === "study" && <StudyPlatform updateStats={updateStats} showReward={showReward} profile={profile} />}
                    {activeTab === "career" && <CareerSimulator updateStats={updateStats} showReward={showReward} profile={profile} />}
                    {activeTab === "missions" && <Missions updateStats={updateStats} showReward={showReward} profile={profile} />}
                    {activeTab === "community" && <Community language={language} />}
                    {activeTab === "opportunities" && <Opportunities profile={profile} language={language} />}
                    {activeTab === "assistant" && <Assistant updateStats={updateStats} showReward={showReward} />}
                    {activeTab === "profile" && <ProfilePage profile={profile} updateProfile={updateProfile} language={language} reset={reset} />}
                    
                    {["assignment", "notification", "results", "messages", "syllabus", "setting"].includes(activeTab) && (
                      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                          <FileText size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 capitalize">{activeTab} Section</h3>
                        <p className="text-slate-500 max-w-md mx-auto font-medium">This feature is currently being developed to provide a comprehensive digital learning infrastructure for Nigerian students.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>

          <AnimatePresence>
            {reward && (
              <RewardSystem 
                message={reward} 
                onComplete={() => setReward(null)} 
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
