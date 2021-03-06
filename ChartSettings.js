(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define("ChartSettings", {

        requires: [
            //"settings.PortfolioDatePicker",
            //"settings.PortfolioItemDataTypePicker",
            "settings.PortfolioItemPicker"
        ],

        // mixins: [
        //     "settings.SettingsChangeMixin"
        // ],

        config: {
            app: undefined
        },

        constructor: function (config) {
            this.mergeConfig(config);
        },

        getSettingsConfiguration: function () {
            var self = this;

            var componentJoiner = function () {
                this.settingsParent = this.settingsParent || self;
                self.addChildComponent(this);
            };

            return [
                this._buildComponent("chartportfolioitempicker", componentJoiner),
                //this._buildComponent("chartportfoliodatepicker", componentJoiner),
                //this._buildComponent("chartportfoliodatatypepicker", componentJoiner)
            ];
        },

        _buildComponent: function (type, componentJoiner) {
            return {
                xtype: type,
                cls: "paddedSettingCmp",
                listeners: {
                    added: componentJoiner
                }
            };
        },

        // sendSettingsChange: function (artifact, caller) {
        //     for (var i = 0; i < this.childComponents.length; i++) {
        //         var child = this.childComponents[i];
        //         if (child !== caller) {
        //             child.receiveSettingsChange(artifact);
        //         }
        //     }
        // },

        addChildComponent: function (component) {
            this.childComponents = this.childComponents || [];
            this.childComponents.push(component);
        }
    });
}());
