pragma solidity ^0.8.17;

contract Debank {
    mapping(address => uint256) internal balances;
    mapping(address => bool) internal hasAccount;
    mapping(address => mapping(address => bool)) internal authorizedWithdrawers;

    modifier AccountRequired {
        require(hasAccount[msg.sender], "Account does not exist");
        _;
    }

    function createAccount() public {
        require(!hasAccount[msg.sender], "Account already exists");
        hasAccount[msg.sender] = true;
    }

    function userHasAccount() public view returns (bool) {
        return hasAccount[msg.sender];
    }

    function getBalance() public view AccountRequired returns (uint256) {
        return balances[msg.sender];
    }

    function deposit() public payable AccountRequired {
        balances[msg.sender] += msg.value;
    }

    function transferToAccount(address to, uint256 amount) public AccountRequired {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function transferToWallet(address to, uint256 amount) public AccountRequired {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        (bool success, ) = to.call{ value: amount }("");
        require(success, "Failed to transfer to wallet");
    }

    function payToAccount(address to) public payable {
        balances[to] += msg.value;
    }

    function payToWallet(address to) public payable {
        (bool success, ) = to.call{ value: msg.value }("");
        require(success, "Failed to pay to wallet");
    }

    function withdraw(uint256 amount) public AccountRequired {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{ value: amount }("");
        require(success, "Failed to withdraw");
    }

    function closeAccount() public AccountRequired {
        withdraw(balances[msg.sender]);
        delete balances[msg.sender];
        delete hasAccount[msg.sender];
    }

    function getAuthorizedWithdrawers() public view AccountRequired returns (address[] memory) {
        address[] memory withdrawers = new address[](0);
        for (uint256 i = 0; i < 100; i++) {
            if (authorizedWithdrawers[msg.sender][withdrawers[i]]) {
                withdrawers[i] = withdrawers[i];
            }
        }
        return withdrawers;
    }

    function authorizeWithdrawer(address withdrawer) public AccountRequired {
        authorizedWithdrawers[msg.sender][withdrawer] = true;
    }

    function revokeWithdrawer(address withdrawer) public AccountRequired {
        authorizedWithdrawers[msg.sender][withdrawer] = false;
    }

    function withdrawAllFromAccount(address from) public {
        require(authorizedWithdrawers[from][msg.sender], "Not authorized");
        uint256 amount = balances[from];
        (bool success, ) = msg.sender.call{ value: amount }("");
        require(success, "Failed to withdraw");
        balances[from] = 0;
    }
}