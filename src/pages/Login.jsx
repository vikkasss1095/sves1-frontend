import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "../utils/axios";
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/vendor', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0a]">
      {/* --- BACKGROUND IMAGE --- */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070')" }}
      />
      <div className="absolute inset-0 z-1 bg-black/80 backdrop-blur-[1px]" />

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        
        {/* CIRCULAR CONTAINER - Mobile responsive fixed */}
        <div className="relative flex items-center justify-center w-[360px] h-[360px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px]">
          
          {/* Outer Rotating Dotted Ring */}
          <div className="absolute inset-0 rounded-full border-[8px] sm:border-[12px] border-dotted border-cyan-500/20 animate-[spin_60s_linear_infinite]" />
          
          {/* Inner Glow Line */}
          <div className="absolute inset-6 sm:inset-10 rounded-full border border-cyan-500/10 shadow-[0_0_40px_rgba(34,211,238,0.1)]" />

          {/* FORM AREA - Isko z-index aur padding de di hai taaki text clear rahe */}
          <div className="relative z-20 w-full max-w-[240px] sm:max-w-[320px] text-center">
            <h1 className="text-2xl sm:text-4xl font-serif text-cyan-400 mb-6 sm:mb-10 tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
              Login
            </h1>

            <form onSubmit={submit} className="space-y-4 sm:space-y-6">
              {/* Email - Perfect Rounded Pill */}
              <div className="relative group">
                <input
                  name="email" type="email" value={form.email} onChange={handle} required
                  placeholder="Email"
                  className="w-full bg-[#1a1a1a]/60 border border-slate-700/50 rounded-full px-6 py-2.5 sm:py-3 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-all backdrop-blur-md shadow-inner"
                />
              </div>

              {/* Password - Perfect Rounded Pill */}
              <div className="relative group">
                <input
                  name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handle} required
                  placeholder="Password"
                  className="w-full bg-[#1a1a1a]/60 border border-slate-700/50 rounded-full px-6 py-2.5 sm:py-3 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-all backdrop-blur-md shadow-inner"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Login Button - Pill Shape */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 sm:py-3 rounded-full mt-2 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all active:scale-[0.95] flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>Login <LogIn size={16} /></>
                )}
              </button>
            </form>

            <p className="mt-6 sm:mt-10 text-[10px] sm:text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-500 font-bold hover:text-red-400 ml-1">
                Register Here..
              </Link>
            </p>
          </div>
        </div>

        {/* --- DEMO HINT FOOTER --- */}
        <div className="mt-4 sm:mt-8 px-5 py-2 bg-black/60 backdrop-blur-md border border-white/5 rounded-full">
            <p className="text-[9px] sm:text-[11px] text-slate-500 tracking-[0.1em] uppercase text-center">
              Admin: admin@sves1.com | Vendor: vendor@sves1.com
            </p>
        </div>
      </div>
    </div>
  );
}