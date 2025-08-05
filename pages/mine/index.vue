<template>
    <view>
        <u-navbar title="我的" :is-back="false" titleColor="#fff" :background="background"></u-navbar>
        <view class="u-flex user-box u-p-30" @click="$common.navigateTo('/pages/login/login')">
            <view class="u-m-r-10">
                <u-avatar src size="140"></u-avatar>
            </view>
            <view class="u-flex-1">
                <view class="u-font-18 u-p-b-20">WenboX</view>
                <view class="u-font-14 u-tips-color">ID：100001</view>
            </view>
            <view class="u-m-l-10 u-p-10">
                <u-icon name="scan" color="#969799" size="28" @click="scan"></u-icon>
            </view>
            <view class="u-m-l-10">
                <u-icon name="arrow-right" color="#969799" size="28"></u-icon>
            </view>
        </view>

        <view class="u-m-t-20">
            <u-cell-group>
                <u-cell icon="calendar" :iconStyle="iconStyle" title="签到" @click="calendarClick"></u-cell>
                <u-cell icon="bell" :iconStyle="iconStyle" title="消息" @click="toUrl('/pages/mine/message')"></u-cell>
                <u-cell icon="heart" :iconStyle="iconStyle" title="收藏" @click="toUrl('/pages/mine/heart')"></u-cell>
                <u-cell icon="fingerprint" :iconStyle="iconStyle" title="足迹" @click="toUrl('/pages/mine/foot')"></u-cell>
                <u-cell icon="file-text" :iconStyle="iconStyle" title="反馈" @click="toUrl('/pages/mine/feedback')"></u-cell>
                <!-- open-type="contact" 微信小程序的客服组件 -->
                <button open-type="contact" class="class-none">
                    <u-cell :iconStyle="iconStyle" icon="server-fill" title="客服"></u-cell>
                </button>
            </u-cell-group>
        </view>

        <view class="u-m-t-20">
            <u-cell-group>
                <u-cell icon="setting" :iconStyle="iconStyle" title="设置" @click="toUrl('/pages/mine/setting')"></u-cell>
            </u-cell-group>
        </view>
        <!-- 签到弹窗 -->
        <u-popup v-model="show" borderRadius="20" mode="center" length="50%">
            <view class="pupbox">
                <view class="box-icon u-flex u-row-center">
                    <view>
                        <u-icon name="gift-fill" size="158" color="#F05C52"></u-icon>
                    </view>
                </view>
                <view class="text-center red">签到成功,奖励10积分</view>
            </view>
        </u-popup>
    </view>
</template>

<script>
export default {
    data () {
        return {
            background: {
                'background-image': 'linear-gradient(45deg, #2BC3C8, #84E7B9)'
            },
            iconStyle: { color: '#2BC3C8' },
            customStyle: { borderRadius: '88rpx' },
            show: false,
            disabled: false
        };
    },
    onLoad () {},
    methods: {
        calendarClick () {
            this.show = !this.show;
        },
        toUrl (url) {
            this.$common.navigateTo(url);
        },
        // 扫码不支持H5
        scan () {
            // #ifdef H5
            this.$common.errorToShow('H5不支持扫码');
            // #endif
            // #ifdef APP-PLUS || MP
            uni.scanCode({
                success: function (res) {
                    console.log('条码类型：' + res.scanType);
                    console.log('条码内容：' + res.result);
                }
            });
            // #endif
        }
    }
};
</script>

<style lang="scss" scoped>
page {
    background-color: #ededed;
}

.pupbox {
    height: 320rpx;
    background-color: #84e7b9;
    .box-icon {
        padding: 60rpx 30rpx 10rpx;
    }
}

.camera {
    width: 54px;
    height: 44px;

    &:active {
        background-color: #ededed;
    }
}

.user-box {
    background-color: #fff;
}

.class-none {
    border: none;
    margin: 0;
    padding: 0;
    background: #ffffff;
    outline: none;
}

.class-none::after {
    outline: none;
    border: none;
}

.red {
    color: #ff0f00;
}
</style>
