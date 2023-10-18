const app = require("../app");
const request = require("supertest");
const { Customer, Favorite, sequelize } = require("../models/");
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
});

describe("GET /pub/movies", () => {
  it("should return movies with default size and page", async () => {
    const response = await request(app).get("/pub/movies");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(8);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("title", expect.any(String));
    expect(response.body[0]).toHaveProperty("synopsis", expect.any(String));
    expect(response.body[0]).toHaveProperty("trailerUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("rating", expect.any(Number));
    expect(response.body[0]).toHaveProperty("genreId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("status", "Active");
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
  });

  it("should return movies with default size, page and, provided filter", async () => {
    const query = {
      filter: 1, // Movie with genreId 1, Action
    };

    const response = await request(app).get("/pub/movies").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("title", expect.any(String));
    expect(response.body[0]).toHaveProperty("synopsis", expect.any(String));
    expect(response.body[0]).toHaveProperty("trailerUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("rating", expect.any(Number));
    expect(response.body[0]).toHaveProperty("genreId", 1);
    expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("status", "Active");
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
  });

  it("should return movies with provided page", async () => {
    const response = await request(app).get("/pub/movies").query({ page: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(8);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("title", expect.any(String));
    expect(response.body[0]).toHaveProperty("synopsis", expect.any(String));
    expect(response.body[0]).toHaveProperty("trailerUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("rating", expect.any(Number));
    expect(response.body[0]).toHaveProperty("genreId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("status", "Active");
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
  });

  it("should return one movie with provided movie id", async () => {
    const response = await request(app).get("/pub/movies/1").set({ access_token });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("title", expect.any(String));
    expect(response.body).toHaveProperty("synopsis", expect.any(String));
    expect(response.body).toHaveProperty("trailerUrl", expect.any(String));
    expect(response.body).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body).toHaveProperty("rating", expect.any(Number));
    expect(response.body).toHaveProperty("genreId", expect.any(Number));
    expect(response.body).toHaveProperty("authorId", expect.any(Number));
    expect(response.body).toHaveProperty("status", "Active");
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
  });

  it("should fail if provided movie id is not exists in database", async () => {
    const response = await request(app).get("/pub/movies/99").set({ access_token });

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "error not found");
  });
});
