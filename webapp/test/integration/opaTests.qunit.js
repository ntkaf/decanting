/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["com/westernacher/decanting/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
