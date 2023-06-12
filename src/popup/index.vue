<template>
    <div class="popup-app" style="width: 400px">
        <el-form :model="form" label-width="auto" size="small">
            <!-- 全局开关 -->
            <el-form-item label="全局开关">
                <el-switch v-model="form.zoomEnable" inline-prompt active-text="开" inactive-text="关" />
            </el-form-item>
            <template v-if="form.zoomEnable">
                <!-- 唯一标识 -->
                <!-- <el-form-item label="唯一标识">
                    <el-input v-model="form.uuid" />
                </el-form-item> -->
                <!-- 预设层级 -->
                <el-form-item label="预设层级">
                    <el-input-number v-model="form.zIndex" style="width: 100%" />
                </el-form-item>
                <!-- 基准倍率 -->
                <el-form-item label="基准倍率">
                    <el-slider v-model="form.zoomRate" :max="4" :min="1" :step="1" show-stops />
                </el-form-item>
                <!-- 鼠标聚焦 -->
                <el-form-item label="鼠标聚焦">
                    <el-radio-group v-model="form.focusCenter" style="width: 100%">
                        <el-radio-button :label="true">垂直水平居中</el-radio-button>
                        <el-radio-button :label="false">吸顶水平居中</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <!-- 支持全屏 -->
                <el-form-item label="支持全屏">
                    <el-switch v-model="form.supportFullscreen" inline-prompt active-text="开" inactive-text="关" />
                </el-form-item>
                <!-- 智能大小 -->
                <el-form-item label="智能大小">
                    <el-switch v-model="form.autoSize" inline-prompt active-text="开" inactive-text="关" />
                </el-form-item>
                <!-- 基准大小 -->
                <el-form-item label="基准大小" v-if="!form.autoSize">
                    <el-slider v-model="form.zoomSize" :max="400" :min="200" :step="50" show-stops />
                </el-form-item>
                <!-- 智能排版 -->
                <el-form-item label="智能排版">
                    <el-switch v-model="form.autoPosition" inline-prompt active-text="开" inactive-text="关" />
                </el-form-item>
                <!-- 固定排版 zoomPosition -->
                <el-form-item label="固定排版" v-if="!form.autoPosition">
                    <el-select v-model="form.zoomPosition" style="width: 100%">
                        <el-option label="热区右边上对齐" value="right_top"></el-option>
                        <el-option label="热区右边下对齐" value="right_bottom"></el-option>
                        <el-option label="热区左边上对齐" value="left_top"></el-option>
                        <el-option label="热区左边下对齐" value="left_bottom"></el-option>
                        <el-option label="热区上边右对齐" value="top_right"></el-option>
                        <el-option label="热区上边左对齐" value="top_left"></el-option>
                        <el-option label="热区下边右对齐" value="bottom_right"></el-option>
                        <el-option label="热区下边左对齐" value="bottom_left"></el-option>
                        <el-option label="视频右边上对齐" value="video_right_top"></el-option>
                        <el-option label="视频右边下对齐" value="video_right_bottom"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 禁用地址 disabledPath -->
                <el-form-item label="禁用页面">
                    <div class="disabled-host-list" style="display: flex; flex-flow: column nowrap">
                        <template v-for="(host, index) in form.disabledHostList" :key="index">
                            <div v-if="!host.edit" class="disabled-host-item" :key="index + 'list'">
                                <span> {{ host.name }}</span>
                                <span>
                                    <el-tooltip placement="left" effect="light">
                                        <template #content>
                                            <div class="disabled-host-options">
                                                <el-button link @click="disabledHostToEdit(host)"> 编辑 </el-button>
                                                <el-button link @click="disabledHostDel(host)"> 删除 </el-button>
                                                <el-button v-if="index" link @click="disabledHostToPrev(host)"> 上移 </el-button>
                                                <el-button v-if="index !== form.disabledHostList.length - 1" link @click="disabledHostToNext(host)"> 下移 </el-button>
                                                <el-button link @click="disabledHostAdd(host)"> 新建 </el-button>
                                            </div>
                                        </template>
                                        <el-button link>操作</el-button>
                                    </el-tooltip>
                                </span>
                            </div>
                            <div v-else class="disabled-host-edit" :key="index + 'edit'">
                                <el-form :model="host" label-width="auto">
                                    <el-form-item label="标题">
                                        <el-input v-model="host.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="地址">
                                        <el-input v-model="host.path"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="disabledHostCancel(host)">退出编辑</el-button>
                                        <el-button type="primary" @click="disabledHostDel(host)">删除</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </template>
                        <el-button style="width: 100%" plain type="primary" size="small" @click="disabledHostAdd()"> 新建 </el-button>
                    </div>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
