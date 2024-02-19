const express = require("express");
const app = express();
const itemAPIRoutes = require("./routes/itemsAPI");
const ExpressError = require("./expressError");

app.use(express.json());
app.use("/api/items", itemAPIRoutes);

app.use(express.static("public"));

//404 handler
app.use((req, res, next) => {
  return next(new ExpressError("Not Found", 404));
});

//generic error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
  });
});

module.exports = app;
