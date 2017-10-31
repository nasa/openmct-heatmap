define([
    './HeatmapController',
    'text!./heatmap.html',
    'vue'
], function (
    HeatmapController,
    heatmapTemplate,
    Vue
) {
    function HeatmapView(domainObject, openmct, document) {
        this.domainObject = domainObject;
        this.openmct = openmct;
        this.document = document;
    }

    HeatmapView.prototype.show = function (container) {
        var self = this;
        var data = {
            xTicks: [],
            yTicks: [],
            legendTicks: [],
            xTickStyle: "",
            yTickStyle: "",
            legendTickStyle: "",
            low: this.domainObject.low,
            high: this.domainObject.high
        };
        var vue = new Vue({
            el: container,
            template: heatmapTemplate,
            data: data,
            mounted: function () {
                this.$nextTick(function () {
                    self.controller = new HeatmapController(
                        data,
                        vue.$refs.heatmap_grid,
                        vue.$refs.heatmap_legend,
                        self.domainObject,
                        self.openmct
                    );
                    // TODO: Resize dynamically to actual element size?
                    vue.$refs.heatmap_grid.width = vue.$refs.heatmap_grid.height = 1000;
                });
            }
        });
    };

    HeatmapView.prototype.destroy = function () {
        if (this.controller) {
            this.controller.destroy();
            delete this.controller;
        }
    };

    return HeatmapView;
});
