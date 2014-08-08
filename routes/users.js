var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send({
      user1 : {
          name : 'Jack'
      },
      user2 :{
          name : 'Jill'
      }
  });
});

module.exports = router;
