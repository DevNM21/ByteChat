const Namespace =  require('../model/Namespace');
const Room =  require('../model/Room');

localLink = "mongodb://localhost:27017/CG2"
const mongoose = require('mongoose');
mongoose.connect(localLink, { useNewUrlParser: true })
mongoose.set('useCreateIndex', true);


const run = async() => {

    const namespaces = await Namespace.find({})
    console.log(namespaces);
    
}
    run()



module.exports = namespaces;
