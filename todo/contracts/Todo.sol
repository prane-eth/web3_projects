//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Todo {
    address payable owner;
    struct Task {
        bytes32 id;
        address addedBy;
        uint256 timestamp;
        string description;
        bool done;
        uint256 balance;
    }

    constructor() payable {
        owner = payable(msg.sender);
        console.log("Deploying a TodoList with one task");
        addTask("Deploy my first contract");
    }

    Task[] public tasks;

    function addTask(string memory _description) public {
        bytes32 id = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        tasks.push(Task(id, msg.sender, block.timestamp, _description, false, 0));
        console.log("%s has created a task:", msg.sender);
    }

    function getTaskCount() public view returns (uint256) {
        return tasks.length;
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks;
    }

    function finishTask(bytes32 _id) public returns (bool) {
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                // only creator can finish the task
                require(
                    tasks[i].addedBy == msg.sender,
                    "Only creator can finish the task"
                );

                tasks[i].done = true;
                bool status = withdrawForTask(tasks[i]);
                if (status) {
                    tasks[i].balance = 0;
                }
                return true;
            }
        }
        return false;
    }

    function deleteTask(bytes32 _id) public returns (bool) {
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                // only creator can finish the task
                require(
                    tasks[i].addedBy == msg.sender,
                    "Only creator can finish the task"
                );

                // if task has balance, send it back to the creator
                withdrawForTask(tasks[i]);

                // delete item from array in solidity, reordering the array
                tasks[i] = tasks[tasks.length - 1];
                for (uint256 j = i; j < tasks.length - 1; j++) {
                    tasks[j] = tasks[j + 1];
                }
                tasks.pop();
                return true;
            }
        }
        return false;
    }

    // https://solidity-by-example.org/payable/, https://solidity-by-example.org/sending-ether/
    function deposit(bytes32 _id) public payable returns (bool) {
        uint256 amount = msg.value;

        if (amount == 0) {
            return false;
        }
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i].balance += amount;
                return true;
            }
        }
        // if we get here, the task was not found. refund the sender
        address payable sender = payable(msg.sender);
        (bool success, ) = sender.call{value: amount}("");
        require(success, "Failed to refund the deposited Ether");

        return false;
    }

    function withdrawForTask(Task memory task) private returns (bool) {
        uint256 amount = task.balance;
        if (amount <= 0) {
            return false;
        }

        // if contract has lesser Ether
        if (address(this).balance < amount) {
            amount = address(this).balance;
        }

        // send all Ether to owner
        // Owner can receive Ether since the address of owner is payable
        address payable sender = payable(msg.sender);
        (bool success, ) = sender.call{value: amount}("");
        require(success, "Failed to send Ether");
        if (success) {
            // task.balance = 0;
            return true;
        }
        return false;
    }

    function refundToOwner() public returns (bool) {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
        return success;
    }
}
