import mongoose from "mongoose";   
 

const eventSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },

    dateTime : String,

    venueName : String,
    address : String,

    city : {
        type : String,
        default :'Sydney'
    },

    description : String,
    category : String,
    image : String,

    sourceWebsite : String,

    eventUrl : {
        type :String,
        unique : true
    },

    lastScrapedAt : Date,

    status : {
        type : String,
        enum : ['new', 'updated', 'inactive', 'imported'],
        default : 'new'
    },

    importedAt : Date,
    importedBy : String,
    importNotes : String,

}, {timestamps : true})

const Event = mongoose.model('Event', eventSchema)

export default Event;