import express from "express";
import cors from "cors";
import { db, connectToDb } from "./db.js";
const app = express();
app.use(express.json());
app.use(cors());
app.post("/:name", (req, res) => {
  const { name } = req.params;
  const upvote = req.body.upvote;
  res.send(`Article ${name} has ${upvote}`);
});
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;

  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});
app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;

  await db.collection("articles").updateOne(
    { name },
    {
      $inc: { upvotes: 1 },
    }
  );

  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.json(article);
  } else {
    res.send("That article doesn't exist");
  }
});
app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  await db.collection("articles").updateOne(
    { name },
    {
      $push: {
        comments: { postedBy, text },
      },
    }
  );
  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.json(article);
  } else {
    res.send("That article doesn't exist");
  }
});

connectToDb(() => {
  console.log("Successfully connected to db");
  app.listen(8000, () => {
    console.log(`Server is Listening on 8000`);
  });
});
