const express = require("express")
const app = express()
const PORT = 3000
const hbs = require('express-handlebars')
const path = require("path")
const formidable = require('formidable');

const icons = ["doc", "gif", "html", "jpeg", "json", "md", "pdf", "plain", "png", "x-zip-compressed", "FFF", "octet-stream"]


app.get("/", function (req, res) {
    res.render('upload.hbs')
})

app.get('/filemanager', function (req, res) {
    res.render('filemanager.hbs', { t: tab })

})

app.get('/show', function (req, res) {
    let id = req.query.id - 1
    res.sendFile(tab[id].path)
})

app.get('/info', function (req, res) {
    console.log(req.query.id)
    function findId(index) {
        return index.id = req.query.id
    }

    let info = tab.find(findId)
    res.render('info.hbs', info)
})

app.get('/download', function (req, res) {
    let id = req.query.id - 1
    res.download(tab[id].path)
})

app.get('/delete', function (req, res) {
    function findId(i) {
        return i.id > req.query.id - 1
    }

    let index = tab.findIndex(findId)
    tab.splice(index, 1)
    res.redirect('/filemanager')
})

app.get('/deleteAll', function (req, res) {
    tab = []
    res.redirect('/filemanager')
})

let tab = []

app.post('/', function (req, res) {

    let form = formidable({ multiples: true });
    form.keepExtensions = true
    form.uploadDir = __dirname + '/static/upload/'

    form.parse(req, function (err, fields, files) {

        // console.log(files)
        // console.log(Object.keys(files.files).length)

        if (Array.isArray(files.files) == true) {
            for (let i = 0; i < Object.keys(files.files).length; i++) {
                let split = files.files[i].type.split('/')
                let last = tab.length
                if (last == 0) {
                    let obj = {
                        id: 1,
                        name: files.files[i].name,
                        size: files.files[i].size,
                        type: files.files[i].type,
                        path: files.files[i].path,
                        filetype: split[1],
                        savedate: Date.now(),
                    }

                    tab.push(obj)
                } else {
                    let obj = {
                        id: tab[last - 1].id + 1,
                        name: files.files[i].name,
                        size: files.files[i].size,
                        type: files.files[i].type,
                        path: files.files[i].path,
                        filetype: split[1],
                        savedate: Date.now(),
                    }

                    tab.push(obj)
                }


            }
        } else {
            let split = files.files.type.split('/')
            let last = tab.length
            if (last == 0) {
                let obj = {
                    id: 1,
                    name: files.files.name,
                    size: files.files.size,
                    type: files.files.type,
                    path: files.files.path,
                    filetype: split[1],
                    savedate: Date.now(),
                }

                tab.push(obj)
            } else {
                let obj = {
                    id: tab[last - 1].id + 1,
                    name: files.files.name,
                    size: files.files.size,
                    type: files.files.type,
                    path: files.files.path,
                    filetype: split[1],
                    savedate: Date.now(),
                }

                tab.push(obj)
            }
        }



        console.log(Array.isArray(files.files))
        res.redirect("/filemanager")
    });
});

app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    helpers: {
        icon: function (filetype) {
            if (icons.includes(filetype)) {
                return filetype
            } else {
                return "other"
            }
        },
    }
}));
app.set('view engine', 'hbs')

app.use(express.static('static'))
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})