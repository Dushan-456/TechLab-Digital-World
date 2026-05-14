import { validationResult } from "express-validator";
import { BusinessCard } from "../models/BusinessCard.mjs";

const errorCreate = (errors) => errors.map((e) => ({ field: e.path, message: e.msg }));

class BusinessCardControllers {
   createCard = async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ msg: "Validation error", error: errorCreate(errors.array()) });
      }

      const { cardId, templateId, personalInfo, contactInfo, socialLinks } = req.body;

      try {
         const existingCard = await BusinessCard.findOne({ cardId: cardId.toLowerCase() });
         if (existingCard) {
            return res.status(409).json({ success: false, message: "A card with this ID already exists." });
         }

         const newCard = await BusinessCard.create({
            cardId: cardId.toLowerCase(),
            templateId,
            personalInfo,
            contactInfo,
            socialLinks,
            createdBy: req.authUser._id,
         });

         res.status(201).json({ success: true, message: "Business Card created successfully!", data: newCard });
      } catch (error) {
         console.error("Error creating business card:", error);
         res.status(500).json({ success: false, message: "Server error during creation." });
      }
   };

   getAllCards = async (req, res) => {
      try {
         const cards = await BusinessCard.find()
            .populate("createdBy", "firstName lastName email")
            .sort({ createdAt: -1 });

         res.status(200).json({ success: true, count: cards.length, data: cards });
      } catch (error) {
         console.error("Error fetching business cards:", error);
         res.status(500).json({ success: false, message: "Server error fetching cards." });
      }
   };

   getCardByCardId = async (req, res) => {
      const { cardId } = req.params;

      try {
         const card = await BusinessCard.findOne({ cardId: cardId.toLowerCase() });

         if (!card) {
            return res.status(404).json({ success: false, message: "Business card not found." });
         }

         if (!card.isPublished) {
            return res.status(404).json({ success: false, message: "This card is not currently available." });
         }

         card.views += 1;
         await card.save();

         res.status(200).json({ success: true, data: card });
      } catch (error) {
         console.error("Error fetching business card:", error);
         res.status(500).json({ success: false, message: "Server error fetching card." });
      }
   };

   updateCard = async (req, res) => {
      const { cardId } = req.params;
      const { templateId, personalInfo, contactInfo, socialLinks, isPublished } = req.body;

      try {
         const card = await BusinessCard.findOne({ cardId: cardId.toLowerCase() });

         if (!card) {
            return res.status(404).json({ success: false, message: "Business card not found." });
         }

         if (templateId) card.templateId = templateId;
         if (personalInfo) card.personalInfo = { ...card.personalInfo, ...personalInfo };
         if (contactInfo) card.contactInfo = { ...card.contactInfo, ...contactInfo };
         if (socialLinks) card.socialLinks = { ...card.socialLinks, ...socialLinks };
         if (isPublished !== undefined) card.isPublished = isPublished;

         await card.save();

         res.status(200).json({ success: true, message: "Business Card updated successfully!", data: card });
      } catch (error) {
         console.error("Error updating business card:", error);
         res.status(500).json({ success: false, message: "Server error updating card." });
      }
   };

   deleteCard = async (req, res) => {
      const { cardId } = req.params;

      try {
         const card = await BusinessCard.findOneAndDelete({ cardId: cardId.toLowerCase() });

         if (!card) {
            return res.status(404).json({ success: false, message: "Business card not found." });
         }

         res.status(200).json({ success: true, message: "Business Card deleted successfully." });
      } catch (error) {
         console.error("Error deleting business card:", error);
         res.status(500).json({ success: false, message: "Server error deleting card." });
      }
   };
}

export default new BusinessCardControllers();
