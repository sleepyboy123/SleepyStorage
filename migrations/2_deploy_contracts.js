const ImageContract = artifacts.require("ImageContract");

module.exports = function(deployer) {
  deployer.deploy(ImageContract);
};
