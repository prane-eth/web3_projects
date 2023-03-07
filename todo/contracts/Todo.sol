//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Todo is Ownable {
    struct Task {
        address addedBy;
        uint256 timestamp;
        string description;
        bool done;
        uint256 balance;
    }

    mapping(address => Task[]) public tasks;

    function addTask(string memory _description) public payable {
        tasks[msg.sender].push(Task(msg.sender, block.timestamp, _description, false, msg.value));
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks[msg.sender];
    }

    function finishTask(uint256 _index) public returns (bool) {
        require(_index < tasks[msg.sender].length, "Index out of bounds");
        require(
            tasks[msg.sender][_index].addedBy == msg.sender,
            "Only creator can finish the task"
        );

        // if task has balance, send it back to the creator
        withdrawForTask(tasks[msg.sender][_index]);
        tasks[msg.sender][_index].done = true;
        return true;
    }

    function deleteTask(uint256 _index) public {
        require(_index < tasks[msg.sender].length, "Index out of bounds");
        require(
            tasks[msg.sender][_index].addedBy == msg.sender,
            "Only creator can finish the task"
        );
        withdrawForTask(tasks[msg.sender][_index]);

        // delete item from array in solidity, reordering the array
        uint256 lastIndex = tasks[msg.sender].length - 1;
        for (uint256 i = _index; i < lastIndex; i++) {
            tasks[msg.sender][i] = tasks[msg.sender][i + 1];
        }
        tasks[msg.sender].pop();
    }

    function deposit(uint256 _index) public payable returns (bool) {
        require(msg.value > 0, "Value must be greater than 0");
        require(_index < tasks[msg.sender].length, "Index out of bounds");
        require(
            tasks[msg.sender][_index].addedBy == msg.sender,
            "Only creator can finish the task"
        );
        tasks[msg.sender][_index].balance += msg.value;
        return true;
    }

    function withdrawForTask(Task memory task) internal {
        uint256 amountToRefund = task.balance;
        if (amountToRefund <= 0) {
            return;
        }

        // if contract has lesser Ether (possible only when all amount is refunded to owner)
        if (address(this).balance < amountToRefund) {
            amountToRefund = address(this).balance;
        }

        // send all Ether to owner
        (bool success, ) = msg.sender.call{value: amountToRefund}("");
        require(success, "Failed to refund Ether");
    }

    // to call when contract should be closed
    function refundToOwner() public onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Failed to refund Ether to owner");
    }
}
