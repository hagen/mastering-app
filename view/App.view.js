sap.ui.jsview("ffa.mastering.view.App", {

	getControllerName: function () {
		return "ffa.mastering.view.App";
	},

	createContent : function (oController) {
		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		oController._app = new sap.m.NavContainer({
			id : "idContainer"
		});
		return oController._app;
	}

});
