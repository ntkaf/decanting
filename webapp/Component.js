sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/westernacher/decanting/model/models",
     "./controller/ErrorHandler",
], (UIComponent, models,ErrorHandler) => {
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

        }
    });
});