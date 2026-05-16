/**
 * Page Transitions · EchoesFromShell
 *
 * 给不支持 CSS View Transitions 的浏览器（Firefox/Safari）
 * 提供内容淡出 -> 导航 -> 内容淡入的效果
 *
 * View Transitions (Chrome 117+) 有原生 @view-transition CSS 处理
 * 此脚本只作为 fallback
 */
(function() {
  'use strict';

  // 如果浏览器已经原生支持 View Transitions，直接跳过
  if (document.startViewTransition) return;

  var FADE_MS = 180;

  // 是否正在过渡中
  var transitioning = false;

  // 创建覆盖遮罩（极简，和背景同色）
  var overlay = document.createElement('div');
  overlay.id = 'pt-overlay';
  overlay.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'width: 100%',
    'height: 100%',
    'background: #070810',
    'z-index: 9998',
    'opacity: 0',
    'pointer-events: none',
    'transition: opacity ' + FADE_MS + 'ms ease',
  ].join(';') + ';';
  document.body.appendChild(overlay);

  // 监听所有内部链接
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a[href]');
    if (!a || transitioning) return;

    var href = a.getAttribute('href');
    if (!href ||
        href.startsWith('#') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('http:') ||
        href.startsWith('https:') ||
        a.getAttribute('target') ||
        a.getAttribute('download')) return;

    // 只处理同源链接
    try {
      var u = new URL(href, window.location.origin);
      if (u.origin !== window.location.origin) return;
      href = u.pathname + u.search + u.hash;
    } catch(_) { return; }

    // 同一页不处理
    var current = window.location.pathname + window.location.search;
    if (href === current) return;

    e.preventDefault();
    transitioning = true;

    // 淡出内容
    overlay.style.opacity = '1';

    setTimeout(function() {
      window.location.href = href;
      // 注：页面卸载后 overlay 消失，新页面加载后 html bg 是黑的
      // 所以不会闪白，只会闪一帧黑（比白好一万倍）
    }, FADE_MS + 20);
  }, true);

})();
