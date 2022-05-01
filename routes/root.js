const express = require('express');
const router = express.Router();
const path = require('path');

// Returns the HTML index page
router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;