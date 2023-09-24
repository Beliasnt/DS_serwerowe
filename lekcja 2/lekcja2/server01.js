const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")

app.use(express.static('static'))


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/formularz.html"))
})

app.get("/handleForm", function(req, res){
    console.log(req.query)
    res.send(req.query)
})


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})