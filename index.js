
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const port =process.env.PORT || 5000;
require("dotenv").config();

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t0p010p.mongodb.net/ecom-website?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const usersCollection = client.db("ecom-website").collection("userdata");

    const productsCollection = client.db("ecom-website").collection("products");


     // Endpoint to get all products
     app.get("/api/products", async (req, res) => {
      try {
        const products = await productsCollection.find().toArray();
        res.send(products);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
      }
    });

    // app.get("/country-name", async (req, res) => {
    //   const result = await countriesCollection.find({}).toArray();
    //   res.send(result);
    // });

    app.post("/userdata-post", async (req, res) => {
        const data = req.body;
        const result = await usersCollection.insertOne(data);
        res.send(result);
      });

    app.get("/", (req, res) => {
        res.send("App is Running Successfully");
      });
  
      app.listen(port, () => {
        console.log(`Application is running on port ${port}`);
      });
    
  }  catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
run().catch(console.dir);