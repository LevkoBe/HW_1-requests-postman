const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { isUtf8 } = require("buffer");

const app = express();
const ipAdress = "127.0.0.1";
const port = 3000;

const whitelist = ["http://127.0.0.1:3000", "http://127.0.0.1:3001"];
const corsOptions = {
    origin: originFunction,
};
function originFunction (origin, callback) {
    if (whitelist.includes(origin) || !origin) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}

function sendPage(req, res) {
    fs.readFile('index.html', function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    })
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({message: "This is url 'http://127.0.0.1:3000'. If you want to speak with manager, redirect to 'http://127.0.0.1:3000/manager'. Thank you for visiting us."});
});
app.get('/manager', (req, res) => {
    res.json({manager: "Hi there! I am manager! If you have anything to share, feel free to tell me! I'm all yours! If you want instead\
    to see the webpage created by my web-developers, go to the link 'http://127.0.0.1:3000/website.org'. But if you want to continue chat,\
    visit 'http://127.0.0.1:3000/chat'"});
});
app.post('/chat', (req, res) => {
    const { expression } = req.body;
    if (expression) {
        res.json({ manager: `I knew one person, very smart one, that always said '${expression}'. The person was very smart! Hope you are as well!`});
    } else {
        res.status(400).json({ error: "You are not smart! Politely yours, manager♥"});
    }
});
app.get('/website.org', (req, res) => {
    sendPage(req, res);
});

app.listen(port, ipAdress, () => {
    console.log(`Server is running at 'http://${ipAdress}:${port}/`);
});
