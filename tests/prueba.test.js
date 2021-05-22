const mongoose = require("mongoose");
const supertest = require("supertest");
const ToDo = require("../db/models/todo");
require("../db");
const { app, initializeServer } = require("../server");
const statusCodes = require("../server/statusCodes");

const api = supertest(app);

const initialToDos = [
  {
    description: "ToDo 1 description",
    priority: 3,
    done: false,
    user: "60a348a0e1776793ee94acb5",
  },
  {
    description: "ToDo 2 description",
    priority: 1,
    done: true,
    user: "60a348a0e1776793ee94acb5",
  },
];

const endpoints = {
  get: "/todos",
  auth: "/users/login",
};

let server;
beforeAll(() => {
  const port = process.env.PORT_TEST ?? 5030;
  server = initializeServer(port);
});

beforeEach(async () => {
  await ToDo.deleteMany({});
  await Promise.all([
    ToDo.create(initialToDos[0]),
    ToDo.create(initialToDos[1]),
  ]);
  await api
    .post(endpoints.auth)
    .send({
      username: "mariogl",
      password: "mariogl",
    })
    .expect(200);
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});

describe("GET ToDos", () => {
  test("should require authorization", async () => {
    await api.get(endpoints.get).expect(statusCodes.unauthorized);
  });

  /* test("response contains n ToDos", async () => {
    const response = await api.get(endpoints.get);
    expect(response.body.error).toBeNull();
    expect(response.body.data).toHaveLength(initialToDos.length);
  });

  test("response contain a ToDo", async () => {
    const response = await api.get(endpoints.get);
    const descriptions = response.body.data.map((toDo) => toDo.description);
    expect(response.body.error).toBeNull();
    expect(descriptions).toContain("ToDo 1 description");
  }); */
});
