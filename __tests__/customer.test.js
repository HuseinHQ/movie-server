const request = require("supertest");
const app = require("../app");
const { Customer, sequelize } = require("../models");

const account = {
  username: "Husein",
  email: "mhusein463@mail.com",
  password: "Husein",
  phoneNumber: "089636990498",
  address: "Jl. Bhaskara VII No.33",
};

beforeAll(async () => {
  await Customer.create(account);
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Customers", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });
});

describe("POST /pub/register", () => {
  it("should return a json response that contains id and email", async () => {
    let body = {
      username: "Hasan",
      email: "mhasan463@mail.com",
      password: "Hasan",
      phoneNumber: "089636990498",
      address: "Jl. Bhaskara VII No.33",
    };

    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", expect.any(String));
  });

  it("should fail when email input is null", async () => {
    let body = {
      username: "Hasan",
      password: "Hasan",
      phoneNumber: "089636990498",
      address: "Jl. Bhaskara VII No.33",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  it("should fail when password input is null", async () => {
    let body = {
      username: "Hasan",
      email: "mhasan463@mail.com",
      phoneNumber: "089636990498",
      address: "Jl. Bhaskara VII No.33",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  it("should fail when email input is empty", async () => {
    let body = {
      username: "Hasan",
      email: "",
      password: "Hasan",
      phoneNumber: "089636990498",
      address: "Jl. Bhaskara VII No.33",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  it("should fail when password input is empty", async () => {
    let body = {
      username: "Hasan",
      email: "mhasan463@mail.com",
      password: "",
      phoneNumber: "089636990498",
      address: "Jl. Bhaskara VII No.33",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  it("should fail when email is already registered", async () => {
    let body = {
      username: "Husein",
      email: "mhusein463@mail.com",
      password: "Husein",
      phoneNumber: "089636990498",
      address: "Jl. Bhaskara VII No.33",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email already exists");
  });

  it("should fail when email input is not type of email", async () => {
    let body = {
      username: "Husein",
      email: "blablabla",
      password: "Husein",
      phoneNumber: "089636990498",
      address: "Jl. Bhaskara VII No.33",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Type must be Email");
  });
});

describe("POST /pub/login", () => {
  it("shoudl return a json response with acccess token", async () => {
    const login = {
      email: account.email,
      password: account.password,
    };

    const response = await request(app).post("/pub/login").send(login);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });

  it("shoudl fail if the inputed password is wrong", async () => {
    const login = {
      email: "mhusein463@mail.com",
      password: "klsajdnf",
    };

    const response = await request(app).post("/pub/login").send(login);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "invalid username or email or password");
  });

  it("shoudl fail if the inputed email is not registered in database", async () => {
    const login = {
      email: "apapa@mail.com",
      password: "klsajdnf",
    };

    const response = await request(app).post("/pub/login").send(login);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "invalid username or email or password");
  });
});
