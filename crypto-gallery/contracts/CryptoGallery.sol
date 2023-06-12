// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract CryptoGallery is ERC721URIStorage, Ownable, Initializable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    
    mapping(address => uint8) private mintedForAddress;
    mapping(string => bool) private isTokenMinted;
    
    uint256 public PRICE_PER_TOKEN = 0.01 ether;
    uint256 public LIMIT_PER_ADDRESS = 2;
    uint256 public MAX_SUPPLY = 5;
    // string public IPFS_FOLDER = "";
    event Minted(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("CryptoGallery", "CGNFT") {}

    function setPrice(uint256 price) external onlyOwner {
        PRICE_PER_TOKEN = price;
    }

    function getPrice() external view returns (uint256) {
        return PRICE_PER_TOKEN;
    }

    function setLimit(uint256 limit) external onlyOwner {
        LIMIT_PER_ADDRESS = limit;
    }

    function setMaxSupply(uint256 max_supply) external onlyOwner {
        MAX_SUPPLY = max_supply;
    }

    function isAvailable(string memory tokenURI) external view returns (bool) {
        return !isTokenMinted[tokenURI];
    }

    function mintNFT(
        string memory tokenURI
    ) external payable returns (uint256) {
        require(
            PRICE_PER_TOKEN <= msg.value,
            // concatenate string with price
            string(abi.encodePacked("CryptoGallery: Ether paid is less than ", PRICE_PER_TOKEN))
        );
        require(
            _tokenId.current() + 1 <= MAX_SUPPLY,
            "CryptoGallery: You have exceeded Max Supply. No more tokens left to mint"
        );
        require(
            !isTokenMinted[tokenURI],
            "CryptoGallery: This NFT has already been minted"
        );
        require(
            mintedForAddress[msg.sender] < LIMIT_PER_ADDRESS,
            "CryptoGallery: You have exceeded minting limit per address"
        );

        // better if tokenURI = "https://ipfs.io/ipfs/" + getIpfsFolder() + "/" + tokenID + ".png"

        // for security reasons, minting is after payment and increments
        // due to this, we do not need a ReentrancyGuard
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "CryptoGallery: Failed to pay Ether to owner");

        isTokenMinted[tokenURI] = true;
        mintedForAddress[msg.sender] += 1;
        _tokenId.increment();

        uint256 newItemId = _tokenId.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit Minted(msg.sender, newItemId);

        // increase the price for next token by 20%
        // PRICE_PER_TOKEN = (PRICE_PER_TOKEN * 12) / 10;

        return newItemId;
    }
}
