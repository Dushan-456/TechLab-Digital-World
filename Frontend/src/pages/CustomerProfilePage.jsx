import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  HiOutlineCreditCard,
  HiOutlineUpload,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineClipboardCopy,
  HiOutlineUsers,
  HiOutlineSparkles,
  HiOutlinePlusCircle,
  HiOutlineX,
  HiOutlineLogout,
} from "react-icons/hi";

const CustomerProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("cards"); // 'cards' | 'rsvps' | 'bank'
  const [orders, setOrders] = useState({ invitations: [], businessCards: [] });
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // Slip upload modal state
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [selectedCardForSlip, setSelectedCardForSlip] = useState(null);
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [slipBankName, setSlipBankName] = useState("");
  const [slipRefNumber, setSlipRefNumber] = useState("");
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [slipError, setSlipError] = useState("");
  const [slipSuccess, setSlipSuccess] = useState(false);

  // RSVP Viewer state
  const [selectedRsvpCardId, setSelectedRsvpCardId] = useState(null);
  const [rsvpData, setRsvpData] = useState(null);
  const [loadingRsvps, setLoadingRsvps] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("orders/my-orders");
      setOrders(data.data || { invitations: [], businessCards: [] });
      if (data.data?.invitations?.length > 0 && !selectedRsvpCardId) {
        setSelectedRsvpCardId(data.data.invitations[0].cardId);
      }
    } catch (err) {
      console.error("Failed to load customer orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch RSVPs when selected card changes
  useEffect(() => {
    if (!selectedRsvpCardId) return;
    const fetchCardRsvps = async () => {
      setLoadingRsvps(true);
      try {
        const { data } = await API.get(`invitations/${selectedRsvpCardId}/rsvps`);
        setRsvpData(data);
      } catch (err) {
        console.error("Error loading RSVPs:", err);
      } finally {
        setLoadingRsvps(false);
      }
    };
    fetchCardRsvps();
  }, [selectedRsvpCardId]);

  const copyLink = (cardId, type = "invitation") => {
    const prefix = type === "business-card" ? "b" : "v";
    const url = `${window.location.origin}/${prefix}/${cardId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(cardId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openSlipModal = (card) => {
    setSelectedCardForSlip(card);
    setSlipFile(null);
    setSlipPreview(null);
    setSlipBankName(card.payment?.bankName || "");
    setSlipRefNumber(card.payment?.referenceNumber || "");
    setSlipError("");
    setSlipSuccess(false);
    setSlipModalOpen(true);
  };

  const handleSlipFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSlipError("File size exceeds 5MB limit.");
      return;
    }
    setSlipFile(file);
    setSlipError("");
    if (file.type.startsWith("image/")) {
      setSlipPreview(URL.createObjectURL(file));
    } else {
      setSlipPreview(null);
    }
  };

  const handleSlipSubmit = async (e) => {
    e.preventDefault();
    if (!slipFile) {
      setSlipError("Please choose a payment slip file.");
      return;
    }
    setUploadingSlip(true);
    setSlipError("");

    const formData = new FormData();
    formData.append("slip", slipFile);
    if (slipBankName) formData.append("bankName", slipBankName);
    if (slipRefNumber) formData.append("referenceNumber", slipRefNumber);

    try {
      await API.post(`orders/${selectedCardForSlip.cardId}/upload-slip`, formData);
      setSlipSuccess(true);
      fetchOrders();
      setTimeout(() => {
        setSlipModalOpen(false);
      }, 1800);
    } catch (err) {
      console.error("Slip upload error:", err);
      setSlipError(err.response?.data?.message || "Failed to upload payment slip.");
    } finally {
      setUploadingSlip(false);
    }
  };

  const allItems = [
    ...(orders.invitations || []).map((i) => ({ ...i, kind: "invitation" })),
    ...(orders.businessCards || []).map((b) => ({ ...b, kind: "business-card" })),
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <HiOutlineCheckCircle className="text-sm" /> Active & Live
          </span>
        );
      case "PAYMENT_UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <HiOutlineClock className="text-sm" /> Under Verification
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <HiOutlineXCircle className="text-sm" /> Slip Rejected
          </span>
        );
      case "PENDING_PAYMENT":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <HiOutlineClock className="text-sm" /> Pending Payment
          </span>
        );
    }
  };

  const getCardTitle = (item) => {
    if (item.kind === "business-card") return item.personalInfo?.fullName || "Digital Business Card";
    if (item.invitationType === "wedding") return `${item.couple?.bride} & ${item.couple?.groom}`;
    if (item.invitationType === "birthday") return `${item.celebrantName}'s Birthday`;
    if (item.invitationType === "business-event") return item.eventTitle || "Business Event";
    return item.eventName || "Event Invitation";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-20">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-[var(--color-text)] font-[var(--font-display)]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white">
              <HiOutlineSparkles />
            </div>
            TechLab Digital
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/order/create"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all"
            >
              <HiOutlinePlusCircle className="text-base" /> New Order
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="px-3.5 py-1.5 border border-[var(--color-border)] text-[var(--color-primary)] text-xs font-semibold rounded-lg hover:bg-[var(--color-surface-50)]"
              >
                Admin Panel
              </Link>
            )}
            <button
              type="button"
              onClick={logout}
              className="p-2 text-[var(--color-text-muted)] hover:text-red-600 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <HiOutlineLogout className="text-lg" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-bold font-[var(--font-display)]">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-[var(--font-display)]">
                Welcome back, {user?.firstName} {user?.lastName}!
              </h1>
              <p className="text-sm text-slate-300 mt-0.5">
                Manage your digital invitations, payment slips, and guest RSVP responses.
              </p>
            </div>
          </div>

          <Link
            to="/order/create"
            className="sm:hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-xs font-semibold rounded-lg shadow-md"
          >
            <HiOutlinePlusCircle className="text-base" /> Create New Invite
          </Link>
        </div>
      </div>

      {/* Main Tabs Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--color-border)] gap-8 mb-6 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("cards")}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === "cards"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] font-bold"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            My Invitations & Cards ({allItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rsvps")}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === "rsvps"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] font-bold"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            RSVP Responses
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bank")}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === "bank"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] font-bold"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Bank Transfer Details
          </button>
        </div>

        {/* TAB 1: CARDS & INVITATIONS */}
        {activeTab === "cards" && (
          <div className="space-y-4">
            {allItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {allItems.map((item) => {
                  const urlPrefix = item.kind === "business-card" ? "b" : "v";
                  const publicUrl = `${window.location.origin}/${urlPrefix}/${item.cardId}`;
                  const isPendingOrRejected = item.status === "PENDING_PAYMENT" || item.status === "REJECTED";

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded">
                              {item.invitationType || "Business Card"}
                            </span>
                            <h3 className="text-base font-bold text-[var(--color-text)] mt-1.5 font-[var(--font-display)] truncate">
                              {getCardTitle(item)}
                            </h3>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>

                        <p className="text-xs text-[var(--color-text-muted)]">
                          Link slug: <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">/{item.cardId}</code>
                        </p>

                        {/* Rejection notice if any */}
                        {item.status === "REJECTED" && item.payment?.rejectionReason && (
                          <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            <strong>Feedback:</strong> {item.payment.rejectionReason}
                          </div>
                        )}

                        {/* Under Review notice */}
                        {item.status === "PAYMENT_UNDER_REVIEW" && (
                          <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                            Bank slip submitted on {new Date(item.payment?.uploadedAt).toLocaleDateString()}. Pending admin review.
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="pt-4 border-t border-[var(--color-border)] space-y-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => copyLink(item.cardId, item.kind)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-[var(--color-border)] text-xs font-semibold rounded-lg hover:bg-[var(--color-surface-50)] text-[var(--color-text)] transition-colors"
                          >
                            <HiOutlineClipboardCopy className="text-sm" />
                            {copiedId === item.cardId ? "Copied!" : "Copy URL"}
                          </button>
                          <a
                            href={publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-9 h-9 flex items-center justify-center border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-50)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                            title="Preview Link"
                          >
                            <HiOutlineEye className="text-base" />
                          </a>
                        </div>

                        {/* Payment Slip Button */}
                        {isPendingOrRejected && (
                          <button
                            type="button"
                            onClick={() => openSlipModal(item)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:shadow-md transition-all cursor-pointer"
                          >
                            <HiOutlineUpload className="text-sm" />
                            Upload Bank Slip
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-[var(--color-border)] p-8">
                <HiOutlineCreditCard className="mx-auto text-5xl text-[var(--color-text-light)] mb-3" />
                <h3 className="text-lg font-bold text-[var(--color-text)]">No orders yet</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
                  Browse our designs and create your wedding invitation, birthday invite, or digital business card in minutes.
                </p>
                <Link
                  to="/order/create"
                  className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-xs font-bold rounded-lg shadow-md"
                >
                  Create Your First Card
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RSVP RESPONSES */}
        {activeTab === "rsvps" && (
          <div className="space-y-6">
            {/* Card selector */}
            <div className="bg-white p-4 rounded-xl border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">Select Invitation</h3>
                <p className="text-xs text-[var(--color-text-muted)]">View attendee confirmations for each event</p>
              </div>
              <select
                value={selectedRsvpCardId || ""}
                onChange={(e) => setSelectedRsvpCardId(e.target.value)}
                className="py-2 px-3 border border-[var(--color-border)] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              >
                {(orders.invitations || []).map((inv) => (
                  <option key={inv.cardId} value={inv.cardId}>
                    {getCardTitle(inv)} (/{inv.cardId})
                  </option>
                ))}
              </select>
            </div>

            {loadingRsvps ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : rsvpData ? (
              <div className="space-y-5">
                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-muted)] font-medium">Total Responses</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                      {rsvpData.responses?.length || 0}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[var(--color-border)]">
                    <p className="text-xs text-emerald-600 font-medium">Attending</p>
                    <p className="text-2xl font-bold text-emerald-700 mt-1">
                      {rsvpData.responses?.filter((r) => r.attending === "yes").length || 0}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[var(--color-border)]">
                    <p className="text-xs text-red-600 font-medium">Declined</p>
                    <p className="text-2xl font-bold text-red-700 mt-1">
                      {rsvpData.responses?.filter((r) => r.attending === "no").length || 0}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[var(--color-border)]">
                    <p className="text-xs text-indigo-600 font-medium">Total Guests Expected</p>
                    <p className="text-2xl font-bold text-indigo-700 mt-1">
                      {rsvpData.responses?.reduce(
                        (acc, curr) => (curr.attending === "yes" ? acc + (Number(curr.guestCount) || 1) : acc),
                        0
                      ) || 0}
                    </p>
                  </div>
                </div>

                {/* RSVP List Table */}
                <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm">
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-[var(--color-surface-50)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    <div className="col-span-3">Guest Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Attendance</div>
                    <div className="col-span-1">Count</div>
                    <div className="col-span-3">Message</div>
                  </div>

                  {rsvpData.responses?.length > 0 ? (
                    <div className="divide-y divide-[var(--color-border)]">
                      {rsvpData.responses.map((resp, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3.5 items-start sm:items-center text-sm hover:bg-[var(--color-surface-50)]"
                        >
                          <div className="col-span-3 font-semibold text-[var(--color-text)]">
                            {resp.name}
                          </div>
                          <div className="col-span-3 text-xs text-[var(--color-text-muted)] truncate">
                            {resp.email || "—"}
                          </div>
                          <div className="col-span-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                resp.attending === "yes"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {resp.attending === "yes" ? "Attending" : "Declined"}
                            </span>
                          </div>
                          <div className="col-span-1 text-xs text-slate-700">
                            {resp.guestCount || 1}
                          </div>
                          <div className="col-span-3 text-xs text-slate-500 italic truncate">
                            {resp.message || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-sm text-[var(--color-text-muted)]">
                      No RSVP responses recorded yet for this invitation.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-sm text-[var(--color-text-muted)]">
                Please select an invitation to view its RSVPs.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BANK TRANSFER DETAILS */}
        {activeTab === "bank" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl">
                  🏦
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text)] font-[var(--font-display)]">
                    Direct Bank Transfer Information
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Transfer the invitation fee and upload your payment slip in your profile to activate your link.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 text-sm">
                <div className="flex justify-between p-4">
                  <span className="text-slate-500">Bank Name</span>
                  <span className="font-semibold text-slate-900">Commercial Bank of Ceylon</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-slate-500">Account Name</span>
                  <span className="font-semibold text-slate-900">TechLab Digital World (Pvt) Ltd</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-slate-500">Account Number</span>
                  <span className="font-mono font-bold text-indigo-700 text-base">8002 9182 3401</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-slate-500">Branch & Code</span>
                  <span className="font-semibold text-slate-900">Colombo City Branch (045)</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-slate-500">Swift Code (International)</span>
                  <span className="font-mono font-semibold text-slate-900">CCEYLKX</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
                <p className="font-bold">⚠️ Important Payment Instructions:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Please include your <strong>Card Slug (e.g. /dushan-and-nisha)</strong> or your <strong>Username</strong> in the transfer remarks/reference.</li>
                  <li>Take a clear screenshot or photograph of your transfer slip / receipt.</li>
                  <li>Click <strong>"Upload Bank Slip"</strong> on your invitation card in this profile.</li>
                  <li>Our administrators will review your receipt and activate your invitation within 1-2 hours.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* UPLOAD PAYMENT SLIP MODAL */}
      {slipModalOpen && selectedCardForSlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Bank Transfer Slip</h3>
                <p className="text-xs text-slate-500">For card: /{selectedCardForSlip.cardId}</p>
              </div>
              <button
                type="button"
                onClick={() => setSlipModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>

            {slipSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">
                  <HiOutlineCheckCircle />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Payment Slip Uploaded!</h4>
                <p className="text-xs text-slate-500">
                  Your slip has been submitted for review. Our team will verify and activate your card shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSlipSubmit} className="space-y-4">
                {slipError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {slipError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Bank Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={slipBankName}
                    onChange={(e) => setSlipBankName(e.target.value)}
                    placeholder="e.g. Commercial Bank, HNB, Sampath"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reference / Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={slipRefNumber}
                    onChange={(e) => setSlipRefNumber(e.target.value)}
                    placeholder="e.g. TXN91823901"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Slip File (JPG, PNG, PDF max 5MB) *
                  </label>
                  <input
                    type="file"
                    required
                    accept="image/*,application/pdf"
                    onChange={handleSlipFileChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>

                {slipPreview && (
                  <div className="mt-2 text-center border rounded-lg p-2 bg-slate-50">
                    <img
                      src={slipPreview}
                      alt="Slip preview"
                      className="max-h-48 mx-auto object-contain rounded"
                    />
                  </div>
                )}

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSlipModalOpen(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingSlip}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {uploadingSlip ? "Submitting..." : "Submit Receipt"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfilePage;
