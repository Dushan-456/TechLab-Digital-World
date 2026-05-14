import Invitation from "../models/Invitation.mjs";

class InvitationControllers {
   createInvitation = async (req, res) => {
      const { cardId, templateId, couple, event, content } = req.body;

      try {
         // Check if cardId already exists
         const existingCard = await Invitation.findOne({ cardId });
         if (existingCard) {
            return res.status(409).json({ message: "Card ID is already taken. Please choose another one." });
         }

         const newInvitation = await Invitation.create({
            cardId,
            templateId,
            couple,
            event,
            content,
         });

         res.status(201).json({
            message: "Invitation created successfully!",
            invitation: newInvitation,
         });
      } catch (error) {
         console.error("Error creating invitation:", error);
         res.status(500).json({ message: "Server error during creation" });
      }
   };

   getInvitation = async (req, res) => {
      const { cardId } = req.params;

      try {
         const invitation = await Invitation.findOne({ cardId });

         if (!invitation) {
            return res.status(404).json({ message: "Invitation not found." });
         }

         res.status(200).json({
            message: "Invitation retrieved successfully!",
            data: invitation,
         });
      } catch (error) {
         console.error("Error fetching invitation:", error);
         res.status(500).json({ message: "An unexpected error occurred." });
      }
   };
}

export default new InvitationControllers();
