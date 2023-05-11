// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.10;

import "https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC721.sol";
import "https://github.com/transmissions11/solmate/blob/main/src/utils/SafeTransferLib.sol";

contract Marketplace {
    /// ERRORS ///

    /// @notice Thrown when trying to cancel a listing the user hasn't created
    error Unauthorized();

    /// @notice Thrown when non-owner trying to make a listing
    error NotOwned();

    /// @notice Thrown when underpaying or overpaying a listing
    error WrongValueSent();

    /// @notice Thrown when trying to purchase a listing that doesn't exist
    error ListingNotFound();

    /// @notice Thrown when the owner is trying to buy it's own listing
    error OwnedListing();

    /// @notice Thrown when trying to list without any asking price
    error NoAskingPrice();

    /// @notice Thrown when owner is trying to
    /// EVENTS ///

    /// @notice Emitted when a new listing is created
    /// @param listing The newly-created listing
    event NewListing(Listing listing);

    /// @notice Emitted when a listing is cancelled
    /// @param listing The removed listing
    event ListingRemoved(Listing listing);

    /// @notice Emitted when a listing is purchased
    /// @param buyer The address of the buyer
    /// @param listing The purchased listing
    event ListingBought(address indexed buyer, Listing listing);

    /// @notice Used as a counter for the next sale index.
    /// @dev Initialised at 1 because it makes the first transaction slightly cheaper.
    uint256 public saleCounter = 1;

    /// @dev Parameters for listings
    /// @param tokenContract The ERC721 contract for the listed token
    /// @param tokenId The ID of the listed token
    /// @param creator The address of the seller
    /// @param askPrice The amount the seller is asking for in exchange for the token

    struct Listing {
        ERC721 tokenContract;
        uint256 tokenId;
        address creator;
        uint256 askPrice;
    }

    mapping(uint256 => Listing) public getListing;

    /// @dev Remember to call setApprovalForAll(<address of this contract>, true) on the ERC721's contract before calling this function
    function list(
        ERC721 tokenContract,
        uint256 tokenId,
        uint256 askPrice
    ) public returns (uint256) {
        if (msg.sender != tokenContract.ownerOf(tokenId)) revert NotOwned();
        if (askPrice == 0) revert NoAskingPrice();

        // tokenContract.approve(address(this), tokenId);

        Listing memory listing = Listing({
            tokenContract: tokenContract,
            tokenId: tokenId,
            askPrice: askPrice,
            creator: msg.sender
        });

        getListing[saleCounter] = listing;

        emit NewListing(listing);

        return saleCounter++;
    }

    function delist(uint256 listingId) public {
        Listing memory listing = getListing[listingId];

        if (listing.creator != msg.sender) revert Unauthorized();

        delete getListing[listingId];

        emit ListingRemoved(listing);
    }

    function buySecondary(uint256 listingId) public payable {
        Listing memory listing = getListing[listingId];

        if (msg.sender == listing.creator) revert OwnedListing();
        if (listing.creator == address(0)) revert ListingNotFound();
        if (listing.askPrice != msg.value) revert WrongValueSent();

        delete getListing[listingId];

        emit ListingBought(msg.sender, listing);

        SafeTransferLib.safeTransferETH(listing.creator, listing.askPrice);

        listing.tokenContract.transferFrom(
            listing.creator,
            msg.sender,
            listing.tokenId
        );
    }
}
