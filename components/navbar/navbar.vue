<template>
    <view class="navbar" :style="{backgroundColor: bgColor}">
        <view class="status-bar" :style="{height: `${statusBarHeight}px`}"></view>
        <view class="navbar" v-if="showBar">
            <view v-if="showBack" class="page-back" @click="$util.navigateBack()">
                <!-- <image mode="widthFix" :src="$util.img('detail/icon_back@2x.png')"></image> -->
            </view>
            <view class="container">
                <slot></slot>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        bgColor: {
            type: String,
            default: 'transparent',
        },
        showBar: {
            type: Boolean,
            default: true,
        },
        showBack: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            statusBarHeight: 0,
        };
    },
    beforeMount() {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight;
        const isiOS = systemInfo.system.indexOf('iOS') > -1;
        if (isiOS) {
            this.statusBarHeight = this.statusBarHeight - 2;
        } else {
            this.statusBarHeight = this.statusBarHeight + 2;
        }
        console.log(this.statusBarHeight);
    },
};
</script>

<style lang="scss" scoped>
.navbar {
    position: relative;
    z-index: 999;
    .status-bar {
        width: 100%;
    }

    .navbar {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 44px;
        padding: 0 12px;
        z-index: 999;
        .page-back {
            display: flex;
            justify-content: space-between;
            align-items: center;
            image {
                width: 20px;
            }
        }
        .container {
            flex: 1;
        }
    }
}
</style>