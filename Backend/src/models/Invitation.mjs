import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
   {
      cardId: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      templateId: {
         type: String,
         required: true,
         enum: ['ethereal', 'lumina', 'kinetic'],
      },
      couple: {
         bride: { type: String, required: true },
         groom: { type: String, required: true },
      },
      event: {
         date: { type: String, required: true },
         location: { type: String, required: true },
      },
      content: {
         welcomeText: { type: String, required: true },
      },
   },
   { timestamps: true }
);

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
