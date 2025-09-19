sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.westernacher.decanting.controller.ScanHU", {
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
        onPressConfirmHUButton: function () {
            /** @type {sap.m.SearchField} */
            const oField = this.byId("ScanHUInput");
            const sHu = oField ? oField.getValue().trim() : "";

            if (!sHu) {
                // Basic UX guardrail
                MessageToast.show("Please enter HU before continuing.");
                return;
            }

            // Get router and navigate to RouteDecanting
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDecanting", { huId: encodeURIComponent(sHu) });
        }
    });
});
