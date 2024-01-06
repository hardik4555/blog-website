import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const db= new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog application",
  password: "kittukhushi@17",
  port: 5432,
})

db.connect();
const app = express();
const port = 4000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/posts',async(req,res)=>
{
  try {
    const result= await db.query("SELECT * FROM articles");
    const posts=result.rows;
    res.json(posts);
  } catch (error) {
    console.error("Error retrieving posts from database", error.message);
  }
})

app.get('/posts/:id',async(req,res)=>
{


  try {
    const id=req.params.id;
    const result= await db.query("SELECT * FROM articles WHERE id=$1", [id]);
    const post=result.rows[0];
    res.json(post);
  } catch (error) {
    console.error("Error retrieving post from database", error.message);
  }
})

app.post('/posts',async(req,res)=>
{

  try {
    const {title, content, author}=req.body;
    const newPost= await db.query("INSERT into articles (title, content, author, date) VALUES ($1, $2, $3, $4) RETURNING *",[title, content, author, new Date()])
    res.status(201).json(newPost.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error creating post" });
  }
})


app.patch("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, author } = req.body;
    console.log(`This is content : ${content}`);
    const updateQuery = `
      UPDATE articles
      SET
        ${title ? 'title=$1,' : ''}
        ${content ? 'content=$2,' : ''}
        ${author ? 'author=$3,' : ''}
        date=$4
      WHERE id = $5
    `;


    const values = [title, content, author, new Date(), id].filter(val => val !== undefined);
    console.log("SQL Query:", updateQuery);
    console.log("Values:", values);

    const result = await db.query(updateQuery, values);

    res.json({ message: "Post updated successfully" });
  } catch (e) {
    console.error("Error updating post", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/posts/:id", async (req, res) => {

  try{
    const {id}=req.params;
    const deletePost = await db.query("DELETE FROM articles WHERE id=$1",[id]);
    res.json("post was deleted");
  } catch(error)
  {
    console.error(error.message);
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
