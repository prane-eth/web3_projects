// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract EtherGuard is Initializable, ReentrancyGuardUpgradeable {
    function initialize() public initializer {
        __ReentrancyGuard_init();
    }
    
    mapping(address => uint256) internal balances;
    mapping(address => bool) internal hasAccount;
    mapping(address => mapping(address => bool)) internal authorizedWithdrawers;

    modifier accountRequired {
        require(hasAccount[msg.sender], "EtherGuard: Account does not exist");
        _;
    }

    string constant ERR_AMOUNT_TOO_LARGE = "EtherGuard: Amount too large to store";

    function checkOverflow(uint256 a, uint256 b) internal pure {
        require(a + b > a, ERR_AMOUNT_TOO_LARGE);
    }
    function checkUnderflow(uint256 a, uint256 b) internal pure {
        require(a - b < a, ERR_AMOUNT_TOO_LARGE);
    }

    function createAccount() public {
        require(!hasAccount[msg.sender], "EtherGuard: Account already exists");
        hasAccount[msg.sender] = true;
    }

    function userHasAccount() public view returns (bool) {
        return hasAccount[msg.sender];
    }

    function getBalance() public view accountRequired returns (uint256) {
        return balances[msg.sender];
    }

    function deposit() public payable accountRequired {
        balances[msg.sender] += msg.value;
    }

    function depositToAccount(address to) public payable {
        require(hasAccount[to], "EtherGuard: Receiver has no account");
        checkOverflow(balances[to], msg.value);
        balances[to] += msg.value;
    }

    function transferToAccount(address to, uint256 amount) public accountRequired {
        require(balances[msg.sender] >= amount, "EtherGuard: Insufficient balance");
        checkOverflow(balances[to], amount);
        checkUnderflow(balances[msg.sender], amount);
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function transferToWallet(address to, uint256 amount) public accountRequired nonReentrant {
        require(balances[msg.sender] >= amount, "EtherGuard: Insufficient balance");
        checkUnderflow(balances[msg.sender], amount);
        balances[msg.sender] -= amount;
        (bool success, ) = to.call{ value: amount }("");
        require(success, "EtherGuard: Failed to transfer to wallet");
    }

    function withdraw(uint256 amount) public accountRequired nonReentrant {
        require(balances[msg.sender] >= amount, "EtherGuard: Insufficient balance");
        checkUnderflow(balances[msg.sender], amount);
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{ value: amount }("");
        require(success, "EtherGuard: Failed to withdraw");
    }

    function closeAccount() public accountRequired {
        uint256 amountToRefund = balances[msg.sender];
        if (amountToRefund > address(this).balance) {
            amountToRefund = address(this).balance;
        }
        require(amountToRefund > 0, "EtherGuard: Insufficient contract balance to withdraw");
        balances[msg.sender] -= amountToRefund;
        (bool success, ) = msg.sender.call{ value: amountToRefund }("");
        require(success, "EtherGuard: Failed to withdraw");
        require(balances[msg.sender] == 0, "EtherGuard: Failed to withdraw all funds");
        delete balances[msg.sender];
        delete hasAccount[msg.sender];
    }

    // function getAuthorizedWithdrawers() public view accountRequired returns (address[] memory) {
    //     address[] memory withdrawers = new address[](10);
    //     uint256 count = 0;
    //     for (uint256 i = 0; i < 10; i++) {
    //         if (authorizedWithdrawers[msg.sender][withdrawers[i]]) {
    //             withdrawers[count] = withdrawers[i];
    //             count++;
    //         }
    //     }
    //     assembly {
    //         mstore(withdrawers, count)
    //     }
    //     return withdrawers;
    // }

    function authorizeWithdrawer(address withdrawer) public accountRequired {
        authorizedWithdrawers[msg.sender][withdrawer] = true;
    }

    function isAuthorizedWithdrawer(address withdrawer) public view accountRequired returns (bool) {
        return authorizedWithdrawers[msg.sender][withdrawer];
    }

    function revokeWithdrawer(address withdrawer) public accountRequired {
        authorizedWithdrawers[msg.sender][withdrawer] = false;
    }

    function withdrawAllFromAccount(address from) public nonReentrant {
        // called by authorized withdrawers to withdraw all funds from an account
        require(authorizedWithdrawers[from][msg.sender], "EtherGuard: Not authorized");
        require(balances[from] > 0, "EtherGuard: No balance to withdraw");
        uint256 amount = balances[from];
        balances[from] = 0;
        (bool success, ) = msg.sender.call{ value: amount }("");
        require(success, "EtherGuard: Failed to withdraw");
    }

    receive() external payable {
        if (!userHasAccount()) {
            createAccount();
        }
        deposit();
    }
}