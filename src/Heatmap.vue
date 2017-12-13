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
            low: 0,
            high: 100,
            grid: []
        };
    },
    computed: {
        bounds: function () {
            return { low: this.low, high: this.high };
        },
        colors: function () {
            return new HeatmapColors(this.low, this.high);
        },
        width: function () {
            return this.height > 0 ? grid[0].length : 0;
        },
        height: function () {
            return this.grid.length;
        }
    },
    methods: {
        renderLegend() {
            var legend = vue.$refs.heatmap_legend;
            if (!legend) {
                this.$nextTick(this.renderLegend.bind(this));
            }
            var legendContext = legend.getContext('2d');

            for (var y = 0; y < legend.height; y += 1) {
                legendContext.fillStyle =
                    this.colors.colorForIntensity(1.0 - y / legend.height);
                legendContext.fillRect(0, y, legend.width, 2);
            }
        },
        renderMap() {
            var canvas = vue.$refs.heatmap_grid;
            var width = this.width;
            var height = this.height;
            var xSize = this.canvas.width / width;
            var ySize = this.canvas.height / height;
            var points = heatmapModel.points();

            this.context.lineWidth = 1.5;
            this.context.strokeStyle = '#484848';
            for (var x = 0; x < width; x += 1) {
                for (var y = 0; y < height; y += 1) {
                    this.context.fillStyle =
                        this.colors.color(heatmapModel.at(x + bounds.x - 1, y + bounds.y - 1));
                    this.context.fillRect(x * xSize, y * ySize, xSize, ySize);
                    this.context.strokeRect(x * xSize, y * ySize, xSize, ySize);
                }
            }

            if (points.length > 0) {
                this.context.lineWidth = 3.0;
                this.context.strokeStyle = '#FFFFFF';
                this.context.beginPath();
                this.context.moveTo(
                    (points[0].x - bounds.x + 1) * xSize,
                    (points[0].y - bounds.y + 1) * ySize
                );
                points.forEach(function (point, index) {
                    this.context.lineTo(
                        (point.x - bounds.x + 1) * xSize,
                        (point.y - bounds.y + 1) * ySize
                    );
                }.bind(this));
                this.context.stroke();

                this.context.fillStyle = '#FFFFFF';
                this.context.beginPath();
                this.context.arc(
                    (points[points.length - 1].x - bounds.x + 1) * xSize,
                    (points[points.length - 1].y - bounds.y + 1) * ySize,
                    9.0,
                    0,
                    Math.PI * 2
                );
                this.context.fill();
            }
        }
    }
    mounted() {
        this.$nextTick(() {
            this.renderLegend();
            this.renderMap();
            var canvas = vue.$refs.heatmap_grid;
            // Todo: change this to use .innerHeight/width of container
            canvas.width = canvas.height = 1000;
        });
    }
};
</script>

<style lang="sass">
$interiorMargin: 10px;
$interiorMarginSm: 5px;
$interiorMarginLg: 20px;

/********************************************* HEATMAPS */
.l-heatmap {
    font-size: 0.7rem;
    right: $interiorMargin; // Fend off from the scrollbar
}

.h-heatmap-legend {
    flex: 1 1 1%; // Pertains to the width of legend area
    height: 50%;
    min-height: 100px !important;
    canvas.heatmap-legend {
        width: 10px;
    }
    .h-heatmap-legend-ticks {
       justify-content: space-between;
       margin-left: $interiorMarginSm;
    }
}

.h-heatmap-grid-outer {
    $ticksYW: 40px;
    flex: 1 1 100% !important;
    margin-left: $ticksYW + $interiorMarginLg;

    .h-heatmap-grid-and-ticks {
        position: relative;
        height: 0;
        width: 100%;
        padding-bottom: 100%;
        .heatmap-grid {
            width: 100%;
            height:100%;
            position: absolute;
        }

        .s-tick-label {
            flex: 1;
            min-width: 0;
            overflow: hidden;
        }

        .l-heatmap-ticks-x,
        .l-heatmap-ticks-y {
            justify-content: stretch;
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            z-index: 2;
        }

        .l-heatmap-ticks-x,
        .l-heatmap-ticks-y {
            display: flex;
            flex-wrap: nowrap;
        }

        .l-heatmap-ticks-x {
            flex-direction: row;
            bottom: auto;
            top: 100%;
            transform: translateY($interiorMargin);
            .s-tick-label {
                text-align: center;
            }
        }

        .l-heatmap-ticks-y {
            flex-direction: column;
            left: auto;
            right: 100%;
            text-align: right;
            transform: translateX($interiorMargin * -1);
            .s-tick-label {
                display: flex;
                align-items: center;
                text-align: right;
            }
        }
    }
}
</style>
