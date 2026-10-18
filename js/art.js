/* 自绘卡通插图（SVG），不使用任何官方海报/剧照/视频帧；角色为简化的原创风格 */
(function () {
  var A = {};

  A.cloud = function (w, cls) {
    return '<svg class="cloud ' + (cls || '') + '" width="' + w + '" viewBox="0 0 120 60" aria-hidden="true">' +
      '<path d="M25 52a20 20 0 0 1 2-40 26 26 0 0 1 49-6 22 22 0 0 1 30 24 15 15 0 0 1-4 22z" fill="#fff"/></svg>';
  };

  A.sun = function (w) {
    var rays = '';
    for (var i = 0; i < 8; i++) {
      rays += '<rect x="47" y="2" width="6" height="16" rx="3" fill="#FFC93C" transform="rotate(' + (i * 45) + ' 50 50)"/>';
    }
    return '<svg class="sun" width="' + w + '" viewBox="0 0 100 100" aria-hidden="true">' + rays +
      '<circle cx="50" cy="50" r="22" fill="#FFD95A"/><circle cx="43" cy="47" r="2.6" fill="#7a4b1e"/><circle cx="57" cy="47" r="2.6" fill="#7a4b1e"/>' +
      '<path d="M43 55q7 7 14 0" stroke="#7a4b1e" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>';
  };

  A.star = function (w, color) {
    return '<svg class="star" width="' + w + '" viewBox="0 0 50 50" aria-hidden="true"><path d="M25 3l6.5 14.5L47 19l-11.5 10.5L38.5 45 25 37l-13.500 8 3-15.500L3 19l15.500-1.500z" fill="' + (color || '#FFD95A') + '" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
  };

  /* 简化的粉色小猪（正面圆脸，原创画法） */
  A.pig = function (w, cls) {
    return '<svg class="mascot ' + (cls || '') + '" width="' + w + '" viewBox="0 0 200 210" aria-hidden="true">' +
      '<path d="M60 150l-14 52h108l-14-52z" fill="#FF6B6B"/>' +
      '<rect x="84" y="140" width="32" height="18" rx="8" fill="#FF9FC0"/>' +
      '<path d="M44 52Q36 20 70 30l14 20z" fill="#FF8FB8"/><path d="M156 52Q164 20 130 30l-14 20z" fill="#FF8FB8"/>' +
      '<circle cx="100" cy="100" r="68" fill="#FFB6D0"/>' +
      '<circle cx="62" cy="116" r="12" fill="#FF8FA8" opacity=".55"/><circle cx="138" cy="116" r="12" fill="#FF8FA8" opacity=".55"/>' +
      '<circle cx="74" cy="84" r="9" fill="#fff"/><circle cx="126" cy="84" r="9" fill="#fff"/>' +
      '<circle cx="76" cy="86" r="5.500" fill="#3b2a2a"/><circle cx="124" cy="86" r="5.500" fill="#3b2a2a"/>' +
      '<circle cx="78" cy="83.500" r="1.800" fill="#fff"/><circle cx="126" cy="83.500" r="1.800" fill="#fff"/>' +
      '<ellipse cx="100" cy="116" rx="26" ry="19" fill="#FF8FB8"/>' +
      '<ellipse cx="91" cy="116" rx="4" ry="6.500" fill="#C85C86"/><ellipse cx="109" cy="116" rx="4" ry="6.500" fill="#C85C86"/>' +
      '<path d="M84 142q16 12 32 0" stroke="#C85C86" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';
  };

  /* 简化的银红光之英雄（原创简化画法，不复刻任何具体角色） */
  A.hero = function (w, cls) {
    return '<svg class="mascot ' + (cls || '') + '" width="' + w + '" viewBox="0 0 200 230" aria-hidden="true">' +
      '<path d="M58 118L30 70" stroke="#E9EEF6" stroke-width="20" stroke-linecap="round"/><circle cx="28" cy="66" r="12" fill="#F2564D"/>' +
      '<path d="M142 118L170 70" stroke="#E9EEF6" stroke-width="20" stroke-linecap="round"/><circle cx="172" cy="66" r="12" fill="#F2564D"/>' +
      '<rect x="60" y="112" width="80" height="78" rx="30" fill="#F2564D"/>' +
      '<path d="M60 128q40 22 80 0" stroke="#E9EEF6" stroke-width="12" fill="none"/>' +
      '<circle cx="100" cy="150" r="14" fill="#7FE0FF" stroke="#fff" stroke-width="4"/>' +
      '<rect x="68" y="186" width="26" height="34" rx="12" fill="#E9EEF6"/><rect x="106" y="186" width="26" height="34" rx="12" fill="#E9EEF6"/>' +
      '<path d="M100 8q-14 8-12 26h24q2-18-12-26z" fill="#CBD6E4"/>' +
      '<ellipse cx="100" cy="68" rx="52" ry="56" fill="#F3F6FB"/>' +
      '<path d="M100 14v34" stroke="#CBD6E4" stroke-width="6" stroke-linecap="round"/>' +
      '<ellipse cx="78" cy="70" rx="14" ry="19" fill="#FFF07A" stroke="#fff" stroke-width="3" transform="rotate(12 78 70)"/>' +
      '<ellipse cx="122" cy="70" rx="14" ry="19" fill="#FFF07A" stroke="#fff" stroke-width="3" transform="rotate(-12 122 70)"/>' +
      '<circle cx="82" cy="66" r="4" fill="#fff"/><circle cx="118" cy="66" r="4" fill="#fff"/>' +
      '<path d="M86 100q14 10 28 0" stroke="#B5C2D3" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<circle cx="62" cy="92" r="8" fill="#FFB6C8" opacity=".6"/><circle cx="138" cy="92" r="8" fill="#FFB6C8" opacity=".6"/></svg>';
  };

  A.truck = function (w) {
    return '<svg class="truck" width="' + w + '" viewBox="0 0 160 100" aria-hidden="true">' +
      '<rect x="8" y="26" width="86" height="44" rx="10" fill="#FFC93C"/><path d="M94 40h30l22 20v10H94z" fill="#7FD1FF"/>' +
      '<rect x="104" y="46" width="18" height="12" rx="3" fill="#fff"/>' +
      '<circle cx="42" cy="74" r="14" fill="#6b5a4a"/><circle cx="42" cy="74" r="6" fill="#ddd"/>' +
      '<circle cx="120" cy="74" r="14" fill="#6b5a4a"/><circle cx="120" cy="74" r="6" fill="#ddd"/>' +
      '<path d="M34 46q8-10 16 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';
  };

  A.forShow = function (id, w, cls) { return id === 'peppa' ? A.pig(w, cls) : A.hero(w, cls); };
  window.MomoArt = A;
})();
