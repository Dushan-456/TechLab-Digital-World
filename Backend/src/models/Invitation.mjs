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
         responses: [
            {
               name: { type: String, required: true, trim: true },
               email: { type: String, trim: true },
               attending: { type: String, enum: ["yes", "no"], default: "yes" },
               guestCount: { type: Number, default: 1 },
               message: { type: String, trim: true },
               submittedAt: { type: Date, default: Date.now },
            },
         ],
      },
      isPublished: {
         type: Boolean,
         default: true,
      },
      status: {
         type: String,
         enum: ["PENDING_PAYMENT", "PAYMENT_UNDER_REVIEW", "ACTIVE", "REJECTED"],
         default: "PENDING_PAYMENT",
      },
      payment: {
         slipUrl: { type: String, default: null },
         uploadedAt: { type: Date, default: null },
         bankName: { type: String, trim: true },
         referenceNumber: { type: String, trim: true },
         amount: { type: Number, default: 0 },
         verifiedAt: { type: Date, default: null },
         verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
         rejectionReason: { type: String, default: null },
      },
      price: {
         type: Number,
         default: 0,
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
      default: 1,
   },
   dressCode: {
      type: Number,
      default: 1,
   },
   receptionType: {
      type: Number,
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

// ----------------------------------------
// Discriminator: Business Event
// ----------------------------------------
const businessEventSchema = new mongoose.Schema({
   eventTitle: { type: String, required: [true, "Event title is required"], trim: true },
   tagline: { type: String, trim: true },
   organizer: { type: String, trim: true },
   agenda: [
      {
         time: { type: String, trim: true },
         session: { type: String, trim: true },
         speaker: { type: String, trim: true },
      },
   ],
   speakers: [
      {
         name: { type: String, trim: true },
         role: { type: String, trim: true },
         company: { type: String, trim: true },
         photo: { type: String },
         linkedin: { type: String },
      },
   ],
   registrationLink: { type: String, trim: true },
   ticketPrice: { type: String, trim: true },
   sponsors: [
      {
         name: { type: String, trim: true },
         logoUrl: { type: String },
      },
   ],
});

const BusinessEventInvitation = Invitation.discriminator("business-event", businessEventSchema);

export { Invitation, WeddingInvitation, BirthdayInvitation, EventInvitation, BusinessEventInvitation };
