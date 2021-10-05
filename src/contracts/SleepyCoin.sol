pragma solidity 0.5.0;

contract SleepyCoin {
    address public minter;
    mapping (address => uint) public balances;
    
    event Sent(
        address from,
        address to,
        uint amount
    );
    
    modifier onlyMinter {
        require(msg.sender == minter, "Only minter can call this function");
        _;
    }

    modifier amountGreaterThan(uint amount) {
        require(amount < 1e60);
        _;
    }
    
    modifier balanceGreaterThanAmount(uint amount) {
        require(amount <= balances[msg.sender], "Insufficient Balance");
        _;
    }
    
    constructor() public {
        minter = msg.sender;
    }
    
    function mint(address receiver, uint amount) public onlyMinter amountGreaterThan(amount) {
        require(msg.sender == minter);
        require(amount < 1e60);
        balances[receiver] += amount;
    }
    
    function send(address receiver, uint amount) public balanceGreaterThanAmount(amount) {
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}