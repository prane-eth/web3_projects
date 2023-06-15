// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract BlockGoals is Initializable, ReentrancyGuardUpgradeable {
    function initialize() public initializer {
        __ReentrancyGuard_init();
    }

    struct Task {
        uint256 timestamp;
        string description;
        bool done;
        uint256 balance;
    }

    mapping(address => Task[]) private tasks;

    string constant INDEX_OUT_OF_BOUNDS = "BlockGoals: Task does not exist. Please refresh";

    function addTask(string memory _description) public payable  {
        tasks[msg.sender].push(
            Task(block.timestamp, _description, false, msg.value)
        );
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks[msg.sender];
    }

    function deposit(uint256 _index) public payable returns (bool) {
        require(msg.value > 0, "BlockGoals: Value must be greater than 0");
        require(
            msg.value < 10 ether,
            "BlockGoals: Value must be less than 10 Ether"
        );
        require(
            _index < tasks[msg.sender].length,
            INDEX_OUT_OF_BOUNDS
        );
        // make sure uint256 can hold the value, and no underflow
        require(
            tasks[msg.sender][_index].balance + msg.value >=
                tasks[msg.sender][_index].balance,
            "BlockGoals: Value too large to store"
        );
        tasks[msg.sender][_index].balance += msg.value;
        return true;
    }

    function finishTask(uint256 _index) public nonReentrant  {
        require(_index < tasks[msg.sender].length, INDEX_OUT_OF_BOUNDS);

        tasks[msg.sender][_index].done = true;

        // if task has balance, send it back to the creator
        withdrawAfterFinish(_index);
    }

    function deleteTask(uint256 _index) public nonReentrant  {
        require(_index < tasks[msg.sender].length, INDEX_OUT_OF_BOUNDS);
        require(
            address(this).balance >= tasks[msg.sender][_index].balance,
            "BlockGoals: Not enough contract balance to refund"
        );
        uint256 amountToRefund = tasks[msg.sender][_index].balance;

        // delete item - move item to last, then pop it
        uint256 lastIndex = tasks[msg.sender].length - 1;
        for (uint256 i = _index; i < lastIndex; i++) {
            tasks[msg.sender][i] = tasks[msg.sender][i + 1];
        }
        tasks[msg.sender].pop();
        (bool success, ) = msg.sender.call{value: amountToRefund}("");
        require(success, "BlockGoals: Failed to withdraw Ether");
    }

    function withdrawAfterFinish(uint256 _index) internal {
        uint256 amountToRefund = tasks[msg.sender][_index].balance;
        // if no enough ether, refund partially.remaining amount is refunded after task is deleted
        if (amountToRefund > address(this).balance) {
            amountToRefund = address(this).balance;
        }
        if (amountToRefund <= 0)
            return;
        
        tasks[msg.sender][_index].balance -= amountToRefund;
        (bool success, ) = msg.sender.call{value: amountToRefund}("");
        require(success, "BlockGoals: Failed to withdraw Ether");
    }

    receive() external payable {
        revert("BlockGoals: Fallback function receive() is not allowed");
    }

    fallback() external payable {
        revert("BlockGoals: Fallback function fallback() is not allowed");
    }
}
