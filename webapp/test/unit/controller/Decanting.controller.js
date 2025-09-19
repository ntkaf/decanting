/*global QUnit*/

sap.ui.define([
	"com/westernacher/decanting/controller/Decanting.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Decanting Controller");

	QUnit.test("I should test the Decanting controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
