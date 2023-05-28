import {
    createDashboard,
    setPerfectHotZoneSize,
    updateDashboard,
    createWorkspace,
    updateShadowVideo,
    setHotZonePosition,
    setShadowVideoOffset,
    setPerfectPosition,
    applyUserSetting,
} from './utils';

import { DASHBOARD } from './const';

const dashboard: Record<keyof typeof DASHBOARD, any> = { ...DASHBOARD };

export async function initZoom() {
    await applyUserSetting(dashboard);
    // 查找视频
    const videoList = document.querySelectorAll('video');
    if (videoList && videoList.length) {
        const addVideoListener = function (videoEl: HTMLVideoElement) {
            videoEl.dataset.zoom = 'ks-cqc-fe-audit';
            videoEl.addEventListener('mousemove', e => videoMove(e, dashboard));
            videoEl.addEventListener('mouseenter', e => videoEnter(e, dashboard));
            videoEl.addEventListener('mouseleave', e => videoLeave(e, dashboard));
            videoEl.addEventListener('mouseout', e => videoLeave(e, dashboard));
            videoEl.addEventListener('play', e => videoLeave(e, dashboard));
            videoEl.addEventListener('playing', e => videoLeave(e, dashboard));
            videoEl.addEventListener('rezise', e => videoLeave(e, dashboard));
        };
        createDashboard(dashboard);
        dashboard.videoCount = [...videoList].length;
        const noZoomVideoList = [...videoList].filter(el => el.dataset.zoom !== 'ks-cqc-fe-audit');
        noZoomVideoList.forEach(addVideoListener);
        window.addEventListener('scroll', e => videoLeave(e, dashboard));
        window.addEventListener('wheel', e => videoLeave(e, dashboard));
        document.addEventListener('fullscreenchange', e => videoLeave(e, dashboard));
    }
}

export function videoMove(e: any, dashboard: any) {
    const { paused = true } = dashboard.elActiveVideo || {};
    if (!paused) {
        return;
    }
    if (dashboard.activeVideo === false) {
        videoEnter(e, dashboard);
    }
    dashboard.mouseScreenX = e.x;
    dashboard.mouseScreenY = e.y;
    dashboard.mouseOffsetX = e.offsetX;
    dashboard.mouseOffsetY = e.offsetY;
    updateDashboard(dashboard);
    setHotZonePosition(dashboard);
    setShadowVideoOffset(dashboard);
    setPerfectPosition(dashboard);
}

export async function videoEnter(e: any, dashboard: any) {
    await applyUserSetting(dashboard);
    if (!dashboard.zoomEnable) {
        return;
    }
    const elVideo = e.target;
    const { paused } = elVideo;
    if (!paused) {
        return;
    }
    createWorkspace(dashboard, elVideo);
    const rect = elVideo.getBoundingClientRect();
    dashboard.elActiveVideo = elVideo;
    dashboard.activeVideoWidth = rect.width;
    dashboard.activeVideoHeight = rect.height;
    dashboard.activeVideoScreenX = rect.x;
    dashboard.activeVideoScreenY = rect.y;
    dashboard.activeVideo = true;
    if (dashboard.elHotZone) {
        dashboard.elHotZone.style.opacity = 1;
    }
    if (dashboard.elShadowVideoBox) {
        dashboard.elShadowVideoBox.style.opacity = 1;
    }
    setPerfectHotZoneSize(rect.width, rect.height, dashboard);
    updateDashboard(dashboard);
    updateShadowVideo(dashboard);
}

export function videoLeave(_e: any, dashboard: any) {
    if (dashboard.elActiveVideo && dashboard.elWorkSpace) {
        const video = dashboard.elActiveVideo as HTMLVideoElement;
        if (video.parentNode && video.parentNode.contains(dashboard.elWorkSpace)) {
            video.parentNode?.removeChild(dashboard.elWorkSpace);
        }
    }
    dashboard.elActiveVideo;
    dashboard.elActiveVideo = null;
    dashboard.activeVideoWidth = 0;
    dashboard.activeVideoHeight = 0;
    dashboard.activeVideoScreenX = 0;
    dashboard.activeVideoScreenX = 0;
    dashboard.mouseOffsetX = 0;
    dashboard.mouseOffsetY = 0;
    if (dashboard.elHotZone) {
        dashboard.elHotZone.style.opacity = 0;
    }
    if (dashboard.elShadowVideoBox) {
        dashboard.elShadowVideoBox.style.opacity = 0;
    }
    dashboard.activeVideo = false;
    updateDashboard(dashboard);
}
