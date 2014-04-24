Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    requires: [
        'Rally.data.lookback.SnapshotStore',
        'Rally.data.lookback.SnapshotModel'
    ],

    // switch to app configuration from ui selection
    // This attribute is required for setting to work.
    config: {
        defaultSettings : {
            portfolioItemID: 17975052269,
            showGrid: true,
            showChart: false
        }
    },
    getSettingsFields: function() {

        var values = [
            {
                name: 'portfolioItemID',
                xtype: 'rallytextfield',
                label : 'Portfolio Item ID'

            },
            {
                name: 'showGrid',
                xtype: 'rallycheckboxfield',
                label: 'Show/Hide Grid'
            },
            {
                name: 'showChart',
                xtype: 'rallycheckboxfield',
                label: 'Show/Hide Chart'
            }
        ];

        return values;
    },
    componentCls: 'app',
    layout: 'fit',
    launch: function() {
        //Write app code here
        //this.update("portfolio app");

        this._getSnapshots(); // this will create Snapshot store this is needed if we use LookBack API
    },

    _snapshotStore: undefined, // save the loaded SnapshotStore with Lookback API query results

    _getSnapshots: function() {
        var store = Ext.create('Rally.data.lookback.SnapshotStore', {
            listeners: {
            load: this._onSnapshotStoreLoad,
                scope: this
            },
            find: {
                "_ItemHierarchy": this.getSetting("portfolioItemID"),
                "__At": "current",
                "_TypeHierarchy": { '$in' : [ "HierarchicalRequirement" ] },
                "Iteration": { $exists: true }, // Ensure we only have stories with an iteration
                "Children": null // Ensure we only have leaf nodes in the item tree, i.e. no parent stories or portfolio items with stories
            },
            fetch: ["ObjectID", "Name", "_ItemHierarchy", "Project", "_TypeHierarchy", "Iteration", "PlanEstimate", "ScheduleState"],
            hydrate: ["_TypeHierarchy", "ScheduleState"],
            sort: {
                "_ValidFrom": 1
            },
            start: 0,
            pagesize:100,
            compress: true,
            useHttpPost: true,
            autoLoad: true,
            groupField: 'Iteration'
		});

    },

    _onSnapshotStoreLoad: function(store, data, success) {
        //process data
        if (success) {
            this._snapshotStore = store;
            this._rollUpByProject(data);
        } else {
            alert("Something went wrong with the Lookback API request");
        }
    },

    _rollUpByProject: function(data) {
        var snapshots = _.map(data, function(item) {
            return item.data;
        });

        var groupedByIteration = _.groupBy(snapshots, 'Iteration');
        var iterations = _.keys(groupedByIteration);

    	var groupedByProject = _.groupBy(snapshots, 'Project');
    	var projects = _.keys(groupedByProject);

        this._getIterationDetails(iterations);
    },

    _getIterationDetails: function(iterationIds) {
        var iterations = _.without(iterationIds, "");
        var promises = [];
        _.each(iterations, function(iterationId) {
            promises.push(this._sendIterationQuery(iterationId));
        }, this);

        Deft.Promise.all(promises)
            .then({
                success: this._onIterationsLoaded,
                failure: function(error) {
                    alert('promises failure: ' + error);
                },
                scope: this
            });
    },

    _sendIterationQuery: function(iterationId) {
        var store = Ext.create('Rally.data.wsapi.Store', {
            model: Ext.identityFn('Iteration'),
            filters: [
                {
                    property: 'ObjectID',
                    operator: '=',
                    value: iterationId
                }
            ],
            context: {
                workspace: this.getContext().getWorkspaceRef()
            },
            fetch: ['ObjectID', 'Name','StartDate','EndDate'],
            limit: Infinity
        });
        // returns a Deft promise
        return store.load();
    },

    _onIterationsLoaded: function(results) {
        // convert the nested array of iteration data returned by multiple wsapi requests
        // into a map with ObjectID: [details map] as the key/value pairs.  This will
        // give us a lookup data structure to resolve iteration ObjectIDs to names in the
        // LBAPI results.
        var iterations = _.reduce(results, function(accumulator, value, key) {
            var details = value[0].data;
            accumulator[details.ObjectID] = {
                ObjectID: details.ObjectID,
                Name: details.Name,
                StartDate: details.StartDate,
                EndDate: details.EndDate,
            };
            return accumulator;

        }, {}, this);

        this._hydrateIterations(iterations);
    },

    _hydrateIterations: function(iterations) {
        console.log('_hydrateIterations');

        _.each(this._snapshotStore.data.items, function(item) {
            if (item.data.Iteration) {
                item.data.Iteration = iterations[item.data.Iteration].Name;
            }
        });

        if (this.getSetting("showGrid")) this._loadGrid(this._snapshotStore);
        if (this.getSetting("showChart")) this._loadChart();
    },

    _loadGrid: function(snapshotStore){
        console.log('_loadTable');
//        debugger;

        this.add({
            xtype: 'gridpanel',
            store: snapshotStore,
            columnLines: true,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                items: [{
                    xtype: 'exporterbutton'
                }]
            }],
            columns: [
                {
                    text: 'ObjectID',
                    dataIndex: 'ObjectID',
                    flex : 1,
                    sortable : false

                },
                {
                    text: 'Name',
                    dataIndex: 'Name',
                    flex : 1,
                    sortable : false
                },
                {
                    text: 'Project',
                    dataIndex: 'Project',
                    flex : 1,
                    sortable : false
                },
                {
                    text: 'Iteration',
                    dataIndex: 'Iteration',
                    flex : 1,
                    sortable : false
                },
                {
                    text: 'PlanEstimate',
                    dataIndex: 'PlanEstimate',
                    flex : 1,
                    sortable : false
                },
                {
                    text: 'ScheduleState',
                    dataIndex: 'ScheduleState',
                    flex : 1,
                    sortable : false
                }
            ]

        });

    },

    _loadChart: function() {
        console.log('_loadChart');

        var summary = this._getPlanEstimateByStateSummary(this._snapshotStore);

        var seriesData = [];

        _.reduce(summary, function(result, value, key) {
            seriesData.push({
                name: key,
                y: value
            });
        }, []);

        console.log('seriesData: ', seriesData);

        this._addChartComponent(seriesData);
    },

    _getPlanEstimateByStateSummary: function(snapshotStore) {
        var summary = _.reduce(snapshotStore.data.items, function(accumulator, value, key) {
            var state = value.data.ScheduleState;
            if (!accumulator[state]) {
                accumulator[state] = 0;
            }
            if (value.data.PlanEstimate) {
                accumulator[state] += value.data.PlanEstimate;
            }
            return accumulator;
        }, {}, this);
        return summary;
    },

    _addChartComponent: function(seriesData) {
        console.log('_addChartComponent');

        var chartComponentConfig = this._getHighchartComponentConfig(seriesData);
        console.log('chartComponentConfig', chartComponentConfig);

        this.add({
            xtype: 'container',
            items: [
                {
                    xtype: 'container',
                    itemId: 'header',
                    cls: 'header'
                },
                {
                    xtype: 'container',
                    itemId: 'chart',
                    cls: 'chart'
                }
            ]
        });

        console.log('adding chart to #chart');
        this.down('#chart').add(chartComponentConfig);

        console.log('after this.add');
    },

    _getHighchartComponentConfig: function(seriesData) {
        console.log('_getHighchartComponentConfig');

        var highchartConfig = this._getHighchartConfig();

        console.log('highchartConfig');
        console.log(highchartConfig);

        return {
            xtype: 'rallychart',
            chartConfig: highchartConfig,
            chartData: {
                categories: [],
                series: [{
                    type: 'pie',
                    name: 'Story points by state',
                    data: seriesData
                }]
            }
        };


    },

    _getHighchartConfig: function() {
        return {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Story points by state'
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage:.1f} %</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        // style: {
                        //     color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        // }
                    }
                }
            }
        };
    }


});
