const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const hbs = require('express-handlebars');
const formidable = require('formidable');
const { appendFile } = require("fs");
const { url } = require("inspector");
const fs = require("fs")

app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    helpers: {
        icon: function (ext) {
            if (fs.existsSync(ikonkipath + ext + '.png')) {
                return ext
            } else {
                return "blank"
            }
        },
    }
}));
app.set('view engine', 'hbs');

app.use(
    express.urlencoded({
        extended: true
    })
)
let ikonkipath = path.join(__dirname, "static/gfx/")
let id = 1
let context = { files: [] }
let file = { id: id, name: '', path: '', size: '', type: '', savedata: '', icon: '' }

//wyświetlenie indexu
app.get('/upload', function (req, res) {
    res.render("index.hbs")
})
app.post('/filemanager', function (req, res) {
    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true
    form.uploadDir = path.join(__dirname, 'upload')
    form.parse(req, function (err, fields, files) {
        console.log(files)
        const isArray = Array.isArray(files.image)
        console.log(isArray);
        if (isArray) {
            for (let i = 0; i < files.image.length; i++) {
                let icon = ''
                switch (files.image[i].type) {
                    case 'text/plain':
                        icon = "https://cdn1.iconfinder.com/data/icons/bootstrap-vol-3/16/filetype-txt-512.png"
                        break
                    case 'image/png':
                        icon = "https://cdn1.iconfinder.com/data/icons/bootstrap-vol-3/16/filetype-png-512.png"
                        break
                    case 'image/jpeg':
                        icon = "https://cdn1.iconfinder.com/data/icons/bootstrap-vol-3/16/filetype-jpg-512.png"
                        break
                    default:
                        icon = "https://cdn1.iconfinder.com/data/icons/bootstrap-vol-2/16/file-earmark-x-512.png"
                        break
                }
                let date = new Date()
                let time = date.getTime()
                file = { id: id, name: files.image[i].name, path: files.image[i].path, size: files.image[i].size, type: files.image[i].type, savedata: time, icon: icon }
                context.files.push(file)
                id++
            }
        }
        else {
            let icon = ''
            switch (files.image.type) {
                case 'text/plain':
                    icon = "https://cdn1.iconfinder.com/data/icons/bootstrap-vol-3/16/filetype-txt-512.png"
                    break
                case 'image/png':
                    icon = "https://cdn1.iconfinder.com/data/icons/bootstrap-vol-3/16/filetype-png-512.png"
                    break
                case 'image/jpeg':
                    icon = "https://cdn1.iconfinder.com/data/icons/bootstrap-vol-3/16/filetype-jpg-512.png"
                    break
                default:
                    icon = "https://cdn1.iconfinder.com/data/icons/bootstrap-vol-2/16/file-earmark-x-512.png"
                    break
            }
            let date = new Date()
            let time = date.getTime()
            file = { id: id, name: files.image.name, path: files.image.path, size: files.image.size, type: files.image.type, savedata: time, icon: icon }
            context.files.push(file)
            id++
        }
        // res.render("upload.hbs")
        res.redirect('/upload')
    });

});

app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', context)
})

app.get('/show', function (req, res) {
    let result = ''
    for (let i = 0; i < context.files.length; i++) {
        if (context.files[i].id == req.query.id) {
            result = context.files[i].path;
            break;
        }
    }
    res.sendFile(result);
})

app.get("/info", function (req, res) {
    let result = "";
    for (let i = 0; i < context.files.length; i++) {
        if (context.files[i].id == req.query.id) {
            result = context.files[i];
            break;
        }
    }
    res.render("info.hbs", result);
});

app.get("/delete", function (req, res) {
    for (let i = 0; i < context.files.length; i++) {
        if (context.files[i].id == req.query.id) {
            context.files.splice(i, 1);
            break;
        }
    }
    res.redirect("/filemanager");
});


app.get("/deleteAll", function (req, res) {
    //context.files.splice(0, context.files.length);
    context.files.length = 0
    id = 1;
    res.redirect("/filemanager")
})

app.get("/download", function (req, res) {
    let result = "";
    for (let i = 0; i < context.files.length; i++) {
        if (context.files[i].id == req.query.id) {
            result = context.files[i].path;
            break;
        }
    }
    res.download(result);
});




/////////////MANAGER WITH CREATING FILES AND FOLDERS ///////////////

