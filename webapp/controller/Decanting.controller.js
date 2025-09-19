sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/westernacher/decanting/model/formatter"
], (Controller, formatter) => {
    "use strict";

    return Controller.extend("com.westernacher.decanting.controller.Decanting", {
        formatter: formatter,
        onInit() {
            let a = 1;
        },
        onProductItemPress: function (oEvent) {
            let oModel = this.getView().getModel('data');
            let oSplitAppContainer = this.getView().byId('SplitAppDemo')
            oSplitAppContainer.toMaster(this.createId("masterProductsDetailsPage"));
            let oBindingContext = oEvent.getParameter('listItem').getBindingContext('data')
            this.getView().byId('masterProductsDetailsPage').setBindingContext(oBindingContext, "data");
            oSplitAppContainer.toDetail(this.createId("detailSelectBoxTypePage"));
            oModel.setProperty("/selectedItem", oBindingContext.getObject())
        },
        onBackToProductsListPress: function () {
            let oSplitAppContainer = this.getView().byId('SplitAppDemo')
            oSplitAppContainer.toMaster(this.createId("masterProductsPage"));

        },
        onToteSelected: function (oEvent) {
            let sKey = oEvent.getSource().getCustomData()[0].getValue();
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            if (sKey == "8division") {
                oSplitAppContainer.toDetail(this.createId("detailPack8DivisionPage"));
            } else {
                oSplitAppContainer.toDetail(this.createId("detailPackOtherPage"));
            }
        },
        onPressDivision: function(oEvent){
            let sKey = oEvent.getSource().getCustomData()[0].getValue();
            let oBindingContext = oEvent.getSource().getBindingContext('data');
            const sPath = oBindingContext.getPath();
            let oModel = this.getView().getModel('data');
            oModel.setProperty(sPath+"/status", "selected");
            let a = 1;
        }
    });
});