<template>
    <view>
        <u-navbar title="搜索" :backTextStyle="backTextColor" :placeholder="true" backIconColor="#fff" :bgcolor="background" :autoBack="true"></u-navbar>
        <view class="home">
            <u-search placeholder="请输入关键词搜索" v-model="keyword" :actionStyle="actionStyle" @search="search" @custom="search"></u-search>
            <view class="u-m-t-20">
                <view class="u-flex u-row-between">
                    <view class="title">历史记录</view>
                    <view>
                        <u-icon name="trash" size="32"></u-icon>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            background: {
                "background-image": "linear-gradient(45deg, #2BC3C8, #84E7B9)",
            },
            keyword: "",
            backTextColor: {
                color: "#ffffff",
            },
            actionStyle: {
                color: "#39CCCC",
            },
        };
    },
    onLoad() {},
    methods: {
        search() {
            console.log(this.keyword);
            // this.$u.route({
            //     url: "pages/index/index",
            //     query: {
            //         keyword: this.keyword,
            //     },
            // });
        },
    },
};
</script>

<style lang="scss" scoped>
.title {
    font-size: 32rpx;
    font-weight: 700;
}
</style>
