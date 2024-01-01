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
        res.send(JSON.stringify(tab, null, 5))
    });

    let tab = []

    form.on("file", function () {
        tab.push("file " + new Date().getTime())
    })

    form.on("Expected", function (bytesExpected) {
        tab.push("Expected  " , bytesExpected , new Date().getTime())
    })

    form.on("Received", function(bytesReceived) {
        tab.push("Received " , bytesReceived, new Date().getTime())
    })

    form.on("fileBegin", function () {
        tab.push("fileBegin " + new Date().getMilliseconds())
    })

    form.on("end", function () {
        tab.push("end " + new Date().getTime())
    })
});



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})