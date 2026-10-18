/* 播放配置 */
window.MOMO_CONFIG = {
  PLAY_BASE: "",   // ← 占位：现在为空 = 还没有接入视频，点“播放”只会弹出温柔提示

  // 拼出某一集的播放地址；PLAY_BASE 或该集 path 为空时返回 null（= 还在路上）
  buildPlayUrl: function (show, group, ep) {
    if (!this.PLAY_BASE || !ep || !ep.path) return null;
    var base = this.PLAY_BASE.replace(/\/+$/, "");
    var path = String(ep.path).replace(/^\/+/, "");
    return base + "/" + path.split("/").map(encodeURIComponent).join("/");
  },

  // 孩子看到的温柔提示
  COMING_TEXT: "这集还在路上～"
};
