<form onSubmit={submit} autoComplete="off" className="space-y-6">

  {/* hidden chrome hack */}
  <input type="text" name="fakeuser" style={{ display: "none" }} />
  <input type="password" name="fakepass" style={{ display: "none" }} />

  {/* Email */}
  <input
    name="email"
    type="email"
    value={form.email}
    onChange={handle}
    placeholder="Email"
    autoComplete="off"
    className="input"
  />

  {/* Password */}
  <div className="relative">
    <input
      name="password"
      type={showPwd ? "text" : "password"}
      value={form.password}
      onChange={handle}
      placeholder="Password"
      autoComplete="new-password"
      className="input pr-10"
    />
    <button
      type="button"
      onClick={() => setShowPwd(!showPwd)}
      className="absolute right-4 top-1/2 -translate-y-1/2"
    >
      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  </div>
</form>