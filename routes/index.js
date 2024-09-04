const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true }));

// Import models
const allToys = require('../models/alltoys');
const girlsToys = allToys.filter(toy => toy.type === 'girls');
const boysToys = allToys.filter(toy => toy.type === 'boys');

// Routes
router.get('/', (req, res) => {
    res.send('Welcome Home !!!');
});

router.get('/home', (req, res) => {
    res.render('Homepage');
});

// Route to display JSON data for girls' toys
router.get('/toysgirls-json', (req, res) => {
    res.json(girlsToys); 
});

// Route to display JSON data for boys' toys
router.get('/toysboys-json', (req, res) => {
    res.json(boysToys);
});

// Route to display JSON data for boys' toys
router.get('/alltoys-json', (req, res) => {
    res.json(allToys); 
});

// Route to render EJS view for girls' toys
router.get('/toysgirls', (req, res) => {
    res.render('toysgirls', { toys: girlsToys });
});

// Route to render EJS view for boys' toys
router.get('/toysboys', (req, res) => {
    res.render('alltoys', { toys: boysToys });
});

// Route to render EJS view for all' toys
router.get('/alltoys', (req, res) => {
    res.render('alltoys', { toys: allToys }); 
});

// GET route to display the form
router.get('/add-toy', (req, res) => {
    res.render('addToy');
});

const getNextId = (type, toysArrays) => {
    // Check if toysArrays is an array and contains arrays
    if (!Array.isArray(toysArrays) || !toysArrays.every(Array.isArray)) {
        throw new Error('toysArrays should be an array of arrays');
    }

    // Combine arrays and filter by type
    const toysByType = toysArrays.flat().filter(toy => toy.type === type);

    // Calculate the max ID and return the next ID
    const maxId = toysByType.reduce((max, toy) => Math.max(max, toy.id || 0), 0);
    return maxId + 1;
};

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
        targetArray = girlsToys;
    } else if (type === 'boys') {
        targetArray = boysToys;
    } else if (type ==="all") {
        targetArray = allToys;
    }else {
        return res.status(400).send('Invalid type');
    }

    // Calculate the next available ID for the specific type
    let newId;
    try {
        newId = getNextId(type, [boysToys, girlsToys, allToys]);
    } catch (error) {
        return res.status(500).send(error.message);
    }

    const newToy = { id: newId, name, type, url };
    targetArray.push(newToy);

    // If you update the combined allToys, ensure consistency
    if (type === 'all') {
        // Ensure allToys reflects changes if updated
        const index = allToys.findIndex(toy => toy.id === newId);
        if (index === -1) {
            allToys.push(newToy);
        }
    } else {
        // Also ensure allToys reflects changes for boys and girls
        allToys.push(newToy);
    }

    res.redirect('/home');
});

module.exports = router;
