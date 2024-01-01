const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")

app.use(express.static('static'))
app.use(express.urlencoded({
    extended: true
}));
const formidable = require('formidable');
const { appendFile } = require("fs");


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/formularzBytes.html"))
})

app.post('/handleUpload', function (req, res) {
    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true
    res.header("content-type", "application/json")
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia
    form.parse(req, function (err, fields, files) {
        console.log(form.bytesExpected, form.bytesReceived);
        res.send(JSON.stringify({
                    bytesExpected: form.bytesExpected,
                    bytesReceived: form.bytesReceived
                 }, null, 5))
    });
});



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})