const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const hbs = require('express-handlebars');
const formidable = require('formidable');
const { appendFile } = require("fs");
const { url } = require("inspector");
const fs = require("fs")


app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');

app.use(
    express.urlencoded({
        extended: true
    })
)

let id = 1
let context = { files: [] }
let file = { id: id, name: '', path: '', size: '', type: '', savedata: '', icon: '' }

//wyświetlenie indexu
app.get("/", function (req, res) {
    res.render('index.hbs',);

})

app.post('/filemanager', function (req, res) {
    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true
    form.uploadDir = path.join(__dirname, 'upload')
    form.parse(req, function (err, fields, files) {
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
        console.log(context);
        // res.render("upload.hbs")
        res.redirect('/')
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
    console.log(result);
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


let contextFolder = {}

app.get("/manager", function (req, res) {
    // readFolder()
    const filepath1 = path.join(__dirname, "pliki")
    fs.readdir(filepath1, (err, filesM) => {
        if (err) throw err
        filesM.forEach(fileM => {
            console.log(fileM)
            contextFolder = { filesM: fileM }
            res.render("manager.hbs", contextFolder)
        });
    })
})


app.get("/createFolder", function (req, res) {
    contextFolder = { name: req.query.name }
    //mkdir(req,res)
    const filepath2 = path.join(__dirname, "pliki", contextFolder.name)
    if (!fs.existsSync(filepath2)) {
        fs.mkdir(filepath2, (err) => {
            if (err) throw err
            res.redirect("/manager")
        })
    }
})


// function readFolder(req, res) {
//     const filepath1 = path.join(__dirname, "pliki")
//     fs.readdir(filepath1, (err, filesM) => {
//         if (err) throw err
//         console.log(filesM)
//         filesM.forEach(fileM => {
//             console.log(fileM)
//             contextFolder = { filesM: fileM }
//             res.render("manager.hbs", contextFolder)
//         });
//     })
// }
// function mkdir(req,res) {
//     const filepath2 = path.join(__dirname, "pliki", contextFolder.name)
//     if (!fs.existsSync(filepath2)) {
//         fs.mkdir(filepath2, (err) => {
//             if (err) throw err
//             readFolder(req, res)

//         })
//     }
// }

app.post("/createFile", function (req, res) {
    res.redirect("/manager")
})


app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})