jQuery.sap.declare("ffa.mastering.util.Controller");

// Provides controller ffa.mastering.util.Controller
sap.ui.define(["jquery.sap.global", "sap/ui/core/mvc/Controller"],
  function(jQuery, MvcController) {
    "use strict";

    var Controller = MvcController.extend("ffa.mastering.util.Controller", /** @lends ffa.mastering.util.Controller */ {

    });

    /**
     * Returns the event bus
     */
    Controller.prototype.getEventBus = function() {
      return this.getOwnerComponent().getEventBus();
    };

    /**
     * Returns the router
     */
    Controller.prototype.getRouter = function() {
      return sap.ui.core.UIComponent.getRouterFor(this);
    };

    /***
     *     █████╗ ██╗     ███████╗██████╗ ████████╗███████╗
     *    ██╔══██╗██║     ██╔════╝██╔══██╗╚══██╔══╝██╔════╝
     *    ███████║██║     █████╗  ██████╔╝   ██║   ███████╗
     *    ██╔══██║██║     ██╔══╝  ██╔══██╗   ██║   ╚════██║
     *    ██║  ██║███████╗███████╗██║  ██║   ██║   ███████║
     *    ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
     *
     */

    /**
     * Simple MessageBox error
     */
    Controller.prototype.showErrorAlert = function(sMessage, sTitle, bCompact) {
      jQuery.sap.require("sap.m.MessageBox");
      sap.m.MessageBox.alert(sMessage, {
        icon: sap.m.MessageBox.Icon.ERROR,
        title: (sTitle ? sTitle : "Alert"),
        actions: [sap.m.MessageBox.Action.CLOSE],
        styleClass: bCompact ? "sapUiSizeCompact" : ""
      });
    };

    /**
     * Simple MessageBox info alert
     */
    Controller.prototype.showInfoAlert = function(sMessage, sTitle, bCompact) {
      jQuery.sap.require("sap.m.MessageBox");
      sap.m.MessageBox.show(sMessage, {
        icon: sap.m.MessageBox.Icon.INFORMATION,
        title: (sTitle ? sTitle : "Information"),
        actions: [sap.m.MessageBox.Action.OK],
        styleClass: bCompact ? "sapUiSizeCompact" : ""
      });
    };

    /**
     * Simple MessageBox success alert
     */
    Controller.prototype.showSuccessAlert = function(sMessage, sTitle, bCompact) {
      jQuery.sap.require("sap.m.MessageBox");
      sap.m.MessageBox.show(sMessage, {
        icon: sap.m.MessageBox.Icon.SUCCESS,
        title: (sTitle ? sTitle : "Success"),
        actions: [sap.m.MessageBox.Action.CLOSE],
        styleClass: bCompact ? "sapUiSizeCompact" : ""
      });
    };


    /***
     *    ██████╗ ██╗   ██╗███████╗██╗   ██╗
     *    ██╔══██╗██║   ██║██╔════╝╚██╗ ██╔╝
     *    ██████╔╝██║   ██║███████╗ ╚████╔╝
     *    ██╔══██╗██║   ██║╚════██║  ╚██╔╝
     *    ██████╔╝╚██████╔╝███████║   ██║
     *    ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝
     *
     */

    /**
     * Opens a busy dialog WITH title and text
     * @param  {object} oParams Object of parameters
     */
    Controller.prototype.openBusyDialog =
      Controller.prototype.showBusyDialog = function(oParams) {
        var d = this._oBusyDialog;

        // Create the fragment and open!
        if (!d) {
          d = this._oBusyDialog = sap.ui.xmlfragment("ffa.mastering.view.BusyDialog", this);
          this.getView().addDependent(d);
        }

        // Set title, text and cancel event
        if (oParams) {
          d.setTitle(oParams.title);
          d.setText(oParams.text);
          if (typeof oParams.onCancel === 'function') {
            d.attachEvent('close', function(oEvent) {
              if (oEvent.getParameter("cancelPressed")) {
                oParams.onCancel();
              }
            });
          }

          // And cancel button?
          if (oParams.showCancelButton === undefined) {
            d.setShowCancelButton(false);
          } else {
            d.setShowCancelButton(oParams.showCancelButton);
          }
        } else {
          d.setTitle("");
          d.setText("");
          d.setShowCancelButton(false);
        }

        // now show the dialog
        d.open();
      };

    /**
     * Updates the open busy dialog with new text.
     * @param  {object} oParams Params containing only text
     */
    Controller.prototype.updateBusyDialog = function(oParams) {
      var d = this._oBusyDialog;
      if (!d) {
        this.showBusyDialog(oParams);
      } else {
        if (oParams.title) {
          d.setTitle(oParams.title);
        }
        if (oParams.text) {
          d.setText(oParams.text);
        }
      }
    };

    /**
     * Closes the busy dialog
     */
    Controller.prototype.closeBusyDialog =
      Controller.prototype.hideBusyDialog = function(oParams) {
        if (this._oBusyDialog) {
          // now show the dialog
          this._oBusyDialog.close();
        }
      };

    /***
     *     ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ███████╗
     *    ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██╔════╝
     *    ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     ███████╗
     *    ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ╚════██║
     *    ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████║
     *     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝
     *
     */

    /**
     * Collects the specified control Id from the view
     * @param  {String} sId  Control ID
     * @return {Control}     View control
     */
    Controller.prototype.getControl = function(sId) {
      return this.getView().byId(sId);
    };
  });
