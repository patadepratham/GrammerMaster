import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import bcrypt from 'bcrypt';
import User from './models/userSchema.js';
import Score from './models/scoreSchema.js';
import Driver from './models/driverSchema.js';
import cors from 'cors';


const app = express();
const router = express.Router();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router); 


(async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/quizdb");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
})();


app.set('views', './views');

const questionSchema = new mongoose.Schema({
    question: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    answer: String
});

const Question = mongoose.model('Question', questionSchema);

app.post('/add-question', (req, res) => {
    const newQuestion = new Question({
        question: req.body.question,
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4,
        answer: req.body.answer
    });

    newQuestion.save()
        .then(() => res.json({ message: 'Question added successfully!' }))
        .catch(err => res.status(400).json({ error: err }));
});

const quizSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: String
});

const Quiz = mongoose.model('Quiz', quizSchema);

app.get('/api/questions', async (req, res) => {
    try {
        const questions = await Quiz.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log("Home Page");
    res.render('Home');
});

app.get('/searching-driver', (req, res) => {
    res.render('searching-driver');
});

app.get('/about', (req, res) => {
    console.log("Info Page");
    res.render('Info');
});

app.get('/Question', (req, res) => {
    res.render('Question');
});

app.get('/records', (req, res) => {
    console.log("record Page");
    res.render('Records-ride');
});

app.get('/acceptedride', (req, res) => {
    console.log("Accept Page");
    res.render('Acceptedride');
});

app.get('/login', (req, res) => {
    console.log("Login Page");
    res.render('Login');
});

app.get('/contact', (req, res) => {
    console.log("Contact Page");
    res.render('Contact');
});

app.get('/signup', (req, res) => {
    console.log("Signup Page");
    res.render('Signup', { error: null });
});

app.get('/profile', (req, res) => {
    console.log("Profile Page");
    res.render('Profile', { error: null });
});

app.get('/driverlogin', (req, res) => {
    console.log("DriverLogin Page");
    res.render('DriverLogin',{ error: null });
});

app.post("/driverlogin", async (req, res) => {
    const { duname, dpwd } = req.body;

    try {
        // Find the driver in the database
        const driver = await Driver.findOne({ duname });

        // If driver does not exist
        if (!driver) {
            return res.status(404).send('Driver not found');
        }

        // Trim and normalize whitespace in the submitted password
        const submittedPassword = dpwd.trim();

        // Trim and normalize whitespace in the hashed password from the database
        const databasePassword = driver.dpwd.trim();

        // Log information for debugging
        console.log('Submitted password:', submittedPassword);
        console.log('Length of submitted password:', submittedPassword.length);
        console.log('Hashed password from database:', databasePassword);
        console.log('Length of hashed password from database:', databasePassword.length);
        console.log('Comparing passwords...');

        // Compare the passwords after converting both to the same format and encoding
        const validPassword = await bcrypt.compare(submittedPassword, databasePassword);

        // Log the result of the comparison
        console.log('Is password valid?', validPassword);

        // If passwords match
        if (validPassword) {
            console.log('Password is valid');
            
            // Update the driver's availability status to true
            await Driver.findByIdAndUpdate(driver._id, { available: true });

            // Render the Driverprofile page
            res.render('Driverprofile', { username: driver.duname });
        } else {
            console.log('Invalid password');
            res.status(401).send('Invalid password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

app.post("/driversignup", async (req, res) => {
    const { uname, psw } = req.body;

    try {
        if (!uname || !psw) {
            return res.status(400).send('Username and password are required.');
        }

        // Check if the driver already exists in the database
        const existingDriver = await Driver.findOne({ duname: uname });
        if (existingDriver) {
            return res.status(400).send('Driver already exists. Please choose a different username.');
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(psw, saltRounds);

        // Create a new driver with hashed password
        const newDriver = new Driver({
            duname: uname,
            dpwd: hashedPassword
        });

        // Save the new driver to the database
        console.log("Saving new driver...");
        await newDriver.save();
        console.log("Driver registered successfully!");
        res.render('DriverLogin');
    } catch (error) {
        console.error('Error registering driver:', error);
        res.status(500).send('Error registering driver');
    }
});

app.get('//booking-confirmation', (req, res) => {
    console.log("DriverLogin Page");
    res.render('booking-confirmation',{ error: null });
});

app.get('/driversignup', (req, res) => {
    console.log("DriverSignup Page");
    res.render('DriverSignup', { error: null }); // Pass error as null initially
});

app.get('/driverprofile', (req, res) => {
    console.log("Driver Page");
    res.render('Driverprofile');
});

app.get('/driverRecord', (req, res) => {
    console.log("Driver Record");
    res.render('driverRecord');
});

app.get('/exercise', (req, res) => {
    console.log("Exercises Page");
    res.render('Exercise'); // Pass error as null initially
});

app.get('/leader', (req, res) => {
    console.log("Leaderboard Page");
    res.render('Leaderboard'); // Pass error as null initially
});

router.post('/api/update-score', async (req, res) => {
    const { userId, score } = req.body; // Ensure you are receiving the `userId` and `score` from the request body

    try {
        // Find the user by `uname` and update their score
        const userScore = await Score.findOneAndUpdate(
            { uname: userId }, // Match the `uname` field with `userId` (assuming this is the username)
            { $inc: { score: score } }, // Increment the score by the passed value
            { new: true, upsert: true } // Create a new record if one doesn't exist
        );

        if (userScore) {
            res.json({ message: 'Score updated successfully!', score: userScore.score });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

app.get("/api/leaderboard", async (req, res) => {
    try {
        const topUsers = await Score.find().sort({ score: -1 }).limit(10);
        res.json(topUsers);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).send('Error fetching leaderboard');
    }
});

// Signup route
app.post("/signup", async (req, res) => {
    const { uname, psw } = req.body;

    try {
        if (!uname || !psw) {
            return res.status(400).send('Username and password are required.');
        }
        const existingUser = await User.findOne({ uname });

        if (existingUser) {
            return res.status(400).send('User already exists. Please choose a different username.');
        }
        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(psw, saltRounds);

        // Create a new user
        const newUser = new User({
            uname,
            pwd: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();

        res.render('Login');
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send('Error signing up user');
    }
});


app.post("/login", async (req, res) => {
    const { username, pwd } = req.body;
    try {
        const user = await User.findOne({ uname: username });

        // If user does not exist
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Check if the password is correct
        const validPassword = await bcrypt.compare(pwd, user.pwd); // Changed password to pwd
        if (!validPassword) {
            return res.status(401).send('Invalid password');
        }

        // Successful login
        res.render('Profile', { username: user.uname });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});


app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send(`Something broke! Error: ${err.message}`);
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
