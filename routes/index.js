const express = require('express');
const router = express.Router();

// Import models
const boys = require('../models/toysboys');
const girls = require('../models/toysgirls');

// Routes
router.get('/', (req, res) => {
    res.send('Welcome Home !!!');
});

router.get('/home', (req, res) => {
    res.render('Homepage');
});

// Route to display JSON data for girls' toys
router.get('/toysgirls-json', (req, res) => {
    res.json(girls); // Return JSON response
});

// Route to display JSON data for boys' toys
router.get('/toysboys-json', (req, res) => {
    res.json(boys); // Return JSON response
});

// Route to render EJS view for girls' toys
router.get('/toysgirls', (req, res) => {
    res.render('toysGirls', { toys: girls }); // Render EJS template with the toys data
});

// Route to render EJS view for boys' toys
router.get('/toysboys', (req, res) => {
    res.render('toysBoys', { toys: boys }); // Render EJS template with the toys data
});

// GET route to display the form
router.get('/add-toy', (req, res) => {
    res.render('addToy');
});

// POST route to handle form submissions
router.post('/add-toy', (req, res) => {
    if (!req.body) {
        return res.status(400).send('No data received');
    }

    const { name, type, url } = req.body;
    
    if (!name || !type || !url) {
        return res.status(400).send('Name, type, and URL are required');
    }

    let targetArray;
    if (type === 'girls') {
        targetArray = girls;
    } else if (type === 'boys') {
        targetArray = boys;
    } else {
        return res.status(400).send('Invalid type');
    }

    const maxId = targetArray.reduce((max, toy) => Math.max(max, toy.id), 0);
    const newId = maxId + 1;

    const newToy = { id: newId, name, type, url };
    targetArray.push(newToy);

    res.redirect('/home');
});

module.exports = router;
