'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const jsonLookup = require('./public/javascript/jsonLookup');
const app = express();
const URL = "https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json",
    MANAGERS_PER_PAGE = 2,
    PORT = "3000";

let pageRefreshed = 1,
    deliveryForView = {},
    searchedString = "",
    currentPageNumber = 0,
    matchingManagers = [],
    managerDetails = {},
    totalPages = 0;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
        pageRefreshed = 1;
    }
    if (pageRefreshed) {
        pageRefreshed = 0;
        res.render('index');
    }
    else {
        deliveryForView = {};
        searchedString = req.query.search;
        currentPageNumber = req.query.pageNum;

        request(URL, function (err, response, body) {
            if (req.query.command === "searching") {
                matchingManagers = [];
                managerDetails = JSON.parse(body);
                jsonLookup.lookFor(matchingManagers, managerDetails, searchedString);
                // Filter duplicate manager names & emails
                matchingManagers = matchingManagers.filter(function(elem, index, self) {
                    return index === self.indexOf(elem);
                });
            }
            if (matchingManagers.length > 0 ) {
                deliveryForView[0] = matchingManagers.slice((currentPageNumber)*2, (currentPageNumber)*2 + MANAGERS_PER_PAGE);
                totalPages = Math.ceil(matchingManagers.length / MANAGERS_PER_PAGE);
                deliveryForView[1] = totalPages;
            }
            // Send a code (-1) to view to state that there is no more matchingManagers left
            else {
                deliveryForView[0] = [];
                deliveryForView[1] = -1;
            }

            res.send((deliveryForView));
        });
    }
});

app.listen(3000, function () {
    console.log('Now listening on port ' + PORT + "!")
});
