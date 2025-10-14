sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.westernacher.decanting.controller.ScanHU", {
        onInit: function () {

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteScanHU").attachPatternMatched(this._onScanHURouteMatched.bind(this), this);
        },
        _onScanHURouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments") || {};
            var sWcIdEncoded = oArgs.wcId || (oArgs.query && oArgs.query.wcId);

            var sWcId = sWcIdEncoded ? decodeURIComponent(sWcIdEncoded) : "";
            this.getView().getModel("data").setProperty("/SelectedWorkCenter", sWcId);
            this.byId("ScanHUInput").setValue("");
        },
        onSearchHU: function (oEvent) {
            var sHu = oEvent.getParameter("query") || oEvent.getSource().getValue();
            if (!sHu) {
                MessageToast.show("Please enter HU.");
                return;
            }
            MessageToast.show("HU: " + sHu);
        },
        onPressConfirmHUButton: function () {
            const oField = this.byId("ScanHUInput");
            const sHu = oField ? oField.getValue().trim() : "";

            if (!sHu) {
                MessageToast.show("Please enter HU before continuing.");
                return;
            }

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDecanting", {
                huId: encodeURIComponent(sHu),
                wcId: this.getView().getModel("data").getProperty("/SelectedWorkCenter")
            });
        }
    });
});
