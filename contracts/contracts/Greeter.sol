// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "hardhat/console.sol";
import { StringUtils } from "./libraries/StringUtils.sol";
import { Base64 } from "./libraries/Base64.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

struct Record {
    string avatar;
    string twitterTag;
    string website;
    string email;
    string description;
}

enum RecordType {
    AVATAR,
    TWITTER,
    WEBSITE,
    EMAIL,
    DESCRIPTION
}

contract Domains is ERC721 {
    //mapping(string => address) public domains;
    //mapping(string => string) public avatars;

    mapping(string => Record) public records;
    mapping(uint => string) public names;
    mapping(string => uint) public ids;

    string public tld;
    address payable public owner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"> <path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#FFF"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#b033d6"/><stop offset="1" stop-color="#e0961d" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartTwo = '</text></svg>';

    error Unauthorized();
    error AlreadyRegistered();
    error InvalidName(string name);

   constructor(string memory _tld) payable ERC721("Hodl Name Service", "HNS") {
       owner = payable(msg.sender);
        tld = _tld;
        console.log("%s name service deployed", _tld);
        _tokenIds.increment();
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    function withdraw() public onlyOwner {
        uint amount = address(this).balance;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to withdraw Matic");
    } 

    function getAllNames() public view returns (string[] memory) {
        console.log("Getting all names from contract");
        string[] memory allNames = new string[](_tokenIds.current()-1);
        for (uint i = 1; i < _tokenIds.current(); i++) {
            allNames[i-1] = names[i];
            console.log("Name for token %d is %s", i, allNames[i-1]);
        }

        return allNames;
    }

    function valid(string calldata name) public pure returns(bool) {
        return StringUtils.strlen(name) >= 3 && StringUtils.strlen(name) <= 12;
    }

    function price(string calldata name) public pure returns(uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0);
        if (len == 3) {
          return 5 * 10**17; // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals). We're going with 0.5 Matic cause the faucets don't give a lot
        } else if (len == 4) {
	        return 3 * 10**17; // To charge smaller amounts, reduce the decimals. This is 0.3
        } else {
	        return 1 * 10**17;
        }
    }
  	
	function register(string calldata name) public payable {
        if (ids[name] != 0) revert AlreadyRegistered();
        if (!valid(name)) revert InvalidName(name);

        uint256 _price = this.price(name);
        require(msg.value >= _price, "Not enough Matic paid");
            
        uint256 newRecordId = _tokenIds.current();

        console.log("Registering %s.%s on the contract with tokenID %d", name, tld, newRecordId);

        _safeMint(msg.sender, newRecordId);
        names[newRecordId] = name;
        ids[name] = newRecordId;

        _tokenIds.increment();
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(isSet(names[tokenId]), "Address unknown");

        string memory _name = string(abi.encodePacked(names[tokenId], ".", tld));

        uint256 length = StringUtils.strlen(_name);
        string memory strLen = Strings.toString(length);

        string memory avatar;

        // If using the basic avatar
        if(isSet(records[names[tokenId]].avatar)) {
            avatar = records[names[tokenId]].avatar;
        } else {
            string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
            avatar = string(abi.encodePacked('data:image/svg+xml;base64,',Base64.encode(bytes(finalSvg))));
        }

        string memory json = Base64.encode(
            bytes(
                string(
                abi.encodePacked(
                    '{"name": "',
                    _name,
                    '", "description": "A domain on the HODL name service", "image": "',
                    avatar,
                    '","length":"',
                    strLen,
                    '"}'
                )
                )
            )
        );

        return string( abi.encodePacked("data:application/json;base64,", json));
    }

    function getId(string calldata name) public view returns(uint) {
        require(ids[name] != 0);
        return ids[name];
    }

	// This will give us the domain owners' address
    function getAddress(string calldata name) public view returns (address) {
       return ownerOf(getId(name));
    }

    function setRecord(string calldata name, string calldata record, RecordType recordType) public {
		// Check that the owner is the transaction sender
        if (msg.sender != getAddress(name)) revert Unauthorized();

        if(recordType == RecordType.AVATAR) {
            records[name].avatar = record;
        } else if(recordType == RecordType.TWITTER) {
            records[name].twitterTag = record;
        } else if(recordType == RecordType.WEBSITE) {
            records[name].website = record;
        } else if(recordType == RecordType.EMAIL) {
            records[name].email = record;
        } else if(recordType == RecordType.DESCRIPTION) {
            records[name].description = record;
        }
    }

    // One string is in memory cause https://forum.openzeppelin.com/t/stack-too-deep-when-compiling-inline-assembly/11391/4
    function setRecords(string calldata name, string memory _avatar, string calldata _twitterTag, string calldata _website, string calldata _email, string calldata _description) public {
        if (msg.sender != getAddress(name)) revert Unauthorized();

        records[name].avatar = _avatar;
        records[name].twitterTag = _twitterTag;
        records[name].website = _website;
        records[name].email = _email;
        records[name].description = _description;
    }

    function getRecord(string calldata name, RecordType recordType) public view returns(string memory) {
        if(recordType == RecordType.AVATAR) {
            return records[name].avatar;
        } else if(recordType == RecordType.TWITTER) {
            return records[name].twitterTag;
        } else if(recordType == RecordType.WEBSITE) {
            return records[name].website;
        } else if(recordType == RecordType.EMAIL) {
            return records[name].email;
        } else if(recordType == RecordType.DESCRIPTION) {
            return records[name].description;
        }

        revert("Record not found");
    }

    function getRecords(string calldata name) public view returns(string[] memory, address) {
        address addr = getAddress(name);
        string[] memory allRecords = new string[](5);

        allRecords[0] = records[name].avatar;
        allRecords[1] = records[name].twitterTag;
        allRecords[2] = records[name].website;
        allRecords[3] = records[name].email;
        allRecords[4] = records[name].description;

        return (allRecords, addr);
    }

    function isSet(string memory name) public pure returns(bool) {
        return StringUtils.strlen(name) != 0;
    }
}