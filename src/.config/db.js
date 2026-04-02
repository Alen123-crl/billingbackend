const mongoose = require('mongoose')

mongoose.connect(process.env.DBConnectionString)
  .then(() => {
    console.log("mongodb connected")
  })
  .catch(err => {
    console.log("connection error " + err)
  })
