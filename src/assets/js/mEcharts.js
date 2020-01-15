import echarts from 'echarts';
import {nowDayTo, nowMountTo, nowTimeTo} from '../../util/common'


// 业务数量&状态
export function option1Fn(){
    var dataArr = [{
        value: 91,
        name: '综合健康评分'
    }];
    var color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
            offset: 0,
            color: '#5CF9FE' // 0% 处的颜色
        },
        {
            offset: 0.17,
            color: '#468EFD' // 100% 处的颜色
        },
        {
            offset: 0.9,
            color: '#468EFD' // 100% 处的颜色
        },
        {
            offset: 1,
            color: '#5CF9FE' // 100% 处的颜色
        }
    ]);
    var colorSet = [
        [0.91, color],
        [1, '#15337C']
    ];
    var rich = {
        white: {
            fontSize: 50,
            color: '#fff',
            fontWeight: '500',
            padding: [-150, 0, 0, 0]
        },
        bule: {
            fontSize: 120,
            fontFamily: 'DINBold',
            color: '#fff',
            fontWeight: '700',
            padding: [-120, 0, 0, 0],
        },
        radius: {
            width: 350,
            height: 80,
            // lineHeight:80,
            borderWidth: 1,
            borderColor: '#0092F2',
            fontSize: 50,
            color: '#fff',
            backgroundColor: '#1B215B',
            borderRadius: 20,
            textAlign: 'center',
        },
        size: {
            height: 400,
            padding: [100, 0, 0, 0]
        }
    }
  var option = {
        // backgroundColor: '#0E1327',
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
    
        series: [{ //内圆
                type: 'pie',
                radius: '85%',
                center: ['50%', '50%'],
                z: 0,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.RadialGradient(.5, .5, 1, [{
                                offset: 0,
                                color: 'rgba(17,24,43,0)'
                            },
                            {
                                offset: .5,
                                // color: '#1E2B57'
                                color:'rgba(28,42,91,.6)'
                            },
                            {
                                offset: 1,
                                color: '#141C33',
                                // color:'rgba(17,24,43,0)'
                            }
                        ], false),
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                },
                hoverAnimation: false,
                label: {
                    show: false,
                },
                tooltip: {
                    show: false
                },
                data: [100],
            },
            {
                type: 'gauge',
                name: '外层辅助',
                radius: '74%',
                startAngle: '225',
                endAngle: '-45',
                splitNumber: '100',
                pointer: {
                    show: false
                },
                detail: {
                    show: false,
                },
                data: [{
                    value: 1
                }],
                // data: [{value: 1, name: 90}],
                title: {
                    show: true,
                    offsetCenter: [0, 30],
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: '微软雅黑',
                        fontSize: 20,
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [
                            [1, '#00FFFF']
                        ],
                        width: 2,
                        opacity: 1
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    length: 20,
                    lineStyle: {
                        color: '#051932',
                        width: 0,
                        type: 'solid',
                    },
                },
                axisLabel: {
                    show: false
                }
            },
            {
                type: 'gauge',
                radius: '70%',
                startAngle: '225',
                endAngle: '-45',
                pointer: {
                    show: false
                },
                detail: {
                    formatter: function(value) {
                        var num = Math.round(value);
                        return '{bule|' + num + '}{white|分}' + '{size|' + '}\n{radius|综合健康评分}';
                    },
                    rich: rich,
                    "offsetCenter": ['0%', "0%"],
                },
                data: dataArr,
                title: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colorSet,
                        width: 25,
                        // shadowBlur: 15,
                        // shadowColor: '#B0C4DE',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        opacity: 1
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false,
                    length: 25,
                    lineStyle: {
                        color: '#00377a',
                        width: 2,
                        type: 'solid',
                    },
                },
                axisLabel: {
                    show: false
                },
            },
            {
                name: '灰色内圈', //刻度背景
                type: 'gauge',
                z: 2,
                radius: '60%',
                startAngle: '225',
                endAngle: '-45',
                //center: ["50%", "75%"], //整体的位置设置
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [1, '#018DFF']
                        ],
                        width: 2,
                        opacity: 1, //刻度背景宽度
                    }
                },
                splitLine: {
                    show: false
                },
                // data: [{
                //     show: false,
                //     value: '80'
                // }], //作用不清楚
                axisLabel: {
                    show: false
                },
                pointer: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                detail: {
                    show: 0
                }
            },
            {
                name: "白色圈刻度",
                type: "gauge",
                radius: "60%",
                startAngle: 225, //刻度起始
                endAngle: -45, //刻度结束
                z: 4,
                axisTick: {
                    show: false
                },
                splitLine: {
                    length: 16, //刻度节点线长度
                    lineStyle: {
                        width: 2,
                        color: 'rgba(1,244,255, 0.9)'
                    } //刻度节点线
                },
                axisLabel: {
                    color: 'rgba(255,255,255,0)',
                    fontSize: 12,
                }, //刻度节点文字颜色
                pointer: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        opacity: 0
                    }
                },
                detail: {
                    show: false
                },
                data: [{
                    value: 0,
                    name: ""
                }]
            },
            { //内圆
                type: 'pie',
                radius: '56%',
                center: ['50%', '50%'],
                z: 1,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.RadialGradient(.5, .5, .8, [{
                                offset: 0,
                                color: '#4978EC'
                            },
                            {
                                offset: .5,
                                color: '#1E2B57'
                            },
                            {
                                offset: 1,
                                color: '#141F3D'
                            }
                        ], false),
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                },
                hoverAnimation: false,
                label: {
                    show: false,
                },
                tooltip: {
                    show: false
                },
                data: [100],
            },
        ]
    };

    return option1;
}
export function option011Fn(){
    var rich1 = {
        a1:{color:'#222',fontSize:24,padding:[0,0,12,0],fontFamily :'PingFang'},
        a2:{color:'#666',fontSize:12,padding:[6,0,5,0],fontFamily :'PingFang'},
        b1:{color:'#222',fontSize:24,padding:[0,0,12,0],fontFamily :'PingFang'},
        b2:{color:'#666',fontSize:12,padding:[5,0,5,0],fontFamily :'PingFang'},
        c1:{color:'#222',fontSize:22,padding:[0,0,5,0],fontFamily :'PingFang'},
        c2:{color:'#666',fontSize:12,padding:[5,0,5,0],fontFamily :'PingFang'},
        hr:{borderColor: '#eee',width: '100%',borderWidth: 0.3,height: 0,align:'left'}
    };
    var color1_01 = ['#4795FF','#EEEEEE'];
    var color1_02 = ['#F3BD4A','#EEEEEE'];
    var color1_03 = ['#28BCD5','#EEEEEE'];
    var labelTop = {
        normal : {
            label : {
                show : true,
                formatter : function (params){
                   var html= '';
                   html +='{a1|'+params.data.value+'}'+'\n{a2|正常数量}'+'\n{hr|}\n';
                    return html;
                },
                rich:rich1,
                position : 'center',
                textStyle: {
                    baseline : 'bottom'
                }
            }
        }
    };
    var labelBottom = {
        normal : {
            color: '#ccc',
            label : {
                show : true,
                position : 'center',
                formatter : function (params){
                   var html= '';
                   html +='{b1|'+params.data.value+'}'+'\n{b2|异常数量}';
                    return html;
                },
                textStyle: {
                    baseline : 'top'
                },
                rich:rich1
            },
            labelLine : {
                show : false
            }
        }
    };
    var labelBottom2 = {
        normal : {
            color: '#ccc',
            label : {
                show : true,
                position : 'center',
                formatter : function (params){
                   var html= '';
                   html +='{b1|'+params.data.value+'}'+'\n{b2|异常数量}';
                    return html;
                },
                textStyle: {
                    baseline : 'top'
                },
                rich:rich1
            },
            labelLine : {
                show : false
            }
        }
    }

    var radius1 = [80, 90];

    let option1 = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            show: false
        },
        title : [
        {
            text: '网络层转换',
            left: 'center',
            bottom: '8%',
            textStyle: {color:"#222",fontWeight:'normal',fontSize:14}
        }

    ],
        toolbox: {
            show : false
        },
        series : [

            {
                type : 'pie',
                center : ['50%', '55%'],
                hoverAnimation  :false, //去除悬浮放大动画	  
                silent:true, //去除悬浮高亮
                clockwise :false, //顺时针
                radius : radius1,
                x:'20%', // for funnel
                itemStyle: {
                    normal: {
                        color:function(params) {
                            return color1_02[params.dataIndex]
                        }
                    }
                },
                data : [
                    {name:'正常数量', value:76,itemStyle : labelTop},
                    {name:'异常数量', value: 24, itemStyle : labelBottom}
                ]
            },
            // {
            //     type : 'pie',
            //     center : ['79%', '44%'],
            //     hoverAnimation  :false, //去除悬浮放大动画	  
            //     silent:true, //去除悬浮高亮
            //     radius : radius1,
            //     clockwise :false, //顺时针
            //     x:'40%', // for funnel
            //     itemStyle: {
            //         normal: {
            //             color:function(params) {
            //                 return color1_03[params.dataIndex]
            //             }
            //         }
            //     },
            //     data : [
            //         {name:'正常数量', value:14,itemStyle : labelTop},
            //         {name:'异常数量', value:86, itemStyle : labelBottom}
            //     ]
            // }
        ],
        color: ['#4895FF','#F4BC4B','#27BDD5']
    };

    return option1;
}


