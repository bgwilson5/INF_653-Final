const State = require('../model/State');
const statesJson = require('../model/states.json');

// Returns all data for all states
const getAllStates = async (req, res) => {
  // Create varaible to hold the json from the states file and the db
  let stJson, dbJson;

  // Check if contig option provided
  if (req?.query?.contig == 'true') {
    // If contig is true, filter out AK and HI
    stJson = statesJson.filter(
      (state) => state.code !== 'AK' && state.code !== 'HI'
    );
    dbJson = await State.find();
  } else if (req?.query?.contig == 'false') {
    // If contig is false, return only AK and HI
    stJson = statesJson.filter(
      (state) => state.code === 'AK' || state.code === 'HI'
    );
    dbJson = await State.find();
  } else {
    // If contig not specified, return all states
    stJson = JSON.parse(JSON.stringify(statesJson));
    dbJson = await State.find();
  }

  const states = joinStatesWithFunFacts(stJson, dbJson);

  // Check if any data was found
  if (!states) {
    return res.status(204).json({ message: 'No states found.' });
  }

  // Return the data as json
  res.json(states);
};

// Returns all data for a single state
const getState = async (req, res) => {
  // Find the state and its fun facts
  const state = statesJson.find((state) => state.code === req.params.state);
  const dbJson = await State.find({ statecode: req.params.state });
  const result = joinStatesWithFunFacts([state], dbJson);

  // Respond with JSON
  // joinStates function returns an array, so for a single state the first element must be returned
  res.json(result[0]);
};

// Returns the capital of a given state
const getStateCapital = (req, res) => {
  // Find the state and its capital
  const state = statesJson.find((state) => state.code === req.params.state);

  // Return only the state name and capital
  res.json({
    state: state.state,
    capital: state.capital_city,
  });
};

// Returns the nickname of a given state
const getStateNickname = (req, res) => {
  // Find the state and its nickname
  const state = statesJson.find((state) => state.code === req.params.state);

  // Return only the state name and nickname
  res.json({
    state: state.state,
    nickname: state.nickname,
  });
};

// Returns the population of a given state
const getStatePopulation = (req, res) => {
  // Find the state and its population
  const state = statesJson.find((state) => state.code === req.params.state);

  // Return only the state name and population
  res.json({
    state: state.state,
    population: state.population.toLocaleString(),
  });
};

// Returns the population of a given state
const getStateAdmission = (req, res) => {
  // Find the state and its admission
  const state = statesJson.find((state) => state.code === req.params.state);

  // Return only the state name and admission
  res.json({
    state: state.state,
    admitted: state.admission_date,
  });
};

// Export all functions
module.exports = {
  getAllStates,
  getState,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmission,
};

// Takes an array of json objects for states and joins them with the fun facts from the database
const joinStatesWithFunFacts = (statesJson, dbJson) => {
  return statesJson.map((stateJson) => {
    // Get the state code
    const stateCode = stateJson.code;

    // Deep copy the json to avoid adding funfacts to the stateJson in cache
    let result = { ...stateJson };

    // Find the matching fun facts in the dbJson, if any
    const facts = dbJson.find((state) => state.statecode === stateCode);

    // Join the fun facts to the stateJson
    if (facts?.funfacts?.length > 0 && facts.funfacts !== []) {
      result.funfacts = facts.funfacts;
    }

    // Return the result
    return result;
  });
};