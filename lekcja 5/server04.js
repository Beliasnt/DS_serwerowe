const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const hbs = require('express-handlebars');
const { title } = require("process");


app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów

const context = {
    subject: "ćwiczenie 4 - dane z tablicy, select",
    fields: [
        { name: "title" },
        { name: "author" },
        { name: "lang" }
    ],
    books: [
        { title: "Lalka", author: "B Prus", lang: "PL" },
        { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
        { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
        { title: "Zamek", author: "F Kafka", lang: "CZ" }
    ]
}

app.get("/", function (req, res) {
    console.log("--- cały obiekt context")
    console.log(context)
    console.log("--- tablica fields z obiektu context")
    console.log(context.context)
    res.render('view4.hbs', context);   // nie podajemy ścieżki tylko nazwę pliku
})

app.get("/handleForm", function (req, res) {
    switch (req.query.select) {
        case "title":
            res.render("Title.hbs", context)
            break;

        case "lang":
            res.render("lang.hbs", context)
            break;

        case "author":
            res.render("author.hbs", context)
            break;
        default:
            res.render("deafault.hbs")
    }
})

app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
