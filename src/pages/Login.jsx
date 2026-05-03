return (
  <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
    style={{ backgroundImage: `url(${bg})` }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/60"></div>

    <div className="relative flex flex-col items-center justify-center w-full max-w-md">

      {/* Rings (responsive) */}
      <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] rounded-full border border-cyan-400 opacity-30"></div>

      <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] rounded-full border-2 border-dashed border-cyan-400 animate-spin-slow opacity-40"></div>

      <div className="relative text-center w-full">

        <h2 className="text-cyan-400 text-xl sm:text-2xl mb-6 tracking-widest">
          LOGIN
        </h2>

        <form onSubmit={submit} autoComplete="off" className="space-y-4 w-full">

          {/* Autofill hack */}
          <input type="text" name="fakeuser" hidden />
          <input type="password" name="fakepass" hidden />

          {/* Email */}
          <input
            name="user_email"
            type="email"
            placeholder="Enter email"
            value={form.user_email}
            onChange={handle}
            autoComplete="off"
            required
            className="w-full max-w-[320px] mx-auto block px-4 py-2 rounded-full bg-white text-black"
          />

          {/* Password */}
          <div className="relative w-full max-w-[320px] mx-auto">
            <input
              name="user_password"
              type={showPwd ? "text" : "password"}
              placeholder="Enter password"
              value={form.user_password}
              onChange={handle}
              autoComplete="new-password"
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
            className="w-full max-w-[320px] mx-auto block bg-cyan-500 py-2 rounded-full text-white"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        {/* Links */}
        <p className="text-gray-300 mt-4 text-sm">
          Forgot Password?{" "}
          <Link to="/forgot-password" className="text-cyan-400">
            Reset here
          </Link>
        </p>

        <p className="text-gray-300 mt-2 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-red-400">
            Register Here..
          </Link>
        </p>

      </div>
    </div>
  </div>
);