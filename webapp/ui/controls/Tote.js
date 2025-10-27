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
                labelTop: { type: "string" },
                labelBottom: { type: "string" },
                labelLeft: { type: "string" },
                labelRight: { type: "string" }
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
            this.setProperty("labelTop", sValue, true);
            this.getAggregation("_top").setText(sValue);
            return this;
        },
        setLabelBottom: function (sValue) {
            this.setProperty("labelBottom", sValue, true);
            this.getAggregation("_bottom").setText(sValue);
            return this;
        },
        setLabelLeft: function (sValue) {
            this.setProperty("labelLeft", sValue, true);
            this._oLeft.setText(sValue);
            return this;
        },
        setLabelRight: function (sValue) {
            this.setProperty("labelRight", sValue, true);
            this._oRight.setText(sValue);
            return this;
        },
        onBeforeRendering: function () {
            sap.m.VBox.prototype.onBeforeRendering.apply(this, arguments);
            this._oGrid.setDefaultSpan(this._getSpan());
            this._oGrid.setDefaultIndent(this._getIndent());

            this._oGrid.removeAllContent();

            this.getDivisions().forEach(function (oDiv) {
                oDiv.destroyLayoutData();
                this._oGrid.addContent(oDiv);
            }.bind(this));

            this._oLeft.setText(this.getLabelLeft());
            this._oRight.setText(this.getLabelRight());
            this.getAggregation("_top").setText(this.getLabelTop());
            this.getAggregation("_bottom").setText(this.getLabelBottom());

            this.removeAllItems();
            this.addItem(this.getAggregation("_top"));
            this.addItem(this.getAggregation("_middle"));
            this.addItem(this.getAggregation("_bottom"));
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
