sap.ui.define([
	"sap/m/CustomListItem",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Title",
    "sap/m/ObjectStatus",
    "sap/m/ObjectNumber"
], function(CustomListItem,VBox,HBox,Title,ObjectStatus,ObjectNumber) {
	"use strict";

	return CustomListItem.extend("com.westernacher.decanting.ui.controls.CustomListItemExt", {
        metadata: {
			 properties : {
                "title": {type: "string"},
                "ean" : {type:"string"},
                "po" : {type:"string"},
                "vendor" : {type:"string"},
                "number" : {type:"string"}

            },
			aggregations : {
                
            },
        },
        init:function(){
             CustomListItem.prototype.init.apply(this,arguments);
        },
		onBeforeRendering:function (){
           CustomListItem.prototype.onBeforeRendering.apply(this,arguments);
           
            const oResourceBundle = this.getModel("i18n").getResourceBundle();

            this._oTopHBox = new HBox({
                items:[new Title({
                    wrapping:true,
                    text:this.getTitle()
                })]
            })
            this._oObjStatus1= new ObjectStatus({
                title:oResourceBundle.getText("xtit.EAN"),
                text:this.getEan()
            })
            this._oObjStatus2= new ObjectStatus({
                title:oResourceBundle.getText("xtit.PO"),
                text:this.getPo()
            });
            this._oObjStatus3= new ObjectStatus({
                title:oResourceBundle.getText("xtit.Vendor"),
                text:this.getVendor()
            })
            this._oVBox2 = new VBox({
                width:"100%",
                items:[this._oObjStatus1,this._oObjStatus2,this._oObjStatus3]
            });
            this._oObjectNumber = new ObjectNumber({
                emphasized:true,
                state:"Information",
                number:this.getNumber()
            });
            this._oObjectNumber.addStyleClass("sapMObjectNumberLarge");
            this._oVBox3 = new VBox({
                width:"25%",
                alignItems:"End",
                alignContent:"End",
                justifyContent:"End",
                height:"100%",
                items:[this._oObjectNumber]
            });
            
            this._oBtmHBox = new HBox({
                justifyContent:"SpaceBetween",
                alignItems:"End",
                alignContent:"SpaceBetween",
                
                items:[this._oVBox2,this._oVBox3]
            })
            this._oVbox1 = new VBox({
                items:[this._oTopHBox,this._oBtmHBox]
            });

            this._oVbox1.addStyleClass("sapUiTinyMargin");
            this._oVbox1.addStyleClass("vcpProductCard__inner");
            this.addContent(this._oVbox1)
           
		},
        renderer: {
			apiVersion: 2,
            render: function(oRm, oControl) {
                sap.m.CustomListItemRenderer.render(oRm,oControl)
			}
		},
       
        onAfterRendering: function () {
			if (sap.ui.core.Control.prototype.onAfterRendering) {
				sap.ui.core.Control.prototype.onAfterRendering.apply(this, arguments);
			}
		}
	});
});