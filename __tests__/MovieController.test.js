const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models/");
const { hashPassword } = require("../helpers/bcrypt");

beforeAll(async () => {
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
});

describe("GET /pub/movies", () => {
  it("should return movies by provided size and page", async () => {
    const response = await request(app).get("/pub/movies").query({ page: 1, size: 8 });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(8);
    expect(response.body[0]).toHaveProperty("title", expect.any(String));
    expect(response.body[0]).toHaveProperty("synopsis", expect.any(String));
    expect(response.body[0]).toHaveProperty("trailerUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("rating", expect.any(Number));
    expect(response.body[0]).toHaveProperty("genreId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
  });

  it("should return movies by provided size and page and filters", async () => {
    const query = {
      page: 1,
      size: 8,
      filter: 1, // Movie with genreId 1, Action
    };

    const response = await request(app).get("/pub/movies").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("title", expect.any(String));
    expect(response.body[0]).toHaveProperty("synopsis", expect.any(String));
    expect(response.body[0]).toHaveProperty("trailerUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("rating", expect.any(Number));
    expect(response.body[0]).toHaveProperty("genreId", 1);
    expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
  });
});
