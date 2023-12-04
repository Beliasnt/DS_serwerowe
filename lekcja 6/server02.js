const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const hbs = require('express-handlebars');

const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'kolekcja1.db',
    autoload: true
});

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów

const top = {
    LiczbaPorzadkowa: "Lp",
    Login: "Login",
    Haslo: "Haslo",
}


app.get("/", function (req, res) {
    res.render('view.hbs',);   // nie podajemy ścieżki tylko nazwę pliku

})

app.get("/handleForm", function (req, res) {
    console.log("Wysłane")

    const doc = {
        login: req.query.login,
        password: req.query.password,
        timestamp: new Date().getTime(),
    }

    coll1.insert(doc, function (err, newDoc) {
        console.log("dodano dokument (obiekt):")
        console.log(newDoc)
        console.log("unikalne id dokumentu: "+ newDoc._id)
    
    });
    coll1.find({ }, function (err, docs) {
        res.render(JSON.stringify({ "docsy": docs }, null, 5))
    });
    res.render('view.hbs', top)

    
})

app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
