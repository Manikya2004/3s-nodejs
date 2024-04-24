const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('./public'));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Create connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'manikya'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the database.');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Session middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req,res)=>{
    res.render('index')
})

// Routes for different pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/index'));
});

// Route to handle signup form submission
app.post('/signup', (req, res) => {
    const { name, phone, email, password } = req.body;

    const sql = 'INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, phone, email, password], (err, result) => {
        if (err) {
            return res.status(400).send(`
            <script>
            alert('Error: User already exists');
            window.location.href = '/signup.html';
            </script>
            `);
        }

        res.send(`
        <script>
        alert('Signup successful');
        window.location.href = '/';
        </script>
        `);
    });
});

// Route to handle login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).send(`
            <script>
            alert('Error: ${err.message}');
            window.location.href = '/login';
            </script>
            `);
        }

        if (result.length > 0) {
            const user = result[0];

            // Store user details in session
            req.session.user = user;
            req.session.account_no = user.account_no; // Store account_no in session

            res.redirect('/portal');
        } else {
            const script = `
            <script>
            alert('No user found.');
            window.location.href = '/login.html';
            </script>
            `;
            res.send(script);
        }
    });
});
app.get('/about', (req,res)=>{
    res.render('about')
})

app.get('/index', (req,res)=>{
    res.render('index')
})

app.get('/login', (req,res)=>{
    res.render('login')
})

app.get('/contact', (req,res)=>{
    res.render('contact')
})

app.get('/products', (req,res)=>{
    res.render('products')
})

app.get('/signup', (req,res)=>{
    res.render('signup')
})

app.listen(port,()=>{
    console.log('Server at 3000')
});
