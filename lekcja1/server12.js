
const express = require("express")
const app = express()
const PORT = 3000;


function random() {
    let result = "";
    for (i = 0; i < 50; i++) {
        const a = Math.floor(Math.random() * (50 - 1)) + 1;
        result += "<a href='/product/'" + a + "> strona" + a + "</a> <br>";
    }
    return result
}

app.get("/", function (req, res) {
    res.send(random())

})

app.get('/product/:id', function (req, res) {
    let id = req.params.id
    res.send("to jest strona o id" + id)

});

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})


