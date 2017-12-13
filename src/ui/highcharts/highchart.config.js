// const options = {
//     chart: {
//         type: this.type,
//         zoomType: null,
//         marginTop: null,
//         backgroundColor: 'transparent',
//         height: this.chartHeight
//     },
//     colors: config.colorList,
//     credits: {
//         enabled: false
//     },
//     legend: {
//         align: "left",
//         borderWidth: 0,
//         enabled: this.showLegend,
//         itemStyle: {
//             color: config.legend.itemStyle,
//             textDecoration: null
//         },
//         itemHoverStyle: {
//             color: config.legend.itemHoverStyle,
//         },
//         itemHiddenStyle: {
//             textDecoration: 'line-through'
//         },
//         labelFormatter: function() {
//             return '<div class="text-over chart-highchart-legend" title="' + this.name + '"><span class="chart-highchart-legend-color" style="background-color: ' + this.color + '"></span><span class="chart-highchart-legend-info">' + this.name + '<span></div>';
//         },
//         maxHeight: this.legendMaxH,
//         navigation: {
//             activeColor: config.legend.navigation.activeColor,
//             animation: true,
//             arrowSize: 10,
//             inactiveColor: config.legend.navigation.inactiveColor,
//             style: {
//                 color: config.legend.navigation.styleColor,
//                 fontSize: config.legend.navigation.styleFontSize
//             }
//         },
//         symbolHide: true, // 修改源码，drawLineMarker方法增加symbolHidde属性（L11342）
//         symbolWidth: 0,
//         symbolPadding: 0,
//         useHTML: true,
//         x: this.showY1 ? 25 : -12,
//     },
//     navigator: {
//         enabled: false
//     },
//     plotOptions: {
//         series: {
//             borderWidth: 0,
//             color: "#ff0000",
//             dataLabels: {
//                 enabled: this.showDataLabels,
//                 // formatter: function () {
//                 //  var _split = 0;
//                 //  var regTextFloat = /^(-)?(\d)*(\.)(\d)*$/;//验证是否是float，必须有“.”才算float
//                 //  if (regTextFloat.test(this.y)) {
//                 //      _split = 2;
//                 //  }
//                 //  //格式化dataLabels的显示
//                 //  //无效代码，暂时保留：return Highcharts.numberFormat(this.y, _split, '.', ',');
//                 //  return this.formatDataViewer(this.point.y, this.point.unit, this.point.dataType, this.point.dataFormat);
//                 // }
//             },
//             lineWidth: 2,
//             states: {
//                 hover: {
//                     halo: null,
//                     lineWidth: 3
//                 }
//             },
//             marker: {
//                 symbol: 'circle',
//                 lineColor: '#FF0000', // inherit from series
//                 radius: 1,
//                 states: {
//                     hover: {
//                         fillColor: '#FFFFFF',
//                         radius: 4,
//                         radiusPlus: 2,
//                         lineWidthPlus: 2,
//                         lineColor: null, // inherit from series
//                         lineWidth: 3
//                     }
//                 }
//             },
//         },
//     },
//     series: this.series,
//     title: {
//         text: null
//     },
//     tooltip: {
//         crosshairs: null,
//         hideDelay: 0, //默认为500 ms. when mouse out from a point or chart之后,多久去隐藏toolTip,
//         shadow: false,
//         borderWidth: 0,
//         dateTimeLabelFormats: this.localeTooltipDateTimeLabelFormats,
//         useHTML: true,
//         headerFormat: '<div class="chart-highchart-tooltip">',
//         // pointFormatter: function () {
//         //     return '<div class="chart-highchart-tooltip-data clearfix"><span>' + this.series.name + ':</span> <b>' + this.formatDataViewer(this.y, this.unit, this.dataType, this.dataFormat) + '</b></div>';
//         // },
//         footerFormat: '<div class="chart-highchart-tooltip-info" style="background-color: {point.color};"><span class="block">{point.key}</span></div></div>',
//         style: {
//             padding: 0,
//         }
//     },
//     xAxis: [{
//         type: 'datetime',
//         startOfWeek: this.startOfWeek, // 0 = Sunday, 1 = Monday. Defaults to 1
//         dateTimeLabelFormats: this.localeXAxisDateTimeLabelFormats,
//         labels: {
//             enabled: false, // 不显示x轴刻度标签
//             style: {
//                 color: '#bdbdbd',
//                 fontSize: '12px'
//             }
//         },
//         title: {
//             text: null // 不显示x轴名称
//         },
//         lineColor: '#bdbdbd',
//         lineWidth: 0, // 不显示x轴
//         showFirstLabel: true,
//         showLastLabel: true,
//         gridLineColor: '#bdbdbd',
//         gridLineWidth: 0, // 不显示格线
//         tickColor: '#bdbdbd',
//         tickWidth: 0, // 设置刻度线宽度
//         tickLength: 0, // 设置刻度线长度
//         tickPixelInterval: 60,
//         minPadding: 0,
//         maxPadding: 0, // 线与顶端距离
//     }],
//     yAxis: [{
//         labels: {
//             style: {
//                 color: '#bdbdbd',
//                 fontSize: '12px'
//             },
//             enabled: true // 不显示y轴刻度标签
//         },
//         title: {
//             text: null // 不显示y轴名称
//         },
//         lineColor: '#bdbdbd',
//         lineWidth: 0, // 不显示y轴的线
//         offset: -8, // y轴label与y轴的距离
//         tickColor: '#bdbdbd',
//         endOnTick: false,
//         minPadding: 0.01,
//         maxPadding: 0.01, // 线与顶端距离
//         gridLineColor: '#bdbdbd',
//         gridLineWidth: 0 // 不显示格线
//     }, {
//         labels: {
//             style: {
//                 color: '#bdbdbd',
//                 fontSize: '12px'
//             },
//             enabled: false // 不显示y轴刻度标签
//         },
//         title: {
//             text: null // 不显示y轴名称
//         },
//         opposite: true,
//         lineColor: '#bdbdbd',
//         lineWidth: 0, // 不显示y轴的线
//         offset: -8, // y轴label与y轴的距离
//         tickColor: '#bdbdbd',
//         endOnTick: false,
//         minPadding: 0.01,
//         maxPadding: 0.01, // 线与顶端距离
//         gridLineColor: '#bdbdbd',
//         gridLineWidth: 0 // 不显示格线
//     }]
// }


