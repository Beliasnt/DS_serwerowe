const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")

app.use(express.static('static'))
app.use(express.urlencoded({
    extended: true
}));


app.post("/", function (req, res) {
    
    res.sendFile(path.join(__dirname, "/static/index.html"))
    console.log(req.body);
    let val1 = parseInt(req.body.text1)
    let val2 = parseInt(req.body.text2)
    res.header("content-type", "application/json")
    let tab1 = [
        {message: req.body.select + " dwu elementów",wynik: val1 + val2},
        {message: req.body.select + " dwu elementów",wynik: val1 - val2,},
        {message: req.body.select + " dwu elementów",wynik: val1 * val2,},
        {message: req.body.select + " dwu elementów", wynik: val1 / val2}
        ]
    
    if (req.body.select == "suma")
        res.send(JSON.stringify({
            message: req.body.select + " dwu elementów",
            wynik: val1 + val2
        }, null, 5))
    else if (req.body.select == "roznica")
        res.send(JSON.stringify({
            message: req.body.select + " dwu elementów",
            wynik: val1 - val2
        }, null, 5))
    else if (req.body.select == "iloczyn")
        res.send(JSON.stringify({
            message: req.body.select + " dwu elementów",
            wynik: val1 * val2
        }, null, 5))
    else if (req.body.select == "iloraz")
        res.send(JSON.stringify({
            message: req.body.select + " dwu elementów",
            wynik: val1 / val2
        }, null, 5))
    else if (req.body.select == "wszystko na raz")
        res.send(JSON.stringify(tab1, null, 5))



})



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})