const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
app.use(express.static('static'))


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/formularz.html"))
})

app.get("/handleForm", function (req, res) {
    console.log(req.query)
    let col = req.query.color
    let colorText = `<div style="color:white; font-size: 100px">
      ${col}
      </div>`
    let resend = `<body style="height: 100px; width: 100px; background-color:
    ${col}">`
    res.send(resend + colorText)
})


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})