// @ts-ignore
import { ElMessage } from 'element-plus';

export type Host = {
    edit: boolean;
    name: string;
    path: string;
};

export default defineComponent({
    setup() {
        const form = reactive({
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
        });
        function swapListItem(list: any[], aIndex: number, bIndex: number) {
            const tmp = list[aIndex];
            list[aIndex] = list[bIndex];
            list[bIndex] = tmp;
            return [...list];
        }
        function disabledHostAdd(host?: Host) {
            const newHost = {
                edit: true,
                name: '',
                path: '',
            };
            if (form.disabledHostList.some(i => i.edit)) {
                ElMessage('请完成进行中的编辑项再进行此操作');
                return;
            }
            if (!host) {
                form.disabledHostList.push(newHost);
                return;
            }
            const list = form.disabledHostList || [];
            const index = list.findIndex(i => i === host);
            form.disabledHostList.splice(index, 1, host, newHost);
        }
        function disabledHostDel(host: Host) {
            form.disabledHostList = form.disabledHostList.filter(i => i !== host);
        }
        function disabledHostCancel(host: Host) {
            if (host.name && host.path) {
                host.edit = false;
                return;
            }
            ElMessage('标题和地址不可为空');
        }
        function disabledHostToEdit(host: Host) {
            host.edit = true;
        }
        function disabledHostToNext(host: Host) {
            const list = form.disabledHostList || [];
            const index = list.findIndex(i => i === host);
            if (list[index] && list[index + 1]) {
                form.disabledHostList = swapListItem(form.disabledHostList, index, index + 1);
            }
        }
        function disabledHostToPrev(host: Host) {
            const list = form.disabledHostList || [];
            const index = list.findIndex(i => i === host);
            if (list[index] && list[index - 1]) {
                form.disabledHostList = swapListItem(form.disabledHostList, index, index - 1);
            }
        }
        async function setStorage(key: string, value: string) {
            // @ts-ignore
            if (chrome.storage && chrome.storage.local) {
                // @ts-ignore
                chrome.storage.local.set({ [key]: value });
            }
            if (localStorage) {
                localStorage.setItem(key, value);
            }
        }
        async function getStorage(key: string) {
            let data = null;
            // @ts-ignore
            if (chrome.storage && chrome.storage.local) {
                // @ts-ignore
                const result = await chrome.storage.local.get([key]);
                data = result[key];
            }
            if (!data && localStorage) {
                data = localStorage.getItem(key);
            }
            return data;
        }
        async function init() {
            const storage = await getStorage(form.uuid);
            const decodeForm = storage ? JSON.parse(storage) : {};
            console.log('POPUP 初始化', decodeForm);
            Object.assign(form, decodeForm);
        }
        init();
        watch(
            form,
            async () => {
                const storage = await getStorage(form.uuid);
                if (JSON.stringify(form) !== storage) {
                    console.log('setStorage');
                    setStorage(form.uuid, JSON.stringify(form));
                }
            },
            {
                immediate: true,
                deep: true,
            }
        );

        return {
            form,
            disabledHostAdd,
            disabledHostDel,
            disabledHostCancel,
            disabledHostToEdit,
            disabledHostToNext,
            disabledHostToPrev,
        };
    },
});
</script>

<style scoped lang="less">
.popup-app {
    padding: 24px;
    max-width: 360px;
    // 禁用地址列表
    .disabled-host-list {
        display: flex;
        flex-flow: column nowrap;
        width: 100%;

        .disabled-host-item {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            line-height: 24px;
            margin-bottom: 10px;
            span .el-button--small {
                padding: 5px;
            }
        }
        .disabled-host-edit {
            background: rgba(0, 0, 0, 0.05);
            padding: 10px;
            margin-bottom: 5px;
            border-radius: 2px;
            :deep(.el-form-item) {
                margin-bottom: 5px;
                &:last-child .el-form-item__content {
                    justify-content: center;
                }
            }
        }
    }
    .disabled-host-options {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
    }
    .disabled-host-options .el-button {
        margin: 0;
    }
    :deep(.el-switch--small .el-switch__core) {
        min-width: 40px;
    }
}
</style>
