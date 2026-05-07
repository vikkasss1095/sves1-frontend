import { useState, useEffect, useRef } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// ─── Inline Styles ────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "#f3f2f0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "0",
  },
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #e0e0e0",
    padding: "0 40px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0a66c2",
    letterSpacing: "-0.5px",
  },
  logoSpan: { color: "#313335" },
  topbarRight: { fontSize: "13px", color: "#666" },
  topbarLink: { color: "#0a66c2", fontWeight: "600", marginLeft: "4px", cursor: "pointer", textDecoration: "none" },
  container: {
    maxWidth: "780px",
    margin: "32px auto",
    padding: "0 16px 60px",
  },
  progressWrap: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    padding: "20px 28px",
    marginBottom: "20px",
  },
  progressTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  progressTitle: { fontSize: "13px", color: "#666" },
  progressPct: { fontSize: "13px", fontWeight: "700", color: "#0a66c2" },
  progressBar: { height: "6px", background: "#e8f0fe", borderRadius: "99px", overflow: "hidden" },
  progressFill: { height: "100%", background: "#0a66c2", borderRadius: "99px", transition: "width 0.4s ease" },
  steps: { display: "flex", gap: "0", marginTop: "14px" },
  step: (active, done) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
  }),
  stepDot: (active, done) => ({
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: done ? "#0a66c2" : active ? "#e8f0fe" : "#f3f2f0",
    border: active ? "2px solid #0a66c2" : done ? "none" : "2px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    color: done ? "#fff" : active ? "#0a66c2" : "#999",
    transition: "all 0.25s",
  }),
  stepLabel: (active, done) => ({
    fontSize: "10px",
    color: active || done ? "#0a66c2" : "#999",
    fontWeight: active || done ? "600" : "400",
    textAlign: "center",
    lineHeight: "1.3",
  }),
  card: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    padding: "28px",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#191919",
    marginBottom: "4px",
  },
  cardSub: { fontSize: "13px", color: "#666", marginBottom: "22px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  fieldFull: { display: "flex", flexDirection: "column", gap: "5px", gridColumn: "1 / -1" },
  label: { fontSize: "12px", fontWeight: "600", color: "#313335", letterSpacing: "0.2px" },
  req: { color: "#c00", marginLeft: "2px" },
  input: (err) => ({
    padding: "10px 12px",
    border: `1px solid ${err ? "#c00" : "#ccc"}`,
    borderRadius: "8px",
    fontSize: "14px",
    color: "#191919",
    background: "#fff",
    outline: "none",
    transition: "border 0.2s",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  }),
  select: (err) => ({
    padding: "10px 12px",
    border: `1px solid ${err ? "#c00" : "#ccc"}`,
    borderRadius: "8px",
    fontSize: "14px",
    color: "#191919",
    background: "#fff",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    cursor: "pointer",
  }),
  textarea: (err) => ({
    padding: "10px 12px",
    border: `1px solid ${err ? "#c00" : "#ccc"}`,
    borderRadius: "8px",
    fontSize: "14px",
    color: "#191919",
    background: "#fff",
    outline: "none",
    resize: "vertical",
    minHeight: "90px",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  }),
  errMsg: { fontSize: "11px", color: "#c00", marginTop: "2px" },
  divider: { height: "1px", background: "#f0f0f0", margin: "20px 0" },
  sectionHeading: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#0a66c2",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  photoBox: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "16px",
    background: "#f8f9fa",
    borderRadius: "10px",
    border: "1px dashed #ccc",
    marginBottom: "20px",
    cursor: "pointer",
  },
  photoCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "#0a66c2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    color: "#fff",
    flexShrink: 0,
    overflow: "hidden",
  },
  photoImg: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" },
  photoText: { flex: 1 },
  photoTitle: { fontSize: "14px", fontWeight: "600", color: "#191919", marginBottom: "2px" },
  photoSub: { fontSize: "12px", color: "#666" },
  skillInput: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
  },
  skillAddBtn: {
    padding: "10px 16px",
    background: "#0a66c2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  skillsWrap: { display: "flex", flexWrap: "wrap", gap: "6px" },
  skillTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#e8f0fe",
    color: "#0a66c2",
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: "99px",
  },
  skillDel: {
    background: "none",
    border: "none",
    color: "#0a66c2",
    cursor: "pointer",
    fontSize: "15px",
    lineHeight: "1",
    padding: "0",
  },
  addMoreBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "1px dashed #0a66c2",
    color: "#0a66c2",
    fontSize: "13px",
    fontWeight: "600",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#c00",
    fontSize: "13px",
    cursor: "pointer",
    padding: "0",
    fontWeight: "600",
  },
  uploadBox: {
    border: "1.5px dashed #bbb",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s",
    background: "#fafafa",
  },
  uploadIcon: { fontSize: "30px", marginBottom: "6px" },
  uploadTitle: { fontSize: "14px", fontWeight: "600", color: "#191919", marginBottom: "2px" },
  uploadSub: { fontSize: "12px", color: "#888" },
  uploadedFile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    background: "#f0f7ff",
    borderRadius: "8px",
    border: "1px solid #c8deff",
  },
  fileIcon: { fontSize: "22px" },
  fileName: { fontSize: "13px", fontWeight: "600", color: "#191919", flex: 1 },
  fileRemove: {
    background: "none",
    border: "none",
    color: "#c00",
    cursor: "pointer",
    fontSize: "18px",
  },
  scoreCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "14px 18px",
    background: "#f0f7ff",
    borderRadius: "10px",
    border: "1px solid #c8deff",
  },
  scoreCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#0a66c2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "800",
    color: "#fff",
    flexShrink: 0,
  },
  scoreInfo: { flex: 1 },
  scoreTitle: { fontSize: "14px", fontWeight: "700", color: "#191919" },
  scoreSub: { fontSize: "12px", color: "#555", marginTop: "2px" },
  navBtns: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px",
  },
  backBtn: {
    padding: "11px 24px",
    background: "none",
    border: "1px solid #0a66c2",
    color: "#0a66c2",
    borderRadius: "99px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  nextBtn: {
    padding: "11px 28px",
    background: "#0a66c2",
    color: "#fff",
    border: "none",
    borderRadius: "99px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "11px 32px",
    background: "#057642",
    color: "#fff",
    border: "none",
    borderRadius: "99px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  successWrap: {
    textAlign: "center",
    padding: "60px 20px",
  },
  successIcon: { fontSize: "64px", marginBottom: "16px" },
  successTitle: { fontSize: "26px", fontWeight: "800", color: "#191919", marginBottom: "8px" },
  successSub: { fontSize: "15px", color: "#555", maxWidth: "400px", margin: "0 auto 24px" },
  successScore: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    background: "#f0f7ff",
    border: "1px solid #c8deff",
    borderRadius: "12px",
    padding: "12px 24px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#0a66c2",
  },
};

