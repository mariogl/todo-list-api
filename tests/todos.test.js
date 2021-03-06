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

  describe("GET single ToDo", () => {
    const testedToDo = initialToDos[0];
    const id = testedToDo._id;
    const getOneUrl = `${endpoints.get}/${id}`;
    test("should require authorization", async () => {
      await api.get(getOneUrl).expect(statusCodes.unauthorized);
    });

    test("should return the requested ToDo", async () => {
      const res = await api
        .get(getOneUrl)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(statusCodes.ok)
        .expect("Content-Type", /json/);

      expect(res.body.id).toBe(testedToDo._id);
      expect(res.body.description).toBe(testedToDo.description);
      expect(res.body.done).toBe(testedToDo.done);
    });
  });

  describe("POST ToDo", () => {
    const newToDo = {
      description: "ToDo 4 description",
      priority: 1,
      done: false,
    };
    test("should require authorization", async () => {
      await api
        .post(endpoints.post)
        .send(newToDo)
        .expect(statusCodes.unauthorized);
    });

    test("should return the created ToDo", async () => {
      const res = await api
        .post(endpoints.post)
        .set("Authorization", `Bearer ${authToken}`)
        .send(newToDo)
        .expect(statusCodes.ok)
        .expect("Content-Type", /json/);

      expect(res.body.id).toBe(newToDo._id);
      expect(res.body.description).toBe(newToDo.description);
      expect(res.body.done).toBe(newToDo.done);
    });

    test("should add a ToDo to database", async () => {
      await api
        .post(endpoints.post)
        .set("Authorization", `Bearer ${authToken}`)
        .send(newToDo)
        .expect(statusCodes.ok);

      const res = await api
        .get(endpoints.get)
        .set("Authorization", `Bearer ${authToken}`);

      expect(
        res.body.data.some((toDo) => toDo.description === newToDo.description)
      ).toBe(true);
    });
  });

  describe("PUT ToDo", () => {
    const testedToDo = initialToDos[0];
    const modifiedToDo = {
      id: testedToDo._id,
      description: "New description",
      priority: 1,
      done: true,
    };
    const id = modifiedToDo.id;

    test("should require authorization", async () => {
      await api
        .put(endpoints.put)
        .send(modifiedToDo)
        .expect(statusCodes.unauthorized);
    });

    test("should return the old ToDo", async () => {
      const res = await api
        .put(endpoints.put)
        .set("Authorization", `Bearer ${authToken}`)
        .send(modifiedToDo)
        .expect(statusCodes.ok)
        .expect("Content-Type", /json/);

      expect(res.body.id).toBe(modifiedToDo._id);
      expect(res.body.description).toBe(testedToDo.description);
      expect(res.body.done).toBe(testedToDo.done);
    });

    test("should modify the ToDo in database", async () => {
      await api
        .put(endpoints.put)
        .set("Authorization", `Bearer ${authToken}`)
        .send(modifiedToDo)
        .expect(statusCodes.ok);

      const getOneUrl = `${endpoints.get}/${id}`;
      const res = await api
        .get(getOneUrl)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.body.id).toBe(modifiedToDo.id);
      expect(res.body.description).toBe(modifiedToDo.description);
      expect(res.body.done).toBe(modifiedToDo.done);
    });
  });

  describe("DELETE ToDo", () => {
    const testedToDo = initialToDos[0];
    const id = testedToDo._id;
    const deleteUrl = `${endpoints.delete}/${id}`;
    test("should require authorization", async () => {
      await api.delete(deleteUrl).expect(statusCodes.unauthorized);
    });

    test("should receive OK from database", async () => {
      await api
        .delete(deleteUrl)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(statusCodes.ok);
    });

    test("should remove the requested ToDo", async () => {
      await api.delete(deleteUrl).set("Authorization", `Bearer ${authToken}`);
      const res = await api
        .get(endpoints.get)
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.body.data.some((toDo) => toDo.id === id)).toBe(false);
    });
  });
});
