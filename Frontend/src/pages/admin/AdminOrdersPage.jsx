import { useState, useEffect, useMemo } from "react";
import API from "../../services/api";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineExternalLink,
} from "react-icons/hi";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.split("/api/v1")[0] || "";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Rejection modal
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("orders/admin/all");
      setOrders(data.data || []);
    } catch (err) {
      console.error("Failed to load admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApprove = async (order) => {
    if (!window.confirm(`Approve payment and activate "${order.cardId}"?`)) return;
    setActionLoading(true);
    try {
      await API.patch(`orders/admin/${order.cardId}/approve`);
      setOrders((prev) =>
        prev.map((o) => (o.cardId === order.cardId ? { ...o, status: "ACTIVE" } : o))
      );
    } catch (err) {
      console.error("Failed to approve order:", err);
      alert("Error approving order.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingOrder) return;
    setActionLoading(true);
    try {
      await API.patch(`orders/admin/${rejectingOrder.cardId}/reject`, {
        reason: rejectionReason,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.cardId === rejectingOrder.cardId
            ? { ...o, status: "REJECTED", payment: { ...o.payment, rejectionReason } }
            : o
        )
      );
      setRejectingOrder(null);
      setRejectionReason("");
    } catch (err) {
      console.error("Failed to reject order:", err);
      alert("Error rejecting order.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchSlug = o.cardId?.toLowerCase().includes(q);
        const matchUser =
          o.createdBy?.email?.toLowerCase().includes(q) ||
          o.createdBy?.username?.toLowerCase().includes(q) ||
          `${o.createdBy?.firstName} ${o.createdBy?.lastName}`.toLowerCase().includes(q);
        return matchSlug || matchUser;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <HiOutlineCheckCircle /> Active
          </span>
        );
      case "PAYMENT_UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 animate-pulse">
            <HiOutlineClock /> Review Slip
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <HiOutlineXCircle /> Rejected
          </span>
        );
      case "PENDING_PAYMENT":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <HiOutlineClock /> Unpaid
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] font-[var(--font-display)]">
            Orders & Payment Approvals
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Verify customer bank transfer receipts and activate digital invitations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by slug or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-64 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="relative">
            <HiOutlineFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Statuses ({orders.length})</option>
              <option value="PAYMENT_UNDER_REVIEW">
                Needs Review ({orders.filter((o) => o.status === "PAYMENT_UNDER_REVIEW").length})
              </option>
              <option value="PENDING_PAYMENT">Pending Payment</option>
              <option value="ACTIVE">Active & Live</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3">Card & Category</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Payment Slip</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((order) => {
              const urlPrefix = order.kind === "business-card" ? "b" : "v";
              const hasSlip = !!order.payment?.slipUrl;
              const fullSlipUrl = hasSlip ? `${API_BASE}${order.payment.slipUrl}` : null;

              return (
                <div
                  key={order._id}
                  className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 items-start md:items-center hover:bg-slate-50/70 transition-colors"
                >
                  {/* Card & Category */}
                  <div className="col-span-3">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      /{order.cardId}
                    </p>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                      {order.invitationType || "Business Card"} · {order.templateId}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="col-span-3">
                    <p className="text-sm font-semibold text-slate-800">
                      {order.createdBy?.firstName} {order.createdBy?.lastName || "—"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{order.createdBy?.email}</p>
                  </div>

                  {/* Payment Slip */}
                  <div className="col-span-2">
                    {hasSlip ? (
                      <button
                        type="button"
                        onClick={() => setSelectedSlip(fullSlipUrl)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <HiOutlineEye className="text-sm" /> View Receipt
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No slip uploaded</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    {getStatusBadge(order.status)}
                    {order.payment?.uploadedAt && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(order.payment.uploadedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2 w-full md:w-auto">
                    {order.status !== "ACTIVE" && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleApprove(order)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                        title="Approve & Activate"
                      >
                        Approve
                      </button>
                    )}

                    {order.status !== "REJECTED" && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => setRejectingOrder(order)}
                        className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="Reject Slip"
                      >
                        Reject
                      </button>
                    )}

                    <a
                      href={`/${urlPrefix}/${order.cardId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Open Link"
                    >
                      <HiOutlineExternalLink className="text-base" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-sm text-slate-500">
            No orders found matching this filter.
          </div>
        )}
      </div>

      {/* VIEW SLIP LIGHTBOX MODAL */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h4 className="text-sm font-bold text-slate-800">Customer Payment Slip Receipt</h4>
              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-50 p-2 rounded-lg">
              {selectedSlip.toLowerCase().endsWith(".pdf") ? (
                <iframe src={selectedSlip} className="w-full h-96" title="Slip PDF" />
              ) : (
                <img src={selectedSlip} alt="Bank Slip Receipt" className="max-h-[70vh] object-contain rounded" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Reject Payment Proof</h3>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide feedback for <strong>/{rejectingOrder.cardId}</strong>. The customer will be requested to upload a clear slip.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                placeholder="e.g. Receipt is blurry or transfer reference number does not match..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRejectingOrder(null)}
                  className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                >
                  {actionLoading ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
