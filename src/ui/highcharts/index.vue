<template>
	<div class="highcharts-wrap"><div>
</template>

<script>
var Highcharts = require('highcharts');
import {
    config,
    formatDataViewer
} from  "./highchart.config";
import {
	getHighchartsLocalization
} from './highchart.l18n';

export default {
    name: "highcharts",

    props: {
    	type: {
    		type: String,
    		default: 'line'
    	},
    	showDataLabels: {
    		type: Boolean,
    		default: false
    	},
    	showLegend: {
    		type: Boolean,
    		default: false
    	},
    	showY1: {
    		type: Boolean,
    		default: false
    	},
		series: {
        	type: Array,
        	required: true
    	},
        extend: Object
	},

  	data: function() {
    	return {
    		target: undefined,
    		chartHeight: 500,
    		legendMaxH: 200,
    		startOfWeek: 0,
    		localeConfig: getHighchartsLocalization('zh_CN'),
    		localeTooltipDateTimeLabelFormats: getHighchartsLocalization('zh_CN')['localeTooltipDateTimeLabelFormats'],
            localeXAxisDateTimeLabelFormats: getHighchartsLocalization('zh_CN')['localeXAxisDateTimeLabelFormats']
    	}
    },

    mounted: function() {
        const options = {
            chart: {
                type: this.type,
                zoomType: null,
                marginTop: null,
                backgroundColor: 'transparent',
                height: this.chartHeight
            },
            colors: config.colorList,
            credits: {
                enabled: false
            },
            legend: {
                align: "left",
                borderWidth: 0,
                enabled: this.showLegend,
                itemStyle: {
                    color: config.legend.itemStyle,
                    textDecoration: null
                },
                itemHoverStyle: {
                    color: config.legend.itemHoverStyle,
                },
                itemHiddenStyle: {
                    textDecoration: 'line-through'
                },
                labelFormatter: function () {
                    return '<div class="text-over chart-highchart-legend" title="' + this.name + '"><span class="chart-highchart-legend-color" style="background-color: ' + this.color + '"></span><span class="chart-highchart-legend-info">' + this.name + '<span></div>';
                },
                maxHeight: this.legendMaxH,
                navigation: {
                    activeColor: config.legend.navigation.activeColor,
                    animation: true,
                    arrowSize: 10,
                    inactiveColor: config.legend.navigation.inactiveColor,
                    style: {
                        color: config.legend.navigation.styleColor,
                        fontSize: config.legend.navigation.styleFontSize
                    }
                },
                symbolHide: true, // 修改源码，drawLineMarker方法增加symbolHidde属性（L11342）
                symbolWidth: 0,
                symbolPadding: 0,
                useHTML: true,
                x: this.showY1 ? 25 : -12,
            },
            navigator: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    color: "#ff0000",
                    dataLabels: {
                        enabled: this.showDataLabels,
                        formatter: function () {
                         var _split = 0;
                         var regTextFloat = /^(-)?(\d)*(\.)(\d)*$/;//验证是否是float，必须有“.”才算float
                         if (regTextFloat.test(this.y)) {
                             _split = 2;
                         }
                         return formatDataViewer(this.point.y, this.point.unit, this.point.dataType, this.point.dataFormat);
                        }
                    },
                    lineWidth: 2,
                    states: {
                        hover: {
                            halo: null,
                            lineWidth: 3
                        }
                    },
                    marker: {
                        symbol: 'circle',
                        lineColor: '#FF0000', // inherit from series
                        radius: 1,
                        states: {
                            hover: {
                                fillColor: '#FFFFFF',
                                radius: 4,
                                radiusPlus: 2,
                                lineWidthPlus: 2,
                                lineColor: null, // inherit from series
                                lineWidth: 3
                            }
                        }
                    },
                },
            },
            series: this.series,
            title: {
                text: null
            },
            tooltip: {
                crosshairs: null,
                hideDelay: 0, //默认为500 ms. when mouse out from a point or chart之后,多久去隐藏toolTip,
                shadow: false,
                borderWidth: 0,
                dateTimeLabelFormats: this.localeTooltipDateTimeLabelFormats,
                useHTML: true,
                headerFormat: '<div class="chart-highchart-tooltip">',
                pointFormatter: function () {
                    return '<div class="chart-highchart-tooltip-data clearfix"><span>' + this.series.name + ':</span> <b>' + formatDataViewer(this.y, this.unit, this.dataType, this.dataFormat) + '</b></div>';
                },
                footerFormat: '<div class="chart-highchart-tooltip-info" style="background-color: {point.color};"><span class="block">{point.key}</span></div></div>',
                style: {
                    padding: 0,
                }
            },
            xAxis: [{
                type: 'datetime',
                startOfWeek: this.startOfWeek, // 0 = Sunday, 1 = Monday. Defaults to 1
                dateTimeLabelFormats: this.localeXAxisDateTimeLabelFormats,
                labels: {
                    enabled: false, // 不显示x轴刻度标签
                    style: {
                        color: '#bdbdbd',
                        fontSize: '12px'
                    }
                },
                title: {
                    text: null // 不显示x轴名称
                },
                lineColor: '#bdbdbd',
                lineWidth: 0, // 不显示x轴
                showFirstLabel: true,
                showLastLabel: true,
                gridLineColor: '#bdbdbd',
                gridLineWidth: 0, // 不显示格线
                tickColor: '#bdbdbd',
                tickWidth: 0, // 设置刻度线宽度
                tickLength: 0, // 设置刻度线长度
                tickPixelInterval: 60,
                minPadding: 0,
                maxPadding: 0,// 线与顶端距离
            }],
            yAxis: [{
                labels: {
                    style: {
                        color: '#bdbdbd',
                        fontSize: '12px'
                    },
                    enabled: true // 不显示y轴刻度标签
                },
                title: {
                    text: null // 不显示y轴名称
                },
                lineColor: '#bdbdbd',
                lineWidth: 0, // 不显示y轴的线
                offset: -8, // y轴label与y轴的距离
                tickColor: '#bdbdbd',
                endOnTick: false,
                minPadding: 0.01,
                maxPadding: 0.01, // 线与顶端距离
                gridLineColor: '#bdbdbd',
                gridLineWidth: 0 // 不显示格线
            }, {
                labels: {
                    style: {
                        color: '#bdbdbd',
                        fontSize: '12px'
                    },
                    enabled: false // 不显示y轴刻度标签
                },
                title: {
                    text: null // 不显示y轴名称
                },
                opposite: true,
                lineColor: '#bdbdbd',
                lineWidth: 0, // 不显示y轴的线
                offset: -8, // y轴label与y轴的距离
                tickColor: '#bdbdbd',
                endOnTick: false,
                minPadding: 0.01,
                maxPadding: 0.01, // 线与顶端距离
                gridLineColor: '#bdbdbd',
                gridLineWidth: 0 // 不显示格线
            }]
        };

        //各图形特殊配置
        switch(this.type){
            case "pie":
                options.colors = config.pieColorList;
                options.legend.y = 22;
                options.legend.align = "center";
                options.legend.labelFormatter = this.extend.labelFormatter;
                options.plotOptions.pie = this.extend.plotOptions;
                options.tooltip.pointFormatter = this.extend.pointFormatter;
                options.title = this.extend.title;
                break;
            case "stackBar":
                options.chart.type = 'bar';
                options.plotOptions.series['stacking'] = 'normal';
                break;
            case "stackColumn":
                options.chart.type = 'column';
                options.plotOptions.series['stacking'] = 'normal';
                break;
        }

        //初始化
		this.target = Highcharts.chart(this.$el, options);
	},

	beforeDestroy: function() {
		this.target.destroy();
	},

	methods: {
        
	}
}
</script>

<style lang="sass">
@import "../styles/imports";

.highcharts-wrap {
    background-color: $dd-white;
}
</style>