sap.ui.define([
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Text",
    "sap/ui/layout/Grid",
    "sap/ui/layout/GridData",
    "sap/m/VBoxRenderer"
], function (VBox, HBox, Text, Grid, GridData, VBoxRenderer) {
    "use strict";

    return VBox.extend("com.westernacher.decanting.ui.controls.Tote", {
        metadata: {
            properties: {
                // labelTop: { type: "string", default: "A" },
                labelBottom: { type: "string", default: "A" }
                //  labelLeft: { type: "string", default: "D"  },
                // labelRight: { type: "string", default: "B"  }
            },

            aggregations: {
                divisions: { type: "com.westernacher.decanting.ui.controls.ToteDivision", multiple: true },
                _top: { type: "sap.m.Text", visibility: "hidden", multiple: false },
                _bottom: { type: "sap.m.Text", visibility: "hidden", multiple: false },
                _middle: { type: "sap.m.HBox", visibility: "hidden", multiple: false }
            }

        },

        init: function () {
            sap.m.VBox.prototype.init.apply(this, arguments);
            this.addStyleClass("tote8Container");
            //  this.addStyleClass("toteGrid");
            this.setAlignItems("Center")
            this.setWidth("100%")
            this.setJustifyContent("Center")
            this.setAggregation("_top", new Text().addStyleClass("toteLabel toteLabelTop"));
            this.setAggregation("_bottom", new Text().addStyleClass("toteLabel toteLabelBottom"));

            this._oLeft = new Text().addStyleClass("toteLabel toteLabelLeft");
            this._oGrid = new Grid({ width: "100%", defaultSpan: "L3 M6 S12", hSpacing: 2, vSpacing: 2 }).addStyleClass("toteGrid");
            this._oRight = new Text().addStyleClass("toteLabel toteLabelRight");

            this.setAggregation("_middle", new HBox({
                alignItems: "Center",
                justifyContent: "Center",
                items: [this._oLeft, this._oGrid, this._oRight]
            }).addStyleClass("toteBoardRow"));
        },


        setLabelTop: function (sValue) {
            // this.setProperty("labelTop", sValue, true);
            this.getAggregation("_top").setText(sValue);
            return this;
        },
        setLabelBottom: function (sValue) {
            this.setProperty("labelBottom", sValue, true);
            this.getAggregation("_bottom").setText(sValue);
            if (sValue === "B") {
                this._setBatTheBottom();
            } else {
                this._setDatTheBottom();
            }
            return this;
        },
        _setBatTheBottom: function () {
            this.setLabelTop("D");
            this.setLabelLeft("C");
            this.setLabelRight("A");
        },
        _setDatTheBottom: function () {
            this.setLabelTop("B");
            this.setLabelLeft("A");
            this.setLabelRight("C");
        },
        setLabelLeft: function (sValue) {
            //this.setProperty("labelLeft", sValue, true);
            this._oLeft.setText(sValue);
            return this;
        },
        setLabelRight: function (sValue) {
            //this.setProperty("labelRight", sValue, true);
            this._oRight.setText(sValue);
            return this;
        },
        onBeforeRendering: function () {
            sap.m.VBox.prototype.onBeforeRendering.apply(this, arguments);
            this._oGrid.setDefaultSpan(this._getSpan());
            this._oGrid.setDefaultIndent(this._getIndent());

            this._oGrid.removeAllContent();
            this._addLabelsForDivisions()
            this.getDivisions().forEach(function (oDiv) {
                oDiv.destroyLayoutData();
                this._oGrid.addContent(oDiv);
            }.bind(this));

            //  this._oLeft.setText(this.getLabelLeft());
            // this._oRight.setText(this.getLabelRight());
            //  this.getAggregation("_top").setText(this.getLabelTop());
            //   this.getAggregation("_bottom").setText(this.getLabelBottom());

            this.removeAllItems();
            this.addItem(this.getAggregation("_top"));
            this.addItem(this.getAggregation("_middle"));
            this.addItem(this.getAggregation("_bottom"));
        },
        _addLabelsForDivisions: function () {
            let aDivisions = this.getAggregation('divisions');
            let sLabelBottom = this.getLabelBottom();
            let bBottomOrder =  sLabelBottom === "D" ? true : false;
            let iItemsInTheRow = Math.ceil(aDivisions.length / 2)
            for (let i = 0; i< aDivisions.length; i++){
                
                let sLabel, sRowValue; 
                if(i+1 <= iItemsInTheRow){
                    sLabel = (i+1).toString() 
                    sRowValue = bBottomOrder ? "-2" : "-1";                                  
                }else{
                    sLabel = ( (i+1)-iItemsInTheRow ).toString()
                    sRowValue = bBottomOrder ? "-1" : "-2";
                }
                sLabel = sLabel + sRowValue;  
                aDivisions[i].setTitle(sLabel)    ;
            }

        },

        _getSpan: function () {
            var iCount = this.getDivisions().length;
            let sSpan = "";
            if (iCount === 1) {
                sSpan = "L8 M10 S12";
            } else if (iCount === 2) {
                sSpan = "L6 M6 S12";
            } else if (iCount === 3) {
                sSpan = "L4 M6 S12";
            } else {
                sSpan = "L3 M6 S12";
            }
            return sSpan;
        },
        _getIndent: function () {
            var iCount = this.getDivisions().length;
            let sIndent = "";
            if (iCount === 1) {
                sIndent = "L2 M1 S0";
            } else if (iCount === 2) {
                sIndent = "L0 M0 S0";
            } else if (iCount === 3) {
                sIndent = "L0 M0 S0";
            } else {
                sIndent = "L0 M0 S0";
            }
            return sIndent;
        },



        renderer: VBoxRenderer
    });
});
