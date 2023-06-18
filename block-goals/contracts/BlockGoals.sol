// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract BlockGoals is Initializable, ReentrancyGuardUpgradeable {
    struct Task {
        uint256 timestamp;
        bytes32 description;
        bool done;
        uint256 balance;
    }

    mapping(address => Task[]) private tasks;

    function initialize() external initializer {
        __ReentrancyGuard_init();
    }

    function addTask(string memory _description) external payable {
        bytes32 _bytes = bytes32(bytes(_description));
        tasks[msg.sender].push(Task(block.timestamp, _bytes, false, msg.value));
    }

    function deposit(uint256 _index) external payable returns (bool) {
        require(msg.value > 0, "BlockGoals: Value must be greater than 0");
        require(msg.value < 10 ether, "BlockGoals: Value must be less than 10 Ether");
        require(_index < tasks[msg.sender].length, "BlockGoals: Task does not exist. Please refresh");

        uint256 newBalance = tasks[msg.sender][_index].balance + msg.value;
        require(newBalance >= tasks[msg.sender][_index].balance, "BlockGoals: Value too large to store");  // overflow check

        tasks[msg.sender][_index].balance = newBalance;
        return true;
    }

    function finishTask(uint256 _index) external nonReentrant {
        require(_index < tasks[msg.sender].length, "BlockGoals: Task does not exist. Please refresh");

        tasks[msg.sender][_index].done = true;

        // if task has balance, send it back to the creator
        withdrawAfterFinish(_index);
    }

    function deleteTask(uint256 _index) external nonReentrant {
        require(_index < tasks[msg.sender].length, "BlockGoals: Task does not exist. Please refresh");

        uint256 amountToRefund = tasks[msg.sender][_index].balance;
        require(address(this).balance >= amountToRefund, "BlockGoals: Not enough contract balance to refund");

        // delete item - move item to last, then pop it
        uint256 lastIndex = tasks[msg.sender].length - 1;
        tasks[msg.sender][_index] = tasks[msg.sender][lastIndex];
        tasks[msg.sender].pop();

        (bool success, ) = msg.sender.call{value: amountToRefund}("");
        require(success, "BlockGoals: Failed to withdraw Ether");
    }

    function withdrawAfterFinish(uint256 _index) internal {
        uint256 amountToRefund = tasks[msg.sender][_index].balance;
        if (amountToRefund > address(this).balance) {
            amountToRefund = address(this).balance;
        }
        if (amountToRefund > 0) {
            tasks[msg.sender][_index].balance -= amountToRefund;
            (bool success, ) = msg.sender.call{value: amountToRefund}("");
            require(success, "BlockGoals: Failed to withdraw Ether");
        }
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks[msg.sender];
    }

    receive() external payable {
        revert("BlockGoals: Fallback function receive() is not allowed");
    }

    fallback() external payable {
        revert("BlockGoals: Fallback function fallback() is not allowed");
    }
}