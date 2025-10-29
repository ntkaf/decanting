
sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
], function (BaseController, MessageToast) {
    "use strict";

    return BaseController.extend("com.westernacher.decanting.controller.ScanWorkCenter", {
        onInit:function(){
            this._oComponent=this.getOwnerComponent();
            this._oRouter= this.getOwnerComponent().getRouter();
            this._oView = this.getView();
        },
        /** Handle Enter/scan in the SearchField */
        onSearchHU: function (oEvent) {
            // Read HU from the SearchField (works for Enter or scan suffix)
            var sHu = oEvent.getParameter("query") || oEvent.getSource().getValue();
            if (!sHu) {
                //MessageToast.show("Please enter HU.");
                this.showMessageToast("xmsg.Message2")
                return;
            }
            // TODO: validate HU, then route to details (example)
            // this.getOwnerComponent().getRouter().navTo("huDetails", { huId: sHu });
            MessageToast.show("HU: " + sHu);
        },
        onPressConfirmWorkStationButton: function () {
            /** @type {sap.m.SearchField} */
            const oField = this.byId("ScanWorkCenterInput");
            const sWC = oField ? oField.getValue().trim() : "";

            if (!sWC) {
                this.showMessageToast("xmsg.Message1")
                return;
            }

            const oRouter = this.getOwnerComponent().getRouter();

          oRouter.navTo("RouteScanHU", { wcId: encodeURIComponent(sWC) });
        },
        onWorkCenterListPress:function(oEvent){
            console.log("list pressed")
            var sWC=oEvent.getSource().getBindingContext("data2").getObject().title;
            console.log(sWC)
            if (!sWC) {
                this.showMessageToast("xmsg.Message1")
                return;
            }
            this._oRouter.navTo("RouteScanHU", { wcId:sWC });
        }
    });
});
