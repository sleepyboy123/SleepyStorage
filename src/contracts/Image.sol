pragma solidity 0.5.0;

contract Image {
    string imageHash;
    
    // Write Function
    function set(string memory _imageHash) public {
        imageHash = _imageHash;
    }

    // Read Function
    function get() public view returns (string memory) {
        return imageHash;
    }
}
