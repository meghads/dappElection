var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  var electionInstance;

  it("initializes with two candidates", function() {
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("it initializes the candidates with the correct values", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidates(1);
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "Candidate 1", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "Candidate 2", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    });
  });

  it("allows a voter to cast a vote", async function() {
    electionInstance = await Election.deployed();
    const candidateId = 1;
  
    const receipt = await electionInstance.vote(candidateId, { from: accounts[0] });
  
    console.log(receipt.logs); // Debug to check structure of logs
  
    // Verify the event was triggered and its structure
    assert.equal(receipt.logs.length, 1, "an event was triggered");
    assert.equal(receipt.logs[0].event, "VotedEvent", "the event type is correct");
  
    // Access the event argument
    const eventArg = receipt.logs[0].args.candidateId;
    assert(eventArg !== undefined, "the event argument is not undefined");
  
    // Convert to number and check the value
    assert.equal(eventArg.toNumber(), candidateId, "the candidate id is correct");
  
    // Verify the voter is marked as having voted
    const voted = await electionInstance.voters(accounts[0]);
    assert(voted, "the voter was marked as voted");
  
    // Check the vote count was updated
    const candidate = await electionInstance.candidates(candidateId);
    const voteCount = candidate[2];
    assert.equal(voteCount.toNumber(), 1, "increments the candidate's vote count");
  });
  
  


  it("throws an exception for invalid candiates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    });
  });
  it("throws an exception for double voting", async function() {
    electionInstance = await Election.deployed();
    const candidateId = 2;
  
    await electionInstance.vote(candidateId, { from: accounts[1] });
    const candidate = await electionInstance.candidates(candidateId);
    assert.equal(candidate.voteCount.toNumber(), 1, "accepts first vote");
  
    try {
      await electionInstance.vote(candidateId, { from: accounts[1] });
      assert.fail("should have thrown an exception for double voting");
    } catch (error) {
      assert(error.message.includes('revert'), "error message must contain revert");
  
      // Verify candidate vote counts remain as expected
      const candidate1 = await electionInstance.candidates(1);
      assert.equal(candidate1.voteCount.toNumber(), 1, "candidate 1 vote count is unchanged");
  
      const candidate2 = await electionInstance.candidates(2);
      assert.equal(candidate2.voteCount.toNumber(), 1, "candidate 2 vote count is unchanged");
    }
  });
  
});