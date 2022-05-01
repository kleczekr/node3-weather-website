const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Raf Kle",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Raf Kle",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Raf Kle",
    message: "You need to do this or that",
  });
});

app.get("/weather", (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error: 'Our geocoding software could not recognize the location, please try reviewing the query.'
            })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: 'The weather service API seems to be down, sorry for the inconvenience!'
                })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term.",
    });
  }

  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Help Not Found",
    name: "Raf Kle",
    message: "The help article was not found.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    name: "Raf Kle",
    message: "The page was not found.",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
