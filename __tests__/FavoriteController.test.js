const app = require("../app");
const { Favorite } = require("../models/");
const request = require("supertest");
const { Customer, sequelize } = require("../models/");
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

    console.log(response.body);

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
});
