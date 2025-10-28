sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/westernacher/decanting/model/models",
    "./controller/ErrorHandler",
     "sap/ui/Device",
], (UIComponent, models, ErrorHandler,Device) => {
    "use strict";

    return UIComponent.extend("com.westernacher.decanting.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
            //this.oErrorHandler = new ErrorHandler(this);

        },
        getContentDensityClass: function () {
            if (this._sContentDensityClass === undefined) {
                // check whether FLP has already set the content density class; do nothing in this case
                var element = document.getElementsByTagName("body")[0];
                if (element.classList.contains("sapUiSizeCozy") || element.classList.contains("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (Device.system.desktop && Device.support.touch) { // apply "compact" mode if touch is not supported
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else if (Device.support.touch) { // apply "compact" mode if touch is not supported
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this._sContentDensityClass = "sapUiSizeCozy";
                } else {
                    //sapUiSizeCompact
                    this._sContentDensityClass = "sapUiSizeCompact";
                }
            }
            return this._sContentDensityClass;
        },

        /**
         * check if mobile device
         * @returns {boolean}
         * @private
         */
        isMobile: function () {
            return Device.system.tablet || Device.system.phone;
        },

    });
});