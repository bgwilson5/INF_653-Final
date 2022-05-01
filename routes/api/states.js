const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const funfactsController = require('../../controllers/funfactsController');
const verifyState = require('../../middleware/verifyState');

// Returns data for all states
router.route('/').get(statesController.getAllStates);

// Returns all data for a single state
router.route('/:state').get(verifyState, statesController.getState);

// Returns a state name and capital city
router
  .route('/:state/capital')
  .get(verifyState, statesController.getStateCapital);

// Returns a state name and nickname
router
  .route('/:state/nickname')
  .get(verifyState, statesController.getStateNickname);

// Returns a state name and population
router
  .route('/:state/population')
  .get(verifyState, statesController.getStatePopulation);

// Returns a state name and admission date
router
  .route('/:state/admission')
  .get(verifyState, statesController.getStateAdmission);

// State fun facts
router
  .route('/:state/funfact')
  .get(verifyState, funfactsController.getRandomFact)
  .post(verifyState, funfactsController.createFact)
  .patch(verifyState, funfactsController.modifyFact)
  .delete(verifyState, funfactsController.deleteFact);

module.exports = router;