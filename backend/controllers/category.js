const Category = require('../models/category')

// get Random Integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// ================ create Category ================
exports.createCategory = async (req, res) => {
    try {
        // extract data
        const { name, description } = req.body;

        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const categoryDetails = await Category.create({
            name: name, description: description
        });

        res.status(200).json({
            success: true,
            message: 'Category created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating Category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating Category',
            error: error.message
        })
    }
}


// ================ get All Category ================
exports.showAllCategories = async (req, res) => {
    try {
        // get all category from DB
        const allCategories = await Category.find({}, { name: true, description: true });

        // return response
        res.status(200).json({
            success: true,
            data: allCategories,
            message: 'All allCategories fetched successfully'
        })
    }
    catch (error) {
        console.log('Error while fetching all allCategories');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching all allCategories'
        })
    }
}



// ================ Get Category Page Details ================
exports.getCategoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;
        console.log("DEBUG: Received categoryId:", categoryId);

        if (!categoryId) {
            return res.status(400).json({ success: false, message: "Category ID is required" });
        }

        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })
            .exec();

        console.log("DEBUG: Selected category:", selectedCategory);

        if (!selectedCategory) {
            console.log("DEBUG: Category not found");
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        if (!selectedCategory.courses || selectedCategory.courses.length === 0) {
            console.log("DEBUG: No courses found in this category");
            return res.status(404).json({ success: false, message: "No courses found in this category" });
        }

        res.status(200).json({ success: true, data: selectedCategory });
    } catch (error) {
        console.error("DEBUG: Internal server error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
