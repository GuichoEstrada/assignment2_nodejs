/********************************************************************************** 
 *ITE5315 – Assignment 2
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Luis Estrada Student ID: N01541627 Date: 10/29/2023
 * 
 * ********************************************************************************
 **/
// Import necessary modules for the application
// 'express' for creating node/express application
var express = require('express');
// 'path'module for file handling
var path = require('path'); 
// Create instance of express
var app = express(); 
const fs = require('fs');
// express-handlebars for view renders
const exphbs = require('express-handlebars'); 
const sections = require('express-handlebars-sections');
// setting port number for app, otherwise use default port number 3000
const port = process.env.port || 3000; 

// Template Engine Initialization
// Public directory where static files are served
app.use(express.static(path.join(__dirname, 'public')));
// Adding a custom file extension '.hbs' to the handlebars engine. 
const hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        // Highlight row if car class is "blank"
        setRowColor: function (value) {
            return value === '' ? 'highlight' : '';
        },
        // If car class is "blank", replace with "unknown"
        replaceBlank: function (value) {
            return value === '' ? 'unknown' : value;
        }
    }
});
app.engine('.hbs', hbs.engine);
// Selecting 'hbs' as the view engine.
app.set('view engine', 'hbs'); 

// Middleware for form data handling
app.use(express.urlencoded({ extended: true }));

// Routes
// Request handler for root route which renders index view with title
app.get('/', function (req, res) { 
    res.render('index', { title: 'Express' }); 
});

// Display invoice id
app.get('/allData/invoiceID/:index', async (req, res) => {
    // Extract the index parameter from the URL
    const index = req.params.index;
    // Establish file path to json data
    const filePath = './CarSales.json';
    // Read file asynchronously
    fs.readFile(filePath, 'utf8', (err, jsonString) => {
        // Throw an error if file reading fails
        if (err) {
            console.log('File read failed:', err);
            res.status(404).send('Error reading json data!');
            return;
        }
        try {
            // Parse the JSON data
            const data = JSON.parse(jsonString);
            // Find the record with the specified index
            const record = data[index];
            // If the record is found, render a view with the record data
            if (record) {
                res.render('invoiceID', { title: 'Invoice ID', invoice: record });
            } else {
                // If the record is not found, send a 404 status and message
                res.status(404).send('Invoice record not found!');
            }
        } catch (err) {
            // If there's an error parsing the JSON data, send a 500 status and message
            console.log('Error reading JSON data:', err);
            res.status(500).send('Error reading JSON data!');
        }
    });
});
//Search car by invoice ID
findDataByInvoiceID = (invoiceID) => {
    // Implement logic to search for data in your dataset
    const filePath = './CarSales.json';
    const jsonString = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonString);
    return data.find(item => item.InvoiceNo === invoiceID);
}
app.route('/search/invoiceID')
    .get((req, res) => {
        res.render('searchInvoice', { title: 'Search Invoice Page' });
    })
    .post((req, res) => {
        const { invoiceID } = req.body;
        console.log(req.body)
        // Implement logic to search for the corresponding data based on the invoiceID
        const result = findDataByInvoiceID(invoiceID); // Implement this function
        console.log(result)
        res.render('searchInvoice', { title: 'Search Car through Invoice ID', result });
});

//Search car by Manufacturer
findDataByManufacturer = (Manufacturer) => {
    // Implement logic to search for data in your dataset
    const filePath = './CarSales.json';
    const jsonString = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonString);
    return data.find(item => item.Manufacturer === Manufacturer);
}
app.route('/search/Manufacturer')
    .get((req, res) => {
        res.render('searchManufacturer', { title: 'Search Manufacturer Page' });
    })
    .post((req, res) => {
        const { Manufacturer } = req.body;
        console.log(req.body)
        // Implement logic to search for the corresponding data based on the Manufacturer
        const result = findDataByManufacturer(Manufacturer); // Implement this function
        console.log(result)
        res.render('searchManufacturer', { title: 'Search Car through Manufacturer', result });
});

// Display all JSON data
app.get('/allData', async (req, res) => {
    // Establish file path to json data
    const filePath = './CarSales.json';
    // Read file asynchronously
    fs.readFile(filePath, "utf8", (err, jsonString) => {
        // Throw error is file reading fails
        if (err) {
          console.log("File read failed:", err);
          res.status(404).send("Error reading json data!")
          return;
        }
        // If successful, send appropriate status code and message and 
        // display data
        try {
            const data = JSON.parse(jsonString);
            res.render('allData', { title: 'All Car Sales Data', sales: data });
        // If not, throw error regarding failed reading of data
        } catch (err) {
            console.log('Error reading JSON data:', err);
            res.status(500).send('Error reading JSON data!');
        }
    });
});

// Display all JSON data with class
app.get('/allDataClass', async (req, res) => {
    // Establish file path to json data
    const filePath = './CarSales.json';
    // Read file asynchronously
    fs.readFile(filePath, "utf8", (err, jsonString) => {
        // Throw error is file reading fails
        if (err) {
          console.log("File read failed:", err);
          res.status(404).send("Error reading json data!")
          return;
        }
        // If successful, send appropriate status code and message and 
        // display data
        try {
            const data = JSON.parse(jsonString);
            res.render('allDataClass', { title: 'All Car Sales Data', sales: data });
        // If not, throw error regarding failed reading of data
        } catch (err) {
            console.log('Error reading JSON data:', err);
            res.status(500).send('Error reading JSON data!');
        }
    });
});

// Request handler for route '/users' which sends message
app.get('/users', function (req, res) { 
    res.send('respond with a resource'); 
}); 

// Error handler for requests to any other URL which renders error view
app.get('*', function (req, res) { 
    res.render('error', { title: 'Error', message: 'Wrong Route' }); 
}); 

// Port Listener for incoming requests
app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) })