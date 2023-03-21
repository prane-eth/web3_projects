// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BlockGoals is Initializable {
    struct Task {
        uint256 timestamp;
        string description;
        bool done;
        uint256 balance;
    }

    mapping(address => Task[]) private tasks;
    mapping(address => bool) private isWithdrawing; // to prevent reentrancy attack

    modifier nonReentrant() {
        // defining on our own without using OpenZeppelin
        require(!isWithdrawing[msg.sender], "BlockGoals: Already withdrawing");
        isWithdrawing[msg.sender] = true;
        _;
        isWithdrawing[msg.sender] = false;
    }

    function addTask(string memory _description) public payable {
        tasks[msg.sender].push(
            Task(block.timestamp, _description, false, msg.value)
        );
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks[msg.sender];
    }

    function finishTask(uint256 _index) public {
        require(
            _index < tasks[msg.sender].length,
            "BlockGoals: Index out of bounds"
        );

        // if task has balance, send it back to the creator
        withdrawForTask(_index);

        tasks[msg.sender][_index].done = true;
    }

    function deleteTask(uint256 _index) public {
        finishTask(_index); // if task is not finished, finish it first
        require(
            tasks[msg.sender][_index].balance == 0,
            "BlockGoals: Task has balance"
        );

        // delete item from array in solidity, reordering the array
        uint256 lastIndex = tasks[msg.sender].length - 1;
        for (uint256 i = _index; i < lastIndex; i++) {
            tasks[msg.sender][i] = tasks[msg.sender][i + 1];
        }
        tasks[msg.sender].pop();
    }

    function deposit(uint256 _index) public payable returns (bool) {
        require(msg.value > 0, "BlockGoals: Value must be greater than 0");
        require(
            msg.value < 10 ether,
            "BlockGoals: Value must be less than 10 Ether"
        );
        require(
            _index < tasks[msg.sender].length,
            "BlockGoals: Index out of bounds"
        );
        // make sure uint256 can hold the value
        require(
            tasks[msg.sender][_index].balance + msg.value >=
                tasks[msg.sender][_index].balance,
            "BlockGoals: Value too large"
        );
        tasks[msg.sender][_index].balance += msg.value;
        return true;
    }

    function withdrawForTask(uint256 _index) internal nonReentrant {
        uint256 amountToRefund = tasks[msg.sender][_index].balance;
        if (amountToRefund > address(this).balance) {
            amountToRefund = address(this).balance;
        }

        if (amountToRefund <= 0)
            return;
        
        (bool success, ) = msg.sender.call{value: amountToRefund}("");
        require(success, "BlockGoals: Failed to withdraw Ether");
        tasks[msg.sender][_index].balance = tasks[msg.sender][_index].balance - amountToRefund;
        
        // if no enough ether, refund partially
        // if task is finished, remaining amount is refunded after task is deleted
    }

    receive() external payable {
        revert("BlockGoals: Fallback function fallback() not allowed");
    }

    fallback() external payable {
        revert("BlockGoals: Fallback function fallback() not allowed");
    }
}
