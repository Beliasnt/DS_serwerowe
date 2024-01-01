const express = require("express")
const app = express()
const PORT = 4000;
const path = require("path")

app.use(express.static('static'))
app.use(express.urlencoded({
    extended: true
}));
const formidable = require('formidable');
const { appendFile } = require("fs");


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/formularz.html"))
})

app.post('/handleUpload', function (req, res) {
    let form = formidable({});
    form.keepExtensions = true
    res.header("content-type", "application/json")
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia
    form.parse(req, function (err, fields, files) {
 
        console.log("----- przesłane pola z formularza ------");
        console.log(fields);

        console.log("----- przesłane formularzem pliki ------");
        console.log(files);

        let tablica1 = [fields, files]
        res.send(JSON.stringify(tablica1, null, 5))
    });
});



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})