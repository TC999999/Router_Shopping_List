process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const middleware = require("../middleware");
global.items = middleware.readList();

let pickles = { name: "pickles", price: "6.99" };

beforeEach(function () {
  items.length = 0;
  items.push(pickles);
  middleware.writeList(items);
});

afterEach(function () {
  items.length = 0;
  middleware.writeList(items);
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [pickles] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${pickles.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(pickles);
  });
  test("Responds with 404 for getting invalid name", async () => {
    const res = await request(app).get("/items/cookies");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item not found" });
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "milk", price: "9.99" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "milk", price: "9.99" } });
  });
  test("Responds with 400 if only name is missing", async () => {
    const res = await request(app).post("/items").send({ name: "apple" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Both name and price is required" });
  });
  test("Responds with 400 if only price is missing", async () => {
    const res = await request(app).post("/items").send({ price: "2.99" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Both name and price is required" });
  });
  test("Responds with 400 if both name and price are missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Both name and price is required" });
  });
});

describe("PATCH /items/:name", () => {
  test("Updating an item's name", async () => {
    const res = await request(app)
      .patch(`/items/${pickles.name}`)
      .send({ name: "cucumbers" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: "cucumbers", price: pickles.price },
    });
  });

  test("Updating an item's price", async () => {
    const res = await request(app)
      .patch(`/items/${pickles.name}`)
      .send({ price: "5.99" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: pickles.name, price: "5.99" },
    });
  });

  test("Updating an item's name and price", async () => {
    const res = await request(app)
      .patch(`/items/${pickles.name}`)
      .send({ name: "cucumbers", price: "5.99" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: "cucumbers", price: "5.99" },
    });
  });

  test("Responds with 400 if both name and price are missing", async () => {
    const res = await request(app).patch(`/items/${pickles.name}`).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "Please input an updated name and price",
    });
  });

  test("Responds with 404 if name is invalid", async () => {
    const res = await request(app)
      .patch(`/items/fish`)
      .send({ name: "salmon" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item not found" });
  });
});

describe("DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${pickles.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid name", async () => {
    const res = await request(app).delete("/items/eggs");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item not found" });
  });
});
