export const POSITION = {
    right_top: 'right_top',
    right_bottom: 'right_bottom',
    left_top: 'left_top',
    left_bottom: 'left_bottom',
    top_right: 'top_right',
    top_left: 'top_left',
    bottom_right: 'bottom_right',
    bottom_left: 'bottom_left',
    video_right_top: 'video_right_top',
    video_right_bottom: 'video_right_bottom',
};

export const SETTING = {
    storeKey: 'KS_VIDEO_ZOOM',
    zoomEnable: 1,
    zoomRate: 2,
    zoomSize: 200,
    autoSize: 1,
    autoPosition: 1,
    zoomPosition: 'right_top',
    disabledPath: '',
};

export const DASHBOARD = {
    // 开发模式
    isDev: false,
    // 元素索引
    el: null,
    elWorkSpace: null,
    elHotZone: null,
    elShadowVideo: null,
    elShadowVideoBox: null,
    elActiveVideo: null,
    elActiveVideoSrc: null,
    // 用户配置
    zoomEnable: true,
    zoomRate: 1, // 放大倍率
    autoSize: true,
    zoomSize: 300,
    minSize: 200,
    maxSize: 500,
    focusCenter: false, // 聚焦中心点
    disabledPath: '',
    zoomPosition: POSITION.right_top, // [位置-对齐]
    autoPosition: true,
    // 衍生影像配置
    shadowVideoWidth: 0 * 2,
    shadowVideoHeight: 0 * 2,
    shadowVideoBoxWidth: 0,
    shadowVideoBoxHeight: 0,
    // 衍生热区配置
    hotZoneWidth: 0,
    hotZoneHeight: 0,
    hotZoneOffsetX: 0,
    hotZoneOffsetY: 0,
    hotZoneScreenX: 0,
    hotZoneScreenY: 0,
    // 鼠标实时信息
    mouseScreenX: 0,
    mouseScreenY: 0,
    mouseOffsetX: 0,
    mouseOffsetY: 0,
    // 目标视频信息
    activeVideoScreenX: 0,
    activeVideoScreenY: 0,
    activeVideoWidth: 0,
    activeVideoHeight: 0,
    // 状态统计信息
    activeVideo: false,
    videoCount: 0,
};
