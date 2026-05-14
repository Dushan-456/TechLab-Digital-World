import { validationResult } from "express-validator";
import Invitation from "../models/Invitation.mjs";

// Helper to format validation errors
const errorCreate = (errors) => {
   return errors.map((e) => ({ field: e.path, message: e.msg }));
};

class InvitationControllers {
   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Create a new invitation card
 * @route          POST /api/v1/invitations
 * @access         Authenticated
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   createInvitation = async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({
            msg: "Validation error",
            error: errorCreate(errors.array()),
            data: null,
         });
      }

      const { cardId, templateId, brideName, groomName, eventDate, eventLocation, welcomeText } = req.body;

      try {
         // Check if cardId already exists
         const existingCard = await Invitation.findOne({ cardId: cardId.toLowerCase() });
         if (existingCard) {
            return res.status(409).json({
               success: false,
               message: "A card with this ID already exists. Please choose a different slug.",
            });
         }

         const invitation = await Invitation.create({
            cardId: cardId.toLowerCase(),
            templateId,
            couple: {
               bride: brideName,
               groom: groomName,
            },
            event: {
               date: new Date(eventDate),
               location: eventLocation,
            },
            content: {
               welcomeText: welcomeText || undefined,
            },
            createdBy: req.authUser._id,
         });

         res.status(201).json({
            success: true,
            message: "Invitation created successfully!",
            data: invitation,
            viewUrl: `/v/${invitation.cardId}`,
         });
      } catch (error) {
         console.error("Error creating invitation:", error);

         if (error.code === 11000) {
            return res.status(409).json({
               success: false,
               message: "A card with this ID already exists.",
            });
         }

         res.status(500).json({
            success: false,
            message: "Server error during invitation creation.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Get invitation card by cardId (public view)
 * @route          GET /api/v1/invitations/:cardId
 * @access         Public
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   getInvitationByCardId = async (req, res) => {
      const { cardId } = req.params;

      try {
         const invitation = await Invitation.findOne({ cardId: cardId.toLowerCase() });

         if (!invitation) {
            return res.status(404).json({
               success: false,
               message: "Invitation not found.",
            });
         }

         if (!invitation.isPublished) {
            return res.status(404).json({
               success: false,
               message: "This invitation is not currently available.",
            });
         }

         // Increment view count
         invitation.views += 1;
         await invitation.save();

         res.status(200).json({
            success: true,
            data: invitation,
         });
      } catch (error) {
         console.error("Error fetching invitation:", error);
         res.status(500).json({
            success: false,
            message: "Server error fetching invitation.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Get all invitations (admin list)
 * @route          GET /api/v1/invitations
 * @access         Authenticated
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   getAllInvitations = async (req, res) => {
      try {
         const invitations = await Invitation.find()
            .populate("createdBy", "firstName lastName email")
            .sort({ createdAt: -1 });

         res.status(200).json({
            success: true,
            count: invitations.length,
            data: invitations,
         });
      } catch (error) {
         console.error("Error fetching invitations:", error);
         res.status(500).json({
            success: false,
            message: "Server error fetching invitations.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Update an invitation
 * @route          PATCH /api/v1/invitations/:cardId
 * @access         Authenticated
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   updateInvitation = async (req, res) => {
      const { cardId } = req.params;
      const { templateId, brideName, groomName, eventDate, eventLocation, welcomeText, isPublished } = req.body;

      try {
         const invitation = await Invitation.findOne({ cardId: cardId.toLowerCase() });

         if (!invitation) {
            return res.status(404).json({
               success: false,
               message: "Invitation not found.",
            });
         }

         // Update fields if provided
         if (templateId) invitation.templateId = templateId;
         if (brideName) invitation.couple.bride = brideName;
         if (groomName) invitation.couple.groom = groomName;
         if (eventDate) invitation.event.date = new Date(eventDate);
         if (eventLocation) invitation.event.location = eventLocation;
         if (welcomeText !== undefined) invitation.content.welcomeText = welcomeText;
         if (isPublished !== undefined) invitation.isPublished = isPublished;

         await invitation.save();

         res.status(200).json({
            success: true,
            message: "Invitation updated successfully!",
            data: invitation,
         });
      } catch (error) {
         console.error("Error updating invitation:", error);
         res.status(500).json({
            success: false,
            message: "Server error updating invitation.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Delete an invitation
 * @route          DELETE /api/v1/invitations/:cardId
 * @access         Admin
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   deleteInvitation = async (req, res) => {
      const { cardId } = req.params;

      try {
         const invitation = await Invitation.findOneAndDelete({ cardId: cardId.toLowerCase() });

         if (!invitation) {
            return res.status(404).json({
               success: false,
               message: "Invitation not found.",
            });
         }

         res.status(200).json({
            success: true,
            message: "Invitation deleted successfully.",
         });
      } catch (error) {
         console.error("Error deleting invitation:", error);
         res.status(500).json({
            success: false,
            message: "Server error deleting invitation.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Get dashboard stats
 * @route          GET /api/v1/invitations/stats/overview
 * @access         Authenticated
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   getDashboardStats = async (req, res) => {
      try {
         const totalInvitations = await Invitation.countDocuments();
         const publishedCount = await Invitation.countDocuments({ isPublished: true });
         const totalViews = await Invitation.aggregate([
            { $group: { _id: null, total: { $sum: "$views" } } },
         ]);

         const templateBreakdown = await Invitation.aggregate([
            { $group: { _id: "$templateId", count: { $sum: 1 } } },
         ]);

         const recentInvitations = await Invitation.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("cardId templateId couple event.date views createdAt");

         res.status(200).json({
            success: true,
            data: {
               totalInvitations,
               publishedCount,
               draftCount: totalInvitations - publishedCount,
               totalViews: totalViews[0]?.total || 0,
               templateBreakdown,
               recentInvitations,
            },
         });
      } catch (error) {
         console.error("Error fetching stats:", error);
         res.status(500).json({
            success: false,
            message: "Server error fetching stats.",
         });
      }
   };
}

export default new InvitationControllers();
