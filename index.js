const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000

const app = express()


// middlewere
app.use(cors())
app.use(express.json())



// database setup
const uri = "mongodb+srv://SmartDBUser:RnxtRcUr2zDHmJGs@cluster0.askanda.mongodb.net/?appName=Cluster0";
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
        await client.connect()

        const SmartDB = client.db("SmartDB");
        const productColl = SmartDB.collection("products");

        // get all products 
        app.get('/products', async (req, res) => {
            const cursor = productColl.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        //get a single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await productColl.findOne(quary);
            res.send(result)
        })

        // create or add a new porduct 
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productColl.insertOne(newProduct);
            res.send(result)
        })

        //update a single product
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const quary = { _id: new ObjectId(id) };
            const update = {
                $set: updatedProduct
            }
            const options = {}
            const result = await productColl.updateOne(quary, update, options);
            res.send(result)
        })

        //delete a single product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) };
            const result = await productColl.deleteOne(quary);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('hello')
    console.log("smart server is running");
})

app.listen(port, () => {
    console.log(`Smart server is running on port: ${port}`);
})