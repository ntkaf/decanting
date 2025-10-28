sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageBox"
], function (UI5Object, MessageBox) {
    "use strict";

    return UI5Object.extend("com.westernacher.decanting.controller.ErrorHandler", {

        metadata: {
            // extension can declare the public methods
            // in general methods that start with "_" are private
            methods: {
                constructor: {
                    public: true,
                    final: true
                }
            }
        },

        /**
         * Handles application errors by automatically attaching to the model events and displaying errors when needed.
         * @class
         * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
         * @public
         * @alias com.evorait.evosuite.evoprep.controller.ErrorHandler
         */
        constructor: function (oComponent) {
            this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
            this._oComponent = oComponent;
            this._oDataModel = oComponent.getModel();
            this._bMessageOpen = false;
            
            this._oDataModel.attachMetadataFailed(function (oEvent) {
                var oParams = oEvent.getParameters();
                this.showServiceError(this.extractError(oParams.response));
            }, this);

        },


        showServiceError: function (sMessage) {
            if (this._bMessageOpen) {
                return;
            }
            this._bMessageOpen = true;
            MessageBox.error(
                sMessage, {
                styleClass: this._oComponent.getContentDensityClass(),
                actions: [MessageBox.Action.CLOSE],
                onClose: function () {
                    this._bMessageOpen = false;
                }.bind(this)
            }
            );
        },
        extractError: function (oError) {
            if (JSON.parse(oError.responseText).error.innererror.errordetails) {
                var MsgArr = JSON.parse(oError.responseText).error.innererror.errordetails,
                sMessage = MsgArr.join("\n");
                return sMessage;
            }
        },

    });
});