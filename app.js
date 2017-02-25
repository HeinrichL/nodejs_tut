const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var port = process.env.PORT || 3000;
var app = express();

// Partials registrieren
hbs.registerPartials(__dirname + "/views/partials");

// Handlebars als Viewengine nutzen
app.set('viewengine', hbs);


// Middleware Funktion
app.use((req, resp, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile("server.log", log + '\n', (err) => {
        if (err) {
            console.log(err);
        }
    });
    next();
});

// app.use((req, resp, next) => {
//     resp.render("maintenance.hbs");
// });

// Statische Seiten bekannt machen
app.use(express.static(__dirname + "/public"));

// Helper Funktion
hbs.registerHelper("year", () => {
    return new Date().getFullYear();
});

// Helper Funktion mit Argumenten
hbs.registerHelper("screamIt", (text) => {
    return text.toUpperCase();
})

app.get("/", (req, resp) => {
    // home.hbs rendern und Key-Value Paare übergeben 
    resp.render("home.hbs", {
        pageTitle: "Home Page",
        welcomeMessage: "Welcome to my page!"
    });
});

app.get("/about", (req, resp) => {
    resp.render("about.hbs", {
        pageTitle: "About Page",
    });
});

app.get("/bad", (req, resp) => {
    resp.send({
        status: "404",
        description: "Data not found"
    });
});

// 404 abfangen
app.use(function (req, res, next) {
    res.status(404).send("<h1>Sorry can't find that!</h1>");
});

app.listen(port, () => {
    console.log("Server is up on port " + port);
});