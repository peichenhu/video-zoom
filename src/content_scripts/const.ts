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
    uuid: 'KS_VIDEO_ZOOM',
    zIndex: 9999,
    zoomEnable: true,
    zoomRate: 2,
    zoomSize: 250,
    autoSize: true,
    autoPosition: true,
    focusCenter: false,
    supportFullscreen: true,
    zoomPosition: 'right_top',
    disabledHostList: [
        {
            edit: false,
            name: 'KAP ADX 审核',
            path: '/audit/auditReview?bizId=400000802&queueId=600001789;',
        },
        {
            edit: false,
            name: '元素 5.0 审核',
            path: '/frontend/commercial/index.html#/commercial/superFrame/audit5/auditReview;',
        },
    ],
};

export const DASHBOARD = {
    // 用户配置
    ...JSON.parse(JSON.stringify(SETTING)),
    // 衍生配置
    elWorkspaceId: `${SETTING.uuid}_WORKSPACE`,
    elHotZoneId: `${SETTING.uuid}_HOT_ZONE`,
    elShadowBoxId: `${SETTING.uuid}_SHADOW_BOX`,
    elShadowVideoId: `${SETTING.uuid}_SHADOW_VIDEO`,
    // 基础配置
    isDev: false,
    isFullscreen: false,
    minSize: 200,
    maxSize: 500,
    // 元素索引
    el: null,
    elWorkspace: null,
    elHotZone: null,
    elShadowVideo: null,
    elShadowVideoBox: null,
    elActiveVideo: null,
    elActiveVideoSrc: null,
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
