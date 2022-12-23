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
        uint256 invoiceDate = block.timestamp;
        invoiceData[_buyerPAN].push(
            InvoiceData(_buyerPAN, _sellerPAN, _invoiceAmount, invoiceDate, false)
        );
    }
    function getInvoicesByPAN(string memory _buyerPAN)
        public
        view
        returns (InvoiceData[] memory)
    {
        return invoiceData[_buyerPAN];
    }
    function payInvoiceByPAN(string memory _buyerPAN, uint256 _index) public payable {
        require(
            invoiceData[_buyerPAN][_index].invoiceAmount == msg.value,
            "Amount not matched"
        );
        invoiceData[_buyerPAN][_index].paid = true;
    }
}