const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Server running")
})

const PORT = 5001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})