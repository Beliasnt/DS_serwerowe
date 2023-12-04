const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")

app.use(express.static(__dirname + '/static/'))

app.get("/koty", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/pages/koty.html"))
})

app.get("/drzewa", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/pages/drzewa.html"))
})

app.get("/auta", function (req, res) {

    res.sendFile(path.join(__dirname, "/static/pages/auta.html"))
    //res.send(__dirname)
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/index.html"))
})



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
