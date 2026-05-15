import { validationResult } from "express-validator";
import { Invitation } from "../models/Invitation.mjs";

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

      const {
         invitationType, cardId, templateId,
         eventDate, eventLocation, eventTime, mapEmbedUrl, welcomeText,
         brideName, groomName, brideParents, groomParents,
         ceremonyType, dressCode, backgroundMusic,
         celebrantName, age,
         eventName, organizer, description,
         rsvpDeadline
      } = req.body;

      try {
         const existingCard = await Invitation.findOne({ cardId: cardId.toLowerCase() });
         if (existingCard) {
            return res.status(409).json({ success: false, message: "A card with this ID already exists." });
         }

         const commonData = {
            invitationType,
            cardId: cardId.toLowerCase(),
            templateId,
            event: {
               date: new Date(eventDate),
               location: eventLocation,
               time: eventTime || undefined,
               mapEmbedUrl: mapEmbedUrl || undefined,
            },
            content: { welcomeText: welcomeText || undefined },
            rsvp: {
               deadline: rsvpDeadline ? new Date(rsvpDeadline) : undefined,
            },
            createdBy: req.authUser._id,
         };

         let invitation;
         if (invitationType === "wedding") {
            const coverFile = req.files?.coverImage?.[0];
            const galleryFiles = req.files?.galleryImages || [];

            invitation = await Invitation.create({
               ...commonData,
               couple: { bride: brideName, groom: groomName },
               parents: {
                  brideParents: brideParents || undefined,
                  groomParents: groomParents || undefined,
               },
               coverImage: coverFile ? `/uploads/invitations/${coverFile.filename}` : undefined,
               galleryImages: galleryFiles.map((f) => `/uploads/invitations/${f.filename}`),
               ceremonyType: ceremonyType ? Number(ceremonyType) : 1,
               dressCode: dressCode ? Number(dressCode) : 1,
               backgroundMusic: backgroundMusic || undefined,
            });
         } else if (invitationType === "birthday") {
            invitation = await Invitation.create({ ...commonData, celebrantName, age });
         } else if (invitationType === "event") {
            invitation = await Invitation.create({ ...commonData, eventName, organizer, description });
         }

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
         const filter = {};
         if (req.query.type) {
            filter.invitationType = req.query.type;
         }

         const invitations = await Invitation.find(filter)
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
      const {
         templateId, eventDate, eventLocation, eventTime, mapEmbedUrl,
         welcomeText, isPublished,
         brideName, groomName, brideParents, groomParents,
         ceremonyType, dressCode, backgroundMusic,
         celebrantName, age, eventName, organizer, description,
         rsvpDeadline
      } = req.body;

      try {
         const invitation = await Invitation.findOne({ cardId: cardId.toLowerCase() });

         if (!invitation) {
            return res.status(404).json({ success: false, message: "Invitation not found." });
         }

         if (templateId) invitation.templateId = templateId;
         if (eventDate) invitation.event.date = new Date(eventDate);
         if (eventLocation) invitation.event.location = eventLocation;
         if (eventTime !== undefined) invitation.event.time = eventTime;
         if (mapEmbedUrl !== undefined) invitation.event.mapEmbedUrl = mapEmbedUrl;
         if (welcomeText !== undefined) invitation.content.welcomeText = welcomeText;
         if (isPublished !== undefined) invitation.isPublished = isPublished;
         if (rsvpDeadline !== undefined) {
            if (!invitation.rsvp) invitation.rsvp = {};
            invitation.rsvp.deadline = rsvpDeadline ? new Date(rsvpDeadline) : undefined;
         }

         if (invitation.invitationType === "wedding") {
            if (brideName) invitation.couple.bride = brideName;
            if (groomName) invitation.couple.groom = groomName;
            if (brideParents !== undefined) {
               if (!invitation.parents) invitation.parents = {};
               invitation.parents.brideParents = brideParents;
            }
            if (groomParents !== undefined) {
               if (!invitation.parents) invitation.parents = {};
               invitation.parents.groomParents = groomParents;
            }
            if (ceremonyType !== undefined) invitation.ceremonyType = Number(ceremonyType);
            if (dressCode !== undefined) invitation.dressCode = Number(dressCode);
            if (backgroundMusic !== undefined) invitation.backgroundMusic = backgroundMusic;

            // Handle file uploads
            const coverFile = req.files?.coverImage?.[0];
            if (coverFile) {
               invitation.coverImage = `/uploads/invitations/${coverFile.filename}`;
            }
            const galleryFiles = req.files?.galleryImages;
            if (galleryFiles && galleryFiles.length > 0) {
               const newPaths = galleryFiles.map((f) => `/uploads/invitations/${f.filename}`);
               invitation.galleryImages = [...(invitation.galleryImages || []), ...newPaths];
            }
         } else if (invitation.invitationType === "birthday") {
            if (celebrantName) invitation.celebrantName = celebrantName;
            if (age !== undefined) invitation.age = age;
         } else if (invitation.invitationType === "event") {
            if (eventName) invitation.eventName = eventName;
            if (organizer) invitation.organizer = organizer;
            if (description !== undefined) invitation.description = description;
         }

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

         const typeBreakdown = await Invitation.aggregate([
            { $group: { _id: "$invitationType", count: { $sum: 1 } } },
         ]);

         const recentInvitations = await Invitation.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("cardId templateId invitationType couple celebrantName eventName event.date views createdAt");

         res.status(200).json({
            success: true,
            data: {
               totalInvitations,
               publishedCount,
               draftCount: totalInvitations - publishedCount,
               totalViews: totalViews[0]?.total || 0,
               templateBreakdown,
               typeBreakdown,
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
