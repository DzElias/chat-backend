const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("DB online");

        
    } catch (error) {
        console.log(error);
        throw Error('Error en la base de datos - comuniquese con el administrados, error: ');
    }
}

module.exports = {
    dbConnection
}