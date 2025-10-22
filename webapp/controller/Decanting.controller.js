sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/westernacher/decanting/model/formatter",
    "sap/m/MessageBox"
], (Controller, formatter, MessageBox) => {
    "use strict";

    return Controller.extend("com.westernacher.decanting.controller.Decanting", {
        formatter: formatter,
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDecanting").attachPatternMatched(this._onDecantingRouteMatched.bind(this), this);
        },
        onPress1:function(){
            console.log("manik")
        },

        _onDecantingRouteMatched: function (oEvent) {
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
            oField.setValue("");
        },
        onToteSelected: function (sKey) {
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            let oModel = this.getView().getModel('data');
            let oTote = {
                ToteId: sKey
            }
            if (sKey[0] != "8") {
                oTote.id = 1;
                oTote.status = "notselected";
                oTote.name = 1;
            }
            let aTotes = oModel.getProperty("/Totes");
            if (!aTotes[sKey]) {
                aTotes[sKey] = oTote;
                aTotes[sKey].toteDivisions = JSON.parse(JSON.stringify(oModel.getProperty("/TotesDivisions")));
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
        onCloseTote2: function (oEvent) {
            let oButton = oEvent.getSource();
            let oBindingContext = oButton.getBindingContext('data');

            const sPath = oBindingContext.getPath();
            let oModel = this.getView().getModel('data');

            let iAmountOfItems = oButton.getParent().getItems()[2].getValue();

            if (iAmountOfItems == 0) {
                return;
            }
            let oSelectedItem = oModel.getProperty("/selectedItem")
            this.setToteDivisionData(sPath, oSelectedItem, iAmountOfItems)


            oButton.getParent().getParent().removeStyleClass("readyForPackingBackground");
            oButton.getParent().getParent().addStyleClass("packedBackground");
            let iScannedAmount = oSelectedItem.quantity.scanedAmount;
            let iFinalScanedAmount = iScannedAmount + iAmountOfItems;
            oSelectedItem.quantity.scanedAmount = iFinalScanedAmount,
                oSelectedItem.quantity.amount2 = oSelectedItem.quantity.amount - iFinalScanedAmount;

            oModel.setProperty("/selectedItem/quantity/scanedAmount", iFinalScanedAmount)
            this.assignProductData(oSelectedItem);
            if (iFinalScanedAmount >= oSelectedItem.quantity.amount) {
                this.manageViewAfterTotePacking(oBindingContext)

            }
            this.checkIfToteIsFull();

        },
        onCloseTote: function (oEvent) {
            let oButton = oEvent.getParameter("btnSource");
            let oBindingContext = oButton.getBindingContext('data');

            const sPath = oBindingContext.getPath();
            let oModel = this.getView().getModel('data');

            let iAmountOfItems = oButton.getParent().getItems()[2].getValue();

            if (iAmountOfItems == 0) {
                return;
            }
            let oSelectedItem = oModel.getProperty("/selectedItem")
            this.setToteDivisionData(sPath, oSelectedItem, iAmountOfItems)


            oButton.getParent().getParent().removeStyleClass("readyForPackingBackground");
            oButton.getParent().getParent().addStyleClass("packedBackground");
            let iScannedAmount = oSelectedItem.quantity.scanedAmount;
            let iFinalScanedAmount = iScannedAmount + iAmountOfItems;
            oSelectedItem.quantity.scanedAmount = iFinalScanedAmount,
                oSelectedItem.quantity.amount2 = oSelectedItem.quantity.amount - iFinalScanedAmount;

            oModel.setProperty("/selectedItem/quantity/scanedAmount", iFinalScanedAmount)
            this.assignProductData(oSelectedItem);
            if (iFinalScanedAmount >= oSelectedItem.quantity.amount) {
                this.manageViewAfterTotePacking(oBindingContext)

            }
            this.checkIfToteIsFull();

        },

        onPressPrintLabel: async function () {
            if (!this.oPrintLabelsDialog) {
                this.oPrintLabelsDialog = await this.loadFragment({
                    name: "com.westernacher.decanting.fragment.PrintLabels"
                });
            }
            this.oPrintLabelsDialog.open();
        },
        onConfirmPrintLabel: function () {
            MessageBox.information("Labels printing initiated", {
                styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"
            });
            this.oPrintLabelsDialog.close();
        },
        onCancelPrintLabels: function () {
            this.oPrintLabelsDialog.close();
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
        onChangeTotePress: function (oEvent) {
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            oSplitAppContainer.toDetail(this.createId("detailSelectBoxTypePage"));
        },
        onBackToSelectTotePress: function () {
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');

            oSplitAppContainer.toDetail(this.createId("detailSelectBoxTypePage"));

        },
        onDetailNavigate: function (oEvent) {
            let oPage = oEvent.getParameter('to')
            let sPageId = oPage?.getId();

            if (sPageId && (sPageId.includes("detailPack8DivisionPage") || sPageId.includes("detailPackOtherPage"))) {
                let oModel = this.getView().getModel('data');
                let sCurrent = oModel.getProperty("/currentTote");
                let sPath = `/Totes/${sCurrent}`

                oPage.bindElement({ path: sPath, model: "data" });

                this.prepareViewBasedOnData(sPageId)
            }

        },
        assignProductData: function (oSelectedItem) {
            let oModel = this.getView().getModel('data');
            let aProducts = oModel.getProperty("/123/items");
            for (let i = 0; i < aProducts.length; i++) {
                if (oSelectedItem.itemId == aProducts[i].itemId) {
                    oModel.setProperty(`/123/items/${i}`, oSelectedItem);
                    return;
                }
            }
        },
        checkIfToteIsFull: function () {
            let oModel = this.getView().getModel('data');
            let sToteKey = oModel.getProperty("/currentTote");
            let aTotesDivision = oModel.getProperty(`/Totes/${sToteKey}/toteDivisions`);
            for (let i = 0; i < aTotesDivision.length; i++) {
                if (aTotesDivision[i].status !== "closed") {
                    return;
                }
            }
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            oModel.setProperty("/currentTote", null);
            oSplitAppContainer.toDetail(this.createId("detailSelectBoxTypePage"));
        },
        setToteDivisionData: function (sPath, oSelectedItem, iAmountOfItems) {
            let oModel = this.getView().getModel('data');
            oModel.setProperty(sPath + "/status", "closed");
            oModel.setProperty(sPath + "/itemId", oSelectedItem.itemId);
            oModel.setProperty(sPath + "/itemDescription", oSelectedItem.material.description);
            oModel.setProperty(sPath + "/scanedAmount", iAmountOfItems);
            oModel.setProperty(sPath + "/uom", oSelectedItem.quantity.uom);
        },
        manageViewAfterTotePacking: function (oBindingContext) {
            let oModel = this.getView().getModel('data');
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            oSplitAppContainer.toMaster(this.createId("masterProductsPage"));
            let oListProduct = this.getView().byId("listProducts");
            let aItems = oListProduct.getItems();
            for (let i = 0; i < aItems.length; i++) {
                let oBindingContext = aItems[i].getBindingContext('data');
                if (oBindingContext.getProperty('itemId') == oModel.getProperty("/selectedItem/itemId")) {
                    oModel.setProperty(oBindingContext.getPath() + "/status", 1);

                }
            }
            oModel.setProperty("/selectedItem", null)
        },
        onPressSetExpirationDate: async function () {
            if (!this.oSetExpirationDateDialog) {
                this.oSetExpirationDateDialog = await this.loadFragment({
                    name: "com.westernacher.decanting.fragment.SetExpirationDate"
                });
            }
            this.oSetExpirationDateDialog.open();
        },
        onConfirmSetExpirationDate: function () {
            MessageBox.information("Expiration Date set Successfully", {
                styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"
            });
            let oDate = this.getView().byId('expirationDateDatePicker').getDateValue();
            if (oDate) {
                this._updateInfoForselectedItem({ expirationDate: oDate });
            }

            this.oSetExpirationDateDialog.close();
        },
        onCancelSetExpirationDate: function () {
            this.oSetExpirationDateDialog.close();
        },
        onPressChangeDestinationBin: async function () {
            if (!this.oChangeDestinationBinDialog) {
                this.oChangeDestinationBinDialog = await this.loadFragment({
                    name: "com.westernacher.decanting.fragment.ChangeDestinationBin"
                });
            }
            this.oChangeDestinationBinDialog.open();
        },
        onConfirmChangeDestinationBin: function () {
            MessageBox.information("Destination Bin changed Successfully", {
                styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"
            });
            let sDestinationBin = this.getView().byId('ChangeDestinationBinInput').getSelectedItem().getText()
            if (sDestinationBin) {
                this._updateInfoForselectedItem({ destinationBin: sDestinationBin + " HU6492-2" });
            }

            this.oChangeDestinationBinDialog.close();
        },
        onCancelChangeDestinationBin: function () {
            this.oChangeDestinationBinDialog.close();
        },
        _updateInfoForselectedItem: function (oItemChange) {
            let oModel = this.getView().getModel('data');
            let oSelectedItem = oModel.getProperty("/selectedItem");
            let aKeys = Object.keys(oItemChange);
            for (let i = 0; i < aKeys.length; i++) {
                oSelectedItem[aKeys[i]] = oItemChange[aKeys[i]];
            }
            this.assignProductData(oSelectedItem);
        },
        prepareViewBasedOnData: function (sPageId) {
            if (sPageId && sPageId.includes("detailPack8DivisionPage")) {
                let oGrid = this.getView().byId('tote8Grid')
                let aItems = oGrid.getItems()
                for (let i = 0; i < aItems.length; i++) {
                    let oBindingContext = aItems[i].getBindingContext('data')
                    if (oBindingContext.getProperty('status') === "closed") {
                        aItems[i].addStyleClass("packedBackground");
                    } else {
                        aItems[i].removeStyleClass("packedBackground");
                    }
                }

            } else if (sPageId.includes("detailPackOtherPage")) {
                let oModel = this.getView().getModel('data');
                let sCurrent = oModel.getProperty("/currentTote");
                let sPath = `/Totes/${sCurrent}/status`;
                if (oModel.getProperty(sPath) === "closed") {
                    this.getView().byId('tote1BigCell').addStyleClass("packedBackground")
                } else {
                    this.getView().byId('tote1BigCell').removeStyleClass("packedBackground")
                }

            }
        },
        onCloseHUDecanting: function () {
            let oModel = this.getView().getModel('data');

            let aProducts = oModel.getProperty("/123/items");
            for (let i = 0; i < aProducts.length; i++) {
                oModel.setProperty(`/123/items/${i}/status`, 0);
                oModel.setProperty(`/123/items/${i}/quantity/scanedAmount`, 0);
            }
            oModel.setProperty("/Totes", {});            

            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            oSplitAppContainer.toDetail(this.createId("detailNoItemSelectedPage"));

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteScanHU", {wcId: oModel.getProperty("/SelectedWorkCenter")});

        }
    });
});