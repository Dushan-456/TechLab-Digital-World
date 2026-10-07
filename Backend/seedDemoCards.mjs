import mongoose from "mongoose";
import dotenv from "dotenv";
import { BirthdayInvitation, EventInvitation, BusinessEventInvitation } from "./src/models/Invitation.mjs";
import BusinessCard from "./src/models/BusinessCard.mjs";
import User from "./src/models/User.mjs";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/digital-wedding");
    console.log("Connected to MongoDB for demo seeding...");

    const admin = await User.findOne({ role: "ADMIN" });
    if (!admin) {
      console.log("No admin found. Aborting.");
      process.exit(1);
    }

    // 1. Birthday Demo Card
    await BirthdayInvitation.deleteOne({ cardId: "alex-bash-25" });
    await BirthdayInvitation.create({
      cardId: "alex-bash-25",
      templateId: "neon-bash",
      invitationType: "birthday",
      celebrantName: "Alex Vance",
      age: 25,
      event: {
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: "19:30",
        location: "Club SkyLine, Rooftop Lounge, Colombo",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7885!2d79.85!3d6.92",
      },
      content: {
        welcomeText: "Get ready for the ultimate neon party of the year!",
        description: "Join Alex for great music, cocktails, and epic memories on the rooftop terrace.",
      },
      rsvp: {
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      createdBy: admin._id,
      isPublished: true,
      status: "ACTIVE",
      price: 3500,
    });
    console.log("Seeded Birthday Demo: /v/alex-bash-25");

    // 2. Business Event Demo Card
    await BusinessEventInvitation.deleteOne({ cardId: "techlab-summit-2026" });
    await BusinessEventInvitation.create({
      cardId: "techlab-summit-2026",
      templateId: "summit-pro",
      invitationType: "business-event",
      eventTitle: "TechLab Digital Innovation Summit 2026",
      tagline: "Shaping the Future of Autonomous AI & Cloud Architectures",
      organizer: "TechLab Digital World",
      description: "A premier executive conference uniting engineers, CTOs, and tech founders for high-impact keynotes and visionary panels.",
      ticketPrice: "Rs. 5,000 / Delegate",
      event: {
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        time: "09:00 AM",
        location: "Shangri-La Ballroom, Colombo",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7885!2d79.845!3d6.93",
      },
      agenda: [
        { time: "09:00 AM", session: "Registration & VIP Breakfast Networking", speaker: "TechLab Team" },
        { time: "10:30 AM", session: "Keynote: Next-Gen Agentic Software Engineering", speaker: "Dr. Elena Rostova" },
        { time: "01:00 PM", session: "Networking Luncheon & Partner Showcase", speaker: "All Attendees" },
        { time: "02:30 PM", session: "Panel: Scaling Enterprise Systems with AI", speaker: "Marcus Vance & Aria Chen" },
        { time: "04:30 PM", session: "Cocktails & Awards Ceremony", speaker: "TechLab Digital" },
      ],
      speakers: [
        { name: "Dr. Elena Rostova", role: "VP of Artificial Intelligence", company: "Aether Dynamics" },
        { name: "Marcus Vance", role: "Chief Product Officer", company: "GlobalScale Inc." },
        { name: "Aria Chen", role: "Head of Cloud Architecture", company: "NextGen Labs" },
      ],
      rsvp: {
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
      createdBy: admin._id,
      isPublished: true,
      status: "ACTIVE",
      price: 5000,
    });
    console.log("Seeded Business Summit Demo: /v/techlab-summit-2026");

    // 3. Social Event Demo Card
    await EventInvitation.deleteOne({ cardId: "annual-gala-2026" });
    await EventInvitation.create({
      cardId: "annual-gala-2026",
      templateId: "corporate",
      invitationType: "event",
      eventName: "Founders Gala & Charity Ball 2026",
      organizer: "TechLab Foundation",
      description: "An unforgettable evening of fine dining, classical symphony, and honors celebration supporting our STEM scholarships.",
      event: {
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        time: "18:00",
        location: "Grand Ballroom, Cinnamon Grand Colombo",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7885!2d79.85!3d6.918",
      },
      content: {
        welcomeText: "Cordially invites you and your guests to an evening of celebration",
      },
      rsvp: {
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      },
      createdBy: admin._id,
      isPublished: true,
      status: "ACTIVE",
      price: 3500,
    });
    console.log("Seeded Social Gala Demo: /v/annual-gala-2026");

    // 4. Digital Business Card Demo
    await BusinessCard.deleteOne({ cardId: "dushan-senarath" });
    await BusinessCard.create({
      cardId: "dushan-senarath",
      templateId: "modern",
      personalInfo: {
        fullName: "Dushan Senarath",
        jobTitle: "Founder & Chief Technology Officer",
        company: "TechLab Digital World",
        bio: "Specializing in next-generation web architectures, cloud innovations, and interactive digital event experiences.",
      },
      contactInfo: {
        email: "dushan@techlabdigital.com",
        phone: "+94 77 123 4567",
        website: "https://techlabdigital.com",
        address: "Colombo, Sri Lanka",
      },
      socialLinks: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        github: "https://github.com",
      },
      createdBy: admin._id,
      isPublished: true,
      status: "ACTIVE",
      price: 2500,
    });
    console.log("Seeded Business Card Demo: /b/dushan-senarath");

    await mongoose.disconnect();
    console.log("Seeding finished successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
