jQuery.sap.declare("ffa.mastering.Component");
jQuery.sap.require("ffa.mastering.MyRouter");

sap.ui.core.UIComponent.extend("ffa.mastering.Component", {
  metadata: {
    dependencies: {
      libs: ["sap.m", "sap.ui.layout"],
      components: []
    },
    rootView: "ffa.mastering.view.App",
    config: {
      resourceBundle: "i18n/i18n.properties"
    },
    routing: {
      config: {
        routerClass: ffa.mastering.MyRouter,
        viewType: "XML",
        viewPath: "ffa.mastering.view",
        targetControl: "idContainer",
        targetAggregation: "pages",
        clearTarget: false,
        transition: "slide"
      },
      routes: [{
        pattern: ":all*:",
        name: "dash",
        view: "Dashboard",
        viewLevel: 1
      }],
    }
  },
  /**
   * Initialisation
   */
  init: function() {

    sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
    var mConfig = this.getMetadata().getConfig();

    // always use absolute paths relative to our own
    // component (relative paths will fail if running in the Fiori
    // Launchpad)
    var oRootPath = jQuery.sap.getModulePath("ffa.mastering");

    // set i18n model
    var i18nModel = new sap.ui.model.resource.ResourceModel({
      bundleUrl: [oRootPath, mConfig.resourceBundle].join("/")
    });
    this.setModel(i18nModel, "i18n");

    // set device model
    var mDeviceModel = new sap.ui.model.json.JSONModel({
      isTouch: sap.ui.Device.support.touch,
      isNoTouch: !sap.ui.Device.support.touch,
      isPhone: sap.ui.Device.system.phone,
      isNoPhone: !sap.ui.Device.system.phone,
      isDesktop: sap.ui.Device.system.desktop,
      isNoDesktop: !sap.ui.Device.system.desktop,
      listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
      listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
    });

    mDeviceModel.setDefaultBindingMode("OneWay");
    this.setModel(mDeviceModel, "device");

    // Init our router!
    this.getRouter().initialize();
  },

  /**
   * Destroy component?
   */
  destroy: function() {
    if (this._routeHandler) {
      this._routeHandler.destroy();
    }

    // call overriden destroy
    sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
  },

  /**
   * Create initial JS view - this is a wrapper that will return an embedded
   * SplitApp
   */
  createContent: function() {

    // create root view
    var oView = sap.ui.view({
      id: "idRootView",
      height: "100%",
      viewName: "ffa.mastering.view.App",
      type: "JS",
      viewData: {
        component: this
      }
    });

    // done
    return oView;
  }
});
