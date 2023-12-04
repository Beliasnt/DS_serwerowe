const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")

//app.use(express.static(__dirname + '/static/'))

app.get("/", function (req, res) {
    console.log(req.query)

    let res_string = "<div style='border:1px solid black; height:10px; width:10px; margin: 2px; background-color:" + req.query.bg + "'></div>"
    res_string = res_string.repeat(req.query.count)
    //console.log(res_string)
    res.send(res_string)

})


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
