// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract CryptoGallery is ERC721URIStorage, Ownable, Initializable, ReentrancyGuardUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    
    mapping(address => uint) private mintedForAddress;
    mapping(string => bool) private isTokenMinted;
    
    uint public PRICE_PER_TOKEN = 0.01 ether;
    uint public LIMIT_PER_ADDRESS = 2;
    uint public MAX_SUPPLY = 5;
    // string public IPFS_FOLDER = "";
    event Minted(address indexed to, uint indexed tokenId);

    constructor() ERC721("CryptoGallery", "CGNFT") {}

    function setPrice(uint price) external onlyOwner {
        PRICE_PER_TOKEN = price;
    }

    function getPrice() external view returns (uint) {
        return PRICE_PER_TOKEN;
    }

    function setLimit(uint limit) external onlyOwner {
        LIMIT_PER_ADDRESS = limit;
    }

    function setMaxSupply(uint maxSupply) external onlyOwner {
        MAX_SUPPLY = maxSupply;
    }

    function isAvailable(string memory tokenURI) external view returns (bool) {
        return !isTokenMinted[tokenURI];
    }

    function mintNFT(
        string memory tokenURI
    ) external payable nonReentrant returns (uint) {
        if (msg.value < PRICE_PER_TOKEN) {
            revert("CryptoGallery: Amount paid is less than PRICE_PER_TOKEN");
        }
        if (_tokenId.current() + 1 > MAX_SUPPLY) {
            revert("CryptoGallery: You have exceeded Max Supply. No more tokens left to mint");
        }
        if (isTokenMinted[tokenURI]) {
            revert("CryptoGallery: This NFT has already been minted");
        }
        if (mintedForAddress[msg.sender] >= LIMIT_PER_ADDRESS) {
            revert("CryptoGallery: You have exceeded minting limit per address");
        }

        // better if tokenURI = "https://ipfs.io/ipfs/" + getIpfsFolder() + "/" + tokenID + ".png", or "ipfs://" + ....

        isTokenMinted[tokenURI] = true;
        mintedForAddress[msg.sender] += 1;
        _tokenId.increment();

        uint newItemId = _tokenId.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit Minted(msg.sender, newItemId);

        // increase the price for next token by 20%
        // PRICE_PER_TOKEN = (PRICE_PER_TOKEN * 12) / 10;

        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "CryptoGallery: Failed to pay Ether to owner");

        return newItemId;
    }

    function addStrings(string memory a, uint b) internal pure returns (string memory result) {
        result = string(abi.encodePacked(a, b));
    }
}
