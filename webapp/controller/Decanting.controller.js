sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/westernacher/decanting/model/formatter"
], (Controller, formatter) => {
    "use strict";

    return Controller.extend("com.westernacher.decanting.controller.Decanting", {
        formatter: formatter,
        onInit() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteScanHU").attachPatternMatched(this._onDecantingRouteMatched.bind(this), this);
        },
        _onDecantingRouteMatched: function () {
            var oArgs = oEvent.getParameter("arguments") || {};
            var sWcIdEncoded = oArgs.wcId || (oArgs.query && oArgs.query.wcId);

            var sWcId = sWcIdEncoded ? decodeURIComponent(sWcIdEncoded) : "";
            this.getView().getModel("data").setProperty("/SelectedWorkCenter", sWcId)
        },
        onProductItemPress: function (oEvent) {
            let oModel = this.getView().getModel('data');
            let oSplitAppContainer = this.getView().byId('SplitAppDemo')
            oSplitAppContainer.toMaster(this.createId("masterProductsDetailsPage"));
            let oBindingContext = oEvent.getParameter('listItem').getBindingContext('data')
            this.getView().byId('masterProductsDetailsPage').setBindingContext(oBindingContext, "data");
            const sCurrentAppId = oSplitAppContainer.getCurrentDetailPage().getId();
            if (sCurrentAppId == this.createId("detailNoItemSelectedPage")) {
                oSplitAppContainer.toDetail(this.createId("detailSelectBoxTypePage"));
            }

            oModel.setProperty("/selectedItem", oBindingContext.getObject())
        },
        onBackToProductsListPress: function () {
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            const sCurrentAppId = oSplitAppContainer.getCurrentDetailPage().getId();
            if (sCurrentAppId !== this.createId("Pack8DivisionTote") && sCurrentAppId !== this.createId("DetailPackOtherPage")) {
                oSplitAppContainer.toMaster(this.createId("masterProductsPage"));
            }


        },
        onPressConfirmScanHUButton: function () {
            const oField = this.byId("ScanDestinationHUInput");
            const sDestHu = oField ? oField.getValue().trim() : "";

            if (!sDestHu) {
                MessageToast.show("Please enter HU before continuing.");
                return;
            }
            this.onToteSelected(sDestHu);
        },
        onToteSelected: function (sKey) {
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            let oModel = this.getView().getModel('data');
            let oTote = {
                ToteId: sKey
            }
            let aTotes = oModel.getProperty("/Totes");
            if (!aTotes[sKey]) {
                aTotes[sKey] = oTote;
                aTotes[sKey].toteDivisions =  oModel.getProperty("/TotesDivisions");
                oModel.setProperty("/Totes", aTotes);
            }
oModel.setProperty("/currentTote", sKey);
            if (sKey[0] == "8") {
                oSplitAppContainer.toDetail(this.createId("detailPack8DivisionPage"));
            } else {
                oSplitAppContainer.toDetail(this.createId("detailPackOtherPage"));
            }
        },
        onPressDivision: function (oEvent) {
            //   let sKey = oEvent.getSource().getCustomData()[0].getValue();
            let oBindingContext = oEvent.getSource().getBindingContext('data');
            const sPath = oBindingContext.getPath();
            let oModel = this.getView().getModel('data');
            oModel.setProperty(sPath + "/status", "selected");
            oEvent.getSource().getParent().getParent().addStyleClass("readyForPackingBackground");
        },
        onCloseTote: function (oEvent) {
            let oButton = oEvent.getSource();
            let sKey = oButton.getCustomData()[0].getValue();
            let oBindingContext = oButton.getBindingContext('data');

            const sPath = oBindingContext.getPath();
            let oModel = this.getView().getModel('data');

            let iAmountOfItems = oButton.getParent().getItems()[2].getValue();

            if (iAmountOfItems == 0) {
                return;
            }
            let oSelectedItem = oModel.getProperty("/selectedItem")
            oModel.setProperty(sPath + "/status", "closed");
            oModel.setProperty(sPath + "/itemId", oSelectedItem.itemId);
            oModel.setProperty(sPath + "/itemDescription", oSelectedItem.material.description);
            oModel.setProperty(sPath + "/scanedAmount", iAmountOfItems);
            oModel.setProperty(sPath + "/uom", oSelectedItem.quantity.uom);
            
            oButton.getParent().getParent().removeStyleClass("readyForPackingBackground");
            oButton.getParent().getParent().addStyleClass("packedBackground");
            let iScannedAmount = oSelectedItem.quantity.scanedAmount;
            let iFinalScanedAmount = iScannedAmount+iAmountOfItems;
            oSelectedItem.quantity.scanedAmount = iFinalScanedAmount,               
            oSelectedItem.quantity.amount2 = oSelectedItem.quantity.amount - iFinalScanedAmount;  
           
            oModel.setProperty("/selectedItem/quantity/scanedAmount", iFinalScanedAmount)
            this.assignProductData(oSelectedItem);
            if (iFinalScanedAmount >= oSelectedItem.quantity.amount) {
                let oSplitAppContainer = this.getView().byId('SplitAppDemo');
                oSplitAppContainer.toMaster(this.createId("masterProductsPage"));
                let oListProduct = this.getView().byId("listProducts");
                let aItems = oListProduct.getItems();
                for (let i = 0; i < aItems.length; i++) {
                    let oBindingContext = aItems[i].getBindingContext('data');
                    if (oBindingContext.getProperty('itemId') == oModel.getProperty("/selectedItem/itemId")) {
                        aItems[i].addStyleClass("packedBackground")
                    }
                }
            }
            //  let oStepInput = this.getView().byId().
            //StepInputProductId

        },
        onPressPrintLabel: function () {

        },
        onCompleteTotePress: function (oEvent) {
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            const sCurrentAppId = oSplitAppContainer.getCurrentDetailPage().getId();
            sap.ui.getCore().byId(sCurrentAppId).rerender();
            let oModel = this.getView().getModel('data');
            let aTotesDivisions = oModel.getProperty('/TotesDivisions');
            let aTotesDivisionsList = this.getView().byId('tote8Grid')?.getItems();
            if (!aTotesDivisionsList) {
                return;
            }
            for (let i = 0; i < aTotesDivisions.length; i++) {
                oModel.setProperty("/TotesDivisions/" + i + "/status", "notselected");
                aTotesDivisionsList[i].removeStyleClass("readyForPackingBackground");
                aTotesDivisionsList[i].removeStyleClass("packedBackground");
            }

            oSplitAppContainer.toDetail(this.createId("detailSelectBoxTypePage"));
        },
        onBackToSelectTotePress: function () {
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');

            oSplitAppContainer.toDetail(this.createId("detailSelectBoxTypePage"));

        },
        onDetailNavigate: function(oEvent){
            let oPage = oEvent.getParameter('to')
            let sPageId = oPage?.getId();
            
            if(sPageId && sPageId.includes("detailPack8DivisionPage")){
                let oModel = this.getView().getModel('data')
                let sCurrent = oModel.getProperty("/currentTote");
                let sPath = `/Totes/${sCurrent}`
                
                 oPage.bindElement({path:sPath, model:"data"});
            }

        },
        assignProductData: function(oSelectedItem){
            let oModel = this.getView().getModel('data');
            let aProducts = oModel.getProperty("/123/items");
            for (let i = 0; i<aProducts.length; i++){
                if(oSelectedItem.itemId == aProducts[i].itemId){
                    oModel.setProperty(`/123/items/${i}`, oSelectedItem);
                    return;
                }
            }
        }
    });
});