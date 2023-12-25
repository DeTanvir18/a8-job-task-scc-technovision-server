const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:5174', 'https://scc-tech.web.app'],
        credentials: true,
    }),
)
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tl5czkc.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const userCollection = client.db('sccTech').collection('users');
        const taskCollection = client.db('sccTech').collection('tasks');

        // user api
        // for posting/adding individual user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })




        // task api
        // to get all the tasks
        app.get('/tasks', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result);
        })
        // for adding a task
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });
        // for updating a task
        app.patch('/tasks/update/:id', async (req, res) => {
            const task = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    title: task.title,
                    description: task.description,
                    deadline: task.deadline,
                    priority: task.priority,
                }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc)
            res.send(result);
        })
        // for deleting a meal by admin
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tl5czkc.mongodb.net/?retryWrites=true&w=majority`;


// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
//         // const jobCollection = client.db('careerHunter').collection('jobsByCategory');
//         // const appliedJobCollection = client.db('careerHunter').collection('appliedJobs');
//         const userCollection = client.db('sccTech').collection('users');

//         // // to get all the jobs
//         // app.get('/jobs', async (req, res) => {
//         //   const result = await jobCollection.find().toArray();
//         //   res.send(result);
//         // })
//         // // to get a specific job
//         // app.get('/jobdetails/:id', async (req, res) => {
//         //   const id = req.params.id;
//         //   const query = { _id: new ObjectId(id) }
//         //   const result = await jobCollection.findOne(query);
//         //   res.send(result);
//         // })
//         // // to get specific user's jobs from collection by filter
//         // app.get('/jobs/:email', async (req, res) => {
//         //   const email = req.params.email;
//         //   const query = { email: email };
//         //   const result = await jobCollection.find(query).toArray();
//         //   res.send(result);
//         // })
//         // // to add a car job jobCollection
//         // app.post('/jobs', async (req, res) => {
//         //   const newJob = req.body;
//         //   const result = await jobCollection.insertOne(newJob);
//         //   res.send(result);
//         // })
//         // // to update a job
//         // app.put('/jobs/:id', async (req, res) => {
//         //   const id = req.params.id;
//         //   const filter = { _id: new ObjectId(id) }
//         //   const options = { upsert: true };
//         //   const updatedJob = req.body;

//         //   const job = {
//         //     $set: {
//         //       category: updatedJob.category,
//         //       postedBy: updatedJob.postedBy,
//         //       email: updatedJob.email,
//         //       employer: updatedJob.employer,
//         //       jobTitle: updatedJob.jobTitle,
//         //       postingDate: updatedJob.postingDate,
//         //       deadline: updatedJob.deadline,
//         //       salaryRange: updatedJob.salaryRange,
//         //       applicantsNumber: updatedJob.applicantsNumber,
//         //       companyLogo: updatedJob.companyLogo,
//         //       jobBanner: updatedJob.jobBanner,
//         //       description: updatedJob.description
//         //     }
//         //   }

//         //   const result = await jobCollection.updateOne(filter, job, options);
//         //   res.send(result);
//         // })
//         // // to increase the number of applicants when anyone applies
//         // app.post('/updatejobs/:id', async (req, res) => {
//         //   const id = req.params.id;
//         //   const query = { _id: new ObjectId(id) };
//         //   const result = await jobCollection.updateOne(query, { $inc: { applicantsNumber: 1 } });
//         //   res.send(result);
//         // })
//         // // to delete a job from collection 
//         // app.delete('/jobs/:id', async (req, res) => {
//         //   const id = req.params.id;
//         //   const query = { _id: new ObjectId(id) }
//         //   const result = await jobCollection.deleteOne(query);
//         //   res.send(result);
//         // })





//         // // to get specific user's applied jobs from collection by filter
//         // app.get('/appliedjobs/:email', async (req, res) => {
//         //   const email = req.params.email;
//         //   const query = { email: email };
//         //   const result = await appliedJobCollection.find(query).toArray();
//         //   res.send(result);
//         // })
//         // // to add a user in appliedJobCollection
//         // app.post('/appliedjobs', async (req, res) => {
//         //   const newAppliedUser = req.body;
//         //   const result = await appliedJobCollection.insertOne(newAppliedUser);
//         //   res.send(result);
//         // })



//         // for posting/adding individual user
//         app.post('/users', async (req, res) => {
//             const user = req.body;
//             const query = { email: user.email }
//             const existingUser = await userCollection.findOne(query);
//             if (existingUser) {
//                 return res.send({ message: 'user already exists', insertedId: null })
//             }
//             const result = await userCollection.insertOne(user);
//             res.send(result);
//         })


//     } finally {
//     }
// }
// run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('SCC Technovision server is running')
})

app.listen(port, () => {
    console.log(`SCC Technovision server is running on port: ${port}`)
})