sap.ui.define([
	"sap/f/Card",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Title",
    "sap/m/ObjectNumber",
    "sap/m/FlexItemData",
    "sap/m/Button",
    "sap/m/StepInput"
], function(FioriCardsCustomExt,VBox,Text,Title,ObjectNumber,FlexItemData,Button,StepInput) {
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
                "setInpValue":{type: "int"},
                "stepInpMaxValue":{type: "int"},
                "btnvisible2":{type: "boolean"},
                "textVisisble":{ type: "boolean"},
                "objVisible":{ type: "boolean"},
                "stepInpVisible":{ type: "boolean"}
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
            console.log(this.getBtnvisible2(),this.getStepInpVisible())
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
                press:function(){
                    this.firePressbtn1();
                }.bind(this)
            });
            this._oButtonTop.addStyleClass("toteCellBtn");

            this._oStepInput = new StepInput({
                width:"6rem",
                value:this.getSetInpValue(),
                min:1,
                max:this.getStepInpMaxValue(),
                visible:this.getStepInpVisible()
            });


             this._oButtonBelow=new Button({
                visible:this.getBtnvisible2(),
                type:"Transparent",
                icon:"sap-icon://add",
                width:"100%",
                text:this.getTitleBtn2(),
                press:function(oEvent){
                    this.firePressbtn2(oEvent);
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
                alignItems:"Center",
                justifyContent:"Center",
                width:"100%",
                items:[this._oTitle,this._oButtonTop,this._oStepInput,this._oButtonBelow]
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