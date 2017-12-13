define([
    './Heatmap.vue',
    './HeatmapColors',
    './HeatmapController',
    './HeatmapModel',
    './HeatmapRenderer',
    './heatmap.html',
    './heatmap.scss'
], function (
    HeatmapVue,
    HeatmapColors,
    HeatmapController,
    HeatmapModel,
    HeatmapRenderer,
    heatmapTemplate
) {
    function HeatmapView(domainObject, openmct, document) {
        this.domainObject = domainObject;
        this.openmct = openmct;
        this.document = document;
    }

    HeatmapView.prototype.show = function (container) {
        var vue = new HeatmapVue();
        vue.data.low = this.domainObject.low;
        vue.data.high = this.domainObject.high;
        this.controller = new HeatmapController(
            vue,
            heatmapModel,
            self.domainObject,
            self.openmct
        );
    };

    HeatmapView.prototype.destroy = function () {
        if (this.controller) {
            this.controller.destroy();
            delete this.controller;
        }
    };

    return HeatmapView;
});
