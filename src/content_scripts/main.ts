import { initZoom } from './zoom';
import { storeSetting, setItem, removeWorkspace } from './utils';
import { SETTING } from './const';
// @ts-ignore
if (chrome.storage && chrome.storage.local) {
    // @ts-ignore
    chrome.storage.onChanged.addListener((changes, namespace) => {
        // @ts-ignore
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key === SETTING.uuid && oldValue !== newValue) {
                localStorage.setItem(key, newValue);
                console.log('插件同步配置', newValue);
                main();
            }
        }
    });
}
// 监听变化
window.addEventListener('storage', e => {
    if (e?.key === SETTING.uuid && e.newValue !== e.oldValue) {
        console.log('插件同步配置', e.newValue);
        setItem(e.key, e.newValue);
        main();
    }
});
// 主函数
async function main() {
    const userSetting = await storeSetting();
    removeWorkspace({
        elWorkspaceId: `${userSetting.uuid}_WORKSPACE`,
    });
    // 禁用使用
    const { zoomEnable = true, disabledHostList = [] } = userSetting;
    !zoomEnable && console.log('全局禁止运行视频帧放大镜');
    // 禁用页面
    const checkPath = location.href.slice(location.origin.length);
    const disabledList: Record<string, any>[] = disabledHostList.filter(Boolean);
    const pageDisabled = disabledList.some(item => checkPath.includes(item.path));
    pageDisabled && console.log('页面禁止运行视频帧放大镜');
    // 检查执行
    if (zoomEnable && !pageDisabled) {
        // window['KS_VIDEO_ZOOM'] = {};
        const config = { attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver(initZoom);
        observer.observe(document.body, config);
        // observer.disconnect();
        initZoom();
    }
}
main();
