// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/* 1. Smart contract should be able to store invoice data on blockchain as follows:
BuyerPAN, SellerPAN, Invoice Amount, Invoice Date etc.
2. Sellers can be multiple and so the buyers, solution should focus on creating ledger of invoice
transactions.
3. At later stage smart contract should be able to capture payment status of particular invoice.
4. Smart contact should be able to provide a list of previous invoices when searched with buyer
PAN.
 */

contract Invoice {
    struct InvoiceData {
        string buyerPAN;
        string sellerPAN;
        uint256 invoiceAmount;
        uint256 invoiceDate;
        bool paid;
    }
    mapping(string => InvoiceData[]) public invoiceData;

    function addInvoice(
        string memory _buyerPAN,
        string memory _sellerPAN,
        uint256 _invoiceAmount
    ) public {
        // validations
        require(validatePAN(_buyerPAN), "Invalid buyer PAN");
        require(validatePAN(_sellerPAN), "Invalid seller PAN");
        require(_invoiceAmount > 0, "Invoice amount should be greater than 0");

        uint256 invoiceDate = block.timestamp;
        invoiceData[_buyerPAN].push(
            InvoiceData(_buyerPAN, _sellerPAN, _invoiceAmount, invoiceDate, false)
        );
    }

    function getInvoicesByPAN(string memory _buyerPAN)
            public view returns (InvoiceData[] memory) {
        return invoiceData[_buyerPAN];
    }

    function payInvoiceByPAN(string memory _buyerPAN, uint256 _index) public payable {
        require(
            invoiceData[_buyerPAN][_index].invoiceAmount == msg.value,
            "Amount not matched"
        );
        invoiceData[_buyerPAN][_index].paid = true;
    }

    function validatePAN(string memory _pan) public pure returns (bool) {
        bytes memory b = bytes(_pan);
        if (b.length != 10) return false;

        // PAN format [AAAAA0000A]
        for (uint256 i = 0; i < 5; i++) {
            if ((uint8(b[i]) < 65) || (uint8(b[i]) > 90))
                return false;
        }
        for (uint256 i = 5; i < 9; i++) {
            if ((uint8(b[i]) < 48) || (uint8(b[i]) > 57))
                return false;
        }
        if ((uint8(b[9]) < 65) || (uint8(b[9]) > 90))
            return false;
        
        // 4th character can be P, C, H, A, B, G, J, L, F or I
        // create array with valid values
        bytes memory validChars = bytes("PCHABGJLFI");
        bool found = false;
        for (uint256 i = 0; i < 10; i++) {
            if (b[3] == validChars[i]) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }

        // number part can't be 0001
        if (b[5] == "0" && b[6] == "0" && b[7] == "0" && b[8] == "1") {
            return false;
        }

        return true;
    }
}