export const config = {
    "lineWidth": 160,
    "lineHeight": 100,
    "lineMargin": [0, 0, 0, 0],
    "colorList": ["#C5E1A5", "#EEEEEE", "#A2E0AC", "#B2E2F9", "#F0F4C3", "#F18B85", "#9BAAD3", "#F7B2CC", "#FCD592", "#BC8E84"],
    "pieColorList": ["#AED581", "#6FBD7F", "#6E7FBC", "#88C5EC", "#E6EE9C", "#EE6E66", "#FBC349", "#F48FB1", "#A56B60", "#DCEDC8"],
    "columnColorList": ["#AED581", "#6FBD7F", "#B39DDB", "#88C5EC", "#F48FB1", "#FBC349", "#A56B60", "#D4E157", "#2196F3", "#EE6E66"],
    "lineColorList": ["#AED581", "#2196F3", "#b39ddb", "#6fbd7f", "#F48FB1", "#FBC349", "#A56B60", "#DCE775", "#88c5ec", "#EE6E66"],
    "plotLineColor": "#F18B85",
    "pieOthersColor": "#DCEDC8",
    "legend": {
        "itemStyle": "#bdbdbd",
        "itemHoverStyle": "#bdbdbd",
        "navigation": {
            "activeColor": "#bdbdbd",
            "inactiveColor": "#bdbdbd",
            "styleColor": "#bdbdbd",
            "styleFontSize": "12px"
        }
    }
}

/**
 * 格式化数据显示
 * 数据格式化需要分为两种
 * 1：table类型，该类型不需要在此方法内处理数据格式
 * 2：highcharts类型
 */
export function formatDataViewer(data, unit, dataType, dataFormat, notSplitNumber) {

    var reg = /^(\-|\+)?\d+(\.\d+)?$/; //判断字符串是否为数字(正数、负数、小数) //var reg = /^[0-9]+.?[0-9]*$/;
    if (!reg.test(data)){
        return data; // 如果不是数值直接将data返回，unit抛弃（table中的维度列）
    }
    data = parseFloat(data);
    unit = unit || '';
    var result = ''; // 默认将数值和单位拼接显示
    var numberSign = ""; // 数值正负号
    if(data < 0){
        numberSign = "-";
        data = Math.abs(data); // 转为正数
    }

    if('h' == unit){
        //将小时转换成毫秒
        data = data*60*60*1000;
        unit = 'ms';
    }else if('m' == unit){
        //将分钟转换成毫秒
        data = data*60*1000;
        unit = 'ms';
    }else if('s' == unit){
        data = data*1000;
        unit = 'ms';
    }

    // 如果单位是秒(s),对时间进行格式化显示为: 1h2m3s4ms
    if('ms' == unit){
        var ms = 1;
        var s = 1000;
        var m = 1000 * 60;
        var h = 1000 * 60 * 60;
        var d = 1000 * 60 * 60 * 24;

        // 修正数值位数
        if(data != 0){
            data = parseFloat(data).toFixed(2); // 保留两位小数
            data = parseFloat(data); // 去除末尾的0
        }

        if(data >= d){
            result += (data - data%d)/d + 'd'; // 取整
            data = data%d; // 求余
        }
        if(data >= h){
            result += (data - data%h)/h + 'h'; // 取整
            data = data%h; // 求余
        }
        if(data >= m){
            result += (data-data%m)/m + 'm';
            data = data%m;
        }
        if(data >= s){
            result += (data-data%s)/s + 's';
            data = data%s;
        }
    }

    // 修正数值位数
    if(data != 0){
        data = parseFloat(data).toFixed(2); // 保留两位小数
        data = parseFloat(data); // 去除末尾的0
    }

    if(!notSplitNumber && unit != "%"){
        data = splitNumber(data);
    }

    if(!result || (result && data != 0) ){
        if( (dataType == 'CURRENCY' && (dataFormat == '¥##' || dataFormat == '$##'|| dataFormat == '¥###' || dataFormat == '$')) ){
            result += unit + data;
        }else{
            if('$' == unit || '¥' == unit){
                result += unit + data;
            }else{
                result += data + unit;
            }
        }
    }

    return numberSign + result;
}

/**
    数字三位分割处理
    @param source       要分割的数字
*/
export function splitNumber(source){
    //处理成三位数分割
    source = parseFloat(source).toFixed(2); // 保留两位小数
    source = parseFloat(source); // 2.90 >>> 2.9， 去除末尾的0
    source = (source + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    return source;
}