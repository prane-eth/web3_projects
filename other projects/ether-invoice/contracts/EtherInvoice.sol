// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract EtherInvoice {
    struct InvoiceData {
        string buyerPAN;
        string sellerPAN;
        uint invoiceAmount;
        uint invoiceDate;
        bool paid;
    }
    mapping(string => InvoiceData[]) internal invoiceData;

    function addInvoice(
        string memory _buyerPAN,
        string memory _sellerPAN,
        uint _invoiceAmount
    ) external {
        // validations
        require(validatePAN(_buyerPAN), "EtherInvoice: Invalid buyer PAN");
        require(validatePAN(_sellerPAN), "EtherInvoice: Invalid seller PAN");
        require(
            keccak256(abi.encodePacked(_buyerPAN)) !=
                keccak256(abi.encodePacked(_sellerPAN)),
            "EtherInvoice: Buyer and seller PAN can't be same"
        );
        require(_invoiceAmount > 0, "EtherInvoice: Invoice amount should be greater than 0");

        uint invoiceDate = block.timestamp;
        invoiceData[_buyerPAN].push(
            InvoiceData(_buyerPAN, _sellerPAN, _invoiceAmount, invoiceDate, false)
        );
    }

    function getInvoicesByPAN(string memory _buyerPAN)
            external view returns (InvoiceData[] memory) {
        return invoiceData[_buyerPAN];
    }

    function payInvoiceByPAN(string memory _buyerPAN, uint _index) external payable {
        require(
            invoiceData[_buyerPAN][_index].invoiceAmount == msg.value,
            "EtherInvoice: Amount not matched"
        );
        require(
            _index < invoiceData[_buyerPAN].length,
            "EtherInvoice: Invoice not found"
        );
        invoiceData[_buyerPAN][_index].paid = true;
    }

    function validatePAN(string memory _pan) internal pure returns (bool) {
        bytes memory b = bytes(_pan);
        if (b.length != 10) return false;

        // PAN format [AAAAA0000A]
        for (uint i; i < 5; ++i)
            if ((uint8(b[i]) < 65) || (uint8(b[i]) > 90))  // Explicit type conversion not allowed from "bytes1" to "uint256".
                return false;
        for (uint i = 5; i < 9; ++i)
            if ((uint8(b[i]) < 48) || (uint8(b[i]) > 57))
                return false;
        if ((uint8(b[9]) < 65) || (uint8(b[9]) > 90))
            return false;
        
        // 4th character can be P, C, H, A, B, G, J, L, F or I
        // create array with valid values
        bytes memory validChars = bytes("PCHABGJLFI");
        bool found = false;
        for (uint i; i < 10; ++i) {
            if (b[3] == validChars[i]) {
                found = true;
                break;
            }
        }
        if (!found)
            return false;

        // number part can't be 0001
        return (!(b[5] == "0" && b[6] == "0" && b[7] == "0" && b[8] == "1"));
    }
}