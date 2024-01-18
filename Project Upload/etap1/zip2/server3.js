const fs = require("fs")
const path = require("path")

// if (!fs.existsSync("./newdir")) {
//     fs.mkdir("./newdir", (err) => {
//         if (err) throw err
//         console.log("jest");
//     })
// }

// if (fs.existsSync("./newdir")) {
//     fs.rmdir("./newdir", (err) => {
//         if (err) throw err
//         console.log("nie ma ");
//     })
// }

// if (!fs.existsSync("./newdir")) {
//     fs.mkdir("./newdir", (err) => {
//         if (err) throw err
//         console.log("jest");
//         if (fs.existsSync("./newdir")) {
//             fs.rmdir("./newdir", (err) => {
//                 if (err) throw err
//                 console.log("nie ma ");
//             })
//         }
//     })
// }

// fs.readdir(__dirname, (err, files) => {
//     if (err) throw err
//     console.log("lista", files);
// })

// fs.readdir(__dirname, (err, files) => {
//     if (err) throw err
//     console.log("lista 1  - ", files);
// })

// fs.mkdir("./newdir", (err) => {
//     if (err) throw err
//     console.log("jest");
// })

// fs.readdir(__dirname, (err, files) => {
//     if (err) throw err
//     console.log("lista 2  - ", files);
// })

// fs.readdir(__dirname, (err, files) => {
//     if (err) throw err
//     console.log("lista 1  - ", files);

//     fs.mkdir("./newdir", (err) => {
//         if (err) throw err
//         console.log("dodany");

//         fs.readdir(__dirname, (err, files) => {
//             if (err) throw err
//             console.log("lista 2  - ", files);
//         })
//     })
// })
const filepath3 = path.join(__dirname, "files")
fs.readdir(__dirname, (err, files) => {
    if (err) throw err
    // foreach

    files.forEach((file) => {
        fs.lstat("filepath3", (err, stats) => {
            console.log(file, stats.isDirectory());
        })
    })

    // lub for of
    /*
    for (const f of files) {
      fs.lstat("filepath", (err, stats) => {
            console.log(f, stats.isDirectory());
        })

   }
    */


})