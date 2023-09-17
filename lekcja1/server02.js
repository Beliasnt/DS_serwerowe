const express = require("express")
const app = express()
const PORT = 3000;

//app.use(express.static('static'))

app.get("/kupa", function (req, res) {
    res.send("dane html odesłane z serwera do przeglądarki")
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

