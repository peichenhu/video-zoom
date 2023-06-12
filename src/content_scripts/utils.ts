import { DASHBOARD, POSITION, SETTING } from './const';
/**
 * 图片加载
 * @param src 图片地址
 * @param callback 结果回调
 */
export function loadImg(src: string, callback: any): void {
    const imgIns = new Image(); // 图片安全加载
    imgIns.src = src;
    imgIns.onload = () => callback(imgIns);
    imgIns.onerror = () => callback(false);
    imgIns.onabort = () => callback(false);
}
/**
 * 元素设置样式
 * @param el 目标元素
 * @param styleMap 样式配置表
 */
export function addStyle(el: any, styleMap = {}) {
    for (const [key, value] of Object.entries(styleMap)) {
        el.style[key] = value;
    }
}
/**
 * 偏移与倍率方程式
 * @param a 长度A
 * @param b 长度B
 * @param rate 长度A与长度B之间的倍率
 * @returns 满足倍率的场景下长度A和长度B的偏移量
 */
export function mathOffset(a: number, b: number, rate: number) {
    return (rate * a - b) / (1 + rate);
}
/**
 * 状态大盘
 * @param dashboard 状态表
 */
export function createDashboard(dashboard: any): void {
    if (!dashboard.isDev) {
        return;
    }
    const id = 'ks-cqc-fe-audit-dashboard';
    let el = document.getElementById(id);
    if (el) {
        dashboard.el = el;
        return;
    }
    el = document.createElement('div');
    el.id = id;
    addStyle(el, {
        position: 'fixed',
        top: '0px',
        left: '0px',
        padding: '0 5px',
        background: 'rgba(255, 0, 0, 1)',
        color: 'white',
        height: '30px',
        width: '100%',
        textAlign: 'center',
        lineHeight: '30px',
        fontSize: '12px',
    });
    dashboard.el = el;
    document.body.appendChild(el);
}
/**
 * 计算一个完美的放大镜尺寸
 * @param vw 视频宽度
 * @param dashboard 配置表
 */
export function setPerfectHotZoneSize(vw: number, vh: number, dashboard: Record<string, any>) {
    const { autoSize, zoomRate, zoomSize, maxSize } = dashboard;
    let size = Math.min(vw, zoomSize);
    if (autoSize) {
        size = Math.min(vw, vh);
    }
    const shadowVideoBoxSize = Math.min(maxSize, size + mathOffset(size, size, zoomRate));
    const hotZoneSize = shadowVideoBoxSize / zoomRate;
    dashboard.shadowVideoBoxWidth = +shadowVideoBoxSize.toFixed(0);
    dashboard.shadowVideoBoxHeight = +shadowVideoBoxSize.toFixed(0);
    dashboard.hotZoneWidth = +hotZoneSize.toFixed(0);
    dashboard.hotZoneHeight = +hotZoneSize.toFixed(0);
}
/**
 * 更新监控大盘
 * @param dashboard 配置表
 */
export function updateDashboard(dashboard: any): void {
    if (!dashboard.isDev) {
        return;
    }
    const infoList = [];
    for (const [key, value] of Object.entries(dashboard)) {
        if (!key.startsWith('el')) {
            infoList.push(`${key} : ${value}`);
        }
    }
    dashboard.el.innerText = infoList.join(' | ');
}
/**
 * 计算画板绘制视频的坐标
 * @param canvasWidth 画板宽度
 * @param canvasHeight 画板高度
 * @param mediaWidth 视频宽度
 * @param mediaHeight 视频高度
 * @returns dx, dy, dw, dh
 */
export function computedDrawPosition(canvasWidth: number, canvasHeight: number, mediaWidth: number, mediaHeight: number) {
    const canvasRatio = canvasWidth / canvasHeight;
    const mediaRatio = mediaWidth / mediaHeight;
    if (canvasRatio > mediaRatio) {
        const dh = canvasHeight;
        const dw = dh * mediaRatio;
        const dx = (canvasWidth - dw) / 2;
        const dy = 0;
        return { dx, dy, dw, dh };
    } else if (canvasRatio < mediaRatio) {
        const dw = canvasWidth;
        const dh = dw / mediaRatio;
        const dx = 0;
        const dy = (canvasHeight - dh) / 2;
        return { dx, dy, dw, dh };
    }
    return { dx: 0, dy: 0, dw: canvasWidth, dh: canvasHeight };
}
/**
 * 创建放大镜工作空间
 * @param dashboard 配置表
 * @param elVideo 存在就在视频元素节点平级创建工作空间
 */
