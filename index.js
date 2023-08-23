const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


const tweetSchema = new mongoose.Schema({
    tweet: {
        type: Object,
        required: true,
    },
});

// Create a model using the schema
const Tweet = mongoose.model('Tweet', tweetSchema);


const app = express();
app.use(bodyParser.json());

app.use(cors());

app.options('*', cors()); // Enable preflight requests for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization,type');
    next();
});
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    // Send a 200 OK response to the preflight request
    res.sendStatus(200);
});

const dbUrl = 'mongodb+srv://mixture030030:LbWt4b2FKbyNyme7@cluster0.hhx3g5d.mongodb.net/extension?retryWrites=true&w=majority';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 5000, // 5 seconds
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.post('/save-post', async (req, res) => {
    try {
        const { tweet } = req.body;

        // Create a new Post document using the Mongoose model
        const newTweet = new Tweet({
            tweet,
        });

        // Save the document to the 'post' collection
        const savedPost = await newTweet.save();

        // Respond with the _id of the saved document
        res.json({ tweetId: savedPost._id });
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ error: 'An error occurred while saving the post' });
    }
});

app.get('/fetch-tweet/:id', async (req, res) => {
    try {
        const tweetId = req.params.id;

        // Use the tweetId to query the Post collection in your Mongoose model
        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            return res.status(404).json({ error: 'tweet not found' });
        }

        // Respond with the fetched tweet data
        res.json({ tweet: tweet.tweet }); // Assuming your tweet data is stored under the 'tweet' field
    } catch (error) {
        console.error('Error fetching tweet:', error);
        res.status(500).json({ error: 'An error occurred while fetching the tweet' });
    }
});
app.get('/', async (req, res) => {
    const tweetId = '64e66c979d29d1735a66b8ff';
    const tweet = await Tweet.findById(tweetId);
    res.json({ tweet: tweet }); // Assuming your tweet data is stored under the 'tweet' field
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
