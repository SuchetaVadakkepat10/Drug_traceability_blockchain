// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IUnitNFT {
    function mintUnit(address to) external;
}

contract BatchNFT is ERC721 {
    uint256 public batchCounter;
    address public unitNFT;

    struct Batch {
        string drugName;
        uint256 expiryDate;
        uint256 totalUnits;
        uint256 remainingUnits;
    }

    mapping(uint256 => Batch) public batches;

    constructor() ERC721("DrugBatch", "BATCH") {}

    function setUnitNFT(address _unitNFT) external {
        unitNFT = _unitNFT;
    }

    function mintBatch(
        string memory drugName,
        uint256 expiryDate,
        uint256 totalUnits
    ) external {
        batchCounter++;
        uint256 batchId = batchCounter;

        _safeMint(msg.sender, batchId);

        batches[batchId] = Batch(
            drugName,
            expiryDate,
            totalUnits,
            totalUnits
        );
    }

    function dispenseUnit(uint256 batchId) external {
        require(batches[batchId].remainingUnits > 0, "No units left");

        batches[batchId].remainingUnits--;
        IUnitNFT(unitNFT).mintUnit(msg.sender);
    }
}
