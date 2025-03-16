const TimeAuction = (state = {}, action) => {
    switch (action.type) {
        case "auctioning":
            return {
                "auctioning": true,
                "endTime": true
            }
        case "end":
            return {
                "auctioning": true,
                "endTime": null
            }
        case "not":
            return {
                "auctioning": false,
                "endTime": null
            }
    }
}