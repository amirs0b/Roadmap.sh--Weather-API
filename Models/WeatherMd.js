import mongoose from "mongoose";
const weatherSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    country: {
        type: String,
        lowercase: true,
        trim: true,
        default: ''
    },
    tempC: Number,
    description: String

},{timestamps:true})

const Weather = mongoose.model("Weather",weatherSchema)
export default Weather;

