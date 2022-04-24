const QuestionModel = require('../models/Question');

module.exports = {
    // function to get all tags and the quantity of questions that have each tag
    async list(req, res) {
        try {
            const tags = await QuestionModel.aggregate([
                {
                    $unwind: '$tags',
                },
                {
                    $group: {
                        _id: '$tags',
                        qtd: { $sum: 1 },
                    },
                },
                {
                    $sort: { qtd: -1 },
                },
            ]);
            res.json(tags);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};