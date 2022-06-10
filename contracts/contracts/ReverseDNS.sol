// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "./DNS.sol";
import { StringUtils } from "./libraries/StringUtils.sol";

// The DNS contract is used to bind an human-readable name to an address, which makes it simpler to read and write.

// The ReverseDNS is used to make the opposite, bind the address to one owned domain name.
// We can use this contract to display and domain name instead of the user address on a website.
// This contract can be used by the the user to bind address to his favorite domain name if he have multiples.
contract ReverseDNS {
    
    mapping(address => string) public records;
    Domains public dns;

    // Set the DNS contract address
    constructor(address ctr) {
        dns = Domains(ctr);
    }

    // Get the address binded to the given domain name
    function resolve(address addr) public view returns (string memory) {
        string memory name = records[addr];
        require(StringUtils.strlen(name) != 0, "No reverse dns record found for this address");
        require(dns.getAddress(name) == addr, "User don't own this domain name anymore");
        return name;
    }

    // Set the reverse DNS record for an address
    function setReverse(string calldata name) public {
        require(dns.getAddress(name) == msg.sender, "You don't own this domain");
        records[msg.sender] = name;
    }

}