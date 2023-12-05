const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const hbs = require('express-handlebars');
const Datastore = require('nedb');
const e = require("express");


app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');

app.use(
    express.urlencoded({
        extended: true
    })
)
// tworzenie kolekcji
const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});


//wyświetlenie indexu
app.get("/", function (req, res) {
    res.render('index.hbs',);

})

//wyświetlenie addCar
app.get("/addCar", function (req, res) {
    res.render('add.hbs',);

})

//wyświetlenie carsList
app.get("/carsList", function (req, res) {
    coll1.find({}, function (err, newLista) {
        const context = { lista: newLista }
        res.render('list.hbs', context);
    });


})

//wyświetlenie carsEdit
app.get("/carsEdit", function (req, res) {
    res.render('edit.hbs',);

})

//wyświetlenie carsDelete
app.get("/carsDelete", function (req, res) {
    coll1.find({}, function (err, newLista) {
        const context = { lista: newLista }

        res.render('delete.hbs', context);
    });
})

// ususwanie pojedynczych
app.get("/delete", function (req, res) {
    const id = req.query.Delete
    if (true) {
        coll1.remove({ _id: `${id}` }, {}, function (err, numRemoved) {
            const del = { deleted: numRemoved }
            res.render("delete.hbs", del)
        });
    }
})

// usuwanie wszystkich
app.get("/deleteAll", function (req, res) {
    coll1.remove({}, { multi: true }, function (err, numRemoved) {
        const del = { deleted: numRemoved }
        res.render("delete.hbs", del)
    });

})



//wyświetlenie wysłanie formularza dodającego auta do kolekcji
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
