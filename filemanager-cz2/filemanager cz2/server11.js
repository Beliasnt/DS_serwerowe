const express = require("express");
const app = express();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
app.use(
	express.urlencoded({
		extended: true,
	})
);

const PORT = 4000;
const pliki = path.join(__dirname, "files");
let obraz;

const hbs = require("express-handlebars");
app.set("views", path.join(__dirname, "views")); // ustalamy katalog views
app.engine("hbs", hbs({ defaultLayout: "main.hbs" })); // domyślny layout, potem można go zmienić
app.set("view engine", "hbs"); // określenie nazwy silnika szablonów

app.get("/", function (req, res) {
	let f = [];
	let d = [];
	fs.readdir(pliki, (err, files) => {
		console.log(files);
		files.forEach((file) => {
			fs.lstat(pliki + "/" + file, (err, stats) => {
				if (stats.isDirectory() == true) {
					obraz = path.join("gfx", "folder.png");
					d.push({
						obraz: obraz,
						nazwa: file,
					});
					context.d = d;
				} else {
					obraz = path.join("gfx", "file.png");
					f.push({
						obraz: obraz,
						nazwa: file,
					});
					context.f = f;
				}
				console.log(stats.isDirectory(), file);
			});
		});
		let context = {};
		setTimeout(() => {
			res.render("filemanager.hbs", context);
		}, 200);
	});
});

app.get("/filemanagerP", function (req, res) {
	console.log(req.query.nazwaPliku);
	let plik = req.query.nazwaPliku;
	let filepath = path.join(__dirname, "files", plik + ".txt");
	fs.readdir(pliki, (err, files) => {
		if (err) throw err;
		console.log("lista", files);
		if (fs.existsSync(filepath)) {
			console.log("plik istnieje");
		} else {
			fs.writeFile(filepath, "", (err) => {
				if (err) throw err;
				console.log("plik nadpisany");
				fs.readdir(pliki, (err, files) => {
					console.log(files);
					let f = [];
					let d = [];
					files.forEach((file) => {
						fs.lstat(pliki + "/" + file, (err, stats) => {
							if (stats.isDirectory() == true) {
								obraz = path.join("gfx", "folder.png");
								d.push({
									obraz: obraz,
									nazwa: file,
								});
								context.d = d;
							} else {
								obraz = path.join("gfx", "file.png");
								f.push({
									obraz: obraz,
									nazwa: file,
								});
								context.f = f;
							}
							console.log(stats.isDirectory(), file);
						});
					});
					let context = {};
					setTimeout(() => {
						res.render("filemanager.hbs", context);
					}, 200);
				});
			});
		}
	});
});

app.get("/filemanagerF", function (req, res) {
	console.log(req.query.nazwaFolderu);
	let folder = req.query.nazwaFolderu;
	let folderpath = path.join(__dirname, "files", folder);
	fs.readdir(pliki, (err, files) => {
		if (err) throw err;
		console.log("lista", files);
		if (fs.existsSync(folderpath)) {
			console.log("plik istnieje");
		} else {
			fs.mkdir(folderpath, (err) => {
				if (err) throw err;
				console.log("dodany");
				let f = [];
				let d = [];
				fs.readdir(pliki, (err, files) => {
					console.log(files);
					files.forEach((file) => {
						fs.lstat(pliki + "/" + file, (err, stats) => {
							if (stats.isDirectory() == true) {
								obraz = path.join("gfx", "folder.png");
								d.push({
									obraz: obraz,
									nazwa: file,
								});
								context.d = d;
							} else {
								obraz = path.join("gfx", "file.png");
								f.push({
									obraz: obraz,
									nazwa: file,
								});
								context.f = f;
							}
							console.log(stats.isDirectory(), file);
						});
					});
					let context = {};
					setTimeout(() => {
						res.render("filemanager.hbs", context);
					}, 200);
				});
			});
		}
	});
});

