const express = require("express");
const router = new express.Router();
const middleware = require("../middleware");
const ExpressError = require("../expressError");
global.items = middleware.readList();

router.get("/", function (req, res) {
  res.render("index.html");
});

router.get("/:name", function (req, res) {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  res.json(foundItem);
});

router.post("/", function (req, res, next) {
  try {
    if (!req.body.name || !req.body.price) {
      throw new ExpressError("Both name and price is required", 400);
    }
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);

    res.status(201).json({ added: newItem });
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", function (req, res) {
  if (!req.body.name && !req.body.price) {
    throw new ExpressError("Please input an updated name and price", 400);
  }
  const foundItem = items.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  if (req.body.name) {
    foundItem.name = req.body.name;
  }
  if (req.body.price) {
    foundItem.price = req.body.price;
  }

  res.json({ updated: foundItem });
});

router.delete("/:name", function (req, res) {
  const foundItem = items.findIndex((item) => item.name === req.params.name);
  if (foundItem === -1) {
    throw new ExpressError("Item not found", 404);
  }
  items.splice(foundItem, 1);

  res.json({ message: "Deleted" });
});

module.exports = router;
