const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json()); 

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

// Route to display JSON data 
router.get('/toysgirls-json', (req, res) => {
    res.json(girlsToys); 
});

router.get('/toysboys-json', (req, res) => {
    res.json(boysToys);
});
router.get('/alltoys-json', (req, res) => {
    res.json(allToys); 
});

// Route to render EJS view 
router.get('/toysgirls', (req, res) => {
    res.render('alltoys', { toys: girlsToys , type: 'Girls'});
});
router.get('/toysboys', (req, res) => {
    res.render('alltoys', { toys: boysToys , type: 'Boys'});
});
router.get('/alltoys', (req, res) => {
    res.render('alltoys', { toys: allToys , type: 'All'}); 
});

// GET route to display the form
router.get('/add-toy', (req, res) => {
    res.render('addToy');
});

// GET Route to display the update form
router.get('/updateToy/:id', (req, res) => {
    const toyId = parseInt(req.params.id, 10);
    const toy = allToys.find(t => t.id === toyId);
    if (!toy) {
        return res.status(404).send('Toy not found');
    }
    res.render('updateToy', { toy });
});

// GET route to delete the form
router.get('/delete-toy', (req, res) => {
    res.render('DeleteToy');
});

const getNextId = (toysArray) => {
    if (!Array.isArray(toysArray)) {
        throw new Error('toysArray should be an array');
    }
    const maxId = toysArray.reduce((max, toy) => Math.max(max, toy.id || 0), 0);
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
       // Calculate the next available ID
       let newId;
       try {
           newId = getNextId(allToys);
       } catch (error) {
           return res.status(500).send(error.message);
       }

    const newToy = { id: newId, name, type, url };
    targetArray.push(newToy);
    // If you update the combined allToys, ensure consistency
    if (type === 'all') {
        const index = allToys.findIndex(toy => toy.id === newId);
        if (index === -1) {
            allToys.push(newToy);
        }
    } else {
        allToys.push(newToy);
    }
    res.redirect('/home');
});

// Route to handle the update form submission
router.post('/updateToy/:id', (req, res) => {
    const toyId = parseInt(req.params.id, 10);
    const { name, url, type } = req.body;
    const toyIndex = allToys.findIndex(t => t.id === toyId);

    if (toyIndex === -1) {
        return res.status(404).send('Toy not found');
    }
    // Remove the toy from its current category array
    const oldToy = allToys[toyIndex];
    if (oldToy.type === 'girls') {
        const girlsIndex = girlsToys.findIndex(t => t.id === toyId);
        if (girlsIndex !== -1) {
            girlsToys.splice(girlsIndex, 1);
        }
    } else if (oldToy.type === 'boys') {
        const boysIndex = boysToys.findIndex(t => t.id === toyId);
        if (boysIndex !== -1) {
            boysToys.splice(boysIndex, 1);
        }
    }
    // Update the toy in allToys
    const updatedToy = { id: toyId, name, url, type };
    allToys[toyIndex] = updatedToy;
    // Add the toy to the correct category array
    if (type === 'girls') {
        girlsToys.push(updatedToy);
    } else if (type === 'boys') {
        boysToys.push(updatedToy);
    }
    res.redirect('/alltoys');
});

// Route to handle toy deletion
router.get('/deleteToy/:id', (req, res) => {
    const toyId = parseInt(req.params.id, 10);
    const toyIndex = allToys.findIndex(t => t.id === toyId);
    if (toyIndex === -1) {
        return res.status(404).send('Toy not found');
    }
    // Find the toy to delete
    const toyToDelete = allToys[toyIndex];
    // Remove from allToys
    allToys.splice(toyIndex, 1);
    // Remove from the respective category array
    if (toyToDelete.type === 'girls') {
        const girlsIndex = girlsToys.findIndex(t => t.id === toyId);
        if (girlsIndex !== -1) {
            girlsToys.splice(girlsIndex, 1);
        }
    } else if (toyToDelete.type === 'boys') {
        const boysIndex = boysToys.findIndex(t => t.id === toyId);
        if (boysIndex !== -1) {
            boysToys.splice(boysIndex, 1);
        }
    }
    res.redirect('/alltoys');
});

module.exports = router;
