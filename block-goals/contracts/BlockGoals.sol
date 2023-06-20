// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract BlockGoals is Initializable, ReentrancyGuardUpgradeable {
    struct Task {
        uint timestamp;
        bytes32 description;
        bool done;
        uint balance;
    }

    mapping(address => Task[]) private tasks;

    function initialize() external initializer {
        __ReentrancyGuard_init();
    }

    string internal constant ERROR_TASK_DOES_NOT_EXIST = "BlockGoals: Task does not exist. Please refresh";
    string internal constant ERROR_WITHDRAW_FAIL = "BlockGoals: Failed to withdraw Ether";

    function addTask(string memory _description) external payable {
        bytes32 _bytes = bytes32(bytes(_description));
        tasks[msg.sender].push(Task(block.timestamp, _bytes, false, msg.value));
    }

    function deposit(uint _index) external payable {
        if (msg.value == 0)
            revert("BlockGoals: Value must be greater than 0");
        if (msg.value > 5 ether)
            revert("BlockGoals: Value must be up to 5 Ether");
        
        Task[] storage userTasks = tasks[msg.sender];
        if (_index >= userTasks.length)
            revert(ERROR_TASK_DOES_NOT_EXIST);

        uint newBalance = userTasks[_index].balance + msg.value;
        if (newBalance < userTasks[_index].balance)  // overflow check
            revert("BlockGoals: Value too large to store");

        userTasks[_index].balance = newBalance;
    }

    function finishTask(uint _index) external nonReentrant {
        Task[] storage userTasks = tasks[msg.sender];
        if (_index >= userTasks.length)
            revert(ERROR_TASK_DOES_NOT_EXIST);

        userTasks[_index].done = true;

        // if task has balance, send it back to the creator
        withdrawAfterFinish(_index);
    }

    function deleteTask(uint _index) external nonReentrant {
        Task[] storage userTasks = tasks[msg.sender];
        uint lastIndex = userTasks.length - 1;
        if (_index > lastIndex)
            revert(ERROR_TASK_DOES_NOT_EXIST);

        uint amountToRefund = userTasks[_index].balance;
        if (address(this).balance < amountToRefund)
            amountToRefund = address(this).balance;
        if (amountToRefund > 0) {
            userTasks[_index].balance = userTasks[_index].balance - amountToRefund;
            (bool success, ) = msg.sender.call{value: amountToRefund}("");
            if (!success)
                revert(ERROR_WITHDRAW_FAIL);
        }

        // delete item - move item to last, then pop it
        userTasks[_index] = userTasks[lastIndex];
        userTasks.pop();
    }

    function withdrawAfterFinish(uint _index) internal {
        Task[] storage userTasks = tasks[msg.sender];
        uint amountToRefund = userTasks[_index].balance;
        if (amountToRefund > address(this).balance)
            amountToRefund = address(this).balance;
        if (amountToRefund > 0) {
            userTasks[_index].balance = userTasks[_index].balance - amountToRefund;
            (bool success, ) = msg.sender.call{value: amountToRefund}("");
            if (!success)
                revert(ERROR_WITHDRAW_FAIL);
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