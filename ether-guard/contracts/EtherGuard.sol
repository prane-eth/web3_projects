// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract EtherGuard is Initializable, ReentrancyGuardUpgradeable {
    function initialize() public initializer {
        __ReentrancyGuard_init();
    }

    mapping(address => uint) internal balances;
    mapping(address => mapping(address => bool)) internal authorizedWithdrawers;
    string internal constant ERROR_INSUFFICIENT_BALANCE = "EtherGuard: Insufficient balance";
    string internal constant ERROR_WITHDRAW_FAIL = "BlockGoals: Failed to withdraw Ether";

    function avoidOverflow(uint balance, uint amount) internal pure {
        if (balance + amount < balance)
            revert("EtherGuard: Amount too large to store");  // less gas than require()
    }

    function avoidUnderflow(uint balance, uint amount) internal pure {
        if (balance - amount > balance)
            revert("EtherGuard: Amount too small to store");
    }

    function deposit() public payable {
        avoidOverflow(balances[msg.sender], msg.value);
        unchecked {
            balances[msg.sender] = balances[msg.sender] + msg.value;
        }
    }

    function depositToAccount(address to) external payable {
        avoidOverflow(balances[to], msg.value);
        unchecked {
            balances[to] = balances[to] + msg.value;
        }
    }

    function transferToAccount(address to, uint amount) external nonReentrant {
        address sender = msg.sender;
        if (balances[sender] < amount)
            revert(ERROR_INSUFFICIENT_BALANCE);
        avoidOverflow(balances[to], amount);
        avoidUnderflow(balances[sender], amount);
        unchecked {
            balances[sender] = balances[sender] - amount;
            balances[to] = balances[to] + amount;
        }
    }

    function transferToWallet(
        address to,
        uint amount
    ) external nonReentrant {
        address sender = msg.sender;
        if (balances[sender] < amount)
            revert(ERROR_INSUFFICIENT_BALANCE);
        avoidUnderflow(balances[sender], amount);
        unchecked {
            balances[sender] = balances[sender] - amount;
        }
        (bool success, ) = to.call{value: amount}("");
        if (!success)
            revert("EtherGuard: Failed to transfer to wallet");
    }

    function withdraw(uint amount) external nonReentrant {
        address sender = msg.sender;
        if (!(balances[sender] >= amount))
            revert(ERROR_INSUFFICIENT_BALANCE);
        avoidUnderflow(balances[sender], amount);
        unchecked {
            balances[sender] = balances[sender] - amount;
        }
        (bool success, ) = sender.call{value: amount}("");
        if (!success)
            revert(ERROR_WITHDRAW_FAIL);
    }

    function authorizeWithdrawer(address withdrawer) external {
        authorizedWithdrawers[msg.sender][withdrawer] = true;
    }

    function revokeWithdrawer(address withdrawer) external {
        authorizedWithdrawers[msg.sender][withdrawer] = false;
    }

    function closeAccount() external nonReentrant {
        address sender = msg.sender;
        if (address(this).balance < balances[sender])
            revert("EtherGuard: Insufficient contract balance to withdraw");
        uint amountToRefund = balances[sender];
        delete balances[sender];
        (bool success, ) = sender.call{value: amountToRefund}("");
        if (!success)
            revert(ERROR_WITHDRAW_FAIL);
    }

    function withdrawAllFromAccount(address from) external nonReentrant {
        // called by authorized withdrawers to withdraw all funds from an account
        if (!authorizedWithdrawers[from][msg.sender])
            revert("EtherGuard: Not authorized");
        if (balances[from] <= 0)
            revert("EtherGuard: No balance to withdraw");
        uint amount = balances[from];
        balances[from] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success)
            revert(ERROR_WITHDRAW_FAIL);
    }

    function getBalance() external view returns (uint accountBalance) {
        accountBalance = balances[msg.sender];
    }

    function isAuthorizedWithdrawer(address withdrawer) external view returns (bool isAuthorized) {
        isAuthorized = authorizedWithdrawers[msg.sender][withdrawer];
    }

    // function getAuthorizedWithdrawers() external view returns (address[] memory) { }

    receive() external payable {
        deposit();
    }

    fallback() external payable {
        revert("EtherGuard: Fallback function is not allowed");
    }
}
