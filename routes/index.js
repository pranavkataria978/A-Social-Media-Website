const express = require("express");
// Only one instance of express called new instance is not created
const router = express.Router();

const homeController = require('../controllers/home_controller');

router.get('/',homeController.home);

module.exports = router;