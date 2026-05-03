export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    user_email: "",
    user_password: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: form.user_email,
        password: form.user_password,
      });

      login(res.data.token, res.data.user);
      toast.success("Login successful!");

      navigate(res.data.user.role === "admin" ? "/admin" : "/vendor", {
        replace: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative flex flex-col items-center justify-center w-full max-w-sm">

        {/* Rings (responsive) */}
        <div className="absolute w-[90vw] max-w-[420px] aspect-square rounded-full border border-cyan-400 opacity-30"></div>
        <div className="absolute w-[95vw] max-w-[460px] aspect-square rounded-full border-2 border-dashed border-cyan-400 animate-spin-slow opacity-40"></div>

        <div className="relative text-center w-full">

          <h2 className="text-cyan-400 text-xl sm:text-2xl mb-6 tracking-widest">
            LOGIN
          </h2>

          <form onSubmit={submit} autoComplete="off" className="space-y-4 flex flex-col items-center">

            <input type="text" name="fakeuser" className="hidden" />
            <input type="password" name="fakepass" className="hidden" />

            {/* Email */}
            <input
              name="user_email"
              type="email"
              placeholder="Enter email"
              value={form.user_email}
              onChange={handle}
              required
              className="w-full max-w-[280px] px-4 py-2 rounded-full bg-white text-black"
            />

            {/* Password */}
            <div className="relative w-full max-w-[280px]">
              <input
                name="user_password"
                type={showPwd ? "text" : "password"}
                placeholder="Enter password"
                value={form.user_password}
                onChange={handle}
                required
                className="w-full px-4 py-2 rounded-full bg-white text-black"
              />

              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-2"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-[280px] bg-cyan-500 py-2 rounded-full text-white"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>

          </form>

          {/* Links */}
          <p className="text-gray-300 mt-4 text-xs sm:text-sm">
            Forgot Password?{" "}
            <Link to="/forgot-password" className="text-cyan-400">
              Reset here
            </Link>
          </p>

          <p className="text-gray-300 mt-2 text-xs sm:text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-red-400">
              Register Here..
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}