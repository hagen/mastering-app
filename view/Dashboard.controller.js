jQuery.sap.declare("ffa.mastering.view.Dashboard");
jQuery.sap.require("ffa.mastering.thirdparty.twitter.Twitter");
jQuery.sap.require("sap.m.MessageToast");

// Provides controller view.Dashboard
sap.ui.define([
    'jquery.sap.global',
    'ffa/mastering/util/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/viz/ui5/controls/common/feeds/FeedItem',
    'sap/viz/ui5/data/FlattenedDataset'
  ],
  function(jQuery, Controller, JSONModel, FeedItem, FlattenedDataset) {
    "use strict";

    var Dashboard = Controller.extend("ffa.mastering.view.Dashboard", /** @lends ffa.mastering.view.Dashboard.prototype */ {
      _dialogStartDelay: 12000,
      _dialogPrizeDelay: 7000,
      _dialogJellyBeansDelay: 7000
    });

    /**
     * On init handler
     */
    Dashboard.prototype.onInit = function() {
      // handle route matched
      this.getRouter().getRoute("dash").attachPatternMatched(this.onRouteMatched, this);

      // set up socket listener
      var self = this;
      socket.on("surveys processed", function(oData) {
        self.onDataAvailable(oData);
      });
      socket.on("no surveys processed", function(oData) {
        self.onNoDataAvailable(oData);
      });
    };

    /**
     * On exit handler
     */
    Dashboard.prototype.onExit = function() {};

    /**
     *
     */
    Dashboard.prototype.onBeforeRendering = function() {};

    /**
     *
     */
    Dashboard.prototype.onAfterRendering = function() {};

    /**
     * Route matched handler...
     */
    Dashboard.prototype.onRouteMatched = function(oEvent) {
      this.initSurveyResults();
    };

    /**
     * Initialise the charts with full data loads
     */
    Dashboard.prototype.initSurveyResults = function() {
      // Start with donut
      this.initDonut();

      // Init maturity column chart
      this.initColumn();

      // init heat map
      this.initHeatMap();

      // init pie
      this.initPie();
    };

    Dashboard.prototype.onRunPress = function(first_argument) {
      this.onDataAvailable({
        status: "OK",
        count: 1,
        names: "Hagen"
      });
    };

    /***
     *    ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗
     *    ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝
     *    ███████╗██║   ██║██║     █████╔╝ █████╗     ██║
     *    ╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║
     *    ███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║
     *    ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝
     *
     */

    /**
     * When the socket receives notification that data is available,
     * this handler is fired. It is supplied summary data from
     * the server event, including names, count of survey results collected,
     * and a timestamp.
     * @param  {object} oData Socket event payload from server
     */
    Dashboard.prototype.onDataAvailable = function(oData) {
      // Open the thank you dialog to read the new name
      if (!this._oThankYouDialog) {
        this._oThankYouDialog = sap.ui.xmlfragment("idThankYouFragment", "ffa.mastering.view.ThankYouDialog", this);
        this.getView().addDependent(this._oThankYouDialog);
      }

      // reference for thank you dialog
      var t = this._oThankYouDialog;

      // Set model data from oData.
      if (!this._mUpdate) {
        this._mUpdate = new JSONModel(oData);
        this.getView().setModel(this._mUpdate, "update");
      } else {
        this._mUpdate.setData(oData);
      }

      // Open the nav container dialog
      t.open();

      // Collect nav container and Run page one
      this.runPageStart(sap.ui.core.Fragment.byId("idThankYouFragment", "idNavContainer"));
    };

    /**
     * When the button is pressed, but there is no survey show an error. This may
     * also be how we dispense jelly beans without the need for a survey
     * @param  {object} oData Payload from socket server.
     */
    Dashboard.prototype.onNoDataAvailable = function (oData) {
      // This event is fired when the button is pressed, but there are no surveys
      // available to show. That is, no new surveys have been pressed.
      sap.m.MessageToast.show("No surveys submitted");
    };

    /**
     * Given a number of milliseconds to count for, this function updates
     * the button text, to simulate a count down
     * @param  {number} ms milliseconds
     */
    Dashboard.prototype.beginButtonCountDown = function(ms) {
      var iRemaining = ms - 1000,
        oButton = sap.ui.core.Fragment.byId("idThankYouFragment", "idCountDownButton"),
        sId = jQuery.sap.intervalCall(1000, this, function() {
          if (iRemaining === 0 || iRemaining < 0) {
            oButton.setText("Next");
            jQuery.sap.clearIntervalCall(sId);
          } else {
            oButton.setText(iRemaining / 1000);
            iRemaining -= 1000;
          }
        }, []);
    };

    /***
     *    ███████╗████████╗ █████╗ ██████╗ ████████╗    ██████╗  █████╗  ██████╗ ███████╗
     *    ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝    ██╔══██╗██╔══██╗██╔════╝ ██╔════╝
     *    ███████╗   ██║   ███████║██████╔╝   ██║       ██████╔╝███████║██║  ███╗█████╗
     *    ╚════██║   ██║   ██╔══██║██╔══██╗   ██║       ██╔═══╝ ██╔══██║██║   ██║██╔══╝
     *    ███████║   ██║   ██║  ██║██║  ██║   ██║       ██║     ██║  ██║╚██████╔╝███████╗
     *    ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
     *
     */
    /**
     * Run the start page (whatevern that means)
     * @param  {NavContainer} oNavContainer The dialog nav container
     */
    Dashboard.prototype.runPageStart = function(oNavContainer) {
      this.beginButtonCountDown(this._dialogStartDelay);
      jQuery.sap.delayedCall(this._dialogStartDelay, this, this.runPagePrize, [oNavContainer]);
    };

    /***
     *    ██████╗ ██████╗ ██╗███████╗███████╗    ██████╗  █████╗  ██████╗ ███████╗
     *    ██╔══██╗██╔══██╗██║╚══███╔╝██╔════╝    ██╔══██╗██╔══██╗██╔════╝ ██╔════╝
     *    ██████╔╝██████╔╝██║  ███╔╝ █████╗      ██████╔╝███████║██║  ███╗█████╗
     *    ██╔═══╝ ██╔══██╗██║ ███╔╝  ██╔══╝      ██╔═══╝ ██╔══██║██║   ██║██╔══╝
     *    ██║     ██║  ██║██║███████╗███████╗    ██║     ██║  ██║╚██████╔╝███████╗
     *    ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
     *
     */
    Dashboard.prototype.runPagePrize = function(oNavContainer) {
      // Nav to the next page,
      oNavContainer.to(sap.ui.core.Fragment.byId("idThankYouFragment", "idPagePrize"));

      // begin the button countdown
      this.beginButtonCountDown(this._dialogPrizeDelay);

      // now we wait, so the user can read the screen
      jQuery.sap.delayedCall(this._dialogPrizeDelay, this, this.runPageJellyBeans, [oNavContainer]);

      // send an SMS
      //this.sendSMS(this._mUpdate.getProperty("/request_id"));
    };

    /***
     *         ██╗███████╗██╗     ██╗  ██╗   ██╗    ██████╗ ███████╗ █████╗ ███╗   ██╗███████╗
     *         ██║██╔════╝██║     ██║  ╚██╗ ██╔╝    ██╔══██╗██╔════╝██╔══██╗████╗  ██║██╔════╝
     *         ██║█████╗  ██║     ██║   ╚████╔╝     ██████╔╝█████╗  ███████║██╔██╗ ██║███████╗
     *    ██   ██║██╔══╝  ██║     ██║    ╚██╔╝      ██╔══██╗██╔══╝  ██╔══██║██║╚██╗██║╚════██║
     *    ╚█████╔╝███████╗███████╗███████╗██║       ██████╔╝███████╗██║  ██║██║ ╚████║███████║
     *     ╚════╝ ╚══════╝╚══════╝╚══════╝╚═╝       ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝
     *
     */
    Dashboard.prototype.runPageJellyBeans = function(oNavContainer) {
      // Nav to the next page,
      oNavContainer.to(sap.ui.core.Fragment.byId("idThankYouFragment", "idPageJellyBeans"));

      // begin the button countdown
      this.beginButtonCountDown(this._dialogJellyBeansDelay);

      // And again, wait so the user can read the page
      jQuery.sap.delayedCall(this._dialogJellyBeansDelay, this, function() {

        // Close dialog
        this._oThankYouDialog.close();

        // Load survey results
        this.loadLatestResults(jQuery.proxy(this.onSurveyLoaded, this), jQuery.proxy(this.onSurveyLoadFailed, this));

        // nav back to start
        oNavContainer.backToTop();
      }, []);
    };

    /**
     * Fires and ajax call to the server to shuttle survey results from
     * TypeForm to our database. Once results are read, this call returns and we update
     * the screen with a thank you dialog, and then finally, update the charts.
     * @param  {Function} fnSuccess Success handler
     * @param  {Function} fnError   Error handler
     */
    Dashboard.prototype.loadLatestResults = function(fnSuccess, fnError) {

      // Start with donut
      this.refreshDonut();

      // Init maturity vs data driven combo chart
      this.refreshCombo();

      // init heat map
      this.refreshHeatMap();

      // init pie
      this.refreshPie();

      // Call success handler
      fnSuccess();
    };

    /**
     * Once the survey results have been loaded, we can show a thank you, and
     * update all our charts accordingly.
     */
    Dashboard.prototype.onSurveyLoaded = function() {

      // close of the busy dialog
      if (this._oBusyDialog) {
        this._oBusyDialog.close();
      }

      // Open the thank you dialog to read the new name
      if (!this._oThankYouDialog) {
        this._oThankYouDialog = sap.ui.xmlfragment("idThankYouFragment", "ffa.mastering.view.ThankYouDialog", this);
        this.getView().addDependent(this._oThankYouDialog);
      }

      // reference for thank you dialog
      var t = this._oThankYouDialog;
      t.open();

      // Close dialog once done.
      jQuery.sap.delayedCall(5000, this, function() {
        t.close();

        // update charts so animation can be seen - do this one by one,
        // so the differences can be seen.
      }, []);
    };

    Dashboard.prototype.onSurveyLoadFailed = function() {
      // body...
    };

    /***
     *    ███████╗███╗   ███╗███████╗
     *    ██╔════╝████╗ ████║██╔════╝
     *    ███████╗██╔████╔██║███████╗
     *    ╚════██║██║╚██╔╝██║╚════██║
     *    ███████║██║ ╚═╝ ██║███████║
     *    ╚══════╝╚═╝     ╚═╝╚══════╝
     *
     */

     /**
      * Send SMS text messages to all persons submitted with this survey id.
      * The server will handle finding and sending, we just initiate.
      * @param  {String} sId Survey request id
      */
    Dashboard.prototype.sendSMS = function (sId) {
      jQuery.ajax({
        url: '/sms/send/' + sId,
        type: 'GET',
        async: true,
        success: jQuery.proxy(function(oData, mResponse) {
          sap.m.MessageToast.show(oData.msg);
        }, this),
        error: jQuery.proxy(function(mError) {
          sap.m.MessageToast.show("Error sending text messages");
        }, this)
      });
    };

    /***
     *    ██████╗  ██████╗ ███╗   ██╗██╗   ██╗████████╗
     *    ██╔══██╗██╔═══██╗████╗  ██║██║   ██║╚══██╔══╝
     *    ██║  ██║██║   ██║██╔██╗ ██║██║   ██║   ██║
     *    ██║  ██║██║   ██║██║╚██╗██║██║   ██║   ██║
     *    ██████╔╝╚██████╔╝██║ ╚████║╚██████╔╝   ██║
     *    ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝    ╚═╝
     *
     */

    /**
     * Initialises the donut viz frame, and performs an initial data load.
     */
    Dashboard.prototype.initDonut = function() {

      jQuery.ajax({
        url: '/api/challenges',
        type: 'GET',
        async: true,
        success: jQuery.proxy(function(oData, mResponse) {
          // Render a pie chart, using latest results from survey
          var oVizFrame = this.getView().byId("idVizFrameDonut");
          oVizFrame.setVizType("donut");

          var oPopOver = this.getView().byId("idPopOver");
          oPopOver.connect(oVizFrame.getVizUid());

          var oDataset = new FlattenedDataset({
            dimensions: [{
              name: "Challenge",
              value: "{challenge}"
            }],
            measures: [{
              name: "Proportion",
              value: '{count}'
            }],
            data: {
              path: "/challenges"
            }
          });
          oVizFrame.setDataset(oDataset);

          var mModel = new JSONModel(oData);
          oVizFrame.setModel(mModel);

          var feedSize = new FeedItem({
              uid: "size",
              type: "Measure",
              values: ["Proportion"]
            }),
            feedColor = new FeedItem({
              uid: "color",
              type: "Dimension",
              values: ["Challenge"]
            });
          oVizFrame.addFeed(feedSize);
          oVizFrame.addFeed(feedColor);

          oVizFrame.setVizProperties({
            legend: {
              title: {
                visible: false
              }
            },
            title: {
              visible: false,
            }
          });
        }, this),
        error: jQuery.proxy(function(mError) {

        }, this)
      });
    };

    /**
     * Refresh the donut chart of challenges by collecting the latest results
     * from server. Supply just the updated data to the viz. Set busy while
     * updating...
     */
    Dashboard.prototype.refreshDonut = function() {
      // Grab the chart...
      var oVizFrame = this.getView().byId("idVizFrameDonut");
      oVizFrame.setBusy(true);

      // Collect updated data for the donut. This just reads all challenges
      // data
      var mModel = oVizFrame.getModel();
      mModel.loadData('/api/challenges', {
        success: jQuery.proxy(function(oData, mResponse) {
          // Render the donut chart
          jQuery.sap.delayedCall(2000, this, function() {
            mModel.updateBindings();
            oVizFrame.setBusy(false);
          }, []);
        }, this),
        error: jQuery.proxy(function(mError) {
          oVizFrame.setBusy(false);
        }, this)
      }, true, "GET", false, false, {});
    };

    /***
     *     ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗
     *    ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗
     *    ██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║
     *    ██║     ██║   ██║██║╚██╔╝██║██╔══██╗██║   ██║
     *    ╚██████╗╚██████╔╝██║ ╚═╝ ██║██████╔╝╚██████╔╝
     *     ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═════╝  ╚═════╝
     *
     */

    /**
     * Initialises the column chart viz frame, and performs an initial data load.
     */
    Dashboard.prototype.initColumn = function() {

      jQuery.ajax({
        url: '/api/maturity',
        type: 'GET',
        async: true,
        success: jQuery.proxy(function(oData, mResponse) {
          // render a column chart, indicating average maturity
          var oVizFrame = this.getView().byId("idVizFrameColumn");
          oVizFrame.setVizType("combination");

          var oPopOver = this.getView().byId("idPopOver");
          oPopOver.connect(oVizFrame.getVizUid());

          var oDataset = new FlattenedDataset({
            dimensions: [{
              name: "Rating",
              value: "{rating}"
            }],
            measures: [{
              name: "Maturity",
              value: "{maturity}"
            }, {
              name: "Competitiveness",
              value: "{competitiveness}"
            }],
            data: {
              path: "/maturity_and_comp"
            }
          });
          oVizFrame.setDataset(oDataset);

          var mModel = new JSONModel(oData);
          oVizFrame.setModel(mModel);

          var feedSize = new FeedItem({
              uid: "valueAxis",
              type: "Measure",
              values: ["Maturity", "Competitiveness"]
            }),
            feedColor = new FeedItem({
              uid: "categoryAxis",
              type: "Dimension",
              values: ["Rating"]
            });
          oVizFrame.addFeed(feedSize);
          oVizFrame.addFeed(feedColor);

          oVizFrame.setVizProperties({
            general: {
              layout: {
                padding: 0.04
              }
            },
            valueAxis: {
              title: {
                visible: true,
                text: "Proportion of answers"
              }
            },
            categoryAxis: {
              title: {
                visible: true,
                text: "Rating"
              }
            },
            plotArea: {
              dataLabel: {
                visible: false,
                formatString: 'datalabelFormat',
                style: {
                  color: null
                }
              },
              dataShape: {
                primaryAxis: ["line", "bar"]
              }
            },
            legend: {
              title: {
                visible: false
              }
            },
            title: {
              visible: false,
              text: ""
            }
          });
        }, this),
        error: jQuery.proxy(function(mError) {

        }, this)
      });
    };

    /**
     * Refresh the donut chart of challenges by collecting the latest results
     * from server. Supply just the updated data to the viz. Set busy while
     * updating...
     */
    Dashboard.prototype.refreshCombo = function() {
      // Grab the chart...
      var oVizFrame = this.getView().byId("idVizFrameColumn");
      oVizFrame.setBusy(true);

      var mModel = oVizFrame.getModel();
      mModel.loadData('/api/maturity', {
        success: jQuery.proxy(function(oData, mResponse) {
          // Render the donut chart
          jQuery.sap.delayedCall(3000, this, function() {
            mModel.updateBindings();
            oVizFrame.setBusy(false);
          }, []);
        }, this),
        error: jQuery.proxy(function(mError) {
          oVizFrame.setBusy(false);
        }, this)
      }, true, "GET", false, false, {});
    };

    /***
     *    ██╗  ██╗███████╗ █████╗ ████████╗    ███╗   ███╗ █████╗ ██████╗
     *    ██║  ██║██╔════╝██╔══██╗╚══██╔══╝    ████╗ ████║██╔══██╗██╔══██╗
     *    ███████║█████╗  ███████║   ██║       ██╔████╔██║███████║██████╔╝
     *    ██╔══██║██╔══╝  ██╔══██║   ██║       ██║╚██╔╝██║██╔══██║██╔═══╝
     *    ██║  ██║███████╗██║  ██║   ██║       ██║ ╚═╝ ██║██║  ██║██║
     *    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝       ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝
     *
     */

    /**
     * Initialises the heat map viz frame, and performs an initial data load.
     */
    Dashboard.prototype.initHeatMap = function() {

      jQuery.ajax({
        url: '/api/data_driven',
        type: 'GET',
        async: true,
        success: jQuery.proxy(function(oData, mResponse) {
          // render a column chart, indicating average maturity
          var oVizFrame = this.getView().byId("idVizFrameHeatMap");
          oVizFrame.setVizType("heatmap");

          var oPopOver = this.getView().byId("idPopOver");
          oPopOver.connect(oVizFrame.getVizUid());

          var oDataset = new FlattenedDataset({
            dimensions: [{
              name: "Statement",
              value: "{statement}"
            }],
            measures: [{
              name: "Count",
              value: "{count}"
            }],
            data: {
              path: "/data_driven"
            }
          });
          oVizFrame.setDataset(oDataset);

          var mModel = new JSONModel(oData);
          oVizFrame.setModel(mModel);

          var feedColor = new FeedItem({
              uid: "color",
              type: "Measure",
              values: ["Count"]
            }),
            feedCategoryAxis = new FeedItem({
              uid: "categoryAxis",
              type: "Dimension",
              values: ["Statement"]
            });
          oVizFrame.addFeed(feedColor);
          oVizFrame.addFeed(feedCategoryAxis);

          oVizFrame.setVizProperties({
            general: {
              layout: {
                padding: 0.04
              }
            },
            categoryAxis: {
              title: {
                visible: false
              }
            },
            categoryAxis2: {
              title: {
                visible: false
              }
            },
            plotArea: {
              background: {
                border: {
                  top: {
                    visible: false
                  },
                  bottom: {
                    visible: false
                  },
                  left: {
                    visible: false
                  },
                  right: {
                    visible: false
                  }
                }
              },
              dataLabel: {
                visible: false,
                formatString: 'datalabelFormat',
                style: {
                  color: null
                }
              }
            },
            legend: {
              visible: true,
              title: {
                visible: false
              }
            },
            title: {
              visible: false,
              text: 'Data driven businesses'
            }
          });
        }, this),
        error: jQuery.proxy(function(mError) {

        }, this)
      });
    };

    /**
     * Refresh the heat map chart of data driven business by collecting the latest results
     * from server. Supply just the updated data to the viz. Set busy while
     * updating...
     */
    Dashboard.prototype.refreshHeatMap = function() {
      // Grab the chart...
      var oVizFrame = this.getView().byId("idVizFrameHeatMap");
      oVizFrame.setBusy(true);

      // Collect updated data for the donut. This just reads all challenges
      // data
      var mModel = oVizFrame.getModel();
      mModel.loadData('/api/data_driven', {
        success: jQuery.proxy(function(oData, mResponse) {
          // Render the donut chart
          jQuery.sap.delayedCall(4000, this, function() {
            mModel.updateBindings();
            oVizFrame.setBusy(false);
          }, []);
        }, this),
        error: jQuery.proxy(function(mError) {
          oVizFrame.setBusy(false);
        }, this)
      }, true, "GET", false, false, {});
    };

    /***
     *    ██████╗ ██╗███████╗
     *    ██╔══██╗██║██╔════╝
     *    ██████╔╝██║█████╗
     *    ██╔═══╝ ██║██╔══╝
     *    ██║     ██║███████╗
     *    ╚═╝     ╚═╝╚══════╝
     *
     */

    /**
     * Initialises the pie viz frame, and performs an initial data load.
     */
    Dashboard.prototype.initPie = function() {

      jQuery.ajax({
        url: '/api/accuracy',
        type: 'GET',
        async: true,
        success: jQuery.proxy(function(oData, mResponse) {
          // Render a pie chart, using latest results from survey
          var oVizFrame = this.getView().byId("idVizFramePie");
          oVizFrame.setVizType("pie");

          var oPopOver = this.getView().byId("idPopOver");
          oPopOver.connect(oVizFrame.getVizUid());

          var oDataset = new FlattenedDataset({
            dimensions: [{
              name: "Accuracy",
              value: "{percentage}"
            }],
            measures: [{
              name: "Proportion",
              value: '{count}'
            }],
            data: {
              path: "/accuracy"
            }
          });
          oVizFrame.setDataset(oDataset);

          var mModel = new JSONModel(oData);
          oVizFrame.setModel(mModel);

          var feedSize = new FeedItem({
              uid: "size",
              type: "Measure",
              values: ["Proportion"]
            }),
            feedColor = new FeedItem({
              uid: "color",
              type: "Dimension",
              values: ["Accuracy"]
            });
          oVizFrame.addFeed(feedSize);
          oVizFrame.addFeed(feedColor);

          oVizFrame.setVizProperties({
            legend: {
              title: {
                visible: false
              }
            },
            title: {
              visible: false,
            }
          });
        }, this),
        error: jQuery.proxy(function(mError) {

        }, this)
      });
    };

    /**
     * Refresh the donut chart of challenges by collecting the latest results
     * from server. Supply just the updated data to the viz. Set busy while
     * updating...
     */
    Dashboard.prototype.refreshPie = function() {
      // Grab the chart...
      var oVizFrame = this.getView().byId("idVizFramePie");
      oVizFrame.setBusy(true);

      // Collect updated data for the donut. This just reads all challenges
      // data
      var mModel = oVizFrame.getModel();
      mModel.loadData('/api/accuracy', {
        success: jQuery.proxy(function(oData, mResponse) {
          // Render the donut chart
          jQuery.sap.delayedCall(1500, this, function() {
            mModel.updateBindings();
            oVizFrame.setBusy(false);
          }, []);
        }, this),
        error: jQuery.proxy(function(mError) {
          oVizFrame.setBusy(false);
        }, this)
      }, true, "GET", false, false, {});
    };

    return Dashboard;

  }, /* bExport= */ true);
