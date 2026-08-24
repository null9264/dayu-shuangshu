// assets/charts.js — ECharts 图表初始化
(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();   // #8b1a1a 朱砂
  var accent2 = style.getPropertyValue('--accent2').trim(); // #1f3a4d 黛青
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var accent3 = style.getPropertyValue('--accent3').trim(); // #b8860b 赭金

  // 调色板
  var palette = {
    warm: accent,      // 朱砂 — 温暖、热烈
    cool: accent2,     // 黛青 — 清冷、疏离
    gold: accent3,     // 赭金 — 圆满、念旧
    gray: muted,       // 灰褐 — 沉默、压抑
    ice: '#7a8a99',    // 冷白
    amber: '#c97f3a',
    rose: '#a85a6a'
  };

  // =====================================================
  // Chart 1: 七结局色调分布（玫瑰图 / 南丁格尔图）
  // =====================================================
  var chart1 = echarts.init(document.getElementById('chart-ending-tone'), null, { renderer: 'svg' });

  var endingData = [
    { name: '正典·各归其位',  value: 22, itemStyle: { color: palette.warm  }, desc: '温暖·欣慰' },
    { name: '铁链回想',        value: 18, itemStyle: { color: palette.gray  }, desc: '凄凉·悲悯' },
    { name: '末路',            value: 12, itemStyle: { color: '#3a3a3a'      }, desc: '冰冷·孤绝' },
    { name: '冷眼观棋',        value: 16, itemStyle: { color: palette.ice   }, desc: '清冷·疏离' },
    { name: '北疆糖葫芦',      value: 14, itemStyle: { color: palette.gold  }, desc: '纯真·圆满' },
    { name: '国师未醒',        value: 10, itemStyle: { color: palette.rose  }, desc: '灰暗·遗憾' },
    { name: '庵院灯火',        value: 8,  itemStyle: { color: palette.amber }, desc: '温柔·延续' }
  ];

  chart1.setOption({
    animation: false,
    tooltip: {
      trigger: 'item',
      appendToBody: true,
      backgroundColor: '#faf6ec',
      borderColor: rule,
      textStyle: { color: ink, fontFamily: 'inherit' },
      formatter: function (p) {
        return '<strong style="color:' + accent + '">' + p.name + '</strong><br/>' +
               '色调：' + p.data.desc + '<br/>' +
               '权重：' + p.value + '%';
      }
    },
    legend: {
      bottom: 0,
      textStyle: { color: muted, fontSize: 11 },
      itemWidth: 10, itemHeight: 10
    },
    series: [{
      type: 'pie',
      radius: ['28%', '70%'],
      center: ['50%', '45%'],
      roseType: 'area',
      itemStyle: { borderColor: '#faf6ec', borderWidth: 2 },
      label: {
        color: ink,
        fontSize: 11,
        formatter: '{b}\n{d}%'
      },
      labelLine: { lineStyle: { color: rule }, length: 8, length2: 8 },
      data: endingData
    }]
  });
  window.addEventListener('resize', function () { chart1.resize(); });

  // =====================================================
  // Chart 2: 玩家一周目典型流程 — 信任度/知情度曲线
  // =====================================================
  var chart2 = echarts.init(document.getElementById('chart-progress'), null, { renderer: 'svg' });

  var chapters = ['卷一·序', '卷一·A', '卷一·B', '卷二·A', '卷二·B', '卷二·C', '卷三·A', '卷三·B', '卷三·C', '卷四·A', '卷四·B', '卷五·A', '卷五·B', '卷五·终'];

  // 11 位 NPC 的信任度数据（取典型玩家路线）
  var trustSeries = [
    {
      name: '孙佳琪', smooth: true,
      data: [25, 35, 45, 50, 55, 60, 65, 70, 75, 78, 80, 82, 85, 88],
      itemStyle: { color: palette.warm },
      lineStyle: { width: 2 }
    },
    {
      name: '杨鑫', smooth: true,
      data: [0, 0, 15, 25, 30, 38, 42, 48, 55, 60, 65, 72, 80, 85],
      itemStyle: { color: palette.cool },
      lineStyle: { width: 2 }
    },
    {
      name: '张文静', smooth: true,
      data: [0, 10, 12, 28, 40, 52, 58, 60, 62, 65, 68, 70, 72, 75],
      itemStyle: { color: palette.gold },
      lineStyle: { width: 2 }
    },
    {
      name: '潘婷', smooth: true,
      data: [0, 0, 0, 0, 8, 12, 18, 22, 25, 30, 45, 55, 60, 68],
      itemStyle: { color: palette.rose },
      lineStyle: { width: 2 }
    },
    {
      name: '袁魁', smooth: true,
      data: [10, 18, 25, 35, 42, 50, 55, 60, 65, 70, 72, 75, 78, 80],
      itemStyle: { color: '#5a7a8a' },
      lineStyle: { width: 2 }
    }
  ];

  var knowledgeSeries = {
    name: '玩家知情度',
    smooth: true,
    yAxisIndex: 1,
    data: [5, 12, 20, 32, 40, 48, 55, 65, 72, 78, 85, 90, 95, 100],
    itemStyle: { color: accent },
    lineStyle: { width: 3, type: 'dashed' },
    symbol: 'circle', symbolSize: 8
  };

  chart2.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      backgroundColor: '#faf6ec',
      borderColor: rule,
      textStyle: { color: ink, fontFamily: 'inherit' }
    },
    legend: {
      top: 0,
      textStyle: { color: muted, fontSize: 11 },
      itemWidth: 14, itemHeight: 8
    },
    grid: { top: 50, left: 50, right: 50, bottom: 40 },
    xAxis: {
      type: 'category',
      data: chapters,
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 10, rotate: 30 }
    },
    yAxis: [
      {
        type: 'value', name: '信任度', min: 0, max: 100,
        nameTextStyle: { color: muted, fontSize: 11 },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.4 } },
        axisLabel: { color: muted, fontSize: 10 }
      },
      {
        type: 'value', name: '知情度', min: 0, max: 100,
        nameTextStyle: { color: accent, fontSize: 11 },
        axisLine: { lineStyle: { color: accent } },
        splitLine: { show: false },
        axisLabel: { color: accent, fontSize: 10 }
      }
    ],
    series: trustSeries.concat([knowledgeSeries])
  });
  window.addEventListener('resize', function () { chart2.resize(); });
})();
