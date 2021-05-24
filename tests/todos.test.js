require("dotenv").config();
const mongoose = require("mongoose");
const supertest = require("supertest");
const ToDo = require("../db/models/todo");
const { app, initializeServer } = require("../server");
const statusCodes = require("../server/statusCodes");

const api = supertest(app);

const { MONGO_TEST_URL } = process.env;

let server;
let authToken;
const endpoints = {
  auth: "/users/login",
  get: "/todos",
  delete: "/todos/todo",
  post: "/todos/todo",
  put: "/todos/todo",
};
const initialToDos = [
  {
    _id: "60ab4728499fe334e8079d6c",
    description: "ToDo 1 description",
    priority: 3,
    done: false,
    user: "609fa121795dbe48a8a8b3ff",
  },
  {
    _id: "60ab4728499fe334e8079d6d",
    description: "ToDo 2 description",
    priority: 1,
    done: true,
    user: "609fa121795dbe48a8a8b3ff",
  },
];

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  const port = process.env.PORT_TEST ?? 5030;
  server = initializeServer(port);
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});

beforeEach(async () => {
  // Clean DB and create data
  await ToDo.deleteMany({});
  await Promise.all([
    ToDo.create(initialToDos[0]),
    ToDo.create(initialToDos[1]),
  ]);

  // JWT auth
  const res = await api
    .post(endpoints.auth)
    .send({
      username: "mariogl",
      password: "mariogl",
    })
    .expect(statusCodes.ok);
  if (res.body.token) {
    authToken = res.body.token;
  }
});

describe("ToDos endpoints", () => {
  describe("GET ToDos", () => {
    test("should require authorization", async () => {
      await api.get(endpoints.get).expect(statusCodes.unauthorized);
    });

    test("should return n ToDos", async () => {
      const res = await api
        .get(endpoints.get)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(statusCodes.ok)
        .expect("Content-Type", /json/);

      expect(res.body.data).toHaveLength(initialToDos.length);
    });
  });
});