let filesM = {}
let contextM = { root: "pliki/" }
let filepath1 = path.join(__dirname, contextM.root);
let contextButton = "false"
let pathM = ["pliki"]
let pathMinus = []
let pathTemp = ''
let filepath3 = ''
let nameBar = ''
let ext = ''
app.get("/manager", function (req, res) {
    let folders = []
    let files = []
    fs.readdir(filepath1, (err, list) => {
        list.forEach((file) => {
            const filepath2 = path.join(__dirname, contextM.root, file)
            let ext = file.split(".")
            fs.lstat(filepath2, (err, check) => {
                if (check.isDirectory() == true) {
                    let obj = {
                        name: file,
                        icon: "folder"
                    }
                    folders.push(obj)
                }
                else {
                    let obj = {
                        name: file,
                        ext: ext[ext.length - 1]
                    }
                    files.push(obj)
                }
            }
            )
        })
    })
    res.render("manager.hbs", { folders, files, contextM, pathM, contextButton, pathTemp });
});

app.get("/createFolder", function (req, res) {
    filesM.name = req.query.name
    const filepath2 = path.join(__dirname, contextM.root, filesM.name)
    if (!fs.existsSync(filepath2)) {
        fs.mkdir(filepath2, (err) => {
            if (err) throw err
            res.redirect("/manager")
        })
    }
    else {
        console.log("plik nie został utworzony")
        res.redirect("/manager")
    }
})



app.get("/createFile", function (req, res) {
    filesM.name = req.query.name
    ext = req.query.select
    const filepath2 = path.join(__dirname, contextM.root, filesM.name)
    if (!fs.existsSync(filepath2)) {
        fs.writeFile(filepath2 + "." + ext, type(), (err) => {
            if (err) throw err
            res.redirect("/manager")
        })
    }
    else {
        console.log("plik nie został utworzony")
        res.redirect("/manager")
    }
})

app.get("/deleteM", function (req, res) {
    filesM.name = req.query.name
    const filepath2 = path.join(__dirname, contextM.root, filesM.name)
    fs.lstat(filepath2, (err, check) => {
        if (check.isDirectory() == true) {
            fs.rmdir(filepath2, { recursive: true }, (err) => {
                if (err) throw err
                res.redirect("/manager")
            })
        }
        else {
            fs.unlink(filepath2, (err) => {
                if (err) throw err
                res.redirect("/manager")
            })
        }
    })
})

app.get("/catalog", function (req, res) {
    let root = req.query.root + "/"
    contextM.root += root
    if (root != "pliki/") {
        contextButton = "true"
    }
    pathM = contextM.root.split("/").slice(0, -1)
    pathTemp = pathM.slice(-1)
    filepath1 = path.join(__dirname, contextM.root);
    res.redirect("/manager")
})

app.get("/pliki", function (req, res) {
    let name = req.query.name
    pathM = pathM.splice(0, pathM.indexOf(name) + 1)
    pathTemp = pathM.slice(-1)
    contextM.root = pathM.join("/") + "/"
    if (name == "pliki") {
        contextButton = "false"
    }
    filepath1 = path.join(__dirname, contextM.root);
    res.redirect("/manager")
})

app.get("/changeName", function (req, res) {
    let name = req.query.name
    pathMinus = contextM.root.split("/").slice(0, -2).join("/")
    const folderpath = path.join(__dirname, contextM.root)
    const filepath2 = path.join(__dirname, pathMinus, name)
    if (!fs.existsSync(filepath2)) {
        fs.rename(folderpath, filepath2, (err) => {
            if (err) console.log(err)
            else {
                contextM.root = pathMinus + "/" + name + "/"
                pathTemp = name
                filepath1 = path.join(__dirname, contextM.root)
                pathM = contextM.root.split("/").slice(0, -1)
                res.redirect("/manager")
            }
        })
    }
    else {
        res.redirect("/manager")
    }
})



app.post("/uploadManager", function (req, res) {
    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true
    form.uploadDir = filepath1  // folder do zapisu zdjęcia
    form.parse(req, function (err, fields, files) {
        if (Array.isArray(files.files)) {
            for (let i = 0; i < files.files.length; i++) {
                fs.rename(files.files[i].path, filepath1 + files.files[i].name, function (err) {
                    if (err) console.log('ERROR: ' + err)
                })
            }
            res.redirect('/manager')
        } else {
            fs.rename(files.files.path, filepath1 + files.files.name, function (err) {
                if (err) console.log('ERROR: ' + err)
                res.redirect('/manager')
            })
        }
    })
})

///////////////////////////////EDITING FILES/////////////////////////////////////

let contextF = {}
let imageExt = ''
const configpath = path.join(__dirname, 'static/config.json')
app.get("/file", function (req, res) { //wyświetlenia 
    nameBar = req.query.root
    imageExt = nameBar.split(".")
    imageExt = imageExt[imageExt.length - 1]
    filepath3 = path.join(__dirname, contextM.root, nameBar)
    if (imageExt == "png" || imageExt == "jpg") { res.redirect("/imageManager") }
    else {
        fs.readFile(filepath3, "utf-8", (err, data) => {
            if (err) throw err
            else (
                contextF = data
            )
        })
        res.redirect("/filesEdit")
    }
})