// 访问量和流量统计
export function option2Fn(type = '每月'){
    function pushData(){
        if(type == '每月'){
            let data = nowMountTo(12);
            let newData = [];
            for(var i in data){
                newData.push(data[i].substring(2,data.length));
            }
            return newData.reverse();
        }else if(type == '每天'){
            let data = nowDayTo(12);
            let newData = [];
            for(var i in data){
                newData.push(data[i].substring(2,data.length));
            }
            return newData.reverse();
        }else if(type == '每时'){
            let data = nowTimeTo(12);
            return data.reverse();
        }
    }

    let option2 = {
        legend: {
            itemGap: 20,
            data: ['设备1','设备2','并发量'],
            icon: 'circle',
            itemWidth: 7,
            itemHeight: 7,
            top: 0
        },
        title: {
            text: 'IPv4',
            textStyle: {
                color: '#515a6e'
            },
            left: 'center',
            top: '20'
        },
        grid: {  
            left: '1.5%',  
            right: '1%',  
            bottom: '8%',
            containLabel: true  
       },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#B5D8FF'
                }
            },
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: [5, 10],
            textStyle: {
                color: 'white',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        xAxis: {
            type: 'category',
            data: pushData(),
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            }
        },
        yAxis: [{
            type: 'value',
            name: '流量(Mbps)',
            nameTextStyle: {
                color: '#9AC3FF'
            },
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            },
            min: 0,
            max: 1000
        },{
            type: 'value',
            name: '并发量',
            nameTextStyle: {
                color: '#9AC3FF'
            },
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            },
            min: 0,
            max: 1000
        }],
        series: [{
            name: '设备1',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: ['200', '100', '108', '141', '126', '328', '130', '200', '100', '300', '18', '200'],
            itemStyle: {
                normal: {
                    color: '#4894FF'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            areaStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            stack: '总量'
        }, {
            name: '设备2',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: ['300', '300', '198', '341', '186', '228', '130', '220', '100', '300', '218', '350'],
            itemStyle: {
                normal: {
                    color: '#F3BC47'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            areaStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            stack: '总量'
        },{
            name: '并发量',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: ['100', '200', '308', '241', '226', '328', '230', '100', '300', '200', '328', '280'],
            itemStyle: {
                normal: {
                    color: '#EF4971'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            }
        }]
    }

    return option2;
}

// 集群状态
export function option5Fn(){
    var colorList5_01 = ['#4493FC', '#EFEFEF'];
    var colorList5_02 = ['#F1BC48', '#EFEFEF'];
    var colorList5_03 = ['#28BCD6', '#EFEFEF'];

    let option5 = {
        series: [
            {
                name:'业务IPv4地址',
                type:'pie',
                radius: ['30%', '57%'],
                hoverAnimation  :false, //去除悬浮放大动画	  
                silent:true, //去除悬浮高亮
                clockwise :false, //顺时针
                itemStyle: {
                    normal: {
                        color:function(params) {
                            return colorList5_02[params.dataIndex]
                        }
                    }
                },
                label: {
                  normal: {
                    position: 'inner',
                    show : false
                  }
                },
                data:[
                    {value:98, name:'正常'},
                    {value:2, name:'异常'}
                ]
            },
            {
                name:'业务IPv6地址',
                type:'pie',
                radius: ['75%', '100%'],
                hoverAnimation  :false, //去除悬浮放大动画	  
                silent:true, //去除悬浮高亮
                clockwise :false, //顺时针
                itemStyle: {
                    normal: {
                        color:function(params) {
                            return colorList5_01[params.dataIndex]
                        }
                    }
                },
                label: {
                  normal: {
                    position: 'inner',
                    show : false
                  }
                },
                data:[
                    {value:98, name:'正常'},
                    {value:2, name:'异常'}
                ]
            }
        ]
    };

    return option5;
}

// 告警总数
export function option7Fn(){
    var colorList7 = ['#4493FC','#F2BD49','#FB8650'];
    
    let option7 = {
        series: [
            {
                name:'各类型电影总票房比较',
                type:'pie',
                radius: ['66%','100%'],
                avoidLabelOverlap: false,
                hoverAnimation  :false, //去除悬浮放大动画	  
                silent:true, //去除悬浮高亮
                clockwise :false, //顺时针
                itemStyle: {
                    normal: {
                        color:function(params) {
                            return colorList7[params.dataIndex]
                        }
                    }
                },
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:50, name:'信息类'},
                    {value:30, name:'警告类'},
                    {value:20, name:'严重类'}
                ]
            }
        ]
    };

    return option7;
}


// 告警状态
export function option8Fn(){
    var colorList8 = ['#4493FC','#F2BD49','#FB8650'];

    let option8 = {
        series: [
            {
                name:'各类型电影总票房比较',
                type:'pie',
                radius: ['66%','100%'],
                avoidLabelOverlap: false,
                hoverAnimation  :false, //去除悬浮放大动画	  
                silent:true, //去除悬浮高亮
                clockwise :false, //顺时针
                itemStyle: {
                    normal: {
                        color:function(params) {
                            return colorList8[params.dataIndex]
                        }
                    }
                },
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:50, name:'问题'},
                    {value:30, name:'已解决'}
                ]
            }
        ]
    };

    return option8;
}


