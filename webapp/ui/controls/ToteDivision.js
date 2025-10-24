sap.ui.define([
    "sap/f/Card",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Title",
    "sap/m/ObjectNumber",
    "sap/m/FlexItemData",
    "sap/m/Button",
    "sap/m/StepInput"
], function (Card, VBox, Text, Title, ObjectNumber, FlexItemData, Button, StepInput) {
    "use strict";

    return Card.extend("com.westernacher.decanting.ui.controls.ToteDivision", {
        metadata: {
            properties: {
                title: { type: "string" },
                titleCloseButton: { type: "string" },
                productDescription: { type: "string" },
                packedQuantity: { type: "string" },
                unit: { type: "string" },
                quantity: { type: "int", defaultValue: 1 },
                quantityMaxValue: { type: "int", defaultValue: 1 },
                state: { type: "string", defaultValue: "" }
            },
            events: {
                close: {
                    enablePreventDefault: true,
                    parameters: {
                        btnSource: { type: "object" }
                    }
                }
            }
        },

        init: function () {
            Card.prototype.init.apply(this, arguments);

            this.setLayoutData(new FlexItemData({
                baseSize: "20%",
                growFactor: 1
            }));

            this.addStyleClass("toteCell");

            this._oTitle = new Title();

            this._oAddButton = new Button({
                type: "Transparent",
                icon: "sap-icon://add",
                width: "100%",
                press: function () {
                    this.setDivisionReadyForPacking();

                }.bind(this)
            });
            this._oAddButton.addStyleClass("toteCellBtn");

            this._oQuantityStepInput = new StepInput({
                width: "6rem",
                min: 1
            });

            this._oCloseButton = new Button({
                type: "Transparent",
                width: "100%",
                press: function () {
                    this.setDivisionClosed()
                    this.fireClose({
                        btnSource: this._oCloseButton
                    });
                }.bind(this)
            });
            this._oCloseButton.addStyleClass("toteCellBtn");

            this._oProductDescription = new Text();
            this._oProductDescription.addStyleClass("sapUiSmallMargin");

            this._oObjectNumber = new ObjectNumber({
                emphasized: true
            });
            this._oObjectNumber.addStyleClass("sapMObjectNumberLarge");


        },

        onBeforeRendering: function () {
            Card.prototype.onBeforeRendering.apply(this, arguments);

            this._oTitle.setText(this.sTitleText);
            this._oQuantityStepInput.setMax(this.getQuantityMaxValue());
            this._oQuantityStepInput.setValue(this.getQuantity());


            this._oCloseButton.setText(this.getTitleCloseButton());


            this._oProductDescription.setText(this.getProductDescription());
            this._oObjectNumber.setNumber(this.getPackedQuantity());
            this._oObjectNumber.setUnit(this.getUnit());

            this._applyState(this.getState());
            this._oVbox = new VBox({
                alignItems: "Center",
                justifyContent: "Center",
                width: "100%"
            });
            this._oVbox.addItem(this._oTitle);
            this._oVbox.addItem(this._oAddButton);
            this._oVbox.addItem(this._oQuantityStepInput);
            this._oVbox.addItem(this._oCloseButton);
            this._oVbox.addItem(this._oProductDescription);
            this._oVbox.addItem(this._oObjectNumber);


            this.setContent(this._oVbox);

        },

        setTitle: function (sValue) {
            this.setProperty("title", sValue);
            this.sTitleText = sValue;
            if (this._oTitle) {
                this._oTitle.setText(sValue);
            }
            return this;
        },

        setTitleCloseButton: function (sValue) {
            this.setProperty("titleCloseButton", sValue, true);
            if (this._oCloseButton) {
                this._oCloseButton.setText(sValue);
            }
            return this;
        },

        setProductDescription: function (sValue) {
            this.setProperty("productDescription", sValue, true);
            if (this._oProductDescription) {
                this._oProductDescription.setText(sValue);
            }
            return this;
        },

        setPackedQuantity: function (sValue) {
            this.setProperty("packedQuantity", sValue, true);
            if (this._oObjectNumber) {
                this._oObjectNumber.setNumber(sValue);
            }
            return this;
        },

        setUnit: function (sValue) {
            this.setProperty("unit", sValue, true);
            if (this._oObjectNumber) {
                this._oObjectNumber.setUnit(sValue);
            }
            return this;
        },

        setQuantity: function (sValue) {
            this.setProperty("quantity", sValue, true);
            if (this._oQuantityStepInput) {
                this._oQuantityStepInput.setValue(sValue);
            }
            return this;
        },

        setQuantityMaxValue: function (sValue) {
            this.setProperty("quantityMaxValue", sValue, true);
            if (this._oQuantityStepInput) {
                this._oQuantityStepInput.setMax(sValue);
            }
            return this;
        },



        setState: function (sValue) {
            this.setProperty("state", sValue, true);
            this._applyState(sValue);
            return this;
        },

        _applyState: function (sValue) {
            if (!this._oTitle) {
                return;
            }

            if (sValue === "closed") {
                this._oTitle.setVisible(false);
                this._oAddButton.setVisible(false);
                this._oQuantityStepInput.setVisible(false);
                this._oCloseButton.setVisible(false);
                this._oProductDescription.setVisible(true);
                this._oObjectNumber.setVisible(true);
            } else if (sValue === "selected") {
                this._oTitle.setVisible(true);
                this._oAddButton.setVisible(false);

                this._oQuantityStepInput.setVisible(true);
                this._oCloseButton.setVisible(true);
                this._oProductDescription.setVisible(false);
                this._oObjectNumber.setVisible(false);
            } else {
                this._oTitle.setVisible(true);
                this._oAddButton.setVisible(true);
                this._oQuantityStepInput.setVisible(false);
                this._oCloseButton.setVisible(false);
                this._oProductDescription.setVisible(false);
                this._oObjectNumber.setVisible(false);
            }

        },
        setDivisionReadyForPacking: function () {
            this.setState("selected")
            this.addStyleClass("readyForPackingBackground")
        },
        setDivisionClosed: function () {
            this.setState("closed")
            this.removeStyleClass("readyForPackingBackground");
            this.addStyleClass("packedBackground");
        },
        renderer: {
            apiVersion: 2,
            render: function (oRm, oControl) {
                sap.f.CardRenderer.render(oRm, oControl);
            }
        }
    });
});
