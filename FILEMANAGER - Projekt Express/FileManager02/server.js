const express = require("express")
const app = express()
const PORT = 4000
const hbs = require('express-handlebars')
const fs = require("fs")
const path = require("path")
const formidable = require('formidable');
const { DEFAULT_CIPHERS } = require("tls")
const { dirname } = require("path")
const { secureHeapUsed } = require("crypto")

const filepath = path.join(__dirname, "pliki/")
const iconpath = path.join(__dirname, 'static/icons/')


app.get('/', function (req, res) {
    res.redirect('/filemanager')
})

app.get('/filemanager', function (req, res) {
    let context = []
    let files = []
    let dirs = []
    fs.readdir(filepath, (err, filelist) => {
        if (err) throw err
        for (let i = 0; i < filelist.length; i++) {
            let filename = filelist[i]
            let file = filename.split('.')
            if (file.length == 1) {
                file.push('folder')
                let obj = {
                    name: filename,
                    extension: file[file.length - 1]
                }
                dirs.push(obj)
            } else {
                let obj = {
                    name: filename,
                    extension: file[file.length - 1]
                }

                files.push(obj)
            }
        }

        for (let i = 0; i < dirs.length; i++) {
            context.push(dirs[i])
        }

        for (let i = 0; i < files.length; i++) {
            context.push(files[i])
        }
    })
    res.render('filemanager.hbs', { dirs, files })
})



app.get('/newFolder', function (req, res) {
    let dirname = req.query.dirname
    if (fs.existsSync(filepath + dirname)) {
        let used = []
        fs.readdir(filepath, (err, files) => {
            if (err) throw err

            for (let i = 0; i < files.length; i++) {
                if (files[i] === dirname || files[i] === dirname + `(${used.length})`) {
                    used.push(files[i])
                }
            }

            fs.mkdir(path.join(filepath, dirname + `(${used.length})`), (err) => {
                if (err) throw err
                console.log("Utworzono nowy folder o nazwie", dirname);
            })
        })
    } else {
        fs.mkdir(path.join(filepath, dirname), (err) => {
            if (err) throw err
            console.log("Utworzono nowy folder o nazwie", dirname);
        })
    }

    res.redirect('/filemanager')
})

app.get('/newFile', function (req, res) {
    let filename = req.query.filename
    if (fs.existsSync(filepath + filename + '.txt')) {
        let used = []
        fs.readdir(filepath, (err, files) => {
            if (err) throw err

            for (let i = 0; i < files.length; i++) {
                if (files[i] === filename + '.txt' || files[i] === filename + `(${used.length})` + '.txt') {
                    used.push(files[i])
                    console.log(used.length)
                }
            }

            fs.writeFile(path.join(filepath, filename + `(${used.length})` + '.txt'), "tekst do wpisania", (err) => {
                if (err) throw err
                console.log("Utworzono nowy plik o nazwie", filename + `(${used.length})`);
            })
        })
    } else {
        fs.writeFile(path.join(filepath, filename + ".txt"), "tekst do wpisania", (err) => {
            if (err) throw err
            console.log("Utworzono nowy plik o nazwie", filename);
        })
    }
    res.redirect('/filemanager')
})

app.post('/upload', function (req, res) {
    let form = formidable({ multiples: true });
    form.keepExtensions = true
    form.uploadDir = filepath

    form.parse(req, function (err, fields, files) {
        if (Array.isArray(files.files) == true) {
            console.log('kilka')
            for (let i = 0; i < files.files.length; i++) {
                console.log(files.files[i].path)
                console.log(files.files[i].name)
                fs.rename(files.files[i].path, filepath + files.files[i].name, function (err) {
                    if (err) console.log('ERROR: ' + err)
                })
            }

            res.redirect('/filemanager')
        } else {
            console.log(files.files.path)
            console.log(files.files.name)
            fs.rename(files.files.path, filepath + files.files.name, function (err) {
                if (err) console.log('ERROR: ' + err)

                res.redirect('/filemanager')
            })
        }
    })


})

app.get('/delete', function (req, res) {
    let filename = req.query.name
    let extension = req.query.extension
    if (extension === 'folder') {
        fs.rmdir(filepath + filename, (err) => {
            if (err) throw err
            console.log("Usunięto foler", filename)
        })
    } else {
        fs.unlink(filepath + filename, (err) => {
            if (err) throw err
            console.log("Usunięto plik", filename)
        })
    }

    res.redirect('/filemanager')
})

app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    helpers: {
        icon: function (extension) {
            if (fs.existsSync(iconpath + extension + '.png')) {
                return extension
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