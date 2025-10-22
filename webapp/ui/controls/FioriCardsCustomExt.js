sap.ui.define([
	"sap/f/Card",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Title",
    "sap/m/ObjectNumber",
    "sap/m/FlexItemData",
    "sap/m/Button"
], function(FioriCardsCustomExt,VBox,Text,Title,ObjectNumber,FlexItemData,Button) {
	"use strict";

	return FioriCardsCustomExt.extend("com.westernacher.decanting.ui.controls.FioriCardsCustomExt", {
        metadata: {
			 properties : {
                "title": {type: "string"},
                "titleVisible": {
					type: "boolean"
				},
                "titleBtn2": {type: "string"},
                "titleText":{type: "string"},
                "objNumber":{type: "string"},
                "objUnit":{type: "string"},
                "btnvisible2":{
                    type: "boolean"
                },
                "textVisisble":{ type: "boolean"},
                "objVisible":{ type: "boolean"}
            },
			aggregations : {
            },
            events : {
				pressbtn1 : {enablePreventDefault : true},
                pressbtn2 : {enablePreventDefault : true}
			}
        },
        init:function(){
             FioriCardsCustomExt.prototype.init.apply(this,arguments);
        },
		onBeforeRendering:function (){
           console.log(this.getTextVisisble())
            this._oFlexItemData = new FlexItemData({
                baseSize:"20%",
                growFactor:1
            });
            this._oTitle = new Title({
                text:this.getTitle(),
                visible:this.getTitleVisible()
            });
            this._oButtonTop=new Button({
                visible:this.getTitleVisible(),
                type:"Transparent",
                icon:"sap-icon://add",
                width:"100%",
                id:"StepInputProductId",
                press:function(){
                    this.firePressbtn1();
                }.bind(this)
            })
            this._oButtonTop.addStyleClass("toteCellBtn");

             this._oButtonBelow=new Button({
                visible:this.getTitleVisible(),
                type:"Transparent",
                icon:"sap-icon://add",
                width:"100%",
                text:this.getTitleBtn2(),
                press:function(){
                    this.firePressbtn2();
                }.bind(this)
            });
            this._oButtonBelow.addStyleClass("toteCellBtn");

            this._oText= new Text({
                text:this.getTitleText(),
                visible:this.getTextVisisble(),
            });
            this._oText.addStyleClass("sapUiSmallMargin");

             this._oObjectNumber = new ObjectNumber({
                number:this.getObjNumber(),
                unit:this.getObjUnit(),
                emphasized:true,
                state:"Information",
                visible:this.getObjVisible()
            });
            this._oObjectNumber.addStyleClass("sapMObjectNumberLarge");

            this._oVbox = new VBox({
                alighItems:"Center",
                justifyContent:"Center",
                width:"100%",
                items:[this._oTitle,this._oButtonTop,this._oButtonBelow,this._oText,this._oObjectNumber]
            });

            this.setLayoutData(this._oFlexItemData);
            this.setContent(this._oVbox)
           
		},
        renderer: {
			apiVersion: 2,
            render: function(oRm, oControl) {
                sap.f.CardRenderer.render(oRm,oControl)
			}
		}
	});
});