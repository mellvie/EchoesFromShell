/**
 * Starfield · EchoesFromShell — Three.js v11
 * 
 * 可配置星空背景。所有可调参数集中在顶部 CONFIG 对象，
 * 修改数值后 hexo generate 即可生效，无需改 JS 逻辑。
 *
 * TODO: 星云升级 — FBM 分形噪声多层流动
 */
(function() {
  'use strict';
  if (typeof THREE === 'undefined') {
    console.warn('[starfield] Three.js not loaded — starfield disabled.');
    return;
  }

  // ╔══════════════════════════════════════════════════════════════╗
  // ║                     可配置参数 CONFIG                        ║
  // ╚══════════════════════════════════════════════════════════════╝

  var CONFIG = {

    // ========== 基础 ==========

    // 星星总数（越多越密，也越吃性能，建议 3000-12000）
    starCount: 7000,

    // 相机视场角（度），越大星星分布越广
    fov: 55,

    // 星星距相机最近/最远距离（单位：Three.js 世界单位）
    // zMin 越小近处星越大，但太近会过大；zMax 越大远处星越多但越小
    zMin: 700,
    zMax: 4500,

    // 滚动视差强度（0=无视差，越大背景移动越明显）
    parallax: 0.10,

    // 最大设备像素比（限制高分屏性能消耗，1=低, 2=中, 3=高）
    dprMax: 2,

    // 背景色（十六进制，与 CSS --oh-bg-page 保持一致）
    bgColor: 0x0a0c18,


    // ========== 星星分组 ==========
    // 四组从远到近：ratio 总和应为 1.0
    // size 越大星星越大（有透视衰减，近处星会更显大）
    // twinkleAmp: 0=完全不闪, 1=全黑全亮交替（远星建议 >0.5, 近星建议 <0.2）
    // speedMin/Max: 闪烁速度范围（单位：弧度/秒）
    groups: [
      {
        name: 'deep', ratio: 0.35, size: 1.5, twinkleAmp: 0.90, speedMin: 0.22, speedMax: 0.55,
        desc: '最远最小 — 大量微小闪烁星，模拟大气折射'
      },
      {
        name: 'far', ratio: 0.30, size: 3.5, twinkleAmp: 0.70, speedMin: 0.35, speedMax: 0.75,
        desc: '中远 — 明显的点状星，适度闪烁'
      },
      {
        name: 'mid', ratio: 0.22, size: 6.5, twinkleAmp: 0.45, speedMin: 0.45, speedMax: 1.00,
        desc: '中距 — 较亮，微弱闪烁'
      },
      {
        name: 'near', ratio: 0.13, size: 11.0, twinkleAmp: 0.06, speedMin: 0.55, speedMax: 1.20,
        desc: '最近 — 少量大亮星，几乎不闪'
      },
    ],

    // 每组基础透明度范围（随机在此范围内）
    groupOpacityMin: 0.55,
    groupOpacityMax: 1.0,

    // 闪烁最低亮度（即使全黑阶段也不完全消失，0=全黑, 1=不闪）
    twinkleMinBrightness: 0.05,


    // ========== 特殊色星 ==========
    // 独立于主星群之外的少数彩色亮星

    specialStars: {
      enabled: true,         // 是否启用
      count: 40,             // 数量
      size: 8.5,             // 基础大小
      distMin: 900,          // 最近距离
      distMax: 3500,         // 最远距离
      opacity: 0.75,         // 基础透明度
      twinkleAmp: 0.35,      // 闪烁幅度（0-1）
      speedMin: 0.30,        // 闪烁最低速度
      speedMax: 0.65,        // 闪烁最高速度

      // 颜色列表（每个值为 [R, G, B]，0.0-1.0）
      colors: [
        [1.0, 0.55, 0.18],  // 暖琥珀
        [1.0, 0.62, 0.25],  // 暖金
        [0.55, 0.70, 1.0],  // 蓝白
        [0.65, 0.78, 1.0],  // 冷蓝白
        [1.0, 0.65, 0.55],  // 暖粉
        [0.95, 0.50, 0.40], // 红暖
      ],
    },


    // ========== 主星群光谱 ==========
    // 加权列表: [R, G, B, 权重]，RGB 范围 0-255，权重越大出现的概率越高

    spectralWeights: [
      [180, 200, 255, 5],   // 淡蓝白
      [160, 185, 255, 8],   // 蓝白
      [200, 215, 255, 10],  // 冷白
      [235, 240, 255, 20],  // 纯白（最多）
      [255, 250, 245, 18],  // 暖白
      [255, 255, 255, 25],  // 正白（最多）
      [255, 240, 200, 12],  // 淡暖黄
      [255, 235, 180, 10],  // 暖黄
      [255, 210, 150, 7],   // 金色
      [255, 195, 130, 5],   // 橙色
      [255, 160, 120, 3],   // 红橙
      [240, 140, 110, 2],   // 暖红
    ],


    // ========== 星云 ==========
    // 简单的径向渐变 Sprite 星云
    // TODO: 升级为 FBM 分形噪声 + 多层流动

    nebulae: {
      enabled: true,
      count: 7,              // 星云数量
      distMin: 900,          // 最近距离
      distMax: 2800,         // 最远距离
      sizeMin: 450,          // 最小尺寸
      sizeMax: 1250,         // 最大尺寸
      opacityMin: 0.08,      // 最小透明度
      opacityMax: 0.28,      // 最大透明度
      pulseAmp: 0.18,        // 脉动幅度（0-1, 越大呼吸感越强）
      speedMin: 0.06,        // 脉动最低速度
      speedMax: 0.22,        // 脉动最高速度
      rotationSpeed: 0.00003,// 自转速度

      // 颜色列表（RGB 0-255）
      colors: [
        [80, 60, 140], [40, 70, 130], [100, 50, 90],
        [30, 80, 110], [90, 40, 60], [20, 60, 100],
        [140, 50, 40],  // 暖色
        [130, 70, 30],  // 暖铜
      ],
    },


    // ========== 运动 ==========

    motion: {
      // 场景自转速度（弧度/帧，模拟天球旋转）
      // 设为 0 可完全静止
      rotationY: 0.000018,    // y 轴（主旋转）
      rotationZ: 0.000007,    // z 轴（岁差感）

      // 呼吸缩放（全体星星周期性微涨微缩，0 关闭）
      breathAmp: 0.008,       // 幅度
      breathSpeed: 0.15,      // 速度（弧度/秒）

      // 呼吸缩放作用于哪些组（按 twinkleAmp 阈值）
      // deep(amp>0.7) 最明显, far(0.4-0.7) 次之, 其余不呼吸
      breathThreshold: 0.4,
    },


    // ========== 流星 ==========

    meteors: {
      enabled: true,

      // 出现间隔范围（秒）
      intervalMin: 3,
      intervalMax: 12,

      // 出现距离范围（世界单位）
      distMin: 800,
      distMax: 2600,

      // 速度 & 生命
      speedMin: 1800,         // 最小速度（单位/秒）
      speedMax: 3000,         // 最大速度
      lifeMin: 0.7,           // 最短生命（秒）
      lifeMax: 1.5,           // 最长生命

      // 淡入淡出比例
      fadeInRatio: 0.12,      // 生命前 12% 淡入
      fadeOutRatio: 0.25,     // 生命后 25% 淡出

      // 屏外起点扩展倍率（>1 保证从屏外出现）
      edgeExtend: 1.4,

      // 样式预设
      styles: [
        { name: 'classic', head: [1.0, 0.88, 0.65], trail: [1.0, 0.75, 0.45], headSize: 14, trailSegments: 3, trailWidth: 3.5 },
        { name: 'blue', head: [0.60, 0.78, 1.0], trail: [0.45, 0.65, 1.0], headSize: 12, trailSegments: 3, trailWidth: 3.0 },
        { name: 'green', head: [0.70, 1.0, 0.75], trail: [0.50, 0.85, 0.60], headSize: 13, trailSegments: 3, trailWidth: 3.2 },
        { name: 'spark', head: [1.0, 0.95, 0.80], trail: [1.0, 0.85, 0.55], headSize: 18, trailSegments: 4, trailWidth: 4.5 },
        { name: 'purple', head: [0.80, 0.65, 1.0], trail: [0.60, 0.45, 0.95], headSize: 12, trailSegments: 3, trailWidth: 3.0 },
      ],

      // 尾节间距 & 尺寸衰减
      trailSegmentGap: 25,     // 每节尾迹间距（世界单位）
      trailBaseLength: 35,     // 第一节尾迹长度
    },


    // ========== 彗星 ==========

    comets: {
      enabled: true,

      // 出现间隔范围（秒, 彗星比流星稀有）
      intervalMin: 20,
      intervalMax: 50,

      // 出现距离
      distMin: 1200,
      distMax: 3200,

      // 速度 & 生命（彗星更慢更持久）
      speedMin: 220,
      speedMax: 420,
      lifeMin: 8.0,
      lifeMax: 16.0,

      // 淡入淡出
      fadeInRatio: 0.12,
      fadeOutRatio: 0.25,

      // 屏外起点扩展
      edgeExtend: 1.4,

      // 样式预设
      styles: [
        {
          name: 'gold',
          head: [1.0, 0.95, 0.80], dust: [1.0, 0.82, 0.55], ion: [0.55, 0.72, 1.0],
          headSize: 38, dustSegments: 12, ionSegments: 10, dustWidth: 7.0, ionWidth: 3.5, ionStrength: 1.0,
          desc: '经典金色彗星，尘埃尾为主'
        },
        {
          name: 'ice',
          head: [0.65, 0.82, 1.0], dust: [0.55, 0.70, 0.85], ion: [0.35, 0.55, 1.0],
          headSize: 34, dustSegments: 8, ionSegments: 14, dustWidth: 5.5, ionWidth: 4.0, ionStrength: 1.8,
          desc: '冰蓝彗星，离子尾主导'
        },
        {
          name: 'grand',
          head: [1.0, 0.96, 0.85], dust: [1.0, 0.88, 0.65], ion: [0.50, 0.68, 1.0],
          headSize: 48, dustSegments: 16, ionSegments: 14, dustWidth: 8.0, ionWidth: 4.5, ionStrength: 1.3,
          desc: '壮丽大彗星，双尾均衡'
        },
        {
          name: 'emerald',
          head: [0.55, 1.0, 0.80], dust: [0.45, 0.85, 0.65], ion: [0.30, 0.75, 0.90],
          headSize: 35, dustSegments: 11, ionSegments: 10, dustWidth: 6.5, ionWidth: 3.5, ionStrength: 1.0,
          desc: '翠绿彗星，罕见'
        },
        {
          name: 'crimson',
          head: [1.0, 0.60, 0.40], dust: [0.95, 0.45, 0.30], ion: [0.70, 0.40, 0.55],
          headSize: 36, dustSegments: 10, ionSegments: 8, dustWidth: 6.0, ionWidth: 3.0, ionStrength: 0.7,
          desc: '赤红彗星，凶兆感'
        },
      ],

      // 尘埃尾参数
      dustTail: {
        segmentGap: 12,        // 每节间距
        baseLength: 50,        // 第一节长度
        curvePower: 10,        // 弯曲强度：尘埃受轨道惯性形成弧形
      },

      // 离子尾参数
      ionTail: {
        segmentGap: 16,        // 每节间距
        baseLength: 40,        // 第一节长度
        sideScale: 1.8,        // 初始偏移系数（×dustWidth）
        curvePower: 25,        // 递增偏移：t² × 此值，始终超在尘埃尾外侧
        directionBias: 0.12,   // 方向偏角（模拟太阳风）
        waveFreq: 2,         // 波动频率
        waveAmp: 1.0,          // 波动振幅
      },
    },

  }; // ---- CONFIG END ----

  // ╔══════════════════════════════════════════════════════════════╗
  // ║                     渲染逻辑（不要改）                       ║
  // ╚══════════════════════════════════════════════════════════════╝

  var DPR = Math.min(window.devicePixelRatio || 1, CONFIG.dprMax);
  var PARALLAX = CONFIG.parallax;
  var FOV = CONFIG.fov;

  // ---- Setup ----
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 8000);
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, -1);

  var renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' });
  renderer.setClearColor(CONFIG.bgColor);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(DPR);
  renderer.domElement.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.insertBefore(renderer.domElement, document.body.firstChild);



  // ---- 纹理 ----
  function makeStarTex() {
    var s = 64, c = document.createElement('canvas');
    c.width = c.height = s;
    var ctx = c.getContext('2d');
    var grad = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.15, 'rgba(255,255,255,0.85)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.10)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(c);
  }
  var starTex = makeStarTex();

  function makeNebulaTex(ir, ig, ib) {
    var s = 256, c = document.createElement('canvas');
    c.width = c.height = s;
    var ctx = c.getContext('2d');
    var grad = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, 'rgba(' + ir + ',' + ig + ',' + ib + ',0.10)');
    grad.addColorStop(0.25, 'rgba(' + ir + ',' + ig + ',' + ib + ',0.04)');
    grad.addColorStop(0.6, 'rgba(' + ir + ',' + ig + ',' + ib + ',0.015)');
    grad.addColorStop(1, 'rgba(' + ir + ',' + ig + ',' + ib + ',0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(c);
  }

  // ---- 光谱 ----
  var SPECTRAL = [];
  CONFIG.spectralWeights.forEach(function(w) {
    var n = w[3]; while (n--) SPECTRAL.push([w[0] / 255, w[1] / 255, w[2] / 255]);
  });
  function pickSpec() { return SPECTRAL[Math.floor(Math.random() * SPECTRAL.length)]; }

  function randomHemispherePos(minR, maxR) {
    var cosPhi = -Math.random();
    var sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
    var theta = Math.random() * Math.PI * 2;
    var r = minR + Math.random() * (maxR - minR);
    return [r * sinPhi * Math.cos(theta), r * sinPhi * Math.sin(theta), r * cosPhi];
  }

  // ---- 星星 ----
  function generateStars(count) {
    var pos = new Float32Array(count * 3);
    var col = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      var p = randomHemispherePos(CONFIG.zMin, CONFIG.zMax);
      pos[i * 3] = p[0]; pos[i * 3 + 1] = p[1]; pos[i * 3 + 2] = p[2];
      var spec = pickSpec();
      col[i * 3] = spec[0]; col[i * 3 + 1] = spec[1]; col[i * 3 + 2] = spec[2];
    }
    return { pos: pos, col: col };
  }

  var starGroups = [];
  function createStars() {
    starGroups.forEach(function(g) { scene.remove(g.points); g.geom.dispose(); g.mat.dispose(); });
    starGroups = [];

    CONFIG.groups.forEach(function(group) {
      var n = Math.floor(CONFIG.starCount * group.ratio);
      var data = generateStars(n);

      var geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(data.pos, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(data.col, 3));

      var mat = new THREE.PointsMaterial({
        size: group.size,
        sizeAttenuation: true,
        vertexColors: true,
        map: starTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: CONFIG.groupOpacityMin + Math.random() * (CONFIG.groupOpacityMax - CONFIG.groupOpacityMin),
      });

      var points = new THREE.Points(geom, mat);
      scene.add(points);

      var phases = new Float32Array(n);
      for (var i = 0; i < n; i++) phases[i] = Math.random() * Math.PI * 2;

      starGroups.push({
        points: points, mat: mat, geom: geom, phases: phases,
        speedMin: group.speedMin, speedMax: group.speedMax,
        twinkleAmp: group.twinkleAmp,
        baseOpacity: mat.opacity,
        baseSize: group.size,
      });
    });
  }

  // ---- 特殊色星 ----
  var specialStarGroups = [];
  function createSpecialStars() {
    specialStarGroups.forEach(function(s) { scene.remove(s.points); s.geom.dispose(); s.mat.dispose(); });
    specialStarGroups = [];
    var cfg = CONFIG.specialStars;
    if (!cfg.enabled) return;

    var count = cfg.count;
    var pos = new Float32Array(count * 3);
    var col = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      var p = randomHemispherePos(cfg.distMin, cfg.distMax);
      pos[i * 3] = p[0]; pos[i * 3 + 1] = p[1]; pos[i * 3 + 2] = p[2];
      var sc = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
      col[i * 3] = sc[0]; col[i * 3 + 1] = sc[1]; col[i * 3 + 2] = sc[2];
    }
    var geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(col, 3));
    var mat = new THREE.PointsMaterial({
      size: cfg.size, sizeAttenuation: true, vertexColors: true, map: starTex,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      opacity: cfg.opacity,
    });
    var points = new THREE.Points(geom, mat);
    scene.add(points);
    var phases = new Float32Array(count);
    for (var j = 0; j < count; j++) phases[j] = Math.random() * Math.PI * 2;
    specialStarGroups.push({
      points: points, mat: mat, geom: geom, phases: phases,
      speedMin: cfg.speedMin, speedMax: cfg.speedMax,
      twinkleAmp: cfg.twinkleAmp, baseOpacity: mat.opacity, baseSize: cfg.size,
    });
  }

  createStars();
  createSpecialStars();

  // ---- 星云 ----
  var nebulaSprites = [];
  function createNebulae() {
    nebulaSprites.forEach(function(s) { scene.remove(s); });
    nebulaSprites = [];
    var cfg = CONFIG.nebulae;
    if (!cfg.enabled) return;

    for (var i = 0; i < cfg.count; i++) {
      var nc = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
      var tex = makeNebulaTex(nc[0], nc[1], nc[2]);
      var mat = new THREE.SpriteMaterial({
        map: tex, blending: THREE.AdditiveBlending,
        depthWrite: false, transparent: true,
        opacity: cfg.opacityMin + Math.random() * (cfg.opacityMax - cfg.opacityMin),
      });
      var sprite = new THREE.Sprite(mat);
      var p = randomHemispherePos(cfg.distMin, cfg.distMax);
      sprite.position.set(p[0], p[1], p[2]);
      var sz = cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin);
      sprite.scale.set(sz, sz, 1);
      sprite.userData = {
        phase: Math.random() * Math.PI * 2,
        speed: cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin),
        baseOpacity: mat.opacity,
      };
      scene.add(sprite);
      nebulaSprites.push(sprite);
    }
  }
  createNebulae();

  // ---- 流星 & 彗星纹理 ----
  function makeMeteorTex() {
    var w = 96, h = 8, c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    var grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.15, 'rgba(255,255,255,0.05)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.25)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0.7)');
    grad.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    return new THREE.CanvasTexture(c);
  }
  var meteorTex = makeMeteorTex();

  function makeCometTex() {
    var w = 256, h = 12, c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    var grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'rgba(180,200,255,0)');
    grad.addColorStop(0.1, 'rgba(180,200,255,0.03)');
    grad.addColorStop(0.3, 'rgba(200,220,255,0.12)');
    grad.addColorStop(0.6, 'rgba(220,235,255,0.35)');
    grad.addColorStop(0.85, 'rgba(240,245,255,0.7)');
    grad.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    return new THREE.CanvasTexture(c);
  }
  var cometTex = makeCometTex();

  var meteors = [];
  var nextMeteorAt = 0;
  var nextCometAt = 0;

  function spawnMeteor(t, isComet) {
    isComet = isComet || false;
    var cfg = isComet ? CONFIG.comets : CONFIG.meteors;
    if (!cfg.enabled) return;

    var spawnDist = cfg.distMin + Math.random() * (cfg.distMax - cfg.distMin);
    var Rvis = spawnDist * Math.tan(FOV * Math.PI / 360);
    var Rext = Rvis * cfg.edgeExtend;

    var startAngle = Math.random() * Math.PI * 2;
    var cy = smoothScrollY * PARALLAX;
    var a = [Math.cos(startAngle) * Rext, Math.sin(startAngle) * Rext + cy, -spawnDist];
    var endAngle = startAngle + Math.PI + (Math.random() - 0.5) * 0.8;
    var b = [Math.cos(endAngle) * Rext, Math.sin(endAngle) * Rext + cy, -spawnDist];

    var dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
    var len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (len < 1) return;
    var nx = dx / len, ny = dy / len, nz = dz / len;

    var style = cfg.styles[Math.floor(Math.random() * cfg.styles.length)];

    var headColor = new THREE.Color(style.head[0], style.head[1], style.head[2]);
    var headMat = new THREE.SpriteMaterial({
      map: starTex, blending: THREE.AdditiveBlending,
      depthWrite: false, transparent: true, opacity: 0, color: headColor,
    });
    var head = new THREE.Sprite(headMat);
    head.position.set(a[0], a[1], a[2]);
    head.scale.set(style.headSize, style.headSize, 1);
    scene.add(head);

    var trailParts = [];

    if (isComet) {
      // ---- 单位法向量（垂直运动方向）用于侧向偏移 ----
      var perpX = -ny, perpY = nx;
      var perpLen = Math.sqrt(perpX * perpX + perpY * perpY);
      if (perpLen > 0.001) { perpX /= perpLen; perpY /= perpLen; }

      // ---- 尘埃尾：沿轨迹滞后，宽阔弧形 ----
      // 物理：尘埃受太阳辐射压，滞后于轨道形成宽弧
      var dustColor = new THREE.Color(style.dust[0], style.dust[1], style.dust[2]);
      var dtCfg = CONFIG.comets.dustTail;
      for (var di = 0; di < style.dustSegments; di++) {
        var dMat = new THREE.SpriteMaterial({
          map: cometTex, blending: THREE.AdditiveBlending,
          depthWrite: false, transparent: true, opacity: 0, color: dustColor,
        });
        var dSprite = new THREE.Sprite(dMat);
        dSprite.position.copy(head.position);
        var t = di / (style.dustSegments - 1 || 1);
        var dSz = dtCfg.baseLength * (1 - t * 0.75);
        var dW = style.dustWidth * (1 - t * 0.65);
        dSprite.scale.set(Math.max(dSz, 2), Math.max(dW, 1.5), 1);
        // 弯曲：垂直偏移随距离递增（二次），模拟轨道惯性
        var dustCurve = t * t * dtCfg.curvePower;
        var dustSideX = perpX * dustCurve;
        var dustSideY = perpY * dustCurve;
        // 每节旋转跟随实际弯曲方向
        var bendNx = nx + (perpX * dustCurve * 0.03);
        var bendNy = ny + (perpY * dustCurve * 0.03);
        dMat.rotation = Math.atan2(bendNy, bendNx);
        scene.add(dSprite);
        trailParts.push({
          sprite: dSprite, mat: dMat,
          offset: (di + 1) * dtCfg.segmentGap + style.headSize * 0.2,
          sideX: dustSideX, sideY: dustSideY, sideZ: 0
        });
      }

      // ---- 离子尾：窄蓝，递增偏移，始终在尘埃尾外侧 ----
      // 物理：离子被太阳风径直吹离，距离越远偏角越大
      var ionColor = new THREE.Color(style.ion[0], style.ion[1], style.ion[2]);
      var itCfg = CONFIG.comets.ionTail;
      // 方向偏角：朝侧向偏转，模拟太阳风
      var ionNX = nx - perpX * itCfg.directionBias * style.ionStrength;
      var ionNY = ny - perpY * itCfg.directionBias * style.ionStrength;
      var ionLen = Math.sqrt(ionNX * ionNX + ionNY * ionNY);
      if (ionLen > 0.001) { ionNX /= ionLen; ionNY /= ionLen; }
      for (var ii = 0; ii < style.ionSegments; ii++) {
        var iMat = new THREE.SpriteMaterial({
          map: cometTex, blending: THREE.AdditiveBlending,
          depthWrite: false, transparent: true, opacity: 0, color: ionColor,
        });
        var iSprite = new THREE.Sprite(iMat);
        iSprite.position.copy(head.position);
        var t2 = ii / (style.ionSegments - 1 || 1);
        var iSz = itCfg.baseLength * (1 - t2 * 0.85);
        var iW = style.ionWidth * (1 - t2 * 0.6);
        iSprite.scale.set(Math.max(iSz, 2), Math.max(iW, 1.5), 1);
        // 渐进分离：从 t=0 处贴合彗核，线性 + 二次加速度增长
        var baseSep = style.dustWidth * itCfg.sideScale * style.ionStrength;
        var ionCurve = t2 * t2 * itCfg.curvePower;
        var ionLateral = baseSep * t2 + ionCurve;  // t=0 贴头，t=1 分离最大
        var ionSideX = perpX * ionLateral;
        var ionSideY = perpY * ionLateral;
        // 微波动（正弦波纹）
        var wave = Math.sin(ii * itCfg.waveFreq) * itCfg.waveAmp * style.ionStrength;
        var waveX = perpX * wave;
        var waveY = perpY * wave;
        // 每节旋转沿离子尾方向
        iMat.rotation = Math.atan2(ionNY, ionNX);
        scene.add(iSprite);
        trailParts.push({
          sprite: iSprite, mat: iMat,
          offset: (ii + 1) * itCfg.segmentGap + style.headSize * 0.3,
          sideX: ionSideX + waveX,
          sideY: ionSideY + waveY,
          sideZ: 0
        });
      }
    } else {
      // 流星尾
      var trailColor = new THREE.Color(style.trail[0], style.trail[1], style.trail[2]);
      for (var mi = 0; mi < style.trailSegments; mi++) {
        var tMat = new THREE.SpriteMaterial({
          map: meteorTex, blending: THREE.AdditiveBlending,
          depthWrite: false, transparent: true, opacity: 0, color: trailColor,
        });
        var tSprite = new THREE.Sprite(tMat);
        tSprite.position.copy(head.position);
        var tailSz = CONFIG.meteors.trailBaseLength - mi * (CONFIG.meteors.trailBaseLength / style.trailSegments);
        var tailH = style.trailWidth - mi * (style.trailWidth / style.trailSegments);
        tSprite.scale.set(tailSz, tailH, 1);
        tMat.rotation = Math.atan2(ny, nx);
        scene.add(tSprite);
        trailParts.push({ sprite: tSprite, mat: tMat, offset: (mi + 1) * CONFIG.meteors.trailSegmentGap, sideX: 0, sideY: 0, sideZ: 0 });
      }
    }

    meteors.push({
      head: head, headMat: headMat, trails: trailParts,
      pos: new THREE.Vector3(a[0], a[1], a[2]),
      dir: new THREE.Vector3(nx, ny, nz),
      life: 0,
      maxLife: cfg.lifeMin + Math.random() * (cfg.lifeMax - cfg.lifeMin),
      speed: cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin),
      isComet: isComet,
    });
  }

  function updateMeteors(dt, t) {
    var mc = CONFIG.meteors, cc = CONFIG.comets;
    if (mc.enabled && t >= nextMeteorAt) {
      spawnMeteor(t, false);
      nextMeteorAt = t + mc.intervalMin + Math.random() * (mc.intervalMax - mc.intervalMin);
    }
    if (cc.enabled && t >= nextCometAt) {
      spawnMeteor(t, true);
      nextCometAt = t + cc.intervalMin + Math.random() * (cc.intervalMax - cc.intervalMin);
    }

    for (var i = meteors.length - 1; i >= 0; i--) {
      var m = meteors[i];
      m.life += dt;
      var p = m.life / m.maxLife;
      if (p >= 1) {
        scene.remove(m.head); m.headMat.dispose();
        m.trails.forEach(function(tr) { scene.remove(tr.sprite); tr.mat.dispose(); });
        meteors.splice(i, 1);
        continue;
      }
      var step = m.speed * dt;
      m.pos.x += m.dir.x * step; m.pos.y += m.dir.y * step; m.pos.z += m.dir.z * step;
      m.head.position.copy(m.pos);

      var cfg = m.isComet ? CONFIG.comets : CONFIG.meteors;
      var opacity;
      if (p < cfg.fadeInRatio) opacity = p / cfg.fadeInRatio;
      else if (p > 1 - cfg.fadeOutRatio) opacity = (1 - p) / cfg.fadeOutRatio;
      else opacity = 1;
      m.headMat.opacity = opacity * (m.isComet ? 0.92 : 0.88);

      m.trails.forEach(function(tr) {
        tr.sprite.position.set(
          m.pos.x - m.dir.x * tr.offset + (tr.sideX || 0),
          m.pos.y - m.dir.y * tr.offset + (tr.sideY || 0),
          m.pos.z - m.dir.z * tr.offset + (tr.sideZ || 0)
        );
        tr.mat.opacity = opacity * 0.7;
      });
    }
  }

  // ---- 视差 & resize ----
  var targetScrollY = 0, smoothScrollY = 0;
  window.addEventListener('scroll', function() {
    targetScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  }, { passive: true });

  window.addEventListener('resize', function() {
    createStars(); createSpecialStars(); createNebulae();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  // ---- 动画 ----
  var startTime = performance.now();
  var lastFrame = startTime;

  function animate(now) {
    requestAnimationFrame(animate);

    var dt = Math.min((now - lastFrame) / 1000, 0.1);
    lastFrame = now;

    var diff = targetScrollY - smoothScrollY;
    if (Math.abs(diff) < 0.5) smoothScrollY = targetScrollY;
    else smoothScrollY += diff * 0.10;

    var camY = smoothScrollY * PARALLAX;
    camera.position.y = camY;
    camera.lookAt(0, camY, -1);

    // 双轴自转
    var mot = CONFIG.motion;
    scene.rotation.y += mot.rotationY;
    scene.rotation.z += mot.rotationZ;

    var t = (performance.now() - startTime) / 1000;
    var breath = 1.0 + mot.breathAmp * Math.sin(t * mot.breathSpeed);

    function updateGroup(g, gi) {
      var wave = Math.sin(t * g.speedMin + gi * 1.7 + g.phases[0]);
      var minB = 1.0 - g.twinkleAmp;
      var brightness = minB + g.twinkleAmp * (0.5 + 0.5 * wave);
      brightness = Math.max(CONFIG.twinkleMinBrightness, brightness);
      g.mat.opacity = g.baseOpacity * brightness;
      if (g.twinkleAmp > mot.breathThreshold) {
        g.mat.size = g.baseSize * breath;
      }
    }

    starGroups.forEach(updateGroup);
    specialStarGroups.forEach(function(g) { updateGroup(g, 0); });

    nebulaSprites.forEach(function(s) {
      var nc = CONFIG.nebulae;
      var pulse = (1 - nc.pulseAmp) + nc.pulseAmp * (0.5 + 0.5 * Math.sin(t * s.userData.speed + s.userData.phase));
      s.material.opacity = s.userData.baseOpacity * pulse;
      s.material.rotation += nc.rotationSpeed;
    });

    updateMeteors(dt, t);
    renderer.render(scene, camera);
  }
  animate(startTime);
})();
