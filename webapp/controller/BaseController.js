sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
  ],
  function (Controller) {
    "use strict";

    return Controller.extend(
      "com.westernacher.decanting.controller.BaseController",
      {
        /**
         * Convenience method for accessing the router in every controller of the application.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
          return this.getOwnerComponent().getRouter();
        },

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
          if (this.getOwnerComponent) {
            return this.getOwnerComponent().getModel(sName);
          }
          return this.getView().getModel(sName);
        },

        /**
         * returns language bundle
         * @returns 
         */
        getResourceBundle: function(){
          return this.getModel("i18n").getResourceBundle();
        },



      }
    );
  }
);
