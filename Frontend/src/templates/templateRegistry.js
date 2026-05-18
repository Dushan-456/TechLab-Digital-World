/**
 * ═══════════════════════════════════════════════════════════════
 *  TEMPLATE REGISTRY — Single source of truth for ALL templates
 * ═══════════════════════════════════════════════════════════════
 *
 *  HOW TO ADD A NEW TEMPLATE:
 *  1. Create your component in /templates/{type}/YourTemplate.jsx
 *  2. Import it below
 *  3. Add ONE entry to the `registry` object
 *  That's it! The admin pages, card viewer, and edit page
 *  will all pick it up automatically.
 *
 * ═══════════════════════════════════════════════════════════════
 */

// ── Wedding Templates ────────────────────────────────────────
import EtherealTemplate from "./wedding/EtherealTemplate";
import LuminaTemplate from "./wedding/LuminaTemplate";
import KineticTemplate from "./wedding/KineticTemplate";
import RoyalGoldTemplate from "./wedding/RoyalGoldTemplate";

// ── Birthday Templates ───────────────────────────────────────
import JoyfulTemplate from "./birthday/JoyfulTemplate";

// ── Event Templates ──────────────────────────────────────────
import CorporateTemplate from "./event/CorporateTemplate";

// ─────────────────────────────────────────────────────────────
//  REGISTRY — Add your template here (one line per template)
// ─────────────────────────────────────────────────────────────
const registry = {
  // Wedding
  ethereal:   { component: EtherealTemplate,  type: "wedding",  name: "Ethereal",    desc: "Ultra-minimalist, serif typography",                  color: "#b8a080" },
  lumina:     { component: LuminaTemplate,    type: "wedding",  name: "Lumina",      desc: "Modern glassmorphism, frosted glass",                 color: "#a78bfa" },
  kinetic:    { component: KineticTemplate,   type: "wedding",  name: "Kinetic",     desc: "Dynamic, fluid motion",                              color: "#0ea5e9" },
  royalgold:  { component: RoyalGoldTemplate, type: "wedding",  name: "Royal Gold",  desc: "Premium envelope reveal, personalized for guests",   color: "#d4af37" },

  // Birthday
  joyful:     { component: JoyfulTemplate,    type: "birthday", name: "Joyful",      desc: "Bright colors, fun animations",                      color: "#f472b6" },

  // Event
  corporate:  { component: CorporateTemplate, type: "event",    name: "Corporate",   desc: "Clean, professional layout",                         color: "#1e293b" },
};

// ─────────────────────────────────────────────────────────────
//  HELPER FUNCTIONS (used by pages & CardViewer)
// ─────────────────────────────────────────────────────────────

/** Get the React component for a given template ID */
export const getTemplateComponent = (id) => registry[id]?.component || null;

/** Get list of templates for a given type (wedding/birthday/event) */
export const getTemplatesByType = (type) =>
  Object.entries(registry)
    .filter(([, t]) => t.type === type)
    .map(([id, t]) => ({ id, name: t.name, desc: t.desc, color: t.color }));

/** Get the default template ID for a given type */
export const getDefaultTemplateId = (type) => {
  const templates = getTemplatesByType(type);
  return templates[0]?.id || "";
};

export default registry;
