import { initZoom } from './zoom';
import { storeSetting, setItem } from './utils';
import { SETTING } from './const';
// @ts-ignore
if (chrome.storage && chrome.storage.local) {
    // @ts-ignore
    chrome.storage.onChanged.addListener((changes, namespace) => {
        // @ts-ignore
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key === SETTING.storeKey && oldValue !== newValue) {
                localStorage.setItem(key, newValue);
                console.log('插件同步配置');
                main();
            }
        }
    });
}
// 监听变化
window.addEventListener('storage', e => {
    if (e?.key === SETTING.storeKey && e.newValue !== e.oldValue) {
        console.log('插件同步配置');
        setItem(e.key, e.newValue);
        main();
    }
});
async function main() {
    const userSetting = await storeSetting();
    // 禁用使用
    const { zoomEnable = true, disabledPath = '' } = userSetting;
    !zoomEnable && console.log('全局禁止运行视频帧放大镜');
    // 禁用页面
    const checkPath = location.href.slice(location.origin.length);
    const disabledList = disabledPath.split(';').filter(Boolean);
    const pageDisabled = disabledList.some((path: string) => checkPath.includes(path));
    pageDisabled && console.log('页面禁止运行视频帧放大镜');
    // 检查执行
    if (zoomEnable && !pageDisabled) {
        const config = { attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver(initZoom);
        observer.observe(document.body, config);
        // observer.disconnect();
        initZoom();
    }
}
main();
