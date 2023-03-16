// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract Collection is ERC721URIStorage, Ownable, ReentrancyGuardUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _totalMinted;
    
    mapping(address => uint8) private mintedForAddress;
    mapping(string => uint8) private URIMapping;
    
    uint256 public PRICE_PER_TOKEN = 0.01 ether;
    uint256 public LIMIT_PER_ADDRESS = 5;
    uint256 public MAX_SUPPLY = 5;

    constructor() ERC721("Collection", "CollNFT") {
        __ReentrancyGuard_init();
    }

    function setPrice(uint256 price) external onlyOwner {
        PRICE_PER_TOKEN = price;
    }

    function setLimit(uint256 limit) external onlyOwner {
        LIMIT_PER_ADDRESS = limit;
    }

    function setMaxSupply(uint256 max_supply) external onlyOwner {
        MAX_SUPPLY = max_supply;
    }

    function mintNFT(
        string memory tokenURI
    ) external payable nonReentrant returns (uint256) {
        require(
            PRICE_PER_TOKEN <= msg.value,
            "CollectionApp: Ether paid is less than " + PRICE_PER_TOKEN
        );
        require(
            mintedForAddress[msg.sender] < LIMIT_PER_ADDRESS,
            "CollectionApp: You have exceeded minting limit per address"
        );
        require(
            _totalMinted.current() + 1 <= MAX_SUPPLY,
            "CollectionApp: You have exceeded Max Supply. No more tokens left to mint"
        );
        require(
            URIMapping[tokenURI] == 0,
            "CollectionApp: This NFT has already been minted"
        );
        URIMapping[tokenURI] += 1;
        mintedForAddress[msg.sender] += 1;
        _tokenIds.increment();
        _totalMinted.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function withdrawEther() external onlyOwner {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }
}
