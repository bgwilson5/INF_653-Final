const State = require('../model/State');
const statesJson = require('../model/states.json');

  //Returns a single random fact for the given state

const getRandomFact = async (req, res) => {
  // Get all fun facts for the given state
  const state = await State.findOne({ statecode: req.params.state });
  const facts = state?.funfacts;

  // Results were found
  if (!facts || facts.length === 0) {
    // Find the state
    const stateName = statesJson.find(
      (state) => state.code === req.params.state
    ).state;

    // Return JSON message that no facts found
    res.json({ message: `No Fun Facts found for ${stateName}` });
  } else {
    // Choose random fact
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    // Return the fact as json
    res.json({
      funfact: randomFact,
    });
  }
};

//Create a new random fact entry in the database

const createFact = async (req, res) => {
  // Ensure a fun fact object was passed in the request body
  if (!req?.body?.funfacts) {
    return res.status(400).json({ message: 'State fun facts value required' });
  }
  // Ensure the funfacts value is an array
  if (!Array.isArray(req.body.funfacts)) {
    return res
      .status(400)
      .json({ message: 'State fun facts value must be an array' });
  }

  // Check if an entry for this state already exists
  const state = await State.findOne({ statecode: req.params.state }).exec();

  if (state) {
    // Push new funfacts
    state.funfacts.push(...req.body.funfacts);

    // Save the modified entry
    const result = await state.save();

    // Return the saved results
    res.json(result);
  } else {
    // If no, create a new entry
    try {
      const result = await State.create({
        statecode: req.params.state,
        funfacts: [...req.body.funfacts],
      });

      // Return the results
      res.status(201).json(result);
    } catch (error) {
      console.log(error);
    }
  }
};

//Modify an existing fact entry

const modifyFact = async (req, res) => {
  // Store params for readability
  const stateCode = req?.params?.state;
  const index = req?.body?.index;
  const funfact = req?.body?.funfact;

  // Ensure an index value was provided in the request body
  if (!index) {
    return res.status(400).json({
      message: 'State fun fact required',
    });
  }
  // Ensure a funfact value was provided
  if (!funfact) {
    return res.status(400).json({
      message: 'State fun fact is required',
    });
  }

  // Check entry for the state
  const state = await State.findOne({ statecode: stateCode }).exec();

  if (!state) {
    // No state record found in database
    // Find the name of the state
    const stateName = statesJson.find(
      (state) => state.code === stateCode
    ).state;

    // Return JSON message that no facts were found
    res.json({ message: `No Fun Facts found for ${stateName}` });
  } else if (!state.funfacts[index - 1]) {
    // Invalid index
    // Find the name of the state
    const stateName = statesJson.find(
      (state) => state.code === stateCode
    ).state;

    res.json({ message: `No Fun Fact found at that index for ${stateName}` });
  } else {
    // Modify the found entry
    state.funfacts[index - 1] = funfact;

    // Save the modified entry
    const result = await state.save();

    // Return the saved results
    res.json(result);
  }
};

//Delete an existing fact entry
  
const deleteFact = async (req, res) => {
  // Store the undex and state
  const stateCode = req?.params?.state;
  const index = req?.body?.index;

  // Ensure all required parameters were provided
  if (!index) {
    return res.status(400).json({
      message: 'State fun fact index value required',
    });
  }

  // Check if an entry for this state exists
  const state = await State.findOne({ statecode: stateCode }).exec();

  if (!state) {
    // No state record found in database
    // Find the name of the state
    const stateName = statesJson.find(
      (state) => state.code === stateCode
    ).state;

    // Return JSON message that no facts were found
    res.json({ message: `No Fun Facts found for ${stateName}` });
  } else if (!state.funfacts[index - 1]) {
    // Invalid index
    // Find the name of the state
    const stateName = statesJson.find(
      (state) => state.code === stateCode
    ).state;

    res.json({ message: `No Fun Fact found at that index for ${stateName}` });
  } else {
    // Modify the found entry
    state.funfacts.splice(index - 1, 1);

    // Save the modified entry
    const result = await state.save();

    // Return the saved results
    res.json(result);
  }
};

// Export all functions
module.exports = {
  getRandomFact,
  createFact,
  modifyFact,
  deleteFact,
};