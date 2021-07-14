const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listTitlesSchema = new Schema({
    titles: [
        {
            title: { type: String, required: true },
            movieId: { type: Number, required: true },
            poster_path: { type: String, required: true },
            release: { type: Date, required: true },
            isViewed: { type: Boolean, required: true }
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('ListTitles', listTitlesSchema);