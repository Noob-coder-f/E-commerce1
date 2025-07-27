import mongoose from 'mongoose';

const cardSchema= new mongoose.Schema({

cardname:{
    type: String,
    required: true
},
price:{
    type: Number,
    required: true
},
cardimage:{
    type: String,
    required: true
}
})
const Card= mongoose.model('Card',cardSchema);
export default Card;