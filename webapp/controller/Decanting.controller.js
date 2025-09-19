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
            const sCurrentAppId = oSplitAppContainer.getCurrentDetailPage().getId();
            if(sCurrentAppId==this.createId("detailNoItemSelectedPage")){
                oSplitAppContainer.toDetail(this.createId("detailSelectBoxTypePage"));
            }
            
            oModel.setProperty("/selectedItem", oBindingContext.getObject())
        },
        onBackToProductsListPress: function () {
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            const sCurrentAppId = oSplitAppContainer.getCurrentDetailPage().getId();
            if(sCurrentAppId!==this.createId("Pack8DivisionTote") && sCurrentAppId!==this.createId("DetailPackOtherPage") ){
                oSplitAppContainer.toMaster(this.createId("masterProductsPage"));
            }
            

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
            oEvent.getSource().getParent().getParent().addStyleClass("readyForPackingBackground");
        },
        onCloseTote: function(oEvent){
            let oButton = oEvent.getSource();
            let sKey = oButton.getCustomData()[0].getValue();
            let oBindingContext = oButton.getBindingContext('data');
           
            const sPath = oBindingContext.getPath();
            let oModel = this.getView().getModel('data');
            
            let iAmountOfItems = oButton.getParent().getItems()[2].getValue();

            if(iAmountOfItems==0){
                return;
            }
            oModel.setProperty(sPath+"/status", "closed");
            oModel.setProperty(sPath+"/itemId", oModel.getProperty("/selectedItem/itemId"));
            oModel.setProperty(sPath+"/itemDescription", oModel.getProperty("/selectedItem/material/description"));
             oButton.getParent().getParent().removeStyleClass("readyForPackingBackground");
             oButton.getParent().getParent().addStyleClass("packedBackground");
             if(iAmountOfItems >= oModel.getProperty("/selectedItem/quantity/amount2")){
                let oSplitAppContainer = this.getView().byId('SplitAppDemo');
                oSplitAppContainer.toMaster(this.createId("masterProductsPage"));
                let oListProduct = this.getView().byId("listProducts");
                let aItems = oListProduct.getItems();
                for(let i = 0; i< aItems.length; i++){
                    let oBindingContext = aItems[i].getBindingContext('data');
                    if(oBindingContext.getProperty('itemId') == oModel.getProperty("/selectedItem/itemId")){
                        aItems[i].addStyleClass("packedBackground")
                    }
                }
             }
           //  let oStepInput = this.getView().byId().
             //StepInputProductId

        },
        onPressPrintLabel: function(){

        },
        onCompleteTotePress: function(oEvent){
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');
            const sCurrentAppId = oSplitAppContainer.getCurrentDetailPage().getId();
            sap.ui.getCore().byId(sCurrentAppId).rerender();
            let oModel = this.getView().getModel('data');
            let aTotes = oModel.getProperty('/totes');
            let aTotesList = this.getView().byId('tote8Grid')?.getItems();
            if(!aTotesList){
                return;
            }
            for(let i = 0; i< aTotes.length; i++){
                oModel.setProperty("/totes/"+i+"/status", "notselected");
                aTotesList[i].removeStyleClass("readyForPackingBackground");
                aTotesList[i].removeStyleClass("packedBackground");
            }

            oSplitAppContainer.toDetail(this.createId("detailSelectBoxTypePage"));            
        },
        onBackToSelectTotePress: function(){
            let oSplitAppContainer = this.getView().byId('SplitAppDemo');          
            
                oSplitAppContainer.toDetail(this.createId("detailSelectBoxTypePage"));
            
        }
    });
});