// HTTTP、HTTPS占比
var colorList9 = ['#4493FC','#F3BD4A'];

export const option9 = {
    title: {
        text: '协议占比',
        textStyle: {
            color: '#515a6e',
            fontSize: 12
        },
        left: 'center'
    },
    series: [
        {
            name:'各类型电影总票房比较',
            type:'pie',
            radius: ['43.5%','65%'],
            avoidLabelOverlap: false,
            hoverAnimation  :false, //去除悬浮放大动画	  
            silent:true, //去除悬浮高亮
            clockwise :false, //顺时针
            itemStyle: {
                normal: {
                    color:function(params) {
                        return colorList9[params.dataIndex]
                    }
                }
            },
            label: {
                normal: {
                    show: true,
                    formatter: "{b}：{d}%",
                    textStyle: {
                        fontSize: 12,

                    },
                    position: 'outside'
                },
                emphasis: {
                    show: true
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data:[
                {value:2738861, name:'HTTP'},
                {value:520947, name:'HTTPS'}
            ]
        }
    ]
};

// 应用占比
var colorList10 = ['#7264FF','#EF4873'];

export const option10 = {
    series: [
        {
            name:'各类型电影总票房比较',
            type:'pie',
            radius: ['66%','100%'],
            avoidLabelOverlap: false,
            hoverAnimation  :false, //去除悬浮放大动画	  
            silent:true, //去除悬浮高亮
            clockwise :false, //顺时针
            itemStyle: {
                normal: {
                    color:function(params) {
                        return colorList10[params.dataIndex]
                    }
                }
            },
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:2738861, name:'HTTP'},
                {value:520947, name:'HTTPS'}
            ]
        }
    ]
};

