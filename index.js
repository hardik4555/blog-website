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

// In-memory data store
// let posts = [
//   {
//     id: 1,
//     title: "The Rise of Decentralized Finance",
//     content:
//       "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
//     author: "Alex Thompson",
//     date: "2023-08-01T10:00:00Z",
//   },
//   {
//     id: 2,
//     title: "The Impact of Artificial Intelligence on Modern Businesses",
//     content:
//       "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
//     author: "Mia Williams",
//     date: "2023-08-05T14:30:00Z",
//   },
//   {
//     id: 3,
//     title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
//     content:
//       "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
//     author: "Samuel Green",
//     date: "2023-08-10T09:15:00Z",
//   },
// ];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//

//CHALLENGE 1: GET All posts
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
//CHALLENGE 2: GET a specific post by id
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

//CHALLENGE 3: POST a new post
app.post('/posts',async(req,res)=>
{
  // const newPost={
  //   id: lastId+1,
  //   title: req.body.title,
  //   content: req.body.content,
  //   author: req.body.author,
  //   date:new Date()
  // }
  // lastId++;
  // posts.push(newPost);
  // res.status(201).json(newPost);

  try {
    const {title, content, author}=req.body;
    const newPost= await db.query("INSERT into articles (title, content, author, date) VALUES ($1, $2, $3, $4) RETURNING *",[title, content, author, new Date()])
    res.status(201).json(newPost.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error creating post" });
  }
})

//CHALLENGE 4: PATCH a post when you just want to update one parameter

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

//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete("/posts/:id", async (req, res) => {
  // const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  // if (index === -1) return res.status(404).json({ message: "Post not found" });

  // posts.splice(index, 1);
  // res.json({ message: "Post deleted" });

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
