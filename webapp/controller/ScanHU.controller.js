sap.ui.define([
     "./BaseController",
    "sap/m/MessageToast"
], function (BaseController, MessageToast) {
    "use strict";

    return BaseController.extend("com.westernacher.decanting.controller.ScanHU", {
        onInit: function () {
            this._oComponent=this.getOwnerComponent();
            this._oRouter= this.getOwnerComponent().getRouter();
            this._oView = this.getView();
            this._oRouter.getRoute("RouteScanHU").attachPatternMatched(this._onScanHURouteMatched.bind(this), this);
        },
        _onScanHURouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments") || {};
            var sWcIdEncoded = oArgs.wcId || (oArgs.query && oArgs.query.wcId);

            var sWcId = sWcIdEncoded ? decodeURIComponent(sWcIdEncoded) : "";
            this._oView.getModel("data").setProperty("/SelectedWorkCenter", sWcId);
            this.byId("ScanHUInput").setValue("");
        },
        onSearchHU: function (oEvent) {
            var sHu = oEvent.getParameter("query") || oEvent.getSource().getValue();
            if (!sHu) {
                this.showMessageToast("xmsg.Message2")
                return;
            }
            MessageToast.show("HU: " + sHu);
        },
        onPressConfirmHUButton: function () {
            const oField = this.byId("ScanHUInput");
            const sHu = oField ? oField.getValue().trim() : "";

            if (!sHu) {
                this.showMessageToast("xmsg.Message1")
                return;
            }

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDecanting", {
                huId: encodeURIComponent(sHu),
                wcId: this._oView.getModel("data").getProperty("/SelectedWorkCenter")
            });
        }
    });
});
