const statesJson = require('../model/states.json');

/* 
Verifies that a valid state code has been passed as a url parameter 
Results:
  - If no state code is included, returns a 400 error and message
  - If the state code is valid, converts the value to uppercase and reattaches it to the request, passing it to the next function
  - If the state code is invalid, returns a 400 error and message
*/
const verifyState = (req, res, next) => {
  // Store the state code for readability
  const stateCode = req?.params?.state?.toUpperCase();

  // Check that a state code was provided
  if (!stateCode) {
    return res.status(400).json({ message: 'State abbreviation required' });
  }

  // Get an array of all valid state codes
  const validStateCodes = statesJson.map((state) => state.code);

  // Check if the given code is valid
  if (validStateCodes.indexOf(stateCode) !== -1) {
    // Reattach the capitalized state code to the request and continue
    req.params.state = stateCode;
    next();
  } else {
    // todo
    res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }
};

module.exports = verifyState;