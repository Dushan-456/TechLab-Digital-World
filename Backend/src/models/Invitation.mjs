import mongoose from "mongoose";

const baseOptions = {
   discriminatorKey: "invitationType",
   collection: "invitations",
   timestamps: true,
};

const baseInvitationSchema = new mongoose.Schema(
   {
      cardId: {
         type: String,
         required: [true, "Card ID (slug) is required"],
         unique: true,
         trim: true,
         lowercase: true,
         match: [/^[a-z0-9-]+$/, "Card ID can only contain lowercase letters, numbers, and hyphens"],
      },
      templateId: {
         type: String,
         required: [true, "Template selection is required"],
      },
      event: {
         date: {
            type: Date,
            required: [true, "Event date is required"],
         },
         time: {
            type: String,
            trim: true,
         },
         location: {
            type: String,
            required: [true, "Event location is required"],
            trim: true,
         },
         mapEmbedUrl: {
            type: String,
            trim: true,
         },
      },
      content: {
         welcomeText: {
            type: String,
            trim: true,
         },
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
      rsvp: {
         deadline: {
            type: Date,
         },
      },
      isPublished: {
         type: Boolean,
         default: true,
      },
      views: {
         type: Number,
         default: 0,
      },
   },
   baseOptions
);

baseInvitationSchema.index({ invitationType: 1 });

const Invitation = mongoose.model("Invitation", baseInvitationSchema);

// ----------------------------------------
// Discriminator: Wedding
// ----------------------------------------
const weddingSchema = new mongoose.Schema({
   couple: {
      bride: { type: String, required: [true, "Bride name is required"], trim: true },
      groom: { type: String, required: [true, "Groom name is required"], trim: true },
   },
   parents: {
      brideParents: { type: String, trim: true },
      groomParents: { type: String, trim: true },
   },
   coverImage: { type: String },
   galleryImages: [{ type: String }],
   ceremonyType: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
   },
   dressCode: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
   },
   backgroundMusic: { type: String, trim: true },
});

const WeddingInvitation = Invitation.discriminator("wedding", weddingSchema);

// ----------------------------------------
// Discriminator: Birthday
// ----------------------------------------
const birthdaySchema = new mongoose.Schema({
   celebrantName: { type: String, required: [true, "Celebrant name is required"], trim: true },
   age: { type: Number, required: false },
});

const BirthdayInvitation = Invitation.discriminator("birthday", birthdaySchema);

// ----------------------------------------
// Discriminator: Event
// ----------------------------------------
const eventSchema = new mongoose.Schema({
   eventName: { type: String, required: [true, "Event name is required"], trim: true },
   organizer: { type: String, required: false, trim: true },
   description: { type: String, required: false, trim: true },
});

const EventInvitation = Invitation.discriminator("event", eventSchema);

export { Invitation, WeddingInvitation, BirthdayInvitation, EventInvitation };
