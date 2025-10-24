namespace supplychain;

service SupplyChainService {

    @odata.unbound
    action findTopSites(productId: String, destSite: String, qty: Integer) 
        returns array of {
            site: String;
            availableQty: Integer;
            score: Integer;
        };

    @odata.unbound
    action checkStock(productId: String, site: String) 
        returns {
            productId: String;
            site: String;
            availableQty: Integer;
            nextReplenish: String;
        };

    @odata.unbound
    action transportEstimate(source: String, dest: String, qty: Integer) 
        returns {
            source: String;
            dest: String;
            qty: Integer;
            cost: Double;
            transitDays: Integer;
        };

    @odata.unbound
    action requestTransfer(productId: String, qty: Integer, source: String, dest: String) 
        returns {
            transferId: String;
            status: String;
            approvers: Array of String;
        };

    @odata.unbound
    action pendingApprovals(approverId: String) 
        returns array of {
            id: String;
            product: String;
            qty: Integer;
        };
}
