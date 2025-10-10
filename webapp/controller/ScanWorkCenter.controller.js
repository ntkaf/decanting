
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.westernacher.decanting.controller.ScanWorkCenter", {
        /** Handle Enter/scan in the SearchField */
        onSearchHU: function (oEvent) {
            // Read HU from the SearchField (works for Enter or scan suffix)
            var sHu = oEvent.getParameter("query") || oEvent.getSource().getValue();
            if (!sHu) {
                MessageToast.show("Please enter HU.");
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
                MessageToast.show("Please enter HU before continuing.");
                return;
            }

            const oRouter = this.getOwnerComponent().getRouter();
          //  oRouter.navTo("RouteDecanting", { huId: encodeURIComponent(sHu) });
          oRouter.navTo("RouteScanHU", { wcId: encodeURIComponent(sWC) });
        }
    });
});
