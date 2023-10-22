const app = require("../app");
const { Favorite } = require("../models");
const request = require("supertest");
const { Customer, sequelize } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

let access_token;

beforeAll(async () => {
  // INITIALIZE SEEDERS
  const userDatas = require("../data/user.json").map((el) => {
    el.password = hashPassword(el.password);
    el.createdAt = el.updatedAt = new Date();
    return el;
  });

  const genreDatas = require("../data/genre.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    return el;
  });

  const movieDatas = require("../data/movie.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    return el;
  });

  await sequelize.queryInterface.bulkInsert("Users", userDatas);
  await sequelize.queryInterface.bulkInsert("Genres", genreDatas);
  await sequelize.queryInterface.bulkInsert("Movies", movieDatas);

  // CUSTOMER REGISTER & LOGIN
  const account = {
    email: "alice@example.com",
    password: "123456",
  };

  await Customer.create(account);
  const findCustomer = await Customer.findOne({
    where: { email: account.email },
  });

  access_token = generateToken({ id: findCustomer.id, email: findCustomer.email });

  // CUSTOMER FAVORITE A MOVIE
  await Favorite.create({
    CustomerId: 1,
    MovieId: 1,
  });

  await Favorite.create({
    CustomerId: 1,
    MovieId: 2,
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Movies", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });

  await sequelize.queryInterface.bulkDelete("Genres", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });

  await sequelize.queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });

  await sequelize.queryInterface.bulkDelete("Customers", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });

  await sequelize.queryInterface.bulkDelete("Favorites", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });
});

describe("GET /pub/favorites", () => {
  it("should return favorite movies where customerId is same as customer's login id", async () => {
    const response = await request(app).get("/pub/favorites").set({ access_token });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("CustomerId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("MovieId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("updatedAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("Movie", expect.any(Object));
    expect(response.body[0].Movie).toHaveProperty("id", expect.any(Number));
    expect(response.body[0].Movie).toHaveProperty("title", expect.any(String));
    expect(response.body[0].Movie).toHaveProperty("synopsis", expect.any(String));
    expect(response.body[0].Movie).toHaveProperty("trailerUrl", expect.any(String));
    expect(response.body[0].Movie).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0].Movie).toHaveProperty("rating", expect.any(Number));
    expect(response.body[0].Movie).toHaveProperty("genreId", expect.any(Number));
    expect(response.body[0].Movie).toHaveProperty("authorId", expect.any(Number));
    expect(response.body[0].Movie).toHaveProperty("status", "Active");
    expect(response.body[0].Movie).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0].Movie).toHaveProperty("updatedAt", expect.any(String));
  });

  it("should fail if customer is not logged when attemp to access favorites", async () => {
    const response = await request(app).get("/pub/favorites");

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  it("should fail if customer try to access favorites with fake access token", async () => {
    const response = await request(app).get("/pub/favorites").set({ access_token: "random-string" });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});

describe("POST /favorites", () => {
  it("should return the favorite detail, if the movies is already in customer's list", async () => {
    const response = await request(app).post("/pub/favorites").set({ access_token }).send({ id: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.newFavorite).toHaveProperty("id", expect.any(Number));
    expect(response.body.newFavorite).toHaveProperty("CustomerId", expect.any(Number));
    expect(response.body.newFavorite).toHaveProperty("MovieId", expect.any(Number));
    expect(response.body.newFavorite).toHaveProperty("createdAt", expect.any(String));
    expect(response.body.newFavorite).toHaveProperty("updatedAt", expect.any(String));
    expect(response.body).toHaveProperty("isCreated", false);
  });

  it("should return the new favorite detail, if the favorited movie is new", async () => {
    const response = await request(app).post("/pub/favorites").set({ access_token }).send({ id: 3 });

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.newFavorite).toHaveProperty("id", expect.any(Number));
    expect(response.body.newFavorite).toHaveProperty("CustomerId", expect.any(Number));
    expect(response.body.newFavorite).toHaveProperty("MovieId", expect.any(Number));
    expect(response.body.newFavorite).toHaveProperty("createdAt", expect.any(String));
    expect(response.body.newFavorite).toHaveProperty("updatedAt", expect.any(String));
    expect(response.body).toHaveProperty("isCreated", true);
  });

  it("should fail add to favorite when the movie id is not exists in database", async () => {
    const response = await request(app).post("/pub/favorites").set({ access_token }).send({ id: 100 });

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "error not found");
  });
});
