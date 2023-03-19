// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockGoals is Ownable {
    struct Task {
        uint256 timestamp;
        string description;
        bool done;
        uint256 balance;
    }

    mapping(address => Task[]) public tasks;
    mapping(address => bool) private isWithdrawing;  // to prevent reentrancy attack

    modifier nonReentrant() {  // defining on our own without using OpenZeppelin
        require(!isWithdrawing[msg.sender], "BlockGoals: Already withdrawing");
        isWithdrawing[msg.sender] = true;
        _;
        isWithdrawing[msg.sender] = false;
    }

    function addTask(string memory _description) public payable {
        tasks[msg.sender].push(Task(block.timestamp, _description, false, msg.value));
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks[msg.sender];
    }

    function finishTask(uint256 _index) public {
        require(_index < tasks[msg.sender].length, "BlockGoals: Index out of bounds");

        // if task has balance, send it back to the creator
        withdrawForTask(tasks[msg.sender][_index]);

        tasks[msg.sender][_index].done = true;
    }

    function deleteTask(uint256 _index) public {
        require(_index < tasks[msg.sender].length, "BlockGoals: Index out of bounds");
        Task memory task = tasks[msg.sender][_index];
        withdrawForTask(task);
        require(task.done, "BlockGoals: Task not done");
        require(task.balance == 0, "BlockGoals: Task has balance");

        // delete item from array in solidity, reordering the array
        uint256 lastIndex = tasks[msg.sender].length - 1;
        for (uint256 i = _index; i < lastIndex; i++) {
            tasks[msg.sender][i] = tasks[msg.sender][i + 1];
        }
        tasks[msg.sender].pop();
    }

    function deposit(uint256 _index) public payable returns (bool) {
        require(msg.value > 0, "BlockGoals: Value must be greater than 0");
        require(_index < tasks[msg.sender].length, "BlockGoals: Index out of bounds");
        // make sure uint256 can hold the value
        require(
            tasks[msg.sender][_index].balance + msg.value >= tasks[msg.sender][_index].balance,
            "BlockGoals: Value too large"
        );
        tasks[msg.sender][_index].balance += msg.value;
        return true;
    }

    function withdrawForTask(Task memory task) internal nonReentrant {
        uint256 amountToRefund = 0 + task.balance;
        // without '0 +', task.balance value gets changed with amountToRefund

        // // using require() instead will make finishTask function fail to run if balance for task is 0
        // if (amountToRefund == 0)
        //     return;

        // if contract has lesser Ether (possible only when all amount is refunded to owner)
        if (address(this).balance < amountToRefund) {
            amountToRefund = address(this).balance;
        }

        if (amountToRefund > 0) {
            (bool success, ) = msg.sender.call{value: amountToRefund}("");
            require(success, "BlockGoals: Failed to withdraw Ether");
            task.balance -= amountToRefund;
        }

        // if no enough ether, refund partially
        // if task is finished, remaining amount is refunded after task is deleted
    }

    // to call when contract should be closed
    function refundToOwner() public onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "BlockGoals: Failed to refund Ether to owner");
    }
    function isOwner() public view returns (bool) {
        return msg.sender == owner();
    }

    receive() external payable {
        revert("BlockGoals: Fallback function receive() not allowed");
    }
    fallback() external payable {
        revert("BlockGoals: Fallback function fallback() not allowed");
    }
}
