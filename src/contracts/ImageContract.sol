pragma solidity 0.5.0;

contract ImageContract {
    // Variable with global scope, stored on blockchain
    // _variables are used for local variables
    string imageHash;
    // Store Images
    uint public imageCount = 0;
    address owner;
    address payable node = 0xD314035cB64cbb62e9841B0C922CDC8Dc356D8b6;
    mapping(uint => Image) public images;

    struct Image {
        uint id;
        string imageHash;
        uint paidAmount;
        address payable owner;
        uint256 uploadTime;
    }

    event ImageCreated(
        uint id,
        string imageHash,
        uint paidAmount,
        address payable owner,
        uint256 uploadTime
    );

    event ImageTipped(
        uint id,
        string imageHash,
        uint paidAmount,
        uint256 uploadTime
    );

    // Called when Smart Contract is deployed to the block chain
    constructor() public {
        // 
    }

    // Storage and Memory keywords in Solidity are like a Computer's hard drive and RAM
    // memory is a temporary place to store data whereas Storage holds data between function calls.
    // Once execution stops, memory is completely wiped off for the next execution
    // Each execution of the Smart Contract has access to the data previously stored on the storage area

    // Create Images
    function uploadImage(string memory _imageHash) public {
        // Check that image hash is not empty
        require(bytes(_imageHash).length > 0);

        // Check that image description is not empty
        require(msg.sender != address(0));

        // Increment Image ID
        imageCount++;
        // Add Image to Contract
        images[imageCount] = Image(imageCount, _imageHash, 0, msg.sender, block.timestamp);

        // Trigger an Event
        emit ImageCreated(imageCount, _imageHash, 0, msg.sender, block.timestamp);
    }

    // Pay the Node
    function payNode(uint _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= imageCount);
        // Fetch the image
        Image memory _image = images[_id];
        // Pay the owner by sending them Ether
        address(node).transfer(msg.value);
        // Increment the paid amount
        _image.paidAmount = _image.paidAmount + msg.value;
        // Update the image
        images[_id] = _image;
        // Trigger an event
        emit ImageTipped(_id, _image.imageHash, _image.paidAmount, _image.uploadTime);
    }
}
