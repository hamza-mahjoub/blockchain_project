const truth = artifacts.require("Truth");

module.exports = function (deployer) {
  deployer.deploy(truth);
};
