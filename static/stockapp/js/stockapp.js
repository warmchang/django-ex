function loadstockjsondata(chart) {
    $.ajax({
        type: "get",
        url: "/stockapp/getchartjson/",
        dataType: "json",
        async: true,
        beforeSend: function(XMLHttpRequest) {
            chart.showLoading()
        },
        success: function(data, textStatus) {
            chart.setOption(data);
        },
        complete: function(XMLHttpRequest, textStatus) {
            chart.hideLoading()
        },
        error: function() {}
    });
}

function getsetdayk(chart, url) {
    $.ajax({
        type: "get",
        url: url,
        dataType: "json",
        async: true,
        beforeSend: function(XMLHttpRequest) {
            chart.showLoading()
        },
        success: function(data, textStatus) {
            // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
            // var data0 = splitData([
            //   ['2013/1/24', 2320.26,2320.26,2287.3,2362.94],
            // ]);
            var data0 = splitData(data.data);

            function splitData(rawData) {
                var categoryData = [];
                var values = []
                for (var i = 0; i < rawData.length; i++) {
                    categoryData.push(rawData[i].splice(0, 1)[0]);
                    values.push(rawData[i])
                }
                return {
                    categoryData: categoryData,
                    values: values
                };
            }

            function splitDataFromIndex(data, index) {
                var values = []
                for (var i = 0; i < data.length; i++) {
                    values.push(data[i][index])
                }
                return values;
            }

            function calculateMA(dayCount) {
                var result = [];
                for (var i = 0, len = data0.values.length; i < len; i++) {
                    if (i < dayCount) {
                        result.push('-');
                        continue;
                    }
                    var sum = 0;
                    for (var j = 0; j < dayCount; j++) {
                        sum += data0.values[i - j][1];
                    }
                    result.push(Math.round((sum / dayCount) * 100) / 100);
                }
                return result;
            }
            option = {
                title: {
                    text: data.code,
                    left: 100
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    }
                },
                legend: {
                    data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
                },
                grid: [{
                    left: 100,
                    right: 100,
                    height: '45%'
                }, {
                    left: 100,
                    right: 100,
                    top: '58%',
                    height: '35%'
                }],
                xAxis: [{
                    type: 'category',
                    data: data0.categoryData,
                    scale: true,
                    boundaryGap: false,
                    axisLine: {
                        onZero: false
                    },
                    splitLine: {
                        show: false
                    },
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax'
                }, {
                    gridIndex: 1,
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        onZero: true
                    },
                    data: data0.categoryData,
                    position: 'buttom'
                }],
                yAxis: [{
                    name: '价格(元)',
                    scale: true,
                    splitArea: {
                        show: true
                    }
                }, {
                    gridIndex: 1,
                    name: '成交量(万)',
                    type: 'value',
                    inverse: false
                }],
                dataZoom: [{
                    show: true,
                    realtime: true,
                    start: 30,
                    end: 70,
                    xAxisIndex: [0, 1]
                }, {
                    type: 'inside',
                    realtime: true,
                    start: 30,
                    end: 70,
                    xAxisIndex: [0, 1]
                }],
                series: [{
                    name: '日K',
                    type: 'candlestick',
                    data: data0.values,
                    markLine: {
                        symbol: ['none', 'none'],
                        data: [{
                            name: 'min line',
                            type: 'min',
                            valueDim: 'lowest'
                        }, {
                            name: 'max line',
                            type: 'max',
                            valueDim: 'highest'
                        }]
                    },
                    markPoint: {
                        label: {
                            normal: {
                                formatter: function(param) {
                                    return param != null ? Math.round(param.value * 100) / 100 : '';
                                }
                            },
                        },
                        data: [{
                            name: 'highest value',
                            type: 'max',
                            valueDim: 'highest',
                        }, {
                            name: 'lowest value',
                            type: 'min',
                            valueDim: 'lowest',
                            itemStyle: {
                                normal: {
                                    color: 'rgb(41,200,00)'
                                }
                            }
                        }, ],
                        // tooltip: {
                        //     formatter: function (param) {
                        //         return param.name + '<br>' + (param.data.coord || '');
                        //     }
                        // }
                    },
                }, {
                    name: 'MA5',
                    type: 'line',
                    data: calculateMA(5),
                    smooth: true,
                    lineStyle: {
                        normal: {
                            opacity: 0.5
                        },
                        color: '#000000'
                    }
                }, {
                    name: 'MA10',
                    type: 'line',
                    data: calculateMA(10),
                    smooth: true,
                    lineStyle: {
                        normal: {
                            opacity: 0.5
                        },
                        color: '#EEEE00'
                    }
                }, {
                    name: 'MA30',
                    type: 'line',
                    data: calculateMA(30),
                    smooth: true,
                    lineStyle: {
                        normal: {
                            opacity: 0.5
                        },
                        color: '#388E8E'
                    }
                }, {
                    name: '成交量',
                    type: 'bar',
                    //barWidth : 8,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    symbolSize: 8,
                    hoverAnimation: false,
                    data: splitDataFromIndex(data0.values, 4)
                }]
            };
            chart.setOption(option);
        },
        complete: function(XMLHttpRequest, textStatus) {
            chart.hideLoading()
        },
        error: function() {}
    });
}
