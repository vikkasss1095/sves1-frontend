import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: { minHeight: "100vh", background: "#f3f2f0", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "32px 16px 60px" },
  container: { maxWidth: "860px", margin: "0 auto" },
  backBtn: { background: "none", border: "1px solid #0a66c2", color: "#0a66c2", padding: "8px 18px", borderRadius: "99px", fontSize: "13px", fontWeight: "700", cursor: "pointer", marginBottom: "20px" },
  card: { background: "#fff", borderRadius: "12px", border: "1px solid #e0e0e0", padding: "24px", marginBottom: "16px" },
  profileRow: { display: "flex", gap: "20px", alignItems: "center" },
  avatar: { width: "80px", height: "80px", borderRadius: "50%", background: "#0a66c2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#fff", fontWeight: "700", flexShrink: 0, overflow: "hidden" },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" },
  name: { fontSize: "22px", fontWeight: "800", color: "#191919" },
  meta: { fontSize: "13px", color: "#555", marginTop: "2px" },
  badge: (status) => ({
    display: "inline-block", marginTop: "8px", padding: "4px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "700",
    background: status === "approved" ? "#e6f4ea" : status === "rejected" ? "#fce8e6" : "#fff8e6",
    color: status === "approved" ? "#1a7f37" : status === "rejected" ? "#c00" : "#7a5800",
    border: `1px solid ${status === "approved" ? "#a8d5b5" : status === "rejected" ? "#f5c6c2" : "#ffd966"}`,
  }),
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" },
  sectionTitle: { fontSize: "14px", fontWeight: "700", color: "#0a66c2", marginBottom: "14px", paddingBottom: "8px", borderBottom: "2px solid #e8f0fe" },
  row: { fontSize: "13px", color: "#444", marginBottom: "7px", display: "flex", gap: "6px" },
  rowLabel: { fontWeight: "600", color: "#191919", minWidth: "110px" },
  tag: { display: "inline-block", background: "#e8f0fe", color: "#0a66c2", fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "99px", margin: "2px" },
  actionBar: { display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" },
  approveBtn: { padding: "11px 28px", background: "#057642", color: "#fff", border: "none", borderRadius: "99px", fontSize: "14px", fontWeight: "700", cursor: "pointer" },
  rejectBtn: { padding: "11px 28px", background: "#c00", color: "#fff", border: "none", borderRadius: "99px", fontSize: "14px", fontWeight: "700", cursor: "pointer" },
  disabledBtn: { padding: "11px 28px", background: "#ccc", color: "#fff", border: "none", borderRadius: "99px", fontSize: "14px", fontWeight: "700", cursor: "not-allowed" },
  // Modal
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal: { background: "#fff", borderRadius: "16px", padding: "28px", width: "420px", maxWidth: "90vw", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" },
  modalTitle: { fontSize: "18px", fontWeight: "800", color: "#191919", marginBottom: "6px" },
  modalSub: { fontSize: "13px", color: "#666", marginBottom: "16px" },
  textarea: { width: "100%", minHeight: "100px", padding: "10px 12px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none" },
  modalBtns: { display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" },
  cancelBtn: { padding: "9px 20px", background: "none", border: "1px solid #ccc", borderRadius: "99px", fontSize: "13px", cursor: "pointer" },
  confirmBtn: { padding: "9px 22px", background: "#c00", color: "#fff", border: "none", borderRadius: "99px", fontSize: "13px", fontWeight: "700", cursor: "pointer" },
  docLink: { display: "inline-flex", alignItems: "center", gap: "6px", color: "#0a66c2", fontSize: "13px", fontWeight: "600", textDecoration: "none", padding: "6px 12px", background: "#e8f0fe", borderRadius: "8px", marginRight: "8px" },
  rejectionBox: { background: "#fce8e6", border: "1px solid #f5c6c2", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#c00", marginTop: "10px" },
};

const Row = ({ label, value }) => (
  <div style={S.row}>
    <span style={S.rowLabel}>{label}:</span>
    <span>{value || <span style={{ color: "#aaa" }}>—</span>}</span>
  </div>
);

export default function VendorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchVendor = () => {
    setLoading(true);
    api.get(`/admin/vendors/${id}`)
      .then(res => setVendor(res.data))
      .catch(err => {
        console.error(err);
        toast.error("Failed to load vendor details");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVendor(); }, [id]);

  const handleApprove = async () => {
    setActing(true);
    try {
      await api.put(`/admin/vendors/${id}/approve`);
      toast.success("✅ Vendor Approved!");
      fetchVendor(); // refresh status
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    } finally {
      setActing(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    setActing(true);
    try {
      await api.put(`/admin/vendors/${id}/reject`, { reason: rejectReason });
      toast.success("❌ Vendor Rejected");
      setShowRejectModal(false);
      setRejectReason("");
      fetchVendor();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed");
    } finally {
      setActing(false);
    }
  };

  // ─── Loading / Error States ───────────────────────────────────────────────
  if (loading) return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#666" }}>
        <div style={{ fontSize: "36px", marginBottom: "12px" }}>⏳</div>
        <div>Loading vendor details...</div>
      </div>
    </div>
  );

  if (!vendor) return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#c00" }}>
        <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
        <div>Vendor not found</div>
      </div>
    </div>
  );

  const isActed = vendor.status === "approved" || vendor.status === "rejected";
  const BASE_URL = "https://sves1-backend.onrender.com"; // apna backend URL

  return (
    <div style={S.page}>
      <div style={S.container}>

        {/* Back Button */}
        <button style={S.backBtn} onClick={() => navigate(-1)}>← Back to Vendors</button>

        {/* ── Profile Header ── */}
        <div style={S.card}>
          <div style={S.profileRow}>
            <div style={S.avatar}>
              {vendor.profilePhotoUrl
                ? <img src={`${BASE_URL}${vendor.profilePhotoUrl}`} alt="profile" style={S.avatarImg} />
                : (vendor.firstName?.charAt(0) || "V")
              }
            </div>
            <div>
              <div style={S.name}>{vendor.firstName} {vendor.lastName}</div>
              <div style={S.meta}>📧 {vendor.email} &nbsp;|&nbsp; 📞 {vendor.phone}</div>
              {vendor.alternatePhone && <div style={S.meta}>📞 Alt: {vendor.alternatePhone}</div>}
              <span style={S.badge(vendor.status)}>
                {vendor.status === "approved" ? "✅ Approved" : vendor.status === "rejected" ? "❌ Rejected" : "⏳ Pending Review"}
              </span>
              {vendor.status === "rejected" && vendor.rejectionReason && (
                <div style={S.rejectionBox}>
                  <b>Rejection Reason:</b> {vendor.rejectionReason}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 2-column Grid ── */}
        <div style={S.grid2}>

          {/* Company */}
          <div style={S.card}>
            <div style={S.sectionTitle}>🏢 Company Info</div>
            <Row label="Company" value={vendor.companyName} />
            <Row label="Type" value={vendor.companyType} />
            <Row label="GST" value={vendor.gstNumber} />
            <Row label="PAN" value={vendor.panNumber} />
            <Row label="Business Email" value={vendor.businessEmail} />
            <Row label="Business Phone" value={vendor.businessPhone} />
            <Row label="Website" value={vendor.website} />
            <Row label="Years in Biz" value={vendor.yearsInBusiness} />
            <Row label="Address" value={[vendor.businessStreet, vendor.businessCity, vendor.businessState, vendor.businessPincode].filter(Boolean).join(", ")} />
          </div>

          {/* Professional */}
          <div style={S.card}>
            <div style={S.sectionTitle}>💼 Professional Info</div>
            <Row label="Category" value={vendor.category} />
            <Row label="Sub-category" value={vendor.subCategory} />
            <Row label="Current Role" value={vendor.currentRole} />
            <Row label="Organization" value={vendor.currentOrg} />
            <Row label="Experience" value={vendor.experience} />
            {vendor.summary && (
              <div style={{ ...S.row, flexDirection: "column" }}>
                <span style={S.rowLabel}>Summary:</span>
                <span style={{ marginTop: "4px", lineHeight: "1.6", color: "#555" }}>{vendor.summary}</span>
              </div>
            )}
            {vendor.skills?.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <span style={S.rowLabel}>Skills:</span>
                <div style={{ marginTop: "6px" }}>
                  {vendor.skills.map((sk, i) => <span key={i} style={S.tag}>{sk}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Education */}
          <div style={S.card}>
            <div style={S.sectionTitle}>🎓 Education</div>
            {vendor.education?.length > 0
              ? vendor.education.map((e, i) => (
                  <div key={i} style={{ marginBottom: i < vendor.education.length - 1 ? "14px" : 0, paddingBottom: i < vendor.education.length - 1 ? "14px" : 0, borderBottom: i < vendor.education.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                    <Row label="Degree" value={e.degree} />
                    <Row label="Institution" value={e.institution} />
                    <Row label="Year" value={e.year} />
                    <Row label="Grade" value={e.grade} />
                  </div>
                ))
              : <span style={{ color: "#aaa", fontSize: "13px" }}>No education added</span>
            }
          </div>

          {/* Bank */}
          <div style={S.card}>
            <div style={S.sectionTitle}>🏦 Bank Details</div>
            <Row label="Holder" value={vendor.accountHolder} />
            <Row label="Account No." value={vendor.accountNumber ? "••••" + vendor.accountNumber.slice(-4) : null} />
            <Row label="IFSC" value={vendor.ifsc} />
            <Row label="Bank" value={vendor.bankName} />
            <Row label="Branch" value={vendor.branchName} />
            <Row label="Type" value={vendor.accountType} />
          </div>

        </div>

        {/* ── Address ── */}
        <div style={S.card}>
          <div style={S.sectionTitle}>📍 Personal Address</div>
          <Row label="Address" value={[vendor.street, vendor.city, vendor.state, vendor.pincode, vendor.country].filter(Boolean).join(", ")} />
          <Row label="DOB" value={vendor.dob} />
          <Row label="Gender" value={vendor.gender} />
        </div>

        {/* ── Documents ── */}
        <div style={S.card}>
          <div style={S.sectionTitle}>📄 Documents</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {vendor.resumeUrl
              ? <a href={`${BASE_URL}${vendor.resumeUrl}`} target="_blank" rel="noreferrer" style={S.docLink}>📄 View Resume</a>
              : <span style={{ fontSize: "13px", color: "#aaa" }}>No resume uploaded</span>}
            {vendor.companyLogoUrl && (
              <a href={`${BASE_URL}${vendor.companyLogoUrl}`} target="_blank" rel="noreferrer" style={S.docLink}>🖼️ Company Logo</a>
            )}
            {vendor.businessLicenseUrl && (
              <a href={`${BASE_URL}${vendor.businessLicenseUrl}`} target="_blank" rel="noreferrer" style={S.docLink}>📋 Business License</a>
            )}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div style={S.card}>
          <div style={S.sectionTitle}>⚙️ Admin Actions</div>
          {isActed ? (
            <div style={{ fontSize: "14px", color: "#555" }}>
              This vendor has already been <b style={{ color: vendor.status === "approved" ? "#057642" : "#c00" }}>{vendor.status}</b>.
              You can still change the status below.
            </div>
          ) : null}
          <div style={{ ...S.actionBar, marginTop: "12px" }}>
            <button
              style={acting ? S.disabledBtn : S.approveBtn}
              onClick={handleApprove}
              disabled={acting}
            >
              ✅ Approve Vendor
            </button>
            <button
              style={acting ? S.disabledBtn : S.rejectBtn}
              onClick={() => setShowRejectModal(true)}
              disabled={acting}
            >
              ❌ Reject Vendor
            </button>
          </div>
        </div>

      </div>

      {/* ── Reject Modal ── */}
      {showRejectModal && (
        <div style={S.overlay} onClick={() => setShowRejectModal(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalTitle}>❌ Reject Vendor</div>
            <div style={S.modalSub}>
              Please provide a reason for rejection. This will be visible to the vendor.
            </div>
            <textarea
              style={S.textarea}
              placeholder="e.g. GST number is invalid, incomplete business documents, insufficient experience..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              autoFocus
            />
            <div style={S.modalBtns}>
              <button style={S.cancelBtn} onClick={() => { setShowRejectModal(false); setRejectReason(""); }}>
                Cancel
              </button>
              <button style={S.confirmBtn} onClick={handleRejectSubmit} disabled={acting}>
                {acting ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}