export function createWorkspace(dashboard: Record<string, any>, elVideo?: HTMLVideoElement) {
    const elWorkspace = document.getElementById(dashboard.elWorkspaceId);
    if (!elWorkspace) {
        const elWorkspace = document.createElement('div');
        const elHotZone = document.createElement('div');
        const elShadowBox = document.createElement('div');
        const elShadowVideo = document.createElement('canvas');
        elWorkspace.id = dashboard.elWorkspaceId;
        elHotZone.id = dashboard.elHotZoneId;
        elShadowBox.id = dashboard.elShadowBoxId;
        elShadowVideo.id = dashboard.elShadowVideoId;
        elWorkspace.appendChild(elHotZone);
        elWorkspace.appendChild(elShadowBox);
        elShadowBox.appendChild(elShadowVideo);
        addStyle(elWorkspace, {
            position: 'relative',
            zIndex: dashboard.zIndex,
        });
        addStyle(elHotZone, {
            position: 'fixed',
            top: '-1000px',
            left: '1000px',
            width: dashboard.hotZoneWidth + 'px',
            height: dashboard.hotZoneHeight + 'px',
            background: 'rgba(0, 0, 0, 0.2)',
            zIndex: dashboard.zIndex,
            pointerEvents: 'none',
            opacity: 0,
            boxSizing: 'border-box',
        });
        addStyle(elShadowBox, {
            position: 'fixed',
            top: '-1000px',
            left: '1000px',
            width: dashboard.shadowVideoBoxHeight + 'px',
            height: dashboard.shadowVideoBoxHeight + 'px',
            background: 'rgba(0, 0, 255, 0.2)',
            zIndex: dashboard.zIndex,
            pointerEvents: 'none',
            opacity: 0,
            overflow: 'hidden',
            border: '1px dashed #ff5000',
            boxSizing: 'border-box',
        });
        const cw = dashboard.activeVideoWidth;
        const ch = dashboard.activeVideoHeight;
        elShadowVideo.width = cw;
        elShadowVideo.height = ch;
        addStyle(elShadowVideo, {
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: cw + 'px',
            height: ch + 'px',
            pointerEvents: 'none',
            background: 'black',
            boxSizing: 'border-box',
        });
        dashboard.elWorkspace = elWorkspace;
        dashboard.elHotZone = elHotZone;
        dashboard.elShadowVideoBox = elShadowBox;
        dashboard.elShadowVideo = elShadowVideo;
        if (elVideo && elVideo.parentNode) {
            elVideo.parentNode.appendChild(elWorkspace);
        } else if (!elVideo) {
            document.body.appendChild(elWorkspace);
        }
    }
}
/**
 * 更新热区放大影像图像
 * @param dashboard 配置表
 * @returns void
 */
export function updateShadowVideo(dashboard: any): void {
    const { elActiveVideo: video, elShadowVideo: canvas } = dashboard;
    const { activeVideoWidth: vw, activeVideoHeight: vh, zoomRate } = dashboard;
    if (!video || !canvas) {
        return;
    }
    canvas.width = vw * zoomRate;
    canvas.height = vh * zoomRate;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    const ctx = canvas.getContext('2d');
    const { width: cw, height: ch } = canvas;

    if (video.currentTime === 0 && video.poster) {
        loadImg(video.poster, (img: { width: number; height: number }) => {
            // 根据 Contain 布局计算出来有效画布
            const { dx, dy, dw, dh } = computedDrawPosition(cw, ch, img.width, img.height);
            img && ctx.drawImage(img, dx, dy, dw, dh);
        });
    } else {
        const { videoWidth: vw, videoHeight: vh } = video;
        const { dx, dy, dw, dh } = computedDrawPosition(cw, ch, vw, vh);
        ctx.drawImage(video, dx, dy, dw, dh);
    }
    dashboard.shadowVideoWidth = cw;
    dashboard.shadowVideoHeight = ch;
}
/**
 * 设置热区放大影像偏移位置
 * @param dashboard 配置表
 */
export function setShadowVideoOffset(dashboard: any): void {
    const { activeVideoWidth, activeVideoHeight } = dashboard;
    const { shadowVideoWidth, shadowVideoHeight } = dashboard;
    const { hotZoneOffsetX, hotZoneOffsetY } = dashboard;
    const shadowVideoOffsetX = (hotZoneOffsetX / activeVideoWidth) * shadowVideoWidth * -1;
    const shadowVideoOffsetY = (hotZoneOffsetY / activeVideoHeight) * shadowVideoHeight * -1;
    if (dashboard.elShadowVideo) {
        dashboard.elShadowVideo.style.top = shadowVideoOffsetY + 'px';
        dashboard.elShadowVideo.style.left = shadowVideoOffsetX + 'px';
    }
}
/**
 * 设置热区位置
 * @param dashboard 配置表
 */
export function setHotZonePosition(dashboard: any): void {
    const { hotZoneHeight, hotZoneWidth } = dashboard;
    const vh = dashboard.activeVideoHeight;
    const vw = dashboard.activeVideoWidth;
    let y = dashboard.mouseOffsetY; // 上中心点
    if (dashboard.focusCenter) {
        y = dashboard.mouseOffsetY - hotZoneHeight / 2; // 中心点
    }
    let x = dashboard.mouseOffsetX - hotZoneWidth / 2; // 中心点
    y = Math.max(0, y); // 上限
    x = Math.max(0, x); // 上限
    y = Math.min(vh - hotZoneHeight, y); // 下限
    x = Math.min(vw - hotZoneWidth, x); // 下限
    y = dashboard.activeVideoScreenY + y; // 偏移量
    x = dashboard.activeVideoScreenX + x; // 偏移量
    if (dashboard.elHotZone) {
        dashboard.elHotZone.style.width = hotZoneWidth + 'px';
        dashboard.elHotZone.style.height = hotZoneHeight + 'px';
        dashboard.elHotZone.style.top = y + 'px';
        dashboard.elHotZone.style.left = x + 'px';
    }
    if (dashboard.elShadowVideoBox) {
        dashboard.elShadowVideoBox.style.width = dashboard.shadowVideoBoxWidth + 'px';
        dashboard.elShadowVideoBox.style.height = dashboard.shadowVideoBoxHeight + 'px';
        dashboard.elShadowVideoBox.style.top = y + 'px';
        dashboard.elShadowVideoBox.style.left = x + hotZoneWidth + 'px';
    }
    // 留痕
    dashboard.hotZoneScreenX = x;
    dashboard.hotZoneScreenY = y;
    dashboard.hotZoneOffsetX = x - dashboard.activeVideoScreenX;
    dashboard.hotZoneOffsetY = y - dashboard.activeVideoScreenY;
}
/**
 * 设置一个完美的排版
 * @param dashboard 配置表
 */
export function setPerfectPosition(dashboard: Record<string, any>): void {
    const { innerWidth: sw, innerHeight: sh } = window;
    const { hotZoneWidth: size, shadowVideoBoxWidth: boxSize } = dashboard;
    const { hotZoneScreenX: left, hotZoneScreenY: top } = dashboard;
    const { activeVideoScreenX: vx, activeVideoScreenY: vy } = dashboard;
    const { activeVideoWidth: vw, activeVideoHeight: vh } = dashboard;
    const right = sw - left - size;
    const bottom = sh - top - size;
    // console.log({ right, left, top, bottom });
    const enums: Record<keyof typeof POSITION, any> = { ...POSITION };
    // 排版枚举
    enums.right_top = [POSITION.right_top, top, left + size];
    enums.right_bottom = [POSITION.right_bottom, top - (boxSize - size), left + size];
    enums.bottom_left = [POSITION.bottom_left, top + size, left];
    enums.bottom_right = [POSITION.bottom_right, top + size, left - (boxSize - size)];
    enums.left_top = [POSITION.left_top, top, left - boxSize];
    enums.left_bottom = [POSITION.left_bottom, top - (boxSize - size), left - boxSize];
    enums.top_left = [POSITION.top_left, top - boxSize, left];
    enums.top_right = [POSITION.top_right, top - boxSize, left - (boxSize - size)];
    enums.video_right_top = [POSITION.video_right_top, vy, vx + vw];
    enums.video_right_bottom = [POSITION.video_right_bottom, vy + vh - boxSize, vx + vw];
    // 设置排版
    function setPosition(position: string, top: number, left: number) {
        dashboard.zoomPosition = position;
        if (dashboard.elShadowVideoBox) {
            dashboard.elShadowVideoBox.style.top = top + 'px';
            dashboard.elShadowVideoBox.style.left = left + 'px';
        }
    }
    // 非自动排版
    if (!dashboard.autoPosition) {
        const position: keyof typeof POSITION = dashboard.zoomPosition;
        const list: [string, number, number] = enums[position];
        return setPosition(...list);
    }
    // 自动排版
    if (right > boxSize && bottom + size >= boxSize) {
        return setPosition(...(enums.right_top as [string, number, number]));
    }
    if (right > boxSize && bottom + size < boxSize) {
        return setPosition(...(enums.right_bottom as [string, number, number]));
    }
    if (bottom > boxSize && right + size >= boxSize) {
        return setPosition(...(enums.bottom_left as [string, number, number]));
    }
    if (bottom > boxSize && right + size < boxSize) {
        return setPosition(...(enums.bottom_right as [string, number, number]));
    }
    if (left > boxSize && bottom + size >= boxSize) {
        return setPosition(...(enums.left_top as [string, number, number]));
    }
    if (left > boxSize && bottom + size < boxSize) {
        return setPosition(...(enums.left_bottom as [string, number, number]));
    }
    if (top > boxSize && right + size >= boxSize) {
        return setPosition(...(enums.top_left as [string, number, number]));
    }
    if (top > boxSize && right + size < boxSize) {
        return setPosition(...(enums.top_right as [string, number, number]));
    }
}

export const setItem = async function (key: string, value: any) {
    // @ts-ignore
    if (chrome.storage && chrome.storage.local) {
        // @ts-ignore
        return chrome.storage.local.set({ [key]: value });
    }
    return localStorage.setItem(key, value);
};

export async function getItem(key: string) {
    // @ts-ignore
    if (chrome.storage && chrome.storage.local) {
        // @ts-ignore
        const result = await chrome.storage.local.get([key]);
        return result[key];
    }
    return localStorage.getItem(key);
}

export async function storeSetting() {
    try {
        const storeStr = await getItem('KS_VIDEO_ZOOM');
        const storeSetting = storeStr ? JSON.parse(storeStr) : {};
        return storeSetting;
    } catch (error) {
        // console.error('storeSetting', error);
        return { ...SETTING };
    }
}
/**
 * 同步用户配置
 * @param dashboard 配置表
 */
export async function applyUserSetting(dashboard: typeof DASHBOARD) {
    const userSetting = await storeSetting();
    if (dashboard.supportFullscreen !== userSetting.supportFullscreen) {
        removeWorkspace(dashboard);
    }
    Object.assign(dashboard, {
        ...userSetting,
        elWorkspaceId: `${userSetting.uuid}_WORKSPACE`,
        elHotZoneId: `${userSetting.uuid}_HOT_ZONE`,
        elShadowBoxId: `${userSetting.uuid}_SHADOW_BOX`,
        elShadowVideoId: `${userSetting.uuid}_SHADOW_VIDEO`,
    });
}
/**
 * 删除工作空间
 */
export function removeWorkspace(dashboard: typeof DASHBOARD) {
    let el = document.getElementById(dashboard.elWorkspaceId);
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
    el = null;
}

export default {
    // 导出模块
    loadImg,
    addStyle,
    mathOffset,
    createDashboard,
    updateDashboard,
    setPerfectHotZoneSize,
    computedDrawPosition,
    updateShadowVideo,
    createWorkspace,
};
