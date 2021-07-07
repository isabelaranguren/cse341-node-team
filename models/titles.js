/* 
title: string
genres: Array type
[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":878,"name":"Science Fiction"}]
homepage: string
id: int
overview: string
popularity: float
poster_path: string
logo_path: string
production_companies: array type
[{"id":2537,"logo_path":null,"name":"Kennedy Miller Productions","origin_country":"AU"},{"id":174,"logo_path":"/IuAlhI9eVC9Z8UQWOIDdWRKSEJ.png","name":"Warner Bros. Pictures","origin_country":"US"},{"id":41624,"logo_path":"/wzKxIeQKlMP0y5CaAw25MD6EQmf.png","name":"RatPac Entertainment","origin_country":"US"},{"id":79,"logo_path":"/tpFpsqbleCzEE2p5EgvUq6ozfCA.png","name":"Village Roadshow Pictures","origin_country":"US"}]
release_date: date
revenue: int
runtime: int
vote_average: float
vote_count: int
tagline: string
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listTitlesSchema = new Schema({
    titles: [
        {
            title: { type: String, required: true },
            genres: [
                {
                    id: { type: Number, required: true },
                    name: { type: String, required: true }
                }
            ],
            homepage: { type: String, required: true },
            id: { type: Number, required: true },
            overview: { type: String, required: true },
            popularity: { type: Number, required: true },
            poster_path: { type: String, required: true },
            logo_path: { type: String, required: true },
            release_date: { type: Date, required: true },
            revenue: { type: Number, required: true },
            runtime: { type: Number, required: true },
            vote_average: { type: Number, required: true },
            vote_count: { type: Number, required: true },
            tagline: { type: String, required: true }
        }
    ],

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

});




module.exports = mongoose.model('ListTitles', listTitlesSchema);