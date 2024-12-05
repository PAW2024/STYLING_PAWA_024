const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi Multer untuk mengunggah gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Mock user data (email and password)
const users = [
    { email: "user@example.com", password: "password123", todos: [], images: [] }
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Sign In Page
app.get("/", (req, res) => {
    res.render("signin", { error: null });
});

// Handle Sign In
app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
        // Redirect to Home if login is successful
        res.redirect(`/home?email=${encodeURIComponent(email)}`);
    } else {
        // Reload Sign In page with error message
        res.render("signin", { error: "Account not found or invalid credentials." });
    }
});

// Sign Up Page
app.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

// Handle Sign Up
app.post("/signup", (req, res) => {
    const { email, password } = req.body;
    const userExists = users.find((u) => u.email === email);

    if (userExists) {
        // Reload Sign Up page with error message
        res.render("signup", { error: "Email is already in use." });
    } else {
        // Add new user and redirect to home page
        users.push({ email, password, todos: [], images: [] });
        res.redirect(`/home?email=${encodeURIComponent(email)}`);
    }
});

// Handle Add Todo
app.post("/todo", (req, res) => {
    const { email, title, description } = req.body;
    const user = users.find((u) => u.email === email);

    if (user) {
        user.todos.push({ title, description });
        res.redirect(`/todo?email=${encodeURIComponent(email)}`);
    } else {
        res.status(400).send("Invalid request");
    }
});

// Handle Delete Todo
app.post("/todo/delete", (req, res) => {
    const { email, index } = req.body;
    const user = users.find((u) => u.email === email);

    if (user && user.todos && user.todos.length > index) {
        user.todos.splice(index, 1);
        res.redirect(`/todo?email=${encodeURIComponent(email)}`);
    } else {
        res.status(400).send("Invalid request");
    }
});

// Handle Update Todo
app.post("/todo/update", (req, res) => {
    const { email, index, title, description } = req.body;
    const user = users.find((u) => u.email === email);

    if (user && user.todos && user.todos.length > index) {
        user.todos[index] = { title, description };
        res.redirect(`/todo?email=${encodeURIComponent(email)}`);
    } else {
        res.status(400).send("Invalid request");
    }
});

// Handle Contact Form Submission
app.post("/contact/send", (req, res) => {
    const { email, name, contactEmail, message } = req.body;
    console.log(`Received contact form submission from ${name} (${contactEmail}): ${message}`);
    res.redirect(`/contact?email=${encodeURIComponent(email)}`);
});

// Home Page
app.get("/home", (req, res) => {
    const email = req.query.email;
    res.render("home", { email });
});

// Contact Page
app.get("/contact", (req, res) => {
    const email = req.query.email;
    res.render("contact", { email });
});

// Todo Page
app.get("/todo", (req, res) => {
    const email = req.query.email;
    const user = users.find((u) => u.email === email);
    const todos = user ? user.todos : [];
    res.render("todo", { email, todos });
});

// Handle Image Upload
app.post("/upload", upload.single('image'), (req, res) => {
    const { email } = req.body;
    const user = users.find((u) => u.email === email);
    const imagePath = `/images/${req.file.filename}`;

    if (user) {
        user.images.push(imagePath);
        res.redirect(`/home?email=${encodeURIComponent(email)}`);
    } else {
        res.status(400).send("Invalid request");
    }
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
