const express = require('express')
const path = require('path')
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000

var toppings = { "toppings" : [
  { title : "pepperoni"},
  { title : "peppers"},
  { title : "pickles"} ]};

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .get('/api/v1.0/toppings', function(req, res) {
    for (index=0;index<toppings.toppings.length; index++) {
    toppings.toppings[index]["id"] = index + 1;
    }
    res.json(toppings);
  })
  .get('/api/v1.0/toppings/:id', function(req, res) {
    if(toppings.toppings.length <= req.params.id-1 || req.params.id < 0) {
      res.statusCode = 404;
      return res.send('Error 404: No topping found');
    }
    var t = toppings.toppings[req.params.id - 1];
    t["id"] = req.params.id;
    res.json({topping : t});
  })
  .put('/api/v1.0/toppings/:id', function(req, res) {
    if(!req.body.hasOwnProperty('title')) {
      res.statusCode = 400;
      return res.send('Error 400: Post syntax incorrect.');
    }
  
    toppings.toppings[req.params.id -1] = {
      title : req.body.title,
      id : req.params.id
    };
  
    res.json(true);
  })
  .post('/api/v1.0/toppings', function(req, res) {
    if(!req.body.hasOwnProperty('title')) {
      res.statusCode = 400;
      return res.send('Error 400: Post syntax incorrect.');
    }
    var newid = toppings.toppings.length;
    var newTopping = {
      title : req.body.title
    };
  
    toppings.toppings.push(newTopping);
    res.json(true);
  })
  .delete('/api/v1.0/toppings/:id', function(req, res) {
    if(toppings.toppings.length <= req.params.id-1) {
      res.statusCode = 404;
      return res.send('Error 404: No quote found');
    }
    toppings.toppings.splice(req.params.id-1, 1);
    res.json(true);
  })
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/demo.html', (req, res) => res.render('pages/db'))
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))