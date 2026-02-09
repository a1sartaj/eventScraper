import mongoose from "mongoose";

const emailCaptureSchema = new mongoose.Schema(
    {
        email : {
            type :String,
            required :true
        },

        consent : {
            type : Boolean,
            required : true
        },

        eventId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Event',
            required : true
        }
    }, {timestamps : true}
)

const EmailCapture = mongoose.model('EmailCapture', emailCaptureSchema)

export default EmailCapture
