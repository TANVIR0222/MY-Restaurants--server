const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

//
const uri = `mongodb+srv://my-res:iUARMgIWJAqw2JWp@cluster0.htwfwrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("myres").collection("menu");
    const reviewCollection = client.db("myres").collection("reviews");
    const cardCollection = client.db("myres").collection("cards");
    const userCollection = client.db('myres').collection('user')


    // user data send 
    app.post('/user', async(req,res)=>{
      const user = req.body;
      // Google Sing in  inserted  email google email
      const query  =  {email : user.email}
      const existingUser = await userCollection.findOne(query)

      if(existingUser){
        return res.send({message : 'user alredy existing ' , insertedId : null})
      }

      const result = await userCollection.insertOne(user)
      res.send(result);
    })

    // date get database
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    // reviews get database
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // card data add card
    app.get("/cards", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cardCollection.find(query).toArray();
      res.send(result);
    });

    // card collection send data data base
    app.post("/cards", async (req, res) => {
      const cardItem = req.body;
      const result = await cardCollection.insertOne(cardItem);
      res.send(result);
    });

    //   card collection delet data base
    app.delete("/cards/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new  ObjectId(id) };
      const result = await cardCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
