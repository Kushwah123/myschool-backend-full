const express = require('express');
const {
  addVillage,
  getVillages,
  updateVillage,
  deleteVillage
} = require('../controllers/villageController');

const router = express.Router();

router.post('/add', addVillage);
router.get('/all', getVillages);
router.put('/:id', updateVillage);
router.delete('/:id', deleteVillage);

module.exports = router;
