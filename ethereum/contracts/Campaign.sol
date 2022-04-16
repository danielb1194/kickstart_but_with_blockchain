// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract campaignFactory {
    address [] public deployedCampaigns;

    function createCampaign(uint minimumContribution) public payable {
        require(msg.value > 0, "To create a campaign, you need to transfer funds to pay for the gas fees");

        address deployedCampaign = address(new campaign(minimumContribution, msg.sender));
        deployedCampaigns.push(deployedCampaign);
    }

    function getDeployedCampaigns() public view returns (address [] memory){
        return deployedCampaigns;
    }
}

contract campaign {
    struct Request {
        string description; // the description for the request
        uint value;         // the amount of money the manager wants to send
        address recipient;  // the entity that is going to receive the money
        bool isCompleted;   // marks the request as completed
        bool isCanceled;    // marks the request as canceled
        uint approvers;     // the number of backers that voted in pro of the request
    }

    Request [] public requests;
    address public manager;
    address payable [] public backersArr; // not using arrays due to the time it would take to find a backer (linear time) vs a mapping (constant time)
    uint minimumContribution; // the minimum contribution that each backer must make to the project
    mapping (address => uint) public backers; // stores the relation between a backer, and his/her contribution to the project
    mapping (address => Request []) public requestBackerRelations; // returns the requests that the baker supports

    // lets only the manager access a function
    modifier managerOnly() {
        require(msg.sender == manager, "This function can only be called by the manager"); // this is the code we are going to add to the modified function
        _; // this is where the rest of the code of the modified function will be
    }

    modifier backerOnly() {
        require(backers[msg.sender] >= minimumContribution, "This function can only be called by a backer");
        _; // this is where the rest of the code of the modified function will be
    }
    
    // get the address of whomever deployed this contract and make that the manager for the lottery
    constructor (uint minContribution, address newManager) {
        manager = newManager;
        minimumContribution = minContribution;
    }

    function createRequest(string memory description, uint value, address recipient) public managerOnly {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient, 
            isCompleted: false,
            isCanceled: false,
            approvers: 0
        });

        requests.push(newRequest);
    }

    // adds a participant to the lottery
    function back() public payable {
        // check that the user entered at least .001 ETH (Value must be in wei)
        require(msg.value >= minimumContribution, "You need to send at least the minimum contribution"); 

        backersArr.push(payable(msg.sender));
        backers[payable(msg.sender)] += msg.value;
    }

    // return the contract balance
    function returnBalance() public managerOnly view returns (uint) {
        return address(this).balance;
    }

    // getter function for backers
    function getBackers() public view returns (address payable [] memory) {
        return backersArr;
    }

    // getter function for requests
    function getRequests() public view returns (Request [] memory) {
        return requests;
    }

    // function used by a backer to approve a request (optimize)
    function approveRequest(uint index) public backerOnly {
        // check that the user is not already backing this request
        Request storage requestToBack = requests[index];
        Request [] memory backersApprovedRequests = requestBackerRelations[msg.sender];
        for (uint i = 0; i < backersApprovedRequests.length; i++) {
            require(keccak256(abi.encode(requestToBack)) == keccak256(abi.encode(backersApprovedRequests[i])), "You have already backed this request");
        }

        // if we get here, it means that the user has not backed this request (yet)
        requestToBack.approvers += 1;
        requestBackerRelations[msg.sender].push(requestToBack);
    }

    // returns the requests that a given backer address is currently approving
    function getBackerApprovedRequests(address backerAddress) public view managerOnly returns (Request [] memory) {
        require(backers[backerAddress] >= minimumContribution, "The given address is not a backer");

        return requestBackerRelations[backerAddress];
    }
}