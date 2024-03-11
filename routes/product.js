const router = require("express").Router();
const {collection, Product} = require("../src/config");


router.get("/products", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        let sort = req.query.sort || "product_price";
        let category = req.query.category || "All";

        const categoryOptions = [
            "sweet",
            "hot"
        ];

        category === "All"
            ? (category = [...categoryOptions])
            : (category = req.query.category.split(","));
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        if (sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc";
        }

        const products = await Product.find({ product_name: { $regex: search, $options: "i" } })
            .where("product_category")
            .in([...category])
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

        const total = await Product.countDocuments({
            product_category: { $in: [...category] },
            product_name: { $regex: search, $options: "i" },
        });

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            categories: categoryOptions,
            products,
        };

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

module.exports = router;