// 统计分析
export function analysisFn(color = 1, data = []){
    let colors = [{
        itemColor: '#7264FF',
        areaColor: ['rgba(187, 180, 255, 1)', 'rgba(253, 253, 255, 0)']
    },{
        itemColor: '#3F90F9',
        areaColor: ['rgba(161, 198, 255, 1)', 'rgba(254, 249, 255, 0)']
    }]
    function pushData(){
        let data = nowMountTo(24);
        let newData = [];
        for(var i in data){
            if(i%2 == 0){
                newData.push(data[i]);
            }
        }
        return newData.reverse();
    }
    
    let option = {
        backgroundColor: 'white',
        tooltip: {
            trigger: 'axis',
            padding: [20],
            axisPointer: {
                lineStyle: {
                    color: '#B5D8FF'
                }
            },
            formatter: function(params){
                let name = params[0].name.replace('-','年');
                let marker = params[0].marker;
                let value = params[0].value;
                return marker+'&nbsp;&nbsp;'+name+'月'+'&nbsp;:&nbsp;'+`<span style="font-size: 20px">${value}</span>`;
            }
        },
        grid: {
            left: '4%',
            right: '4%',
            bottom: '8%',
            top: '4%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#323232'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel:{
                interval:0
            },
            data: pushData()
        }],
        yAxis: [{
            type: 'value',
            splitNumber: 3,
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    show: false,
                    color: '#ECF4FF'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    color: '#323232'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#ECF4FF'
                }
            }
        }],
        series: [{
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 1,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: colors[color].areaColor[0]
                    }, {
                        offset: 0.8,
                        color: colors[color].areaColor[1]
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: colors[color].itemColor,
                    borderColor: colors[color].itemColor
    
                }
            },
            data: data
        }]
    }

    return option;
}