// ─── Step Config ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: "personal",     label: "Personal",    icon: "👤" },
  { id: "company",      label: "Company",     icon: "🏢" },
  { id: "professional", label: "Professional",icon: "💼" },
  { id: "education",    label: "Education",   icon: "🎓" },
  { id: "bank",         label: "Bank",        icon: "🏦" },
  { id: "documents",    label: "Documents",   icon: "📄" },
];

const CATEGORIES = ["IT & Software","Manufacturing","Retail & FMCG","Healthcare","Finance & Banking","Logistics","Construction","Education","Hospitality","Other"];
const COMPANY_TYPES = ["Sole Proprietor","Partnership","LLP","Private Limited","Public Limited","NGO / Trust","Other"];
const EXPERIENCE_OPTS = ["Fresher (0 yrs)","0–1 year","1–3 years","3–5 years","5–10 years","10+ years"];
const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Other"];
const ACC_TYPES = ["Savings","Current"];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VendorProfile() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const photoRef = useRef();
  const resumeRef = useRef();
  const logoRef = useRef();

  const [form, setForm] = useState({
    // Personal
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    phone: "", alternatePhone: "", dob: "", gender: "", profilePhoto: null, photoPreview: "",

    // Address
    street: "", city: "", state: "", pincode: "", country: "India",

    // Company
    companyName: "", companyType: "", gstNumber: "", panNumber: "",
    businessEmail: "", businessPhone: "", businessStreet: "", businessCity: "",
    businessState: "", businessPincode: "", website: "", yearsInBusiness: "",

    // Professional
    category: "", subCategory: "", currentRole: "", currentOrg: "",
    experience: "", summary: "", skills: [], skillInput: "",

    // Education (array)
    education: [{ degree: "", institution: "", year: "", grade: "" }],

    // Bank
    accountHolder: "", accountNumber: "", ifsc: "", bankName: "",
    branchName: "", accountType: "",

    // Documents
    resume: null, resumeName: "",
    companyLogo: null, companyLogoName: "",
    businessLicense: null, businessLicenseName: "",
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setNested = (key, i, field, val) => {
    const arr = [...form[key]];
    arr[i] = { ...arr[i], [field]: val };
    setForm((f) => ({ ...f, [key]: arr }));
  };

  // ─── Profile Score ─────────────────────────────────────────────────────────
  const calcScore = () => {
    let s = 0;
    if (form.firstName && form.lastName) s += 10;
    if (form.phone) s += 5;
    if (form.email) s += 5;
    if (form.city) s += 5;
    if (form.companyName) s += 10;
    if (form.gstNumber || form.panNumber) s += 10;
    if (form.skills.length > 0) s += 10;
    if (form.experience) s += 5;
    if (form.education[0]?.degree) s += 10;
    if (form.resume) s += 15;
    if (form.profilePhoto) s += 5;
    if (form.accountNumber) s += 10;
    return s;
  };

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
      if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
      if (!form.phone.trim() || form.phone.length < 10) e.phone = "Valid phone required";
    }
    if (step === 1) {
      if (!form.companyName.trim()) e.companyName = "Required";
      if (!form.companyType) e.companyType = "Required";
    }
    if (step === 2) {
      if (!form.category) e.category = "Required";
      if (!form.experience) e.experience = "Required";
    }
    if (step === 4) {
      if (form.accountNumber && !form.ifsc.trim()) e.ifsc = "IFSC required if account provided";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); };

  const handleFile = (e, field, nameField, previewField) => {
    const file = e.target.files[0];
    if (!file) return;
    set(field, file);
    if (nameField) set(nameField, file.name);
    if (previewField) {
      const reader = new FileReader();
      reader.onload = (ev) => set(previewField, ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    const s = form.skillInput.trim();
    if (s && !form.skills.includes(s)) set("skills", [...form.skills, s]);
    set("skillInput", "");
  };

  const removeSkill = (i) => set("skills", form.skills.filter((_, idx) => idx !== i));

  const addEdu = () =>
    setForm((f) => ({ ...f, education: [...f.education, { degree: "", institution: "", year: "", grade: "" }] }));

  const removeEdu = (i) =>
    setForm((f) => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    if (!validate()) return;
    // Build FormData for API
    const fd = new FormData();
    // Flat fields
    const plain = { ...form };
    delete plain.profilePhoto; delete plain.resume;
    delete plain.companyLogo; delete plain.businessLicense;
    delete plain.photoPreview; delete plain.resumeName;
    delete plain.companyLogoName; delete plain.businessLicenseName;
    delete plain.skillInput; delete plain.confirmPassword;
    fd.append("data", JSON.stringify(plain));
    if (form.profilePhoto) fd.append("profilePhoto", form.profilePhoto);
    if (form.resume) fd.append("resume", form.resume);
    if (form.companyLogo) fd.append("companyLogo", form.companyLogo);
    if (form.businessLicense) fd.append("businessLicense", form.businessLicense);

    try {
      const res = await fetch("https://sves1-backend.onrender.com/api/vendor/profile", {
        method: "POST",
        body: fd,
      });
      if (res.ok) setSubmitted(true);
      else {
        const d = await res.json();
        alert(d.message || "Registration failed");
      }
    } catch {
      // For demo: just show success
      setSubmitted(true);
    }
  };

  const score = calcScore();

  // ─── Input helpers ─────────────────────────────────────────────────────────
  const inp = (key, placeholder, type = "text", readOnly = false) => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[key]}
      onChange={(e) => set(key, e.target.value)}
      style={S.input(errors[key])}
      readOnly={readOnly}
      onFocus={(e) => (e.target.style.borderColor = "#0a66c2")}
      onBlur={(e) => (e.target.style.borderColor = errors[key] ? "#c00" : "#ccc")}
    />
  );

  const sel = (key, opts, placeholder) => (
    <select value={form[key]} onChange={(e) => set(key, e.target.value)} style={S.select(errors[key])}>
      <option value="">{placeholder || "Select..."}</option>
      {opts.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  const field = (label, key, el, req = false, full = false) => (
    <div style={full ? S.fieldFull : S.field}>
      <label style={S.label}>{label}{req && <span style={S.req}>*</span>}</label>
      {el}
      {errors[key] && <span style={S.errMsg}>{errors[key]}</span>}
    </div>
  );

  // ─── Submitted ─────────────────────────────────────────────────────────────
  if (submitted) return (
    <div style={S.page}>
      <div style={S.topbar}>
        <div style={S.logo}>SVES<span style={S.logoSpan}>1</span></div>
      </div>
      <div style={{ ...S.container, ...S.successWrap }}>
        <div style={S.successIcon}>🎉</div>
        <div style={S.successTitle}>Account Created Successfully!</div>
        <div style={S.successSub}>Your vendor profile has been submitted for admin review. You'll receive an email confirmation shortly.</div>
        <div style={S.successScore}>
          <div style={{ ...S.scoreCircle, width: 44, height: 44, fontSize: 14 }}>{score}%</div>
          Profile Score — {score >= 80 ? "Excellent! 🔥" : score >= 50 ? "Good — add more details" : "Complete profile to improve"}
        </div>
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Topbar */}
      <div style={S.topbar}>
        <div style={S.topbar}>
  <div
    style={{
      width: "100%",
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "700",
      color: "#0a66c2",
    }}
  >
      <p className="text-sm font-medium text-slate-800 truncate">
              {user?.name}
            </p>
  </div>
</div>
      </div>

      <div style={S.container}>
        {/* Progress */}
        <div style={S.progressWrap}>
          <div style={S.progressTop}>
            <span style={S.progressTitle}>Step {step + 1} of {STEPS.length} — {STEPS[step].label}</span>
            <span style={S.progressPct}>{Math.round(((step + 1) / STEPS.length) * 100)}% complete</span>
          </div>
          <div style={S.progressBar}>
            <div style={{ ...S.progressFill, width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
          <div style={S.steps}>
            {STEPS.map((s2, i) => (
              <div key={s2.id} style={S.step(i === step, i < step)} onClick={() => i < step && setStep(i)}>
                <div style={S.stepDot(i === step, i < step)}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={S.stepLabel(i === step, i < step)}>{s2.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Score Card */}
        <div style={{ ...S.scoreCard, marginBottom: "16px" }}>
          <div style={S.scoreCircle}>{score}%</div>
          <div style={S.scoreInfo}>
            <div style={S.scoreTitle}>Profile Score</div>
            <div style={S.scoreSub}>
              {score >= 80 ? "🔥 Excellent! Your profile is ready to impress." : score >= 50 ? "👍 Good progress — complete remaining sections." : "ℹ️ Fill all sections to maximize your score."}
            </div>
          </div>
        </div>

        {/* ─── STEP 0: Personal Info ─────────────────────────────────────── */}
        {step === 0 && (
          <div style={S.card}>
            <div style={S.cardTitle}>👤 Personal Information</div>
            <div style={S.cardSub}>Basic details about you</div>

            {/* Photo */}
            <div style={S.photoBox} onClick={() => photoRef.current.click()}>
              <div style={S.photoCircle}>
                {form.photoPreview
                  ? <img src={form.photoPreview} alt="photo" style={S.photoImg} />
                  : "📷"}
              </div>
              <div style={S.photoText}>
                <div style={S.photoTitle}>Upload Profile Photo</div>
                <div style={S.photoSub}>JPG or PNG, max 5MB. Click to upload.</div>
              </div>
              {form.photoPreview && (
                <button style={S.removeBtn} onClick={(e) => { e.stopPropagation(); set("profilePhoto", null); set("photoPreview", ""); }}>✕ Remove</button>
              )}
            </div>
            <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => handleFile(e, "profilePhoto", null, "photoPreview")} />

            <div style={S.grid2}>
              {field("First Name", "firstName", inp("firstName", "e.g. Vikas"), true)}
              {field("Last Name", "lastName", inp("lastName", "e.g. Thavaliya"), true)}
              {field("Email Address", "email", inp("email", "name@example.com", "email"), true)}
              {field("Phone Number", "phone", inp("phone", "+91 9876543210", "tel"), true)}
              {field("Alternate Phone", "alternatePhone", inp("alternatePhone", "+91 9000000000", "tel"))}
              {field("Date of Birth", "dob", inp("dob", "", "date"))}
              {field("Gender", "gender", sel("gender", ["Male","Female","Other","Prefer not to say"], "Select gender"))}
              {field("Password", "password", inp("password", "Min 6 characters", "password"), true)}
              {field("Confirm Password", "confirmPassword", inp("confirmPassword", "Re-enter password", "password"), true)}
            </div>

            <div style={S.divider} />
            <div style={S.sectionHeading}>📍 Current Address</div>
            <div style={S.grid2}>
              {field("Street / Area", "street", inp("street", "e.g. 42 MG Road"), false, false)}
              {field("City", "city", inp("city", "e.g. Indore"))}
              {field("State", "state", sel("state", STATES, "Select state"))}
              {field("Pincode", "pincode", inp("pincode", "452001"))}
              {field("Country", "country", inp("country", "India"))}
            </div>
          </div>
        )}

        {/* ─── STEP 1: Company Info ──────────────────────────────────────── */}
        {step === 1 && (
          <div style={S.card}>
            <div style={S.cardTitle}>🏢 Company / Business Information</div>
            <div style={S.cardSub}>Details about your company or business</div>

            <div style={S.grid2}>
              {field("Company / Business Name", "companyName", inp("companyName", "e.g. Allsoft Infotech Pvt Ltd"), true)}
              {field("Company Type", "companyType", sel("companyType", COMPANY_TYPES, "Select type"), true)}
              {field("GST Number", "gstNumber", inp("gstNumber", "22AAAAA0000A1Z5"))}
              {field("PAN Number", "panNumber", inp("panNumber", "AAAPL1234C"))}
              {field("Business Email", "businessEmail", inp("businessEmail", "info@company.com", "email"))}
              {field("Business Phone", "businessPhone", inp("businessPhone", "+91 9000000000", "tel"))}
              {field("Website", "website", inp("website", "https://yourcompany.com", "url"))}
              {field("Years in Business", "yearsInBusiness", inp("yearsInBusiness", "e.g. 5", "number"))}
            </div>

            <div style={S.divider} />
            <div style={S.sectionHeading}>📍 Business Address</div>
            <div style={S.grid2}>
              {field("Street / Area", "businessStreet", inp("businessStreet", "e.g. Plot 7, Industrial Area"))}
              {field("City", "businessCity", inp("businessCity", "e.g. Ujjain"))}
              {field("State", "businessState", sel("businessState", STATES, "Select state"))}
              {field("Pincode", "businessPincode", inp("businessPincode", "456001"))}
            </div>
          </div>
        )}

        {/* ─── STEP 2: Professional Info ─────────────────────────────────── */}
        {step === 2 && (
          <div style={S.card}>
            <div style={S.cardTitle}>💼 Professional Information</div>
            <div style={S.cardSub}>Your expertise, experience and skills</div>

            <div style={S.grid2}>
              {field("Business Category", "category", sel("category", CATEGORIES, "Select category"), true)}
              {field("Sub-category / Specialization", "subCategory", inp("subCategory", "e.g. Web Development"))}
              {field("Current Role / Designation", "currentRole", inp("currentRole", "e.g. Software Engineer"))}
              {field("Current Organization", "currentOrg", inp("currentOrg", "e.g. Allsoft Infotech"))}
              {field("Total Experience", "experience", sel("experience", EXPERIENCE_OPTS, "Select experience"), true)}
            </div>

            <div style={S.divider} />
            <div style={S.field}>
              <label style={S.label}>Profile Summary</label>
              <textarea
                placeholder="Briefly describe your professional background, expertise, and what makes you stand out..."
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
                style={S.textarea(false)}
              />
            </div>

            <div style={S.divider} />
            <div style={S.sectionHeading}>🛠 Skills / Expertise</div>
            <div style={S.skillInput}>
              <input
                style={S.input(false)}
                placeholder="Type a skill and press Add (e.g. React, Node.js, SAP)"
                value={form.skillInput}
                onChange={(e) => set("skillInput", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <button style={S.skillAddBtn} onClick={addSkill}>+ Add</button>
            </div>
            <div style={S.skillsWrap}>
              {form.skills.map((sk, i) => (
                <span key={i} style={S.skillTag}>
                  {sk}
                  <button style={S.skillDel} onClick={() => removeSkill(i)}>×</button>
                </span>
              ))}
              {form.skills.length === 0 && <span style={{ fontSize: "12px", color: "#aaa" }}>No skills added yet</span>}
            </div>
          </div>
        )}

        {/* ─── STEP 3: Education ─────────────────────────────────────────── */}
        {step === 3 && (
          <div style={S.card}>
            <div style={S.cardTitle}>🎓 Education</div>
            <div style={S.cardSub}>Add your educational qualifications</div>

            {form.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "20px", padding: "16px", background: "#fafafa", borderRadius: "10px", border: "1px solid #e8e8e8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#555" }}>Education {i + 1}</span>
                  {form.education.length > 1 && (
                    <button style={S.removeBtn} onClick={() => removeEdu(i)}>✕ Remove</button>
                  )}
                </div>
                <div style={S.grid2}>
                  <div style={S.field}>
                    <label style={S.label}>Degree / Qualification</label>
                    <input style={S.input(false)} placeholder="e.g. B.Tech, MBA, BCA, 12th" value={edu.degree}
                      onChange={(e) => setNested("education", i, "degree", e.target.value)}
                      onFocus={(e) => (e.target.style.borderColor = "#0a66c2")}
                      onBlur={(e) => (e.target.style.borderColor = "#ccc")} />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Institution / University</label>
                    <input style={S.input(false)} placeholder="e.g. Vikram University, Ujjain" value={edu.institution}
                      onChange={(e) => setNested("education", i, "institution", e.target.value)}
                      onFocus={(e) => (e.target.style.borderColor = "#0a66c2")}
                      onBlur={(e) => (e.target.style.borderColor = "#ccc")} />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Year of Passing</label>
                    <input style={S.input(false)} placeholder="e.g. 2023" value={edu.year} type="number"
                      onChange={(e) => setNested("education", i, "year", e.target.value)}
                      onFocus={(e) => (e.target.style.borderColor = "#0a66c2")}
                      onBlur={(e) => (e.target.style.borderColor = "#ccc")} />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Grade / Percentage / CGPA</label>
                    <input style={S.input(false)} placeholder="e.g. 8.5 CGPA / 78%" value={edu.grade}
                      onChange={(e) => setNested("education", i, "grade", e.target.value)}
                      onFocus={(e) => (e.target.style.borderColor = "#0a66c2")}
                      onBlur={(e) => (e.target.style.borderColor = "#ccc")} />
                  </div>
                </div>
              </div>
            ))}

            <button style={S.addMoreBtn} onClick={addEdu}>+ Add Another Qualification</button>
          </div>
        )}

        {/* ─── STEP 4: Bank Details ──────────────────────────────────────── */}
        {step === 4 && (
          <div style={S.card}>
            <div style={S.cardTitle}>🏦 Bank Account Details</div>
            <div style={S.cardSub}>Used for payment processing. Your data is encrypted and secure.</div>

            <div style={{ padding: "10px 14px", background: "#fff8e6", border: "1px solid #ffd966", borderRadius: "8px", fontSize: "12px", color: "#7a5800", marginBottom: "18px" }}>
              🔒 Your bank details are encrypted using AES-256 and never shared with third parties.
            </div>

            <div style={S.grid2}>
              {field("Account Holder Name", "accountHolder", inp("accountHolder", "As per bank records"))}
              {field("Account Number", "accountNumber", inp("accountNumber", "e.g. 1234567890", "password"))}
              {field("IFSC Code", "ifsc", inp("ifsc", "e.g. SBIN0001234"), false)}
              {field("Bank Name", "bankName", inp("bankName", "e.g. State Bank of India"))}
              {field("Branch Name", "branchName", inp("branchName", "e.g. Ujjain Main Branch"))}
              {field("Account Type", "accountType", sel("accountType", ACC_TYPES, "Select type"))}
            </div>
          </div>
        )}

        {/* ─── STEP 5: Documents ─────────────────────────────────────────── */}
        {step === 5 && (
          <div style={S.card}>
            <div style={S.cardTitle}>📄 Documents</div>
            <div style={S.cardSub}>Upload your resume, company logo and other documents</div>

            {/* Resume */}
            <div style={S.sectionHeading}>📋 Resume / CV</div>
            {form.resume ? (
              <div style={{ ...S.uploadedFile, marginBottom: "16px" }}>
                <span style={S.fileIcon}>📄</span>
                <span style={S.fileName}>{form.resumeName}</span>
                <button style={S.fileRemove} onClick={() => { set("resume", null); set("resumeName", ""); resumeRef.current.value = ""; }}>✕</button>
              </div>
            ) : (
              <div style={{ ...S.uploadBox, marginBottom: "16px" }} onClick={() => resumeRef.current.click()}>
                <div style={S.uploadIcon}>📄</div>
                <div style={S.uploadTitle}>Upload Resume / CV</div>
                <div style={S.uploadSub}>PDF, DOC, DOCX · Max 6MB</div>
              </div>
            )}
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
              onChange={(e) => handleFile(e, "resume", "resumeName", null)} />

            <div style={S.divider} />

            {/* Company Logo */}
            <div style={S.sectionHeading}>🏢 Company Logo</div>
            {form.companyLogo ? (
              <div style={{ ...S.uploadedFile, marginBottom: "16px" }}>
                <span style={S.fileIcon}>🖼️</span>
                <span style={S.fileName}>{form.companyLogoName}</span>
                <button style={S.fileRemove} onClick={() => { set("companyLogo", null); set("companyLogoName", ""); logoRef.current.value = ""; }}>✕</button>
              </div>
            ) : (
              <div style={{ ...S.uploadBox, marginBottom: "16px" }} onClick={() => logoRef.current.click()}>
                <div style={S.uploadIcon}>🖼️</div>
                <div style={S.uploadTitle}>Upload Company Logo</div>
                <div style={S.uploadSub}>JPG, PNG · Max 2MB</div>
              </div>
            )}
            <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => handleFile(e, "companyLogo", "companyLogoName", null)} />

            <div style={S.divider} />

            {/* Final Summary */}
            <div style={S.sectionHeading}>✅ Review & Submit</div>
            <div style={{ background: "#f8f9fa", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#444", lineHeight: "1.8" }}>
              <div>👤 <b>Name:</b> {form.firstName} {form.lastName}</div>
              <div>📧 <b>Email:</b> {form.email}</div>
              <div>📞 <b>Phone:</b> {form.phone}</div>
              <div>🏢 <b>Company:</b> {form.companyName || "—"} ({form.companyType || "—"})</div>
              <div>💼 <b>Category:</b> {form.category || "—"} | Experience: {form.experience || "—"}</div>
              <div>🎓 <b>Education:</b> {form.education[0]?.degree || "—"} from {form.education[0]?.institution || "—"}</div>
              <div>🛠 <b>Skills:</b> {form.skills.length > 0 ? form.skills.join(", ") : "—"}</div>
              <div>📄 <b>Resume:</b> {form.resumeName || "Not uploaded"}</div>
              <div>🏦 <b>Bank:</b> {form.bankName ? `${form.bankName} — ${form.accountType}` : "Not provided"}</div>
              <div style={{ marginTop: "8px", fontWeight: "700", color: "#0a66c2" }}>📊 Profile Score: {score}%</div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={S.navBtns}>
          <div>
            {step > 0 && <button style={S.backBtn} onClick={back}>← Back</button>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {step < STEPS.length - 1
              ? <button style={S.nextBtn} onClick={next}>Next →</button>
              : <button style={S.submitBtn} onClick={handleSubmit}>🚀 Create Account</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}