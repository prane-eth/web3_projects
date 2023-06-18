// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract EtherGuard is Initializable, ReentrancyGuardUpgradeable {
    function initialize() public initializer {
        __ReentrancyGuard_init();
    }

    mapping(address => uint) internal balances;
    mapping(address => bool) internal hasAccount;
    mapping(address => mapping(address => bool)) internal authorizedWithdrawers;

    modifier accountRequired() {
        if (!(hasAccount[msg.sender])) {
            revert("EtherGuard: Account does not exist");
        }
        _;
    }

    function avoidOverflow(uint balance, uint amount) internal pure {
        if (balance + amount < balance) {
            revert("EtherGuard: Amount too large to store");
        }
    }

    function avoidUnderflow(uint balance, uint amount) internal pure {
        if (balance - amount > balance) {
            revert("EtherGuard: Amount too small to store");
        }
    }

    function deposit() public payable accountRequired {
        avoidOverflow(balances[msg.sender], msg.value);
        unchecked {
            balances[msg.sender] = balances[msg.sender] + msg.value;
        }
    }

    function depositToAccount(address to) external payable {
        if (!(hasAccount[to])) {
            revert("EtherGuard: Receiver has no account");
        }
        avoidOverflow(balances[to], msg.value);
        unchecked {
            balances[to] = balances[to] + msg.value;
        }
    }

    function transferToAccount(address to, uint amount) external accountRequired nonReentrant {
        address sender = msg.sender;
        if (!(balances[sender] >= amount)) {
            revert("EtherGuard: Insufficient balance");
        }
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
    ) external accountRequired nonReentrant {
        address sender = msg.sender;
        if (!(balances[sender] >= amount)) {
            revert("EtherGuard: Insufficient balance");
        }
        avoidUnderflow(balances[sender], amount);
        unchecked {
            balances[sender] = balances[sender] - amount;
        }
        (bool success, ) = to.call{value: amount}("");
        if (!(success)) {
            revert("EtherGuard: Failed to transfer to wallet");
        }
    }

    function withdraw(uint amount) external accountRequired nonReentrant {
        address sender = msg.sender;
        if (!(balances[sender] >= amount)) {
            revert("EtherGuard: Insufficient balance");
        }
        avoidUnderflow(balances[sender], amount);
        unchecked {
            balances[sender] = balances[sender] - amount;
        }
        (bool success, ) = sender.call{value: amount}("");
        if (!(success)) {
            revert("EtherGuard: Failed to withdraw");
        }
    }

    function authorizeWithdrawer(address withdrawer) external accountRequired {
        authorizedWithdrawers[msg.sender][withdrawer] = true;
    }

    function revokeWithdrawer(address withdrawer) external accountRequired {
        authorizedWithdrawers[msg.sender][withdrawer] = false;
    }

    function createAccount() public {
        if (hasAccount[msg.sender]) {
            revert("EtherGuard: Account already exists");
        }
        hasAccount[msg.sender] = true;
    }

    function closeAccount() external accountRequired nonReentrant {
        address sender = msg.sender;
        if (!(address(this).balance > balances[sender])) {
            revert("EtherGuard: Insufficient contract balance to withdraw");
        }
        if (!(hasAccount[sender])) {
            revert("EtherGuard: Account does not exist");
        }
        uint amountToRefund = balances[sender];
        delete balances[sender];
        delete hasAccount[sender];
        (bool success, ) = sender.call{value: amountToRefund}("");
        if (!(success)) {
            revert("EtherGuard: Failed to withdraw");
        }
    }

    function withdrawAllFromAccount(address from) external nonReentrant {
        // called by authorized withdrawers to withdraw all funds from an account
        if (!(authorizedWithdrawers[from][msg.sender])) {
            revert("EtherGuard: Not authorized");
        }
        if (!(balances[from] > 0)) {
            revert("EtherGuard: No balance to withdraw");
        }
        uint amount = balances[from];
        balances[from] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!(success)) {
            revert("EtherGuard: Failed to withdraw");
        }
    }

    function userHasAccount() public view returns (bool) {
        return hasAccount[msg.sender];
    }

    function getBalance() external view accountRequired returns (uint) {
        return balances[msg.sender];
    }

    function isAuthorizedWithdrawer(
        address withdrawer
    ) external view accountRequired returns (bool) {
        return authorizedWithdrawers[msg.sender][withdrawer];
    }

    // function getAuthorizedWithdrawers() external view accountRequired returns (address[] memory) { }

    receive() external payable {
        if (!(userHasAccount())) {
            createAccount();
        }
        deposit();
    }

    fallback() external payable {
        revert("EtherGuard: Fallback function is not allowed");
    }
}
