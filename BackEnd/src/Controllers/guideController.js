const Guide = require("../models/guide");


exports.searchGuides = async (req, res) => {
    try {
        const { language, location } = req.query;
        const guides = await Guide.find({
            languages: language,
            location: location
        });
        res.json(guides);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
