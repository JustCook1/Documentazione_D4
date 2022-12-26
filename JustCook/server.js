const app = require('./app');

const mongoose = require('mongoose');

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);


const listener = app.listen(process.env.PORT || 8080, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