app.get("/rmfile", function (req, res) {
	console.log(req.query.nFile);
	let plik = req.query.nFile;
	let filepath = path.join(__dirname, "files", plik);
	fs.unlink(filepath, (err) => {
		if (err) throw err;
		console.log("czas 1: " + new Date().getMilliseconds());
		fs.readdir(pliki, (err, files) => {
			console.log(files);
			let f = [];
			let d = [];
			files.forEach((file) => {
				fs.lstat(pliki + "/" + file, (err, stats) => {
					if (stats.isDirectory() == true) {
						obraz = path.join("gfx", "folder.png");
						d.push({
							obraz: obraz,
							nazwa: file,
						});
						context.d = d;
					} else {
						obraz = path.join("gfx", "file.png");
						f.push({
							obraz: obraz,
							nazwa: file,
						});
						context.f = f;
					}
					console.log(stats.isDirectory(), file);
				});
			});
			let context = {};
			setTimeout(() => {
				res.render("filemanager.hbs", context);
			}, 200);
		});
	});
});

app.get("/rmdirectory", function (req, res) {
	console.log(req.query.nDir);
	let folder = req.query.nDir;
	let folderpath = path.join(__dirname, "files", folder);
	fs.rmdir(folderpath, (err) => {
		if (err) throw err;
		console.log("czas 1: " + new Date().getMilliseconds());
		fs.readdir(pliki, (err, files) => {
			console.log(files);
			let f = [];
			let d = [];
			files.forEach((file) => {
				fs.lstat(pliki + "/" + file, (err, stats) => {
					if (stats.isDirectory() == true) {
						obraz = path.join("gfx", "folder.png");
						d.push({
							obraz: obraz,
							nazwa: file,
						});
						context.d = d;
					} else {
						obraz = path.join("gfx", "file.png");
						f.push({
							obraz: obraz,
							nazwa: file,
						});
						context.f = f;
					}
					console.log(stats.isDirectory(), file);
				});
			});
			let context = {};
			setTimeout(() => {
				res.render("filemanager.hbs", context);
			}, 200);
		});
	});
});

app.post("/upload", function (req, res) {
	let form = formidable({});
	form.keepExtensions = true;
	form.multiples = true;
	form.uploadDir = pliki;
	form.parse(req, function (err, fields, files) {
		const isArray = Array.isArray(files.imagetoupload);
		console.log(files);
		if (isArray) {
			files.imagetoupload.forEach((element) => {
				let newPath = path.join(pliki, element.name);
				fs.rename(element.path, newPath, (err) => {
					if (err) throw err;
					let f = [];
					let d = [];
					fs.readdir(pliki, (err, files) => {
						console.log(files);
						files.forEach((file) => {
							fs.lstat(pliki + "/" + file, (err, stats) => {
								if (stats.isDirectory() == true) {
									obraz = path.join("gfx", "folder.png");
									d.push({
										obraz: obraz,
										nazwa: file,
									});
									context.d = d;
								} else {
									obraz = path.join("gfx", "file.png");
									f.push({
										obraz: obraz,
										nazwa: file,
									});
									context.f = f;
								}
								console.log(stats.isDirectory(), file);
							});
						});
						let context = {};
						setTimeout(() => {
							res.render("filemanager.hbs", context);
						}, 200);
					});
				});
			});
		} else {
			let newPath = path.join(pliki, files.imagetoupload.name);
			fs.rename(files.imagetoupload.path, newPath, (err) => {
				if (err) throw err;
				let f = [];
				let d = [];
				fs.readdir(pliki, (err, files) => {
					console.log(files);
					files.forEach((file) => {
						fs.lstat(pliki + "/" + file, (err, stats) => {
							if (stats.isDirectory() == true) {
								obraz = path.join("gfx", "folder.png");
								d.push({
									obraz: obraz,
									nazwa: file,
								});
								context.d = d;
							} else {
								obraz = path.join("gfx", "file.png");
								f.push({
									obraz: obraz,
									nazwa: file,
								});
								context.f = f;
							}
							console.log(stats.isDirectory(), file);
						});
					});
					let context = {};
					setTimeout(() => {
						res.render("filemanager.hbs", context);
					}, 200);
				});
			});
		}
	});
});

app.use(express.static("static"));

app.listen(PORT, function () {
	console.log("start serwera na porcie " + PORT);
});
