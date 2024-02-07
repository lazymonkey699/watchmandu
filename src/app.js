const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
require("./db/conn");
const User = require("./models/register");
const Watch = require("./models/watch");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "./public/Frontend");

app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/Frontend/index.html"));
});


app.post('/upload', async (req, res) => {
    try {
        const { title, description } = req.body;

        const newWatch = new Watch({
            title,
            description,
        });

        const savedWatch = await newWatch.save();

        res.status(201).json(savedWatch);
    } catch (error) {
        console.error('Error during watch upload:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});


app.get('/upload/all', async (req, res) => {
    try {
        const watches = await Watch.find();
        res.json(watches);
    } catch (error) {
        console.error('Error fetching watch data:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});


app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).send('User registered successfully!');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send('User is not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Invalid email or password');
        }

        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Internal Server Error: ${err.message}`);
});


app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
});
