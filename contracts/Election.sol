//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates and fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;

    // voted event
    event VotedEvent(uint indexed candidateId);

    // Constructor
    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
    }

    function vote(uint candidateId) public {
        // Ensure the voter hasn't voted before
        require(!voters[msg.sender], "You have already voted.");

        // Ensure the candidate ID is valid
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate ID.");

        // Record that the voter has voted
        voters[msg.sender] = true;

        // Update the candidate's vote count
        candidates[candidateId].voteCount++;

        // Trigger the voted event
        emit VotedEvent(candidateId);
    }
}
