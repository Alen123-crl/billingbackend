require('dotenv').config()
const express = require('express')
require('./src/.config/db')
const route=require('./src/routes/route')
const cors = require('cors')

const Billing = express()

Billing.use(cors())
Billing.use(express.json())

Billing.use('/api', route)  

const PORT = process.env.PORT || 3000

Billing.listen(PORT, () => {
  console.log(`server runs on port ${PORT}`)
})


