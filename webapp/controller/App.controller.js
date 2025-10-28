sap.ui.define([
  "./BaseController"
], (BaseController) => {
  "use strict";

  return BaseController.extend("com.westernacher.decanting.controller.App", {
    onInit() {
    },
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
    getResourceBundle: function () {
      return this.getModel("i18n").getResourceBundle();
    },

    readData: function (sModelName, sUri, aFilters, sGroupId, mUrlParams, oReturn) {
      var oModel = sModelName ? this.getModel(sModelName) : this.getModel();
      return new Promise(function (resolve, reject) {
        oModel.read(sUri, {
          filters: aFilters,
          groupId: sGroupId || "",
          urlParameters: mUrlParams || {},
          success: function (oData, oResponse) {
            if (oReturn) {
              resolve([oData, oReturn]);
            } else {
              resolve(oData);
            }
          }.bind(this),
          error: function (oError) {
            //Handle Error
            reject(oError);
          }.bind(this)
        });
      }.bind(this));
    },
  });
});