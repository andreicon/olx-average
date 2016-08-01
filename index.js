var cheerio = require('cheerio');
var request = require('request');
var express = require("express")
var app = express();
var bodyParser = require('body-parser');
var capitalize = require('./capitalize')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/pret-mediu', function(req, res) {
    request('http://olx.ro/imobiliare/apartamente-garsoniere-de-vanzare/'+req.query.oras+'/', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var prices = [];
            var total = 0;
            $('#offers_table tr').find('.td-price p strong').each(function(i, e){
                var price = parseInt($(e).html().replace(/\s/g, ''));
                prices[i] = price;
                total += price;
            });
            var average = total / prices.length;
            res.json(
                { 
                    success: 'true',
                    description: 'Today\'s average prices for appartments in '+ capitalize(req.query.oras),
                    'pretMediu': average
                }
            );   
        } else {
            res.json(
                { 
                    success: 'false',
                    description: 'Today\'s average prices for appartments in '+ capitalize(req.query.oras)
                }
            );
        }
    })

});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);



