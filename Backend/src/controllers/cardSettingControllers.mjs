import CardSetting from "../models/CardSetting.mjs";

class CardSettingControllers {
   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
    * @description    Get all card settings (optionally filtered by category)
    * @route          GET /api/v1/card-settings
    * @access         Public (templates need this without auth)
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   getAll = async (req, res) => {
      try {
         const filter = {};
         if (req.query.category) {
            filter.category = req.query.category;
         }
         // By default, only return active settings
         if (req.query.includeInactive !== "true") {
            filter.isActive = true;
         }

         const settings = await CardSetting.find(filter).sort({ sortOrder: 1, value: 1 });

         res.status(200).json({
            success: true,
            count: settings.length,
            data: settings,
         });
      } catch (error) {
         console.error("Error fetching card settings:", error);
         res.status(500).json({
            success: false,
            message: "Server error fetching card settings.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
    * @description    Create a new card setting
    * @route          POST /api/v1/card-settings
    * @access         Authenticated
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   create = async (req, res) => {
      const { category, label, description, sortOrder, url } = req.body;

      if (!category || !label) {
         return res.status(400).json({
            success: false,
            message: "Category and label are required.",
         });
      }

      try {
         // Auto-increment: find the highest value for this category and add 1
         const maxEntry = await CardSetting.findOne({ category }).sort({ value: -1 });
         const nextValue = maxEntry ? maxEntry.value + 1 : 1;

         const setting = await CardSetting.create({
            category,
            value: nextValue,
            label,
            description: description || "",
            url: url || "",
            sortOrder: sortOrder !== undefined ? sortOrder : nextValue,
         });

         res.status(201).json({
            success: true,
            message: "Card setting created successfully!",
            data: setting,
         });
      } catch (error) {
         console.error("Error creating card setting:", error);
         if (error.code === 11000) {
            return res.status(409).json({
               success: false,
               message: "A setting with this category and value already exists.",
            });
         }
         res.status(500).json({
            success: false,
            message: "Server error creating card setting.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
    * @description    Update a card setting
    * @route          PATCH /api/v1/card-settings/:id
    * @access         Authenticated
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   update = async (req, res) => {
      const { id } = req.params;
      const { label, description, sortOrder, isActive, url } = req.body;

      try {
         const setting = await CardSetting.findById(id);

         if (!setting) {
            return res.status(404).json({
               success: false,
               message: "Card setting not found.",
            });
         }

         if (label !== undefined) setting.label = label;
         if (description !== undefined) setting.description = description;
         if (url !== undefined) setting.url = url;
         if (sortOrder !== undefined) setting.sortOrder = sortOrder;
         if (isActive !== undefined) setting.isActive = isActive;

         await setting.save();

         res.status(200).json({
            success: true,
            message: "Card setting updated successfully!",
            data: setting,
         });
      } catch (error) {
         console.error("Error updating card setting:", error);
         res.status(500).json({
            success: false,
            message: "Server error updating card setting.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
    * @description    Delete a card setting
    * @route          DELETE /api/v1/card-settings/:id
    * @access         Authenticated
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   delete = async (req, res) => {
      const { id } = req.params;

      try {
         const setting = await CardSetting.findByIdAndDelete(id);

         if (!setting) {
            return res.status(404).json({
               success: false,
               message: "Card setting not found.",
            });
         }

         res.status(200).json({
            success: true,
            message: "Card setting deleted successfully.",
         });
      } catch (error) {
         console.error("Error deleting card setting:", error);
         res.status(500).json({
            success: false,
            message: "Server error deleting card setting.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
    * @description    Seed initial card settings from the previously hardcoded values
    * @route          POST /api/v1/card-settings/seed
    * @access         Authenticated
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   seed = async (req, res) => {
      try {
         const seedData = [
            // Ceremony Types
            { category: "ceremonyType", value: 1, label: "Poruwa Ceremony & Tradition", description: "Traditional Sri Lankan", sortOrder: 1 },
            { category: "ceremonyType", value: 2, label: "Church Wedding Ceremony", description: "Christian", sortOrder: 2 },
            { category: "ceremonyType", value: 3, label: "Registry Wedding", description: "Civil", sortOrder: 3 },
            { category: "ceremonyType", value: 4, label: "Hindu Wedding Ceremony", description: "Hindu", sortOrder: 4 },
            { category: "ceremonyType", value: 5, label: "Muslim Nikah Ceremony", description: "Muslim", sortOrder: 5 },
            
            // Dress Codes
            { category: "dressCode", value: 1, label: "Formal", description: "Black Tie / Evening Wear", sortOrder: 1 },
            { category: "dressCode", value: 2, label: "Semi-Formal", description: "Cocktail Attire", sortOrder: 2 },
            { category: "dressCode", value: 3, label: "Casual", description: "Relaxed & Comfortable", sortOrder: 3 },
            { category: "dressCode", value: 4, label: "Black Tie", description: "Tuxedos & Formal Gowns", sortOrder: 4 },
            { category: "dressCode", value: 5, label: "White Tie", description: "Full Formal (Tailcoats & Ballgowns)", sortOrder: 5 },
            { category: "dressCode", value: 6, label: "Beach Formal", description: "Elegant but Beach-Appropriate", sortOrder: 6 },
            { category: "dressCode", value: 7, label: "Festive Attire", description: "Fun, Colorful & Semi-Formal", sortOrder: 7 },
            { category: "dressCode", value: 8, label: "Smart Casual", description: "Neat, Polished but Informal", sortOrder: 8 },
            { category: "dressCode", value: 9, label: "Cultural / Traditional", description: "National or Traditional Attire", sortOrder: 9 },
            
            // Background Music
            { category: "backgroundMusic", value: 1, label: "Romantic Piano", url: "/audio/music1.mp3", sortOrder: 1 },
            { category: "backgroundMusic", value: 2, label: "Wedding March", url: "/audio/music2.mp3", sortOrder: 2 },
            { category: "backgroundMusic", value: 3, label: "Wedding Bells", url: "/audio/music3.mp3", sortOrder: 3 },

            
            // Reception Types (Classic & Traditional)
            { category: "receptionType", value: 1, label: "Evening Banquet", description: "Formal Dinner & Celebration", sortOrder: 1 },
            { category: "receptionType", value: 2, label: "Wedding Breakfast", description: "Morning Dining & Toasts", sortOrder: 2 },
            { category: "receptionType", value: 3, label: "Luncheon Reception", description: "Afternoon Dining & Celebration", sortOrder: 3 },
            
            // Reception Types (Modern & Social)
            { category: "receptionType", value: 4, label: "Cocktail Reception", description: "Drinks, Appetizers & Dancing", sortOrder: 4 },
            { category: "receptionType", value: 5, label: "Dessert Reception", description: "Sweet Treats, Cake & Champagne", sortOrder: 5 },
            { category: "receptionType", value: 6, label: "Tapas & Drinks", description: "Light Bites & Evening Cocktails", sortOrder: 6 },
            
            // Reception Types (Casual & Relaxed)
            { category: "receptionType", value: 7, label: "Garden Party", description: "Outdoor Dining & Lawn Games", sortOrder: 7 },
            { category: "receptionType", value: 8, label: "Buffet Reception", description: "Casual Dining & Celebration", sortOrder: 8 },
            { category: "receptionType", value: 9, label: "Afternoon Tea", description: "Tea, Sandwiches & Scones", sortOrder: 9 },
            
            // Reception Types (Cultural)
            { category: "receptionType", value: 10, label: "Homecoming Reception", description: "Celebrating the Newlyweds", sortOrder: 10 },
            { category: "receptionType", value: 11, label: "Gala Dinner", description: "Black-Tie Celebration", sortOrder: 11 },
         ];

         const operations = seedData.map(item => ({
            updateOne: {
               filter: { category: item.category, value: item.value },
               update: { $setOnInsert: item },
               upsert: true
            }
         }));

         await CardSetting.bulkWrite(operations);

         res.status(201).json({
            success: true,
            message: "Card settings seeded successfully!",
            count: seedData.length,
         });
      } catch (error) {
         console.error("Error seeding card settings:", error);
         res.status(500).json({
            success: false,
            message: "Server error seeding card settings.",
         });
      }
   };
}

export default new CardSettingControllers();
