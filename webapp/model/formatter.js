
sap.ui.define([], () => {
    "use strict";

    return {
        statusIcon(oFlags, sStatus) {

            if (sStatus) {
                return "sap-icon://workflow-tasks";
            }
            if (oFlags?.requiresReconditioning) {
                return "sap-icon://workflow-tasks";
                //sap-icon://action
            }
            if (oFlags?.firstReceipt) {
                return "sap-icon://add-favorite";
                //sap-icon://action
            }

            return "sap-icon://action"
        },
        statusIconColor(oFlags, sStatus) {

            if (sStatus) {
                return "#006400";
            }
            if (oFlags?.requiresReconditioning) {
                return "#FFAC1C";
                //sap-icon://action
            }
            if (oFlags?.firstReceipt) {
                return "#FFAC1C";
                //sap-icon://action
            }

            return "#6495ED"
        },
        onFormatAvailableAmount: function(iAmount, iScanedAmount){
            return iAmount-iScanedAmount;

        },
        onFormatStatusIndication: function(sStatus){
            if(sStatus){
                return "Indication01";
            }
        },
        onFormatDate: function(oDate){
            if(!oDate){
                return "";
            }
            let oTimeInstance = sap.ui.core.format.DateFormat.getDateInstance({
				style: "short"
			});
            return oTimeInstance.format(oDate);
        }
        
    };
});