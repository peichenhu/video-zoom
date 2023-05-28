// 变量方法声明
const SETTING = {
    storeKey: 'KS_VIDEO_ZOOM',
    zoomEnable: 1,
    zoomRate: 2,
    zoomSize: 200,
    autoSize: 1,
    autoPosition: 1,
    focusCenter: 0,
    zoomPosition: 'right_top',
    disabledPath:
        '/audit/auditReview?bizId=400000802&queueId=600001789;/frontend/commercial/index.html#/commercial/superFrame/audit5/auditReview;',
};

const addListener = function (key, callback) {
    const el = document.querySelector(`.item *[name="${key}"]`);
    const elText = document.querySelector(`.setting div[title="${key}"]`);
    el?.addEventListener('change', callback);
    return [el, elText];
};

const setItem = async function (key, value) {
    if (chrome.storage && chrome.storage.local) {
        return chrome.storage.local.set({ [key]: value });
    }
    return localStorage.setItem(key, value);
};

const getItem = async function (key) {
    if (chrome.storage && chrome.storage.local) {
        const result = await chrome.storage.local.get([key]);
        return result[key];
    }
    return localStorage.getItem(key);
};
// 配置监听
if (chrome.storage && chrome.storage.local) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            console.log('视频帧放大镜配置更新', key);
            key === SETTING.storeKey && localStorage.setItem(key, newValue);
            initSetting();
        }
    });
}
// 鼠标位置 focusCenter
const [elFocusCenter, elFocusCenterText] = addListener('focusCenter', e => {
    SETTING.focusCenter = Number(e.target.value);
    update();
});
// 元素绑定
const [elZoomEnable, elZoomEnableText] = addListener('zoomEnable', e => {
    SETTING.zoomEnable = e.target.checked ? 1 : 0;
    update();
});
const [elZoomRate, elZoomRateText] = addListener('zoomRate', e => {
    SETTING.zoomRate = Number(e.target?.value);
    update();
});
const [elZoomSize, elZoomSizeText] = addListener('zoomSize', e => {
    SETTING.zoomSize = Number(e.target.value);
    update();
});
const [elAutoSize, elAutoSizeText] = addListener('autoSize', e => {
    SETTING.autoSize = e.target.checked ? 1 : 0;
    update();
});
const [elAutoPosition, elAutoPositionText] = addListener('autoPosition', e => {
    SETTING.autoPosition = e.target.checked ? 1 : 0;
    update();
});
const [elZoomPosition, elZoomPositionText] = addListener('zoomPosition', e => {
    SETTING.zoomPosition = e.target.value;
    update();
});
const [elDisabledPath, elDisabledPathText] = addListener('disabledPath', e => {
    SETTING.disabledPath = e.target.value;
    update();
});

// 元素更新
function update() {
    elZoomRateText.innerHTML = String(SETTING.zoomRate);
    elZoomSizeText.innerHTML = String(SETTING.zoomSize);
    elAutoSizeText.innerHTML = Boolean(SETTING.autoSize) ? '是' : '否';
    elAutoPositionText.innerHTML = Boolean(SETTING.autoPosition) ? '是' : '否';
    elZoomEnableText.innerHTML = Boolean(SETTING.zoomEnable) ? '是' : '否';
    const elOtherSetting = document.querySelector('.other-setting');
    if (elOtherSetting) {
        elOtherSetting.style.display = SETTING.zoomEnable ? 'block' : 'none';
    }
    const elSettingZoomSize = document.querySelector('.setting-zoom-size');
    if (elSettingZoomSize) {
        elSettingZoomSize.style.display = !SETTING.autoSize ? 'flex' : 'none';
    }
    const elSettingZoomPosition = document.querySelector('.setting-zoom-position');
    if (elSettingZoomPosition) {
        elSettingZoomPosition.style.display = !SETTING.autoPosition ? 'flex' : 'none';
    }
    setItem(SETTING.storeKey, JSON.stringify(SETTING));
}
// 主要函数
async function initSetting() {
    const storeStr = await getItem(SETTING.storeKey);
    const storeSetting = storeStr ? JSON.parse(storeStr) : SETTING;
    Object.assign(SETTING, storeSetting);
    elZoomRate.value = SETTING.zoomRate;
    elZoomSize.value = SETTING.zoomSize;
    elAutoSize.checked = SETTING.autoSize;
    elZoomEnable.checked = SETTING.zoomEnable;
    elAutoPosition.checked = SETTING.autoPosition;
    elZoomPosition.value = SETTING.zoomPosition;
    elDisabledPath.value = SETTING.disabledPath;
    elFocusCenter.value = SETTING.focusCenter;
    update();
}

initSetting();