app.get("/podglad", function (req, res) {
    res.sendFile(filepath3)
})

app.get("/filesEdit", function (req, res) {
    res.render("edit.hbs", { nameBar, contextF, color, font, fontSize })
})

const configFile = fs.readFileSync(configpath)
const config = JSON.parse(configFile);
console.log(config)
let color = config.color
let font = config.font
let fontSize = config.fontSize
let counter = config.counter
app.get("/color", function (req, res) {
    let colors = ["black", "gray", "lightgray", "white"]
    let fontColor = ["white", "white", "black", "black"]
    color = colors[counter]
    font = fontColor[counter]
    counter++
    if (counter == 4) {
        counter = 0
    }
    res.redirect("/filesEdit")
})

app.get("/fontMinus", function (req, res) {
    if (fontSize == 15) {
        fontSize == fontSize
    }
    else fontSize -= 5
    res.redirect("/filesEdit")
})

app.get("/fontPlus", function (req, res) {
    if (fontSize == 45) {
        fontSize == fontSize
    }
    else fontSize += 5
    res.redirect("/filesEdit")
})

app.get("/saveSettings", function (req, res) {
    let parse = JSON.parse(`{"color":"${color}", "font":"${font}", "fontSize": ${fontSize}, "counter":${counter}}`)
    fs.writeFileSync(configpath, JSON.stringify(parse))
    res.redirect("/filesEdit")
})

app.get("/changeNameFile", function (req, res) {
    let name = req.query.name
    let ext = nameBar.split(".")
    ext = ext[ext.length - 1]
    const folderpath = path.join(__dirname, contextM.root, nameBar)
    name = name + "." + ext
    const filepath2 = path.join(__dirname, contextM.root, name)
    if (!fs.existsSync(filepath2)) {
        fs.rename(folderpath, filepath2, (err) => {
            if (err) console.log(err)
            else {
                filepath3 = filepath2
                nameBar = name,
                    (ext == "png" || ext == "jpg") ? res.redirect("/imageManager") : res.redirect("/filesEdit")
            }
        })
    }
    else {
        res.redirect("/filesEdit")
    }
})

app.get('/save', function (req, res) {
    let toSave = req.query.array
    toSave = toSave.split('","')
    toSave[0] = toSave[0].substring(2)
    toSave[toSave.length - 1] = toSave[toSave.length - 1].slice(0, -2)
    toSave.slice(-1)
    toSave = toSave.join("\n")
    fs.writeFile(filepath3, toSave, (err) => {
        if (err) throw err
        contextF = toSave
        console.log("plik zapisany");
    })
    res.redirect("/filesEdit")
})


function type() {
    let text = ''
    if (ext == "txt") {
        text = "txt file\na\nb\nc"
    }
    if (ext == "css") {
        text = "*{\n  background: red\n}"
    }
    if (ext == "js") {
        text = "<script>\nconsole.log('przykładowa strona')\n</script>"
    }
    if (ext == "html") {
        text = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Przykładowa strona</title>
</head>
<body>
    <h1>Przykładowa strona</h1>
</body>
</html>`}
    return text
}



///////////////////////////////EDITING IMAGES/////////////////////////////////////

app.get('/imageManager', function (req, res) {
    const effects = [
        { name: "grayscale", file: nameBar },
        { name: "invert", file: nameBar },
        { name: "sepia", file: nameBar },
    ]
    res.render("image.hbs", { nameBar, filepath3, effects })
})

/////////////////////////////// COOCKIES /////////////////////////////////////


app.get('/', function (req, res) {
    res.redirect("/register")
})
app.get("/register", function (req, res) {
    res.render("register.hbs")
})

let dataBase = { users: [] }
app.post("/register", function (req, res) {
    let userName = req.body.name
    let userPass = req.body.pass
    let confPass = req.body.confirmPass
    user = { name: userName, pass: userPass }
    if (userPass != confPass) {
        res.redirect("/error")
    }
    if (dataBase.users.length > 0) {
        for (let i = 0; i < dataBase.users.length; i++) {
            if (dataBase.users[i].name == userName) {
                res.redirect("/error")
            }
            else {
                dataBase.users.push(user)
                res.redirect("/login")

            }
        }
    }
    else {
        dataBase.users.push(user)
        console.log(dataBase)
        res.redirect("/login")
    }
})

app.get("/login", function (req, res) {
    res.render('login.hbs');
})

app.get("/error", function (req, res) {
    res.render("error.hbs")
})

app.get("/logout", function (req, res) {
    res.render('logout.hbs');
})



app.use(express.static('static'))
app.use(express.static('pliki'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})