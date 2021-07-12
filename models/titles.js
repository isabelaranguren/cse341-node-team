const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listTitlesSchema = new Schema({
    titles: [
        {
            title: { type: String, required: true },
            // genres: [
            //     {
            //         id: { type: Number, required: true },
            //         name: { type: String, required: true }
            //     }
            // ],
            // homepage: { type: String, required: true },
            id: { type: Number, required: true },
            // overview: { type: String, required: true },
            // popularity: { type: Number, required: true },
            poster_path: { type: String, required: true },
            // logo_path: { type: String, required: true },
            release: { type: Date, required: true },
            // revenue: { type: Number, required: true },
            // runtime: { type: Number, required: true },
            // vote_average: { type: Number, required: true },
            // vote_count: { type: Number, required: true },
            // tagline: { type: String, required: true }
        }
    ],

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

});




module.exports = mongoose.model('ListTitles', listTitlesSchema);