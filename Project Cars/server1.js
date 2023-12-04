const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const hbs = require('express-handlebars');
const Datastore = require('nedb')


app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów

app.use(
    express.urlencoded({
        extended: true
    })
)

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});



app.get("/", function (req, res) {
    res.render('index.hbs',);

})

app.get("/addCar", function (req, res) {
    res.render('add.hbs',);

})

app.get("/carsList", function (req, res) {
    coll1.find({}, function (err, newLista) {
        const context = {lista: newLista}
        res.render('list.hbs', context);
   });
   

})

app.get("/carsEdit", function (req, res) {
    res.render('edit.hbs',);

})

app.get("/carsDelete", function (req, res) {
    res.render('delete.hbs',);

})

app.post("/addCar", function (req, res) {
    const lista = {
        ubezpieczony: req.body.ubezpieczony == "on" ? "tak" : "nie",
        benzyna: req.body.benzyna == "on" ? "tak" : "nie",
        uszkodzony: req.body.uszkodzony == "on" ? "tak" : "nie",
        napęd4x4: req.body.napęd4x4 == "on" ? "tak" : "nie"
    };
    coll1.insert(lista, function (err, newLista) {
        res.render('add.hbs', newLista);
    });
    
})

app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
