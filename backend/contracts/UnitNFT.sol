// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract UnitNFT is ERC721 {
    uint256 public unitCounter;
    address public batchNFT;

    constructor() ERC721("DrugUnit", "UNIT") {}

    function setBatchNFT(address _batchNFT) external {
        batchNFT = _batchNFT;
    }

    function mintUnit(address to) external {
        require(msg.sender == batchNFT, "Only BatchNFT can mint");

        unitCounter++;
        _safeMint(to, unitCounter);
    }
}