// 系统监控
export function option11Fn(val = '最近24小时'){
    let interval = 3;

    function pushData(){
        if(val == '最近一月'){
            interval = 5;
            let data = nowDayTo(31);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近一周'){
            interval = 0;
            let data = nowDayTo(7);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近24小时'){
            interval = 3;
            let data = nowTimeTo(25);
            return data.reverse();
        }
    }

    let colorList = [''];

    let option2 = {
        legend: {
            itemGap: 20,
            data: ['设备1','设备2'],
            icon: 'circle',
            itemWidth: 7,
            itemHeight: 7,
            top: 0
        },
        grid: [{  
            left: '1.5%',  
            right: '3%',  
            bottom: '0',
            containLabel: true
       }],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#B5D8FF'
                }
            },
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: [5, 10],
            textStyle: {
                color: 'white',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        xAxis: [{
            type: 'category',
            data: pushData(),
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                },
                interval: interval
            }
        }],
        
        yAxis: [
        {
            type: 'value',
            name: '每台设备查询次数',
            nameTextStyle: {
                color: '#9AC3FF'
            },
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            },
            min: 0,
            max: 1000
        }
    ],
        series: [{
            name: '设备1',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: ['102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
            '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
            '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222'],    
            itemStyle: {
                normal: {
                    color: '#4795FF'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        },{
            name: '设备2',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: ['100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                   '100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                   '100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233'],
            itemStyle: {
                normal: {
                    color: '#F3BD4A'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        }]
    }

    return option2;
}



// 2019/5/20改版
// 访问量和流量统计
export function option92Fn(val = '最近24小时',type = '上行流量'){
    let interval = 3;
    let ud = 'upstream';
    if(type == '下行流量'){
        ud = 'down';
    }
    let seriesList = {
        upstream: {
            device1: {
                ipv4: ['102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
                '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
                '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222'],
                ipv6: ['102', '100', '80', '211', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222',
                '102', '100', '80', '211', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222',
                '102', '100', '80', '211', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222']
            },
            device2: {
                ipv4: ['100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                '100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                '100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233'],
                ipv6: ['150', '202', '205', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                '150', '202', '205', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                '150', '202', '205', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233']
            }
        },
        down: {
            device1: {
                ipv4: ['202', '105', '200', '311', '200', '200', '200', '150', '100', '100', '101', '122','92', '105', '100', '611', '200', '200', '200', '350', '300', '200', '201', '222',
                '202', '305', '400', '711', '300', '100', '100', '450', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
                '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222'],
                ipv6: ['202', '300', '90', '311', '300', '300', '300', '450', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222',
                '202', '400', '580', '211', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222',
                '102', '100', '80', '211', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222']
            },
            device2: {
                ipv4: ['100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                '100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                '100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233'],
                ipv6: ['150', '202', '205', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                '150', '202', '205', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                '150', '202', '205', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233']
            }
        }
    }

    function pushData(){
        if(val == '最近一月'){
            interval = 5;
            let data = nowDayTo(31);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近一周'){
            interval = 0;
            let data = nowDayTo(7);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近24小时'){
            interval = 3;
            let data = nowTimeTo(25);
            return data.reverse();
        }
    }


    let option2 = {
        legend: {
            itemGap: 20,
            data: ['设备1','设备2'],
            icon: 'circle',
            itemWidth: 7,
            itemHeight: 7,
            top: 0
        },
        title: [
            {
                text: 'IPv4',
                textStyle: {
                    color: '#515a6e',
                    fontSize: 12
                },
                left: '25%',
                top: '20'
            },
            {
                text: 'IPv6',
                textStyle: {
                    color: '#515a6e',
                    fontSize: 12
                },
                left: '75%',
                top: '20'
            }
        ],
        grid: [{  
            left: '1.5%',  
            right: '1%',  
            bottom: '0',
            containLabel: true  ,
            width: '45%'
       },{  
            left: '51.5%',  
            right: '1%',  
            bottom: '0',
            containLabel: true,
            width: '45%'
        }],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#B5D8FF'
                }
            },
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: [5, 10],
            textStyle: {
                color: 'white',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        xAxis: [{
            gridIndex: 0,
            type: 'category',
            data: pushData(),
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                },
                interval: interval
            }
        },{
            gridIndex: 1,
            type: 'category',
            data: pushData(),
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                },
                interval: interval
            }
        }],
        
        yAxis: [{
            gridIndex: 0,
            type: 'value',
            name: '流量(Mbps)',
            nameTextStyle: {
                color: '#9AC3FF'
            },
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            },
            min: 0,
            max: 1000
        },
        {
            gridIndex: 1,
            type: 'value',
            name: '流量(Mbps)',
            nameTextStyle: {
                color: '#9AC3FF'
            },
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            },
            min: 0,
            max: 1000
        }
        
    ],
        series: [{
            name: '设备1',
            type: 'line',
            smooth: true,
            xAxisIndex: 0,
            yAxisIndex: 0,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: seriesList[ud].device1.ipv4,    
            itemStyle: {
                normal: {
                    color: '#77ACF9'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            stack: '总量'
        },{
            name: '设备2',
            type: 'line',
            smooth: true,
            xAxisIndex: 0,
            yAxisIndex: 0,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: seriesList[ud].device2.ipv4,
            itemStyle: {
                normal: {
                    color: '#509AFE'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            stack: '总量'
        },{
            name: '设备1',
            type: 'line',
            smooth: true,
            xAxisIndex: 1,
            yAxisIndex: 1,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: seriesList[ud].device1.ipv6,    
            itemStyle: {
                normal: {
                    color: '#77ACF9'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            stack: '总量2'
        },{
            name: '设备2',
            type: 'line',
            smooth: true,
            xAxisIndex: 1,
            yAxisIndex: 1,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: seriesList[ud].device2.ipv6,
            itemStyle: {
                normal: {
                    color: '#509AFE'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            stack: '总量2'
        }]
    }

    return option2;
}

export function option93Fn(val = '最近24小时',type = '上行流量'){
    let interval = 3;
    let ud = 'upstream';
    if(type == '下行流量'){
        ud = 'down';
    }
    let seriesList = {
        upstream: {
            device1: {
                ipv4: ['102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
                '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
                '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222'],
                ipv6: ['102', '100', '80', '211', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222',
                '102', '100', '80', '211', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222',
                '102', '100', '80', '211', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222']
            }
        },
        down: {
            device1: {
                ipv4: ['202', '105', '200', '311', '200', '200', '200', '150', '100', '100', '101', '122','92', '105', '100', '611', '200', '200', '200', '350', '300', '200', '201', '222',
                '202', '305', '400', '711', '300', '100', '100', '450', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
                '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222'],
                ipv6: ['202', '300', '90', '311', '300', '300', '300', '450', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222',
                '202', '400', '580', '211', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222',
                '102', '100', '80', '211', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '211', '200', '200', '200', '250', '100', '200', '201', '222']
            }
        }
    }

    function pushData(){
        if(val == '最近一月'){
            interval = 5;
            let data = nowDayTo(31);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近一周'){
            interval = 0;
            let data = nowDayTo(7);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近24小时'){
            interval = 3;
            let data = nowTimeTo(25);
            return data.reverse();
        }
    }


    let option2 = {
        // legend: {
        //     itemGap: 20,
        //     data: ['设备'],
        //     icon: 'circle',
        //     itemWidth: 7,
        //     itemHeight: 7,
        //     top: 0
        // },
        title: [
            {
                text: 'IPv4',
                textStyle: {
                    color: '#515a6e',
                    fontSize: 12
                },
                left: '25%',
                top: '20'
            },
            {
                text: 'IPv6',
                textStyle: {
                    color: '#515a6e',
                    fontSize: 12
                },
                left: '75%',
                top: '20'
            }
        ],
        grid: [{  
            left: '1.5%',  
            right: '1%',  
            bottom: '0',
            containLabel: true  ,
            width: '45%'
       },{  
            left: '51.5%',  
            right: '1%',  
            bottom: '0',
            containLabel: true,
            width: '45%'
        }],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#B5D8FF'
                }
            },
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: [5, 10],
            textStyle: {
                color: 'white',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        xAxis: [{
            gridIndex: 0,
            type: 'category',
            data: pushData(),
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                },
                interval: interval
            }
        },{
            gridIndex: 1,
            type: 'category',
            data: pushData(),
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                },
                interval: interval
            }
        }],
        
        yAxis: [{
            gridIndex: 0,
            type: 'value',
            name: '流量(Mbps)',
            nameTextStyle: {
                color: '#9AC3FF'
            },
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            },
            min: 0,
            max: 1000
        },
        {
            gridIndex: 1,
            type: 'value',
            name: '流量(Mbps)',
            nameTextStyle: {
                color: '#9AC3FF'
            },
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            },
            min: 0,
            max: 1000
        }
        
    ],
        series: [{
            name: '设备',
            type: 'line',
            smooth: true,
            xAxisIndex: 0,
            yAxisIndex: 0,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: seriesList[ud].device1.ipv4,    
            itemStyle: {
                normal: {
                    color: '#77ACF9'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            stack: '总量'
        },{
            name: '设备',
            type: 'line',
            smooth: true,
            xAxisIndex: 1,
            yAxisIndex: 1,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: seriesList[ud].device1.ipv6,    
            itemStyle: {
                normal: {
                    color: '#77ACF9'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            stack: '总量2'
        }]
    }

    return option2;
}

// 顶部流量图
export function optionLLFn(val = '最近24小时',backFn){
    let interval = 3;

    function pushData(){
        if(val == '最近一月'){
            interval = 5;
            let data = nowDayTo(31);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近一周'){
            interval = 0;
            let data = nowDayTo(7);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近24小时'){
            interval = 3;
            let data = nowTimeTo(25);
            return data.reverse();
        }
    }


    let option2 = {
        show: true,
        toolbox: {
            showTitle: false,
            right: '5%',
            feature: {
                myTool1: {  
                    show: true,
                    // title: '放大',  
                    icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACEElEQVRYR93Vu2sUURTA4d/ZmJWIYDoLIY02llaLi2y2MLNJoYiC2lhYpNjHHxFrCwvdhYCFTRrRiIRAZjArWtnZRCEgMQoR4qP2wcweGWTCZHZ3ZueVgNPec+79zrnMucIhf3LI57MHqHV0SeFUHJDAXbMhq3FygrF+wAfgdMzN5s2GPIyZsy98KEBhA/gRtnneHdi0x5len5fdNBVG5fZ1QOGVwHmgqLDljFPOE9EPUO4IvEF47iFsodKty05UNUnWBwKspizU2jrrQ3y2hXIeiKEAt5o+RI9KtyWfklQ6LCcUMACx40BlvSFbWSEiAR5CYUWEI6rsOkI5K8RIABcx09HLojz1EAVheq0hm2k7MTIgiAC+06NqtuRdGkQswIBOfLS+cYYF6SVF7AGMB1oqjDEBbK/VZTtsQ/c6CvBIYcb6ylvjJFWrLt0kiMTPcfWeTjLJr+JPloFZlFtWU5bCEEZbbwBnRXlvtuSxG5sY4CZfWtRjf2xMhAsKGoUwOvpM4ArKstmUa6kBHuK3TVeEUhQiF4CLqLb1eBFe+BDXraY8CV5HboAgAnBUuRlE5AoYBZE7IApxIAAPcVR4DZzzX8eBAVzExUU9Mebw0kP04KrA7cx/w7DB40eoYiN8EZjKdA5Ejd9AJ/6FZzmIam29j9CKguxb/68ARkfnUEpxOpDZYxTn0GGxqV7DLAB/AR8lUDC5VuPDAAAAAElFTkSuQmCC',  
                    onclick: function (){  
                        backFn()
                    }  
                }
            }
        },
        legend: {
            itemGap: 20,
            data: ['应用层转换','网络层转换'],
            icon: 'circle',
            itemWidth: 7,
            itemHeight: 7,
            top: 0
        },
        grid: [{  
            left: '1.5%',  
            right: '6%',  
            bottom: '0',
            containLabel: true
       }],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#B5D8FF'
                }
            },
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: [5, 10],
            textStyle: {
                color: 'white',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        xAxis: [{
            type: 'category',
            data: pushData(),
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                },
                interval: interval
            }
        }],
        yAxis: [
        {
            type: 'value',
            name: '并发量',
            nameTextStyle: {
                color: '#9AC3FF'
            },
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            },
            min: 0,
            max: 1000
        }
    ],
        series: [{
            name: '应用层转换',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: ['102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
            '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
            '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222'],    
            itemStyle: {
                normal: {
                    color: '#4795FF'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        },{
            name: '网络层转换',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: ['100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                   '100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                   '100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233'],
            itemStyle: {
                normal: {
                    color: '#F3BD4A'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        }]
    }

    return option2;
}

export function optionLLFn3(val = '最近24小时'){
    let interval = 3;

    function pushData(){
        if(val == '最近一月'){
            interval = 5;
            let data = nowDayTo(31);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近一周'){
            interval = 0;
            let data = nowDayTo(7);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近24小时'){
            interval = 3;
            let data = nowTimeTo(25);
            return data.reverse();
        }
    }


    let option2 = {
        show: true,
        legend: {
            itemGap: 20,
            data: ['应用层转换','网络层转换'],
            icon: 'circle',
            itemWidth: 7,
            itemHeight: 7,
            top: 0
        },
        grid: [{  
            left: '1.5%',  
            right: '6%',  
            bottom: '0',
            containLabel: true
       }],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#B5D8FF'
                }
            },
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: [5, 10],
            textStyle: {
                color: 'white',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        xAxis: [{
            type: 'category',
            data: pushData(),
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                },
                interval: interval
            }
        }],
        yAxis: [
        {
            type: 'value',
            name: '并发量',
            nameTextStyle: {
                color: '#9AC3FF'
            },
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            },
            min: 0,
            max: 1000
        }
    ],
        series: [{
            name: '应用层转换',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: ['102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
            '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
            '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222'],    
            itemStyle: {
                normal: {
                    color: '#4795FF'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        },{
            name: '网络层转换',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: ['100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                   '100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233',
                   '100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233','100', '192', '105', '111', '100', '280', '100', '250', '200', '100', '205', '233'],
            itemStyle: {
                normal: {
                    color: '#F3BD4A'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        }]
    }

    return option2;
}

export function optionLLFn2(val = '最近24小时'){
    let interval = 3;

    function pushData(){
        if(val == '最近一月'){
            interval = 5;
            let data = nowDayTo(31);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近一周'){
            interval = 0;
            let data = nowDayTo(7);
            let newData = [];
            for(var i in data){
                newData.push(data[i]);
            }
            return newData.reverse();
        }else if(val == '最近24小时'){
            interval = 3;
            let data = nowTimeTo(25);
            return data.reverse();
        }
    }


    let option2 = {
        grid: [{  
            left: '1.5%',  
            right: '6%',  
            bottom: '0',
            top: '3%',
            containLabel: true
       }],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#B5D8FF'
                }
            },
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: [5, 10],
            textStyle: {
                color: 'white',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        xAxis: [{
            type: 'category',
            data: pushData(),
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                },
                interval: interval
            }
        }],
        
        yAxis: [
        {
            type: 'value',
            name: '并发量',
            nameTextStyle: {
                color: '#9AC3FF'
            },
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#D9EAFE'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12,
                    color: '#222'
                }
            },
            min: 0,
            max: 1000
        }
    ],
        series: [{
            name: '并发量',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 2,
            data: ['102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
            '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222',
            '102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222','102', '205', '300', '611', '200', '200', '200', '350', '300', '200', '201', '222'],    
            itemStyle: {
                normal: {
                    color: '#4795FF'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        }]
    }

    return option2;
}

export const option100 = {
    legend: {
        itemGap: 20,
        data: ['上行流量','下行流量'],
        icon: 'circle',
        itemWidth: 7,
        itemHeight: 7,
        top: 28
    },
    title: {
        text: '流量TOP10',
        textStyle: {
            color: '#515a6e',
            fontSize: 12
        },
        left: 'center'
    },
    grid: {
        left: '3%',
        right: '-15%',
        bottom: '10%',
        containLabel: true
    },
    tooltip: {
        show:"true",
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis:  {
        name: 'Mbps',
        nameTextStyle: {
            color: '#9AC3FF'
        },
        type: 'value',
        axisTick : {show: false},
        axisLine: {
            show: true,
            lineStyle:{
                color:'#D9EAFE',
            }
        },
        splitLine: {
            show: true,
            interval: 'auto',
            lineStyle: {
                color: ['#D4DFF5']
            }
        },
        axisLabel: {
            margin: 10,
            textStyle: {
                fontSize: 12,
                color: '#222'
            },
            interval: 'auto'
        }
        ,
        splitNumber: 3
    },
    yAxis: [
            {
                type: 'category',
                axisTick : {show: false},
                axisLine: {
                    show: true,
                    lineStyle:{
                        color:'#D9EAFE',
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 12,
                        color: '#222'
                    },
                    interval: 'auto'
                },
                data: ['www.51job.com','www.baidu.com','240::1818','202.96.134.133','test.6aas.com','www.6aas.com','ftp.reyzar.com','mail.reyzar.com','oa.reyzar.com','www.reyzar.com']
            },
            {
                type: 'category',
                axisLine: {show:false},
                axisTick: {show:false},
                axisLabel: {show:false},
                splitArea: {show:false},
                splitLine: {show:false},
                data: ['www.51job.com','www.baidu.com','240::1818','202.96.134.133','test.6aas.com','www.6aas.com','ftp.reyzar.com','mail.reyzar.com','oa.reyzar.com','www.reyzar.com']
            },
            
    ],
    series: [
        {
            name: '上行流量',
            type: 'bar',
            yAxisIndex:1,
            itemStyle:{
                normal: {
                    show: true,
                    color: '#F3BD4A',
                    borderWidth:0,
                    borderColor:'#333',
                }
            },
            stack:'product',
            barGap:'0%',
            barCategoryGap:'35%',
            data: [44, 55, 66, 77, 88, 99, 100, 137, 188, 199]
        },
        {
            name: '下行流量',
            type: 'bar',
            itemStyle:{
                normal: {
                    show: true,
                    color: '#4493FC',
                    borderWidth:0,
                    borderColor:'#333',
                }
            },
            stack:'product',
            barGap:'0%',
            barCategoryGap:'35%',
            data: [90, 100, 200, 300, 400, 500, 600, 700, 800, 900]
        }
    ]
};

export const option101 = {
    legend: {
        itemGap: 20,
        data: ['访问量'],
        icon: 'circle',
        itemWidth: 7,
        itemHeight: 7,
        top: 28
    },
    title: {
        text: '访问量TOP10',
        textStyle: {
            color: '#515a6e',
            fontSize: 12
        },
        left: 'center'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
    },
    tooltip: {
        show:"true",
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis:  {
        type: 'value',
        axisTick : {show: false},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#D9EAFE'
            }
        },
        splitLine: {
            show: true,
            interval: 'auto',
            lineStyle: {
                color: ['#D4DFF5']
            }
        },
        axisLabel: {
            margin: 10,
            textStyle: {
                fontSize: 12,
                color: '#222'
            },
            interval: 'auto'
        }
    },
    yAxis: [
            {
                type: 'category',
                axisTick : {show: false},
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#D9EAFE'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 12,
                        color: '#222'
                    },
                    interval: 'auto'
                },
                data: ['www.51job.com','www.baidu.com','240::1818','202.96.134.133','test.6aas.com','www.6aas.com','ftp.reyzar.com','mail.reyzar.com','oa.reyzar.com','www.reyzar.com']
            }  
    ],
    series: [
        {
            name: '访问量',
            type: 'bar',
            itemStyle:{
                normal: {
                    show: true,
                    color: '#4493FC',
                    borderWidth:0,
                    borderColor:'#333',
                }
            },
            barGap:'0%',
            barCategoryGap:'35%',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        }
    ]
};
