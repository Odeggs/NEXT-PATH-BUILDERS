import React, { useState } from "react";
import { motion } from "motion/react";
import { Zap, ArrowRight, User, Mail, Lock, School } from "lucide-react";
import { INSTITUTIONS } from "../constants";

interface AuthProps {
  onAuth: (userData: any) => void;
  key?: string;
}

export const AuthScreen = ({ onAuth }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<"auth" | "survey">("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [careerPath, setCareerPath] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableInterests = ["Technology", "Business", "Healthcare", "Creative Arts", "Engineering", "Law", "Education", "Science"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mocking API call for a clean client-side version
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (!isLogin) {
        setStep("survey");
      } else {
        // Mock successful login
        onAuth({ 
          name: email.split('@')[0], 
          email, 
          university: "PathBridge Academy",
          interests: ["Technology", "Business"],
          careerPath: "Software Engineer",
          gender: "other",
          avatarSeed: "Felix",
          isFirstLogin: false,
          points: 100,
          streak: 1,
          level: 1
        });
      }
    } catch (err: any) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSurveySubmit = () => {
    onAuth({ 
      name, 
      email, 
      university, 
      interests, 
      careerPath, 
      gender,
      avatarSeed: gender === "female" ? "Aneka" : gender === "male" ? "Felix" : "default",
      isFirstLogin: true,
      points: 50 // Bonus for completing survey
    });
  };

  if (step === "survey") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-slate-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Personalize Your Path</h2>
            <p className="text-slate-500 text-sm font-medium">Help us tailor PathBridge to your goals.</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest">What are you interested in?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => {
                      if (interests.includes(interest)) {
                        setInterests(interests.filter(i => i !== interest));
                      } else {
                        setInterests([...interests, interest]);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                      interests.includes(interest)
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Preferred Career Path</label>
              <input 
                type="text"
                placeholder="e.g. Full Stack Developer, Surgeon, CEO..."
                value={careerPath}
                onChange={(e) => setCareerPath(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Gender</label>
              <div className="flex gap-3">
                {["male", "female", "other"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g as any)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border capitalize transition-all ${
                      gender === g
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleSurveySubmit}
              disabled={!careerPath || interests.length === 0 || !gender}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Get Started <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <div className="flex items-center gap-0.5">
            <h1 className="text-2xl font-bold text-slate-900">Pathbridge</h1>
            <span className="text-2xl font-bold text-orange-500">.</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Bridging Learning to Earning</p>
        </div>

        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-8">
          <button 
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
          >
            Sign Up
          </button>
          <button 
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
          >
            Login
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">University</label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none"
                  >
                    <option value="">Select University</option>
                    {INSTITUTIONS.map(uni => (
                      <option key={uni} value={uni}>{uni}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="email" 
                placeholder="name@university.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {loading ? "Please wait..." : isLogin ? "Login to Pathbridge" : "Create Account"}
            {!loading && <ArrowRight size={18} />}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-white px-4 text-slate-400">Or</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => onAuth({
              name: "Guest Student",
              email: "guest@pathbridge.ai",
              university: "PathBridge Academy",
              interests: ["Technology", "Design"],
              careerPath: "Software Engineer",
              gender: "other",
              avatarSeed: "Felix",
              isFirstLogin: false,
              points: 100,
              streak: 1,
              level: 1
            })}
            className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-200"
          >
            Continue as Guest
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          By continuing, you agree to Pathbridge's <span className="text-blue-600 font-black cursor-pointer">Terms</span> and <span className="text-blue-600 font-black cursor-pointer">Privacy</span>.
        </p>
      </motion.div>
    </div>
  );
};
