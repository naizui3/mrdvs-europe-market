/*
 * Shared presentation layer for the country detail pages.
 * Country relationship data continues to come from each page's imported
 * workbook. The market benchmark below is deliberately separate: it uses
 * only public, traceable macro and robotics sources, so a channel-count is
 * never presented as a market-size or automation indicator.
 */
(() => {
  'use strict';

  if (document.documentElement.dataset.germanyStyleUnifier === '1') return;
  document.documentElement.dataset.germanyStyleUnifier = '1';

  const css = `
    #market, #records, #company-relations { scroll-margin-top: 76px !important; }
    main::after { content: ''; display: block; height: calc(100vh - 76px); }
    .table-box { cursor: grab; }
    .table-box.is-dragging { cursor: grabbing; user-select: none; }
    .relation-matrix, .channel-kp-map, .channel-kp-map, .relation-evidence { display: none !important; }
    #brandDirectory, #directory, #spainBrandDirectory, #compDirectory {
      display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 7px; margin-top: 12px;
    }
    #brandDirectory > button, #directory > button, #spainBrandDirectory > button, #compDirectory > button {
      min-height: 60px; border: 1px solid #dce5f0; border-radius: 6px; background: #fff;
      padding: 7px 8px; text-align: left; cursor: pointer; color: #344e6d;
      font: 700 12px/1.35 Inter, "Microsoft YaHei", Arial, sans-serif; overflow: hidden;
    }
    #brandDirectory > button:hover, #directory > button:hover, #spainBrandDirectory > button:hover,
    #compDirectory > button:hover, #brandDirectory > button.active, #directory > button.active,
    #spainBrandDirectory > button.active, #compDirectory > button.active {
      border-color: #1769c2; background: #edf5ff; color: #13579c;
    }
    #brandDirectory > button > .sub, #directory > button > .sub, #spainBrandDirectory > button > .sub,
    #compDirectory > button > .sub {
      display: block; min-height: 30px; margin-top: 3px; color: #61728a; font-size: 11px;
      font-weight: 500; line-height: 1.35; white-space: normal;
    }
    @media (max-width: 1050px) {
      #brandDirectory, #directory, #spainBrandDirectory, #compDirectory { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    @media (max-width: 620px) {
      #brandDirectory, #directory, #spainBrandDirectory, #compDirectory { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    .channel-node small b, .channel-node .node-scope b, .channel-node .channel-summary b {
      font-weight: inherit !important;
    }
    .germany-filter-summary {
      display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
    }
    .germany-filter-summary .summary-metric {
      display: inline-flex; align-items: baseline; gap: 4px; padding: 5px 9px;
      border: 1px solid #d8e2ef; border-radius: 999px; background: #f7faff;
      color: #36516f; font-size: 12px; line-height: 1.2;
    }
    .germany-filter-summary .summary-metric b { color: #113b67; font-size: 15px; }
    .germany-dashboard-kpis {
      display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 11px; padding: 17px 0;
    }
    .germany-dashboard-kpis .kpi {
      display: block; min-height: 102px; background: #fff; border: 1px solid #dce5f0; border-radius: 7px;
      padding: 13px 14px;
    }
    .germany-dashboard-kpis .kpi b { display: block; color: #071d38; font-size: 23px; line-height: 1.2; }
    .germany-dashboard-kpis .kpi span { display: block; margin-top: 6px; color: #52627a; font-size: 12px; }
    .germany-channel-category { padding-top: 20px; }
    .germany-channel-category .metrics { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    #market > .metrics { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
    #market > .metrics .metric small a { font-weight: 700; }
    #market > .metrics .metric small { overflow-wrap: anywhere; }
    @media (max-width: 1050px) {
      .germany-dashboard-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .germany-channel-category .metrics { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      #market > .metrics { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
    }
    @media (max-width: 620px) {
      .germany-dashboard-kpis, .germany-channel-category .metrics, #market > .metrics { grid-template-columns: 1fr !important; }
    }

    /* Czech page used a separate rounded-card template. Keep its data model,
       but bring the typography, spacing and card geometry into the same visual
       system as the Germany reference page. */
    html.czech-germany-visual body {
      background: #f5f8fc; color: #17233a;
      font: 14px/1.55 Inter, "Microsoft YaHei", Arial, sans-serif;
    }
    html.czech-germany-visual .top {
      background: #071d38; z-index: 10; box-shadow: 0 2px 12px #07172d44;
    }
    html.czech-germany-visual .top-inner,
    html.czech-germany-visual .wrap {
      width: min(1480px, calc(100% - 44px)); max-width: none; margin: auto;
    }
    html.czech-germany-visual .top-inner { height: 68px; padding: 0; gap: 22px; }
    html.czech-germany-visual .brand { font-size: 17px; font-weight: 800; letter-spacing: normal; }
    html.czech-germany-visual .brand small { color: #9eddf3; font-size: 10px; font-weight: 600; letter-spacing: .7px; }
    html.czech-germany-visual .top nav { margin-left: auto; gap: 18px; }
    html.czech-germany-visual a { color: #1769c2; text-decoration: none; }
    html.czech-germany-visual a:hover { text-decoration: underline; }
    html.czech-germany-visual .top a { color: #dceeff; }
    html.czech-germany-visual .top a { padding: 0; border-radius: 0; font-size: 13px; font-weight: 650; }
    html.czech-germany-visual .top a:hover { background: transparent; text-decoration: underline; }
    html.czech-germany-visual .wrap { padding: 0 0 38px; }
    html.czech-germany-visual .breadcrumb { padding: 16px 0 0; margin: 0; color: #64748b; font-size: 12px; }
    html.czech-germany-visual .hero {
      padding: 24px 0 18px; background: transparent; border: 0; border-bottom: 1px solid #dce5f0;
      border-radius: 0; box-shadow: none;
    }
    html.czech-germany-visual .eyebrow { color: #1769c2; font-size: 12px; font-weight: 800; letter-spacing: 1px; }
    html.czech-germany-visual .hero h1 { margin: 6px 0 8px; font-size: 30px; line-height: 1.25; color: #17233a; }
    html.czech-germany-visual .hero p { max-width: 980px; color: #52627a; }
    html.czech-germany-visual .kpis { grid-template-columns: repeat(4, 1fr); gap: 11px; margin: 0; padding: 17px 0; }
    html.czech-germany-visual .kpi {
      min-height: 0; padding: 13px 14px; border: 1px solid #dce5f0; border-radius: 7px; background: #fff;
    }
    html.czech-germany-visual .kpi b { font-size: 23px; color: #071d38; }
    html.czech-germany-visual .kpi span { font-size: 12px; color: #64748b; }
    html.czech-germany-visual .section {
      margin: 0; padding: 20px 0; background: transparent; border: 0; border-radius: 0; box-shadow: none;
    }
    html.czech-germany-visual .section-head { gap: 16px; margin-bottom: 11px; }
    html.czech-germany-visual .section h2 { margin: 0; font-size: 20px; color: #17233a; }
    html.czech-germany-visual .section-head p { margin: 2px 0 0; font-size: 13px; color: #64748b; }
    html.czech-germany-visual #market > .metrics { gap: 10px; }
    html.czech-germany-visual .metric {
      padding: 11px 12px; border: 1px solid #dce5f0; border-top: 3px solid #1769c2;
      border-radius: 0; background: #fff;
    }
    html.czech-germany-visual .metric b { font-size: 20px; color: #143f70; }
    html.czech-germany-visual .metric span { margin-top: 2px; font-size: 12px; font-weight: 750; color: #334f70; }
    html.czech-germany-visual .metric small { margin-top: 2px; font-size: 11px; color: #64748b; }
    html.czech-germany-visual .filters {
      grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 10px; margin: 0; padding: 13px;
      border: 1px solid #dce5f0; border-radius: 7px; background: #fff;
    }
    html.czech-germany-visual .field label { margin-bottom: 4px; font-size: 12px; font-weight: 700; color: #51647d; }
    html.czech-germany-visual .field select,
    html.czech-germany-visual .field input { height: auto; min-height: 35px; padding: 7px 8px; border: 1px solid #b9c9de; border-radius: 5px; font: inherit; }
    html.czech-germany-visual .reset {
      height: 35px; padding: 0 12px; border: 1px solid #b9c9de; border-radius: 5px;
      background: #fff; color: #385a80; font: 700 12px Inter, "Microsoft YaHei", Arial, sans-serif;
    }
    html.czech-germany-visual .directory { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 7px; margin: 12px 0 0; }
    html.czech-germany-visual .jump {
      min-height: 60px; padding: 7px 8px; border: 1px solid #dce5f0; border-radius: 6px; background: #fff;
      color: #344e6d; font: 700 12px/1.35 Inter, "Microsoft YaHei", Arial, sans-serif; text-align: left;
    }
    html.czech-germany-visual .jump:hover,
    html.czech-germany-visual .jump.active { border-color: #1769c2; box-shadow: none; background: #edf5ff; color: #13579c; }
    html.czech-germany-visual .summary { margin: 11px 0; font-size: 12px; color: #64748b; }
    html.czech-germany-visual .status-note {
      margin: 10px 0; padding: 9px 11px; border: 0; border-left: 3px solid #d99000; border-radius: 0;
      background: #fff8e8; color: #765315; font-size: 12px;
    }
    html.czech-germany-visual .table-box { border: 1px solid #dce5f0; border-radius: 7px; background: #fff; }
    html.czech-germany-visual .data { min-width: 1740px; }
    html.czech-germany-visual .data th { padding: 10px 11px; background: #eaf1f9; color: #385570; font-size: 12px; font-weight: 800; }
    html.czech-germany-visual .data td { padding: 11px; border-top: 1px solid #dce5f0; font-size: 12px; }
    html.czech-germany-visual .sub { font-size: 11px; color: #61728a; }
    html.czech-germany-visual .overview-products span { font-size: 11px; }
    html.czech-germany-visual .sources {
      margin-top: 0; padding: 15px 16px; border: 1px solid #dce5f0; border-left: 1px solid #dce5f0;
      border-radius: 7px; background: #fff; color: #52627a; font-size: 12px;
    }
    html.czech-germany-visual .footer { padding: 26px 0 38px; }
    @media (max-width: 1100px) {
      html.czech-germany-visual .kpis { grid-template-columns: repeat(2, 1fr); }
      html.czech-germany-visual .directory { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      html.czech-germany-visual .filters { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 620px) {
      html.czech-germany-visual .top-inner,
      html.czech-germany-visual .wrap { width: min(100% - 26px, 1480px); }
      html.czech-germany-visual .top-inner { height: 58px; }
      html.czech-germany-visual .hero h1 { font-size: 25px; }
      html.czech-germany-visual .kpis,
      html.czech-germany-visual .filters,
      html.czech-germany-visual #market > .metrics { grid-template-columns: 1fr !important; }
      html.czech-germany-visual .directory { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
  `;
  document.head.insertAdjacentHTML('beforeend', `<style id="germany-style-unifier-css">${css}</style>`);

  const text = node => (node?.textContent || '').replace(/\s+/g, ' ').trim();
  const unique = values => [...new Set(values.filter(Boolean))];
  const isEmptyRow = row => row.querySelector('td[colspan]') || !row.querySelector('td');
  const findFirst = selectors => selectors.map(selector => document.querySelector(selector)).find(Boolean);
  const findAll = selectors => selectors.flatMap(selector => [...document.querySelectorAll(selector)]);
  const recordBody = () => findFirst(['#relationshipRows', '#competitorRows', '#compRows', '#spainRelationshipRows']);
  const summaryHost = () => findFirst(['#summary', '#compSummary', '#spainSummary']);
  const relationSection = () => document.querySelector('#company-relations');
  const relationDetails = () => findAll(['#relationDetail', '#spainRelationDetail']);
  const brandFilter = () => document.querySelector('#brandFilter, #spainBrandFilter, #compBrand');

  const targetCountryBySlug = {
    germany: '德国', austria: '奥地利', belgium: '比利时', czech: '捷克', denmark: '丹麦', france: '法国',
    ireland: '爱尔兰', italy: '意大利', netherlands: '荷兰', norway: '挪威', poland: '波兰',
    romania: '罗马尼亚', spain: '西班牙', sweden: '瑞典', switzerland: '瑞士', uk: '英国'
  };
  const eurostatBase = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/';
  const ifrDensity2022 = 'https://ifr.org/downloads/press2018/graph_-_Robot_Density_2022_by_country.png';
  const ifrDensity2023 = 'https://ifr.org/ifr-press-releases/news/global-robot-density-in-factories-doubled-in-seven-years';
  const ifrFinal2024 = 'https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years';
  const onsGdp2025 = 'https://www.ons.gov.uk/economy/grossdomesticproductgdp/timeseries/ybha/pn2';

  const eurostatUrl = (dataset, geo, measure) => {
    const fields = dataset === 'nama_10_gdp'
      ? 'freq=A&unit=CP_MEUR&na_item=B1GQ'
      : 'freq=A&unit=CP_MEUR&nace_r2=C&na_item=B1G';
    return `${eurostatBase}${dataset}?${fields}&geo=${geo}&time=2025`;
  };
  const eurostatGdp = geo => eurostatUrl('nama_10_gdp', geo);
  const eurostatManufacturing = geo => eurostatUrl('nama_10_a10', geo);
  const noPublicComparable = (label, note) => ({
    value: '暂无可比公开数据', label,
    note: note || 'IFR 的公开新闻与图表未披露该国可核验总量；完整国别明细需以 World Robotics 授权数据或国家协会原始统计复核。',
    sourceUrl: ifrFinal2024, sourceLabel: 'IFR World Robotics'
  });
  const eurostatMetric = (value, label, geo, dataset, note) => ({
    value, label, note,
    sourceUrl: dataset === 'gdp' ? eurostatGdp(geo) : eurostatManufacturing(geo),
    sourceLabel: 'Eurostat API'
  });
  const ecosystemMetric = (note, sourceUrl, sourceLabel) => ({
    value: sourceUrl ? '行业网络已核验' : '暂无可比统一数值',
    label: '机器视觉生态 / 竞争密度',
    note: note || '各国行业协会的会员定义、覆盖范围与统计年份不同；不将德国 VDMA 会员数或企业全球营收外推为本国市场规模。',
    sourceUrl, sourceLabel
  });
  const installationMetric = (value, note, sourceUrl = ifrFinal2024, sourceLabel = 'IFR World Robotics') => ({
    value, label: '工业机器人新增安装', note, sourceUrl, sourceLabel
  });
  const densityMetric = (value, note, sourceUrl = ifrDensity2022, sourceLabel = 'IFR 密度图') => ({
    value, label: '工业机器人密度', note, sourceUrl, sourceLabel
  });

  /*
   * Fixed, five-card market benchmark. Monetary values are current-price
   * national-account values, not market sales. IFR year labels remain in the
   * note because public IFR releases do not publish every country every year.
   */
  const marketBenchmarkByCountry = {
    austria: {
      gdp: eurostatMetric('€514.3B', '2025 名义 GDP', 'AT', 'gdp', '当前价格；2025 初步值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: densityMetric('219', '2022：每万名制造业员工的工业机器人数量'),
      manufacturing: eurostatMetric('€78.5B', '制造业增加值', 'AT', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric('A3PS / 奥地利自动化产业网络已核验；不以其会员数与 VDMA 直接比较。', 'https://www.automatisierung.at/', '行业网络')
    },
    belgium: {
      gdp: eurostatMetric('€642.0B', '2025 名义 GDP', 'BE', 'gdp', '当前价格；2025 初步值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: densityMetric('216', '2022：每万名制造业员工的工业机器人数量'),
      manufacturing: eurostatMetric('€71.7B', '制造业增加值', 'BE', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric()
    },
    czech: {
      gdp: eurostatMetric('€347.3B', '2025 名义 GDP', 'CZ', 'gdp', '当前价格；2025 已发布值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: densityMetric('198', '2022：每万名制造业员工的工业机器人数量'),
      manufacturing: eurostatMetric('€66.0B', '制造业增加值', 'CZ', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric()
    },
    denmark: {
      gdp: eurostatMetric('€417.8B', '2025 名义 GDP', 'DK', 'gdp', '当前价格；2025 已发布值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: densityMetric('274', '2022：每万名制造业员工的工业机器人数量'),
      manufacturing: eurostatMetric('€75.0B', '制造业增加值', 'DK', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric('Odense Robotics 作为丹麦机器人与自动化产业集群入口已核验；不把集群成员数视作机器视觉市场规模。', 'https://www.odenserobotics.dk/', '产业集群')
    },
    germany: {
      gdp: eurostatMetric('€4.470T', '2025 名义 GDP', 'DE', 'gdp', '当前价格；2025 初步值'),
      installations: installationMetric('26,982', '2024：IFR World Robotics 2025 公开新闻稿披露。'),
      automation: densityMetric('429', '2023：每万名制造业员工；IFR 公开新闻。', ifrDensity2023, 'IFR 新闻稿'),
      manufacturing: eurostatMetric('€789.4B', '制造业增加值', 'DE', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric('VDMA Robotik + Automation 为德国机器人/自动化行业网络；不将“130+ 机器视觉成员”与其他国家不一致口径强行比较。', 'https://www.vdma.org/en/robotics-automation', 'VDMA')
    },
    spain: {
      gdp: eurostatMetric('€1.687T', '2025 名义 GDP', 'ES', 'gdp', '当前价格；2025 初步值'),
      installations: installationMetric('5,100', '2024：IFR World Robotics 2025 公开新闻稿披露。'),
      automation: densityMetric('169', '2022：每万名制造业员工的工业机器人数量'),
      manufacturing: eurostatMetric('€178.8B', '制造业增加值', 'ES', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric('AER Automation 为西班牙自动化与机器人行业网络；会员口径不与 VDMA 做数值比较。', 'https://aer-automation.com/', 'AER Automation')
    },
    france: {
      gdp: eurostatMetric('€2.991T', '2025 名义 GDP', 'FR', 'gdp', '当前价格；2025 初步值'),
      installations: installationMetric('4,900', '2024：IFR World Robotics 2025 公开新闻稿披露。'),
      automation: densityMetric('180', '2022：每万名制造业员工的工业机器人数量'),
      manufacturing: eurostatMetric('€299.3B', '制造业增加值', 'FR', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric()
    },
    ireland: {
      gdp: eurostatMetric('€602.4B', '2025 名义 GDP', 'IE', 'gdp', '当前价格；2025 已发布值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: noPublicComparable('工业机器人密度', 'IFR 公开密度图未披露爱尔兰值；不以生命科学行业规模替代机器人密度。'),
      manufacturing: eurostatMetric('€176.8B', '制造业增加值', 'IE', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric()
    },
    italy: {
      gdp: eurostatMetric('€2.258T', '2025 名义 GDP', 'IT', 'gdp', '当前价格；2025 已发布值'),
      installations: installationMetric('8,783', '2024：IFR World Robotics 2025 公开新闻稿披露。'),
      automation: densityMetric('219', '2022：每万名制造业员工的工业机器人数量'),
      manufacturing: eurostatMetric('€338.7B', '制造业增加值', 'IT', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric()
    },
    netherlands: {
      gdp: eurostatMetric('€1.171T', '2025 名义 GDP', 'NL', 'gdp', '当前价格；2025 已发布值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: densityMetric('248', '2022：每万名制造业员工的工业机器人数量'),
      manufacturing: eurostatMetric('€122.9B', '制造业增加值', 'NL', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric()
    },
    norway: {
      gdp: eurostatMetric('€470.4B', '2025 名义 GDP', 'NO', 'gdp', '当前价格；Eurostat 可比换算值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: noPublicComparable('工业机器人密度', 'IFR 公开密度图未披露挪威值；不以本页渠道或项目数量替代。'),
      manufacturing: eurostatMetric('€28.6B', '制造业增加值', 'NO', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric()
    },
    poland: {
      gdp: eurostatMetric('€922.9B', '2025 名义 GDP', 'PL', 'gdp', '当前价格；2025 已发布值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: noPublicComparable('工业机器人密度', 'IFR 公开密度图未披露波兰值；不以旧年份、非同口径转载值或渠道数量填补。'),
      manufacturing: eurostatMetric('€132.9B', '制造业增加值', 'PL', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric()
    },
    romania: {
      gdp: eurostatMetric('€380.1B', '2025 名义 GDP', 'RO', 'gdp', '当前价格；2025 初步值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: noPublicComparable('工业机器人密度', 'IFR 公开密度图未披露罗马尼亚值；不以渠道、公司或展会数量替代。'),
      manufacturing: eurostatMetric('€44.9B', '制造业增加值', 'RO', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric()
    },
    sweden: {
      gdp: eurostatMetric('€601.2B', '2025 名义 GDP', 'SE', 'gdp', '当前价格；2025 已发布值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: densityMetric('343', '2022：每万名制造业员工的工业机器人数量'),
      manufacturing: eurostatMetric('€72.3B', '制造业增加值', 'SE', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric()
    },
    switzerland: {
      gdp: eurostatMetric('€925.9B', '2025 名义 GDP', 'CH', 'gdp', '当前价格；Eurostat 可比换算值'),
      installations: noPublicComparable('工业机器人新增安装'),
      automation: densityMetric('296', '2022：每万名制造业员工的工业机器人数量'),
      manufacturing: eurostatMetric('€175.2B', '制造业增加值', 'CH', 'manufacturing', '2025 当前价格；NACE Rev.2 C'),
      ecosystem: ecosystemMetric('Swiss Robotics 为瑞士机器人产业网络；不把其成员口径等同于德国 VDMA 机器视觉成员口径。', 'https://swiss-robotics.org/', 'Swiss Robotics')
    },
    uk: {
      gdp: { value: '£3.034T', label: '2025 名义 GDP', note: 'ONS 年度当前价格 GDP（£m：3,033,866）。', sourceUrl: onsGdp2025, sourceLabel: 'ONS PN2' },
      installations: installationMetric('2,500', '2024：IFR World Robotics 2025 公开新闻稿披露。'),
      automation: noPublicComparable('工业机器人密度', 'IFR 公开密度图未披露英国最新可比值；不以早期图表或媒体转载值替代。'),
      manufacturing: { value: '暂无同口径公开值', label: '制造业增加值', note: '本轮只纳入可复算的 2025 当前价格国民账户值；待以 ONS 行业 GVA 原始序列复核后补入。', sourceUrl: onsGdp2025, sourceLabel: 'ONS' },
      ecosystem: ecosystemMetric('Automate UK 是英国制造自动化行业网络；成员口径不与 VDMA 机器视觉成员做数值比较。', 'https://automate-uk.com/', 'Automate UK')
    }
  };
  const originHints = [
    ['SICK', '德国'], ['ifm', '德国'], ['KEYENCE', '日本'], ['Cognex', '美国'], ['Basler', '德国'],
    ['IDS', '德国'], ['Baumer', '瑞士'], ['Pepperl', '德国'], ['Datalogic', '意大利'],
    ['Teledyne', '美国/加拿大'], ['LMI', '加拿大'], ['LUCID', '加拿大'], ['Zivid', '挪威'],
    ['Photoneo', '斯洛伐克'], ['Mech-Mind', '中国'], ['梅卡曼德', '中国'], ['HIKROBOT', '中国'],
    ['海康', '中国'], ['Orbbec', '中国'], ['MRDVS', '中国'], ['迈尔微视', '中国'], ['RealSense', '美国'],
    ['Intel', '美国'], ['Visionerf', '法国'], ['SmartRay', '德国'], ['Balluff', '德国'],
    ['OMRON', '日本'], ['Zebra', '美国'], ['Matrox', '加拿大'], ['FRAMOS', '德国'],
    ['STEMMER', '德国'], ['Infaimon', '西班牙'], ['BCNVision', '西班牙'], ['E2M', '西班牙'],
    ['Irish Machine Vision', '爱尔兰'], ['Kivnon', '西班牙'], ['Mecalux', '西班牙'], ['Pickit', '比利时'],
    ['Stereolabs', '法国'], ['Luxonis', '美国'], ['Accerion', '德国'], ['SensoPart', '德国'],
    ['LEUZE', '德国'], ['JAI', '丹麦'], ['ALLIED_VISION', '德国'], ['AT_SENSORS', '德国'],
    ['Automation Technology', '德国'], ['E_CON_SYSTEMS', '印度'], ['CubeEye', '韩国'], ['CUBEEYE', '韩国'],
    ['WORKSWELL', '捷克'], ['SCORPION_VISION_TORDIVEL', '挪威'], ['Tordivel', '挪威'], ['BLUEBOTICS', '瑞士'],
    ['Bosch Rexroth', '德国'], ['Siemens', '德国'], ['pmdtechnologies', '德国'], ['Photonfocus', '瑞士'],
    ['ESPROS', '瑞士'], ['Cognex', '美国']
  ];
  const technologyHints = [
    ['SICK', 'dToF / 3D视觉'], ['ifm', 'iToF 3D'], ['KEYENCE', '2D AI / 激光轮廓'], ['Cognex', '2D智能 + 3D'],
    ['Basler', 'ToF + 立体视觉'], ['IDS', '立体视觉 + iToF'], ['Baumer', '2D / 3D机器视觉'],
    ['Pepperl', '激光轮廓 / 区域监控'], ['Datalogic', '2D智能 + 物流自动识别'], ['Teledyne', '成像 + 激光轮廓'],
    ['LMI', '激光轮廓 / 3D测量'], ['Zivid', '结构光彩色 3D'], ['Photoneo', '结构光 / 动态 3D'],
    ['Mech-Mind', '结构光 / 激光 3D'], ['梅卡曼德', '结构光 / 激光 3D'], ['HIKROBOT', '激光 / ToF / 2D AI'],
    ['海康', '激光 / ToF / 2D AI'], ['Orbbec', '结构光 + iToF/dToF RGB-D'], ['MRDVS', '工业 RGB-D / 3D视觉'],
    ['RealSense', '立体视觉 / RGB-D'], ['Visionerf', '3D视觉 / 机器人引导'], ['SmartRay', '激光三角测量'],
    ['Balluff', 'ToF / 智能视觉'], ['OMRON', '2D / 3D视觉 + 自动化'], ['Zebra', '智能相机 + 3D轮廓'],
    ['Matrox', '智能相机 + 3D轮廓'], ['Stereolabs', '立体 / 深度视觉'], ['Luxonis', '嵌入式 3D视觉'],
    ['Accerion', '光学定位传感器'], ['Pickit', '3D机器人视觉'], ['BCNVision', '机器视觉分销 + 集成'],
    ['STEMMER', '机器视觉 VAD / 设计导入'], ['Infaimon', '机器视觉 VAD / 集成'],
    ['SensoPart', '视觉传感器 / 机器人引导'], ['LEUZE', '光电传感器 / 激光测距'], ['JAI', '工业相机 / 多光谱成像'],
    ['ALLIED_VISION', '工业相机 / 嵌入式视觉'], ['AT_SENSORS', '激光三角测量 / 3D检测'],
    ['Automation Technology', '激光三角测量 / 3D检测'], ['E_CON_SYSTEMS', 'RGB-D / 深度相机'],
    ['CubeEye', 'ToF深度相机'], ['CUBEEYE', 'ToF深度相机'], ['WORKSWELL', '热成像 / 多光谱成像'],
    ['SCORPION_VISION_TORDIVEL', '3D机器人视觉 / 引导'], ['Tordivel', '3D机器人视觉 / 引导'],
    ['BLUEBOTICS', '自主移动机器人导航'], ['Bosch Rexroth', '工业自动化 / AMR'],
    ['Siemens', '工业自动化 / 边缘AI'], ['pmdtechnologies', 'ToF深度传感器'],
    ['Photonfocus', '工业相机 / 3D激光三角测量'], ['ESPROS', 'ToF图像传感器 / 3D相机']
  ];

  const norm = value => String(value || '').toLowerCase().replace(/[\s\-_/+.，、()（）]/g, '');
  const hintFor = (name, hints) => {
    const key = norm(name);
    return hints.find(([needle]) => key.includes(norm(needle)))?.[1] || '';
  };
  const directoryContainers = () => findAll(['#brandDirectory', '#directory', '#spainBrandDirectory', '#compDirectory']);
  const brandFromButton = button => button.dataset.spainBrand || button.dataset.brand || button.textContent.split(/\s+/)[0];
  const rowForBrand = brand => {
    const body = recordBody();
    if (!body) return null;
    const key = norm(brand);
    return [...body.querySelectorAll(':scope > tr')].find(row => norm(row.cells[0]?.textContent).includes(key)) || null;
  };
  const firstCellLine = row => row?.cells[0]?.textContent.split(/\n+/).map(x => x.trim()).find(Boolean) || '';
  const productCellValue = row => {
    const cell = row?.cells[1];
    return cell?.querySelector('.product')?.textContent.trim() || cell?.querySelector('.overview-products span')?.textContent.trim() || cell?.textContent.split(/\n+/).map(x => x.trim()).find(Boolean) || '';
  };
  const shortenTechnology = value => {
    const normalized = String(value || '').replace(/\s+/g, ' ').trim();
    if (!normalized || /源表未提供|待原始公司明细|需原始公司明细/.test(normalized)) return '';
    const concise = normalized.split(/[。\n]/)[0].trim();
    return concise.length > 34 ? `${concise.slice(0, 34)}…` : concise;
  };
  const existingSecondary = button => button.querySelector('.sub')?.textContent.trim() || '';
  const targetCountry = () => targetCountryBySlug[location.pathname.split('/').pop().split('_')[0]] || '欧洲';

  function standardiseBrandDirectories() {
    directoryContainers().forEach(directory => {
      directory.querySelectorAll(':scope > button').forEach(button => {
        if (button.dataset.germanyDirectoryUniform === '1') return;
        const key = brandFromButton(button);
        const row = rowForBrand(key);
        const existing = existingSecondary(button);
        const origin = hintFor(key, originHints) || (/[\u4e00-\u9fff]/.test(existing) && existing.match(/德国|法国|意大利|西班牙|中国|日本|美国|加拿大|瑞士|挪威|比利时|斯洛伐克|爱尔兰/)?.[0]) || targetCountry();
        let technology = hintFor(key, technologyHints);
        if (!technology && existing && !/\d+\s*(个|条)|威胁分|优先级|关系/.test(existing)) technology = existing.replace(new RegExp(`^${origin}\\s*[·｜|]?\\s*`), '').trim();
        if (!technology) technology = shortenTechnology(productCellValue(row));
        technology = shortenTechnology(technology);
        if (!technology) technology = '产品与技术方向待补充';
        let labelNode = [...button.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
        if (!labelNode) { labelNode = document.createTextNode(key); button.insertBefore(labelNode, button.firstChild); }
        labelNode.nodeValue = key;
        let sub = button.querySelector('.sub');
        if (!sub) { button.insertAdjacentHTML('beforeend', '<br><span class="sub"></span>'); sub = button.querySelector('.sub'); }
        sub.textContent = `${origin} · ${technology}`;
        button.dataset.germanyDirectoryUniform = '1';
      });
    });
  }

  function columnIndex(headers, keyword) {
    return headers.findIndex(header => text(header).includes(keyword));
  }

  function firstMeaningfulLine(value) {
    return String(value || '')
      .split(/[\n\r]+/)
      .map(part => part.trim())
      .find(part => part && !/^(定位|应用|技术路线|竞争关系|关系状态|渠道类型|销售方式)[:：]/.test(part)) || '';
  }

  function tableMetrics() {
    const body = recordBody();
    if (!body) return null;
    const table = body.closest('table');
    const headers = table ? [...table.querySelectorAll('thead th')] : [];
    const rows = [...body.querySelectorAll(':scope > tr')].filter(row => !isEmptyRow(row));
    const brandCol = columnIndex(headers, '竞品公司');
    const productCol = columnIndex(headers, '产品');
    const channelCol = columnIndex(headers, '销售渠道');
    const kpCol = columnIndex(headers, 'KP');

    const brands = [];
    const products = [];
    const channels = [];
    const namedKps = [];

    rows.forEach(row => {
      const cells = [...row.cells];
      const brandCell = cells[brandCol >= 0 ? brandCol : 0];
      const productCell = cells[productCol >= 0 ? productCol : 1];
      const channelCell = cells[channelCol >= 0 ? channelCol : 2];
      const kpCell = cells[kpCol >= 0 ? kpCol : 4];

      const brand = text(brandCell?.querySelector('.entity')) || firstMeaningfulLine(text(brandCell));
      if (brand && !/^候选渠道/.test(brand)) brands.push(brand);

      const productTags = [...(productCell?.querySelectorAll('.overview-products span, .product') || [])]
        .map(text)
        .filter(Boolean);
      (productTags.length ? productTags : [firstMeaningfulLine(text(productCell))]).forEach(product => {
        if (product && !/^未与竞品/.test(product)) products.push(product);
      });

      const channel = text(channelCell?.querySelector('.entity')) || firstMeaningfulLine(text(channelCell));
      if (channel) channels.push(channel);

      if (kpCell) {
        const candidates = [...kpCell.querySelectorAll('.kp-name, .channel-kp b, b')].map(text);
        candidates.forEach(name => {
          if (name && name.length < 80 && !/未公开|姓名未|目标职能|未找到|^KP$|^—$/.test(name)) namedKps.push(name);
        });
      }
    });

    return {
      competitors: unique(brands).length,
      products: unique(products).length,
      channels: unique(channels).length,
      relations: rows.length,
      kps: unique(namedKps).length
    };
  }

  const countrySlug = () => location.pathname.split('/').pop().split('_')[0].toLowerCase();
  function applyCzechVisualParity() {
    if (['czech', 'denmark'].includes(countrySlug())) document.documentElement.classList.add('czech-germany-visual');
  }
  const numberFromText = value => {
    const match = String(value || '').replace(/,/g, '').match(/\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : null;
  };
  const existingKpiValue = (host, matcher) => {
    const card = [...host.querySelectorAll(':scope > .kpi')].find(node => matcher.test(text(node)));
    return card ? numberFromText(card.querySelector('b')?.textContent || '') : null;
  };
  const hasKpContent = value => {
    const normalized = text({ textContent: value });
    return Boolean(normalized) && !/^(—|-|无|N\/A|姓名未公开|未公开|待确认|未找到)/i.test(normalized);
  };
  const personNameCandidates = value => {
    const word = "[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’-]+";
    const pattern = new RegExp(`^\\s*(${word}(?:\\s+${word}){1,3})(?=\\s*(?:$|[,(\\d]))`, 'u');
    const nonPerson = /\b(machine|vision|sales|manager|director|engineer|marketing|product|channel|business|industrial|technical|company|official|target|role|contact|public|team|solution|development|research|global|europe|austria|italy|france|norway|sweden|poland|romania|switzerland|belgium|ireland|managing|senior|owner|executive)\b/i;
    return String(value || '')
      .split(/[\n\r;；|/]+/)
      .map(part => part.replace(/^(姓名|Name|联系人|Contact|KP)\s*[:：]\s*/i, '').trim())
      .map(part => part.match(pattern)?.[1] || '')
      .filter(name => name && !nonPerson.test(name));
  };

  function kpRecordMetrics() {
    const body = recordBody();
    if (!body) return { records: 0, named: 0 };
    const table = body.closest('table');
    const headers = table ? [...table.querySelectorAll('thead th')] : [];
    const kpCol = columnIndex(headers, 'KP');
    const rows = [...body.querySelectorAll(':scope > tr')].filter(row => !isEmptyRow(row));
    const names = [];
    let records = 0;
    rows.forEach(row => {
      const cell = row.cells[kpCol >= 0 ? kpCol : 4];
      const cellText = text(cell);
      if (!hasKpContent(cellText)) return;
      records += 1;
      const structured = [...cell.querySelectorAll('.kp-name, .channel-kp b, b')].flatMap(node => personNameCandidates(node.innerText || node.textContent));
      const inferred = personNameCandidates(cell?.innerText || cell?.textContent);
      names.push(...structured, ...inferred);
    });
    return { records, named: unique(names).length };
  }

  function normaliseTopKpis() {
    if (countrySlug() === 'germany') return;
    const records = tableMetrics();
    if (!records) return;
    const market = document.querySelector('#market');
    let host = document.querySelector('.kpis');
    if (!host && market) {
      host = document.createElement('section');
      host.className = 'kpis germany-dashboard-kpis';
      market.parentNode.insertBefore(host, market);
    }
    if (!host) return;
    if (host.dataset.germanyKpiInitialised === '1') return;

    const kp = kpRecordMetrics();
    const items = [
      [existingKpiValue(host, /竞品.*(公司|实体)|已导入竞品/) ?? records.competitors, '已导入竞品公司'],
      [existingKpiValue(host, /渠道.*(节点|入口)|节点.*渠道/) ?? records.channels, '公开渠道节点样本'],
      [existingKpiValue(host, /KP.*(记录|职能)|职能.*KP/) ?? kp.records, 'KP / 目标职能记录'],
      [existingKpiValue(host, /公开具名.*KP|已核实.*KP/) ?? kp.named, '公开具名 KP']
    ];
    host.classList.add('germany-dashboard-kpis');
    host.innerHTML = items.map(([value, label]) => `<div class="kpi"><b>${value}</b><span>${label}</span></div>`).join('');
    host.dataset.germanyKpiInitialised = '1';
  }

  const html = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function marketMetricMarkup(metric) {
    const source = metric.sourceUrl
      ? ` <a href="${html(metric.sourceUrl)}" target="_blank" rel="noreferrer">${html(metric.sourceLabel || '来源')}</a>`
      : '';
    return `<article class="metric germany-market-benchmark-card"><b>${html(metric.value)}</b><span>${html(metric.label)}</span><small>${html(metric.note)}${source}</small></article>`;
  }

  function ensureMarketBenchmarkSource() {
    const list = document.querySelector('.sources ul');
    if (!list || list.querySelector('[data-germany-market-benchmark-source]')) return;
    const item = document.createElement('li');
    item.dataset.germanyMarketBenchmarkSource = '1';
    item.innerHTML = '统一市场指标：GDP 与制造业增加值优先采用 <a href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10_gdp?freq=A&amp;unit=CP_MEUR&amp;na_item=B1GQ&amp;geo=DE&amp;time=2025" target="_blank" rel="noreferrer">Eurostat 国民账户 API</a> 的 2025 当前价格口径；机器人安装量与密度只采用 <a href="https://ifr.org/ifr-press-releases/news/global-robot-density-in-factories-doubled-in-seven-years" target="_blank" rel="noreferrer">IFR 公开材料</a>明确披露的国别年份。页面不以竞品、渠道、展会或 KP 数量替代缺失的市场指标。';
    list.appendChild(item);
  }

  function renderMarketBenchmark() {
    const slug = countrySlug();
    const benchmark = marketBenchmarkByCountry[slug];
    const market = document.querySelector('#market');
    if (!benchmark || !market) return;

    let metrics = market.querySelector(':scope > .metrics, .metrics');
    if (!metrics) {
      metrics = document.createElement('div');
      metrics.className = 'metrics';
      const head = market.querySelector(':scope > .section-head');
      if (head) head.insertAdjacentElement('afterend', metrics);
      else market.appendChild(metrics);
    }
    if (metrics.dataset.germanyMarketBenchmark === slug) return;

    const headNote = market.querySelector(':scope > .section-head p');
    if (headNote) {
      headNote.textContent = '统一市场基准：GDP 与制造业增加值采用 2025 当前价格国民账户口径；机器人指标仅在 IFR 公开材料明确披露时列示，具体年份见卡片。不以渠道、竞品或 KP 数量替代缺失市场数据；机器视觉行业组织仅作生态入口，不作跨国会员数硬比较。';
      headNote.dataset.germanyMarketBenchmarkScope = '1';
    }

    const ordered = [benchmark.gdp, benchmark.installations, benchmark.automation, benchmark.manufacturing, benchmark.ecosystem];
    metrics.classList.add('germany-market-benchmark');
    metrics.innerHTML = ordered.map(marketMetricMarkup).join('');
    metrics.dataset.germanyMarketBenchmark = slug;
    ensureMarketBenchmarkSource();
  }

  function removeSwissMarketResearchTable() {
    if (countrySlug() !== 'switzerland') return;
    const market = document.querySelector('#market');
    if (!market) return;
    market.querySelector('#marketTabs')?.remove();
    market.querySelector(':scope > .table-box')?.remove();
  }

  function addDerivedMarketMetric(metrics, value, label, note) {
    const card = document.createElement('article');
    card.className = 'metric germany-derived-market-metric';
    card.innerHTML = `<b>${value}</b><span>${label}</span><small>${note}</small>`;
    metrics.appendChild(card);
  }

  function ensureMarketMetricFloor() {
    const market = document.querySelector('#market');
    const metrics = market?.querySelector(':scope > .metrics, .metrics');
    const records = tableMetrics();
    if (!metrics || !records) return;
    const slug = countrySlug();

    if (slug === 'norway' && !metrics.dataset.germanyNorwayGdp) {
      const gdpCard = [...metrics.children].find(card => /GDP|国内生产总值/.test(text(card)));
      if (!gdpCard) {
        const compliance = [...metrics.children].find(card => /出口合规检查/.test(text(card)));
        const ecosystem = [...metrics.children].find(card => /技术验证|产业生态/.test(text(card)));
        if (compliance) {
          compliance.innerHTML = '<b>NOK 5.511T</b><span>2025 名义 GDP</span><small>Statistics Norway 表 09189；2025 初步值</small>';
          if (ecosystem?.querySelector('small')) ecosystem.querySelector('small').textContent += '；另有 12 项出口合规检查';
        } else {
          addDerivedMarketMetric(metrics, 'NOK 5.511T', '2025 名义 GDP', 'Statistics Norway 表 09189；2025 初步值');
        }
        const sources = document.querySelector('.sources ul');
        if (sources && !sources.querySelector('[data-germany-norway-gdp]')) {
          const item = document.createElement('li');
          item.dataset.germanyNorwayGdp = '1';
          item.innerHTML = '补充宏观来源：<a href="https://www.ssb.no/en/statbank/table/09189/" target="_blank" rel="noreferrer">Statistics Norway 表 09189</a>（2025 年名义 GDP，当前价格，初步值）。';
          sources.appendChild(item);
        }
      }
      metrics.dataset.germanyNorwayGdp = '1';
    }

    if (metrics.dataset.germanyMetricFloor === '1') return;
    const fallback = [
      [records.competitors, '已导入竞品公司', '本页公开关系数据统计'],
      [records.products, '产品 / 产品线', '本页公开关系数据统计'],
      [records.channels, '去重渠道节点', '本页公开关系数据统计'],
      [records.relations, '行级关系记录', '本页公开关系数据统计']
    ];
    let index = 0;
    while (metrics.querySelectorAll(':scope > .metric').length < 5 && index < fallback.length) {
      const [value, label, note] = fallback[index++];
      addDerivedMarketMetric(metrics, value, label, note);
    }
    metrics.dataset.germanyMetricFloor = '1';
  }

  function compactMarketMetrics() {
    const market = document.querySelector('#market');
    const metrics = market?.querySelector(':scope > .metrics, .metrics');
    if (!metrics || metrics.dataset.germanyMetricCompact === '1') return;
    const cards = [...metrics.querySelectorAll(':scope > .metric')];
    if (cards.length > 5) {
      const lastVisible = cards[4];
      const note = lastVisible.querySelector('small') || lastVisible.appendChild(document.createElement('small'));
      cards.slice(5).forEach(card => {
        const value = text(card.querySelector('b'));
        const label = text(card.querySelector('span'));
        const detail = text(card.querySelector('small'));
        const supplement = [value, label, detail].filter(Boolean).join(' · ');
        if (supplement) note.textContent += `${note.textContent ? '；补充：' : ''}${supplement}`;
        card.remove();
      });
    }
    metrics.dataset.germanyMetricCompact = '1';
  }

  function prioritiseGdpMetric() {
    const market = document.querySelector('#market');
    const metrics = market?.querySelector(':scope > .metrics, .metrics');
    if (!metrics || metrics.dataset.germanyGdpOrdered === '1') return;
    const gdpCard = [...metrics.querySelectorAll(':scope > .metric')]
      .find(card => /(?:GDP|名义GDP|国内生产总值|GDP规模|gross domestic product)/i.test(text(card)));
    if (gdpCard && gdpCard !== metrics.querySelector(':scope > .metric')) metrics.insertBefore(gdpCard, metrics.firstElementChild);
    metrics.dataset.germanyGdpOrdered = '1';
  }

  function classifyChannel(value) {
    const v = norm(value);
    if (/历史|失效|暂停|已终止|停止合作|暂缓|historical|discontinued|suspended/.test(v)) return 'Z';
    if (/品牌直销|原厂|总部|直营|direct|manufacturer|brandoffice/.test(v)) return 'A';
    if (/vad|分销|经销|代理|电商|distributor|reseller|online/.test(v)) return 'B';
    if (/系统集成|集成商|方案|工程|robotics|automation|integrator|systemintegrator|oem/.test(v)) return 'C';
    if (/区域|分支|办事处|分公司|branch|regional|城市|city/.test(v)) return 'D';
    return '';
  }

  function channelCategoryCounts() {
    const body = recordBody();
    if (!body) return { A: 0, B: 0, C: 0, D: 0, Z: 0, unclassified: 0 };
    const table = body.closest('table');
    const headers = table ? [...table.querySelectorAll('thead th')] : [];
    const channelCol = columnIndex(headers, '销售渠道');
    const typeCol = headers.findIndex(header => /渠道类型|节点类型|渠道分类/.test(text(header)));
    const statusCol = headers.findIndex(header => /关系状态|证据状态|状态/.test(text(header)));
    const result = { A: new Set(), B: new Set(), C: new Set(), D: new Set(), Z: new Set(), unclassified: new Set() };
    [...body.querySelectorAll(':scope > tr')].filter(row => !isEmptyRow(row)).forEach(row => {
      const channelCell = row.cells[channelCol >= 0 ? channelCol : 2];
      const channel = text(channelCell?.querySelector('.entity')) || firstMeaningfulLine(text(channelCell)) || '未具名节点';
      const category = classifyChannel(`${text(channelCell)} ${text(row.cells[typeCol])} ${text(row.cells[statusCol])}`);
      (category ? result[category] : result.unclassified).add(channel);
    });
    return Object.fromEntries(Object.entries(result).map(([key, values]) => [key, values.size]));
  }

  function addChannelCategorySection() {
    const slug = countrySlug();
    if (slug === 'germany' || slug === 'spain' || document.querySelector('.germany-channel-category')) return;
    const market = document.querySelector('#market');
    const records = document.querySelector('#records');
    if (!market || !records || !recordBody()) return;
    const counts = channelCategoryCounts();
    const labels = [
      ['A', '品牌直销 / 总部', '竞品验证、总部合作、替换测试'],
      ['B', 'VAD / 专业分销', '样机、选型与联合商机'],
      ['C', '系统集成 / 方案伙伴', '项目设计导入与 PoC'],
      ['D', '区域销售 / 技术分支', '城市覆盖、现场演示与售后'],
      ['Z', '历史 / 暂停关系', '仅作后续核验，不作当前能力依据']
    ];
    const section = document.createElement('section');
    section.className = 'section germany-channel-category';
    section.id = 'channel-category';
    section.innerHTML = `<div class="section-head"><div><h2>渠道类型与行动定位</h2><p>节点数按本页“渠道名称、渠道类型与关系状态”字段去重统计；仅明确的历史、失效、暂停或暂缓关系归入 Z 类。候选或待核验关系不等同当前授权、库存或服务能力。</p></div></div><div class="metrics">${labels.map(([key, label, action]) => `<article class="metric"><b>${counts[key]}</b><span>${key} · ${label}</span><small>${action}</small></article>`).join('')}</div>${counts.unclassified ? `<div class="status-note">另有 ${counts.unclassified} 个公开渠道节点未在源表中标明可比渠道类型，已保留在下方关系记录中，未强行归入 A/B/C/D/Z。</div>` : ''}`;
    market.insertAdjacentElement('afterend', section);
  }

  function renderSummary() {
    const host = summaryHost();
    const metrics = tableMetrics();
    if (!host || !metrics) return;
    const items = [
      ['竞品数', metrics.competitors],
      ['产品数', metrics.products],
      ['去重渠道数', metrics.channels],
      ['关系数', metrics.relations],
      ['已核实 KP 数', metrics.kps]
    ];
    host.classList.add('germany-filter-summary');
    host.innerHTML = items.map(([label, value]) => `<span class="summary-metric"><b>${value}</b>${label}</span>`).join('');
  }

  function labelValue(node, label) {
    if (!node || node.dataset.germanyLabelled === '1') return;
    const value = text(node);
    if (!value || /^(地址 \/ 覆盖|地址|覆盖|实体城市|线上|销售方式|渠道类型|渠道电话|渠道邮箱|电话|邮箱|公开证据|来源|官网)[:：]/.test(value)) return;
    node.textContent = `${label}${value}`;
    node.dataset.germanyLabelled = '1';
  }

  function standardiseRelationDetails() {
    relationDetails().forEach(detail => {
      detail.querySelectorAll('.relation-matrix, .channel-kp-map, .channel-kp-map, .relation-evidence, .boundary-box, .country-note, .poland-note, .eco-note').forEach(node => node.remove());
      detail.querySelectorAll('.channel-node').forEach(channel => {
      const summaryNodes = [...channel.querySelectorAll(':scope > small, :scope > .channel-summary small')];
      summaryNodes.forEach((node, index) => {
        const value = text(node);
        if (!value) return;
        if (index === 0) labelValue(node, '地址 / 覆盖：');
        else if (!/^(具体产品|覆盖产品|服务|应用|地址|覆盖|销售方式|渠道类型|本地存在|关系范围|业务范围)[:：]/.test(value)) labelValue(node, '服务能力：');
      });
      channel.querySelectorAll(':scope > .node-sub').forEach(node => labelValue(node, '渠道类型：'));
      channel.querySelectorAll(':scope > .node-scope').forEach(node => labelValue(node, '地址 / 覆盖：'));
      channel.querySelectorAll(':scope > span:not(.contact):not(.badge)').forEach(node => labelValue(node, '渠道类型：'));
      });

      const walker = document.createTreeWalker(detail, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        if (node.parentElement?.closest('script,style')) return;
        node.nodeValue = node.nodeValue
          .replace(/产品\s*[×xX]\s*(?:经销)?渠道关系矩阵/g, '产品与渠道关系')
          .replace(/渠道\s*[×xX]\s*(?:城市\s*[×xX]\s*)?KP\s*对应表/g, '渠道与 KP 关系');
      });
    });
  }

  function removeBoundarySections() {
    document.querySelectorAll('#method, .boundary-box').forEach(node => node.remove());
    document.querySelectorAll('a[href="#method"]').forEach(node => node.remove());
    [...document.querySelectorAll('section, aside, div')].forEach(node => {
      const heading = node.querySelector(':scope > h2, :scope > h3, :scope > .section-head h2');
      if (heading && /^(口径与边界|数据口径与边界)$/.test(text(heading))) node.remove();
    });
  }

  function scrollToSection(section) {
    if (!section) return;
    const header = document.querySelector('.top, header');
    const offset = (header?.getBoundingClientRect().height || 0) + 10;
    const top = Math.max(0, window.scrollY + section.getBoundingClientRect().top - offset);
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function bindNavAnchors() {
    document.querySelectorAll('.top a[href^="#"]').forEach(anchor => {
      if (anchor.dataset.germanyAnchorBound === '1') return;
      anchor.dataset.germanyAnchorBound = '1';
      anchor.addEventListener('click', event => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        history.replaceState(null, '', anchor.getAttribute('href'));
        scrollToSection(target);
      });
    });
  }

  function bindDrag(box) {
    if (!box || box.dataset.germanyDragBound === '1') return;
    box.dataset.germanyDragBound = '1';
    let state = null;
    box.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('a,button,select,input,textarea,label,summary')) return;
      state = { id: event.pointerId, x: event.clientX, y: event.clientY, left: box.scrollLeft, top: window.scrollY, moved: false };
      box.setPointerCapture(event.pointerId);
    });
    box.addEventListener('pointermove', event => {
      if (!state || state.id !== event.pointerId) return;
      const dx = event.clientX - state.x;
      const dy = event.clientY - state.y;
      if (!state.moved && Math.hypot(dx, dy) < 4) return;
      state.moved = true;
      box.classList.add('is-dragging');
      box.scrollLeft = state.left - dx;
      window.scrollTo({ top: state.top - dy, behavior: 'auto' });
    });
    const finish = event => {
      if (!state || state.id !== event.pointerId) return;
      if (box.hasPointerCapture(event.pointerId)) box.releasePointerCapture(event.pointerId);
      box.classList.remove('is-dragging');
      const moved = state.moved;
      state = null;
      if (moved) setTimeout(() => { box.dataset.germanySuppressClick = '0'; }, 0);
    };
    box.addEventListener('pointerup', finish);
    box.addEventListener('pointercancel', finish);
  }

  function bindDragBoxes() {
    document.querySelectorAll('.table-box').forEach(bindDrag);
  }

  let refreshQueued = false;
  function refresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(() => {
      refreshQueued = false;
      removeBoundarySections();
      standardiseRelationDetails();
      standardiseBrandDirectories();
      renderSummary();
      normaliseTopKpis();
      renderMarketBenchmark();
      removeSwissMarketResearchTable();
      addChannelCategorySection();
      bindNavAnchors();
      bindDragBoxes();
    });
  }

  function bindCompanyNavigation() {
    const filter = brandFilter();
    if (filter && filter.dataset.germanyCompanyBound !== '1') {
      filter.dataset.germanyCompanyBound = '1';
      filter.addEventListener('change', () => {
        refresh();
        if (!filter.value) return;
        requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(relationSection())));
      });
    }
    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-brand], [data-spain-brand], [data-open-brand], .brand-jump, .jump, .row-action');
      if (!trigger) return;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        refresh();
        if (brandFilter()?.value) scrollToSection(relationSection());
      }));
    });
  }

  function observe() {
    const body = recordBody();
    if (body) new MutationObserver(refresh).observe(body, { childList: true, subtree: true });
    relationDetails().forEach(detail => new MutationObserver(refresh).observe(detail, { childList: true, subtree: true }));
    const market = document.querySelector('#market');
    if (market) new MutationObserver(refresh).observe(market, { childList: true, subtree: true });
  }

  applyCzechVisualParity();
  removeBoundarySections();
  bindCompanyNavigation();
  observe();
  refresh();
  window.addEventListener('load', refresh, { once: true });
})();
