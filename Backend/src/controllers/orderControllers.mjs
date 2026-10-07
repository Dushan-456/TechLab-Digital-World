import { Invitation } from "../models/Invitation.mjs";
import { BusinessCard } from "../models/BusinessCard.mjs";
import { deleteUploadedFile } from "../utils/fileUtils.mjs";

class OrderControllers {
   /**
    * @description Get all orders/cards created by the logged-in customer
    * @route       GET /api/v1/orders/my-orders
    * @access      Authenticated
    */
   getMyOrders = async (req, res) => {
      try {
         const userId = req.authUser._id;

         const [invitations, businessCards] = await Promise.all([
            Invitation.find({ createdBy: userId }).sort({ createdAt: -1 }),
            BusinessCard.find({ createdBy: userId }).sort({ createdAt: -1 }),
         ]);

         res.status(200).json({
            success: true,
            data: {
               invitations,
               businessCards,
               totalCount: invitations.length + businessCards.length,
            },
         });
      } catch (error) {
         console.error("Error fetching my orders:", error);
         res.status(500).json({ success: false, message: "Failed to fetch orders." });
      }
   };

   /**
    * @description Customer uploads bank transfer payment slip for an invitation or card
    * @route       POST /api/v1/orders/:cardId/upload-slip
    * @access      Authenticated
    */
   uploadPaymentSlip = async (req, res) => {
      const { cardId } = req.params;
      const { bankName, referenceNumber } = req.body;

      if (!req.file) {
         return res.status(400).json({ success: false, message: "Payment slip file is required." });
      }

      try {
         const cleanId = cardId.toLowerCase();
         let card = await Invitation.findOne({ cardId: cleanId });
         let isInvitation = true;

         if (!card) {
            card = await BusinessCard.findOne({ cardId: cleanId });
            isInvitation = false;
         }

         if (!card) {
            return res.status(404).json({ success: false, message: "Card or Invitation not found." });
         }

         // Ownership verification (creator or admin)
         const isOwner = card.createdBy && card.createdBy.toString() === req.authUser._id.toString();
         const isAdmin = req.authUser.role === "ADMIN";
         if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: "Not authorized to upload slip for this card." });
         }

         // If previous slip exists, delete old file
         if (card.payment?.slipUrl) {
            deleteUploadedFile(card.payment.slipUrl);
         }

         if (!card.payment) card.payment = {};
         card.payment.slipUrl = `/uploads/payment_slips/${req.file.filename}`;
         card.payment.uploadedAt = new Date();
         if (bankName) card.payment.bankName = bankName.trim();
         if (referenceNumber) card.payment.referenceNumber = referenceNumber.trim();
         card.payment.rejectionReason = null;
         card.status = "PAYMENT_UNDER_REVIEW";

         await card.save();

         res.status(200).json({
            success: true,
            message: "Payment slip submitted successfully! Our team will verify it shortly.",
            data: {
               cardId: card.cardId,
               status: card.status,
               slipUrl: card.payment.slipUrl,
               uploadedAt: card.payment.uploadedAt,
            },
         });
      } catch (error) {
         console.error("Error uploading payment slip:", error);
         res.status(500).json({ success: false, message: "Failed to submit payment slip." });
      }
   };

   /**
    * @description Admin: Get all orders across invitations and business cards
    * @route       GET /api/v1/orders/admin/all
    * @access      Admin
    */
   getAllOrdersForAdmin = async (req, res) => {
      try {
         const { status } = req.query;
         const filter = {};
         if (status && status !== "ALL") {
            filter.status = status;
         }

         const [invitations, businessCards] = await Promise.all([
            Invitation.find(filter)
               .populate("createdBy", "firstName lastName email username")
               .sort({ createdAt: -1 }),
            BusinessCard.find(filter)
               .populate("createdBy", "firstName lastName email username")
               .sort({ createdAt: -1 }),
         ]);

         // Format into uniform order list
         const formattedInvitations = invitations.map((inv) => ({
            ...inv.toObject(),
            kind: "invitation",
         }));

         const formattedBusinessCards = businessCards.map((bc) => ({
            ...bc.toObject(),
            kind: "business-card",
         }));

         const allOrders = [...formattedInvitations, ...formattedBusinessCards].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
         );

         res.status(200).json({
            success: true,
            count: allOrders.length,
            data: allOrders,
         });
      } catch (error) {
         console.error("Error fetching all orders for admin:", error);
         res.status(500).json({ success: false, message: "Failed to fetch orders." });
      }
   };

   /**
    * @description Admin: Approve payment slip and activate card
    * @route       PATCH /api/v1/orders/admin/:cardId/approve
    * @access      Admin
    */
   approveOrder = async (req, res) => {
      const { cardId } = req.params;

      try {
         const cleanId = cardId.toLowerCase();
         let card = await Invitation.findOne({ cardId: cleanId });

         if (!card) {
            card = await BusinessCard.findOne({ cardId: cleanId });
         }

         if (!card) {
            return res.status(404).json({ success: false, message: "Order not found." });
         }

         card.status = "ACTIVE";
         card.isPublished = true;
         if (!card.payment) card.payment = {};
         card.payment.verifiedAt = new Date();
         card.payment.verifiedBy = req.authUser._id;
         card.payment.rejectionReason = null;

         await card.save();

         res.status(200).json({
            success: true,
            message: `Order for "${card.cardId}" approved and activated!`,
            data: card,
         });
      } catch (error) {
         console.error("Error approving order:", error);
         res.status(500).json({ success: false, message: "Failed to approve order." });
      }
   };

   /**
    * @description Admin: Reject payment slip with a reason
    * @route       PATCH /api/v1/orders/admin/:cardId/reject
    * @access      Admin
    */
   rejectOrder = async (req, res) => {
      const { cardId } = req.params;
      const { reason } = req.body;

      try {
         const cleanId = cardId.toLowerCase();
         let card = await Invitation.findOne({ cardId: cleanId });

         if (!card) {
            card = await BusinessCard.findOne({ cardId: cleanId });
         }

         if (!card) {
            return res.status(404).json({ success: false, message: "Order not found." });
         }

         card.status = "REJECTED";
         if (!card.payment) card.payment = {};
         card.payment.rejectionReason = reason?.trim() || "Payment slip could not be verified. Please upload a clear receipt.";

         await card.save();

         res.status(200).json({
            success: true,
            message: `Order for "${card.cardId}" has been marked as rejected.`,
            data: card,
         });
      } catch (error) {
         console.error("Error rejecting order:", error);
         res.status(500).json({ success: false, message: "Failed to reject order." });
      }
   };
}

export default new OrderControllers();
