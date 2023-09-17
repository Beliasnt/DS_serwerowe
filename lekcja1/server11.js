const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")

app.use("/", express.static(path.join(__dirname, '/static/products/')))


app.get('/product_id/:id', function (req, res) {

    let id = req.params.id
    if (id == 1)
        res.sendFile(path.join(__dirname, "/static/products/product1.html"))
    else if (id == 2)
        res.sendFile(path.join(__dirname, "/static/products/product2.html"))
    else if (id == 3)
        res.sendFile(path.join(__dirname, "/static/products/product3.html"))
    else
        res.send("taki produkt nie istnieje")
})




app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
