<template>
    <div class="l-heatmap abs l-flex-row">
        <div class="h-heatmap-legend holder flex-elem l-flex-row">
            <canvas ref="heatmap_legend" class="heatmap-legend flex-elem"></canvas>
            <div class="h-heatmap-legend-ticks flex-elem l-flex-col">
                <div class="s-tick-label flex-elem">{{legendTicks[0]}}</div>
                <div class="s-tick-label flex-elem">{{legendTicks[1]}}</div>
                <div class="s-tick-label flex-elem">{{legendTicks[2]}}</div>
            </div>
        </div>
        <div class="h-heatmap-grid-outer holder flex-elem l-flex-row">
            <div class="h-heatmap-grid-and-ticks">
                <div class="l-heatmap-ticks-y">
                    <div v-for="tick in yTicks" class="s-tick-label">{{tick}}
                        <!--<span class="s-tick-val">{{tick}}</span>-->
                    </div>
                </div>
                <canvas ref="heatmap_grid" class="heatmap-grid"></canvas>
                <div class="l-heatmap-ticks-x">
                    <div v-for="tick in xTicks" class="s-tick-label">{{tick}}
                        <!--<span class="s-tick-val">{{tick}}</span>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            xTicks: [],
            yTicks: [],
            legendTicks: [],
            xTickStyle: "",
            yTickStyle: "",
            legendTickStyle: "",
            low: "",
            high: ""
        };
    },
    mounted() {
        var vue = this;
        this.$nextTick(() {
            var canvas = vue.$refs.heatmap_grid;
            var legend = vue.$refs.heatmap_legend;
            var colors = new HeatmapColors(+self.domainObject.low, +self.domainObject.high);
            var renderer = new HeatmapRenderer(canvas, legend, colors);
            canvas.width = canvas.height = 1000; // Todo: change this to use .innerHeight/width of container
        });
    }
};
</script>
