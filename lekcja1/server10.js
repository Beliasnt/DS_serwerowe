const express = require("express")
const app = express()
const PORT = 3000;


app.get("/", function (req, res) {
    console.log(req.query)

    let valueIn = req.query.value
    let toRad = req.query.toRad
    let valueOut = 0
    let response_string
    if (toRad == "true") { //stopnie na radiany
        valueOut = valueIn * 3.14 / 180
        response_string = "" + valueIn + " stopni to " + valueOut + " radianów"
    }
    else {  //radiany na stopnie
        valueOut = valueIn * 180 / 3.14
        response_string = "" + valueIn + " radianów to " + valueOut + " stopni"
    }

    res.send(response_string)

})



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
