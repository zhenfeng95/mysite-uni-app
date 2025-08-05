<template>
    <view>
        <u-navbar title="搜索" :backTextStyle="backTextColor" :placeholder="true" backIconColor="#fff" :bgcolor="background" :autoBack="true"></u-navbar>
        <view class="search-wrap">
            <u-search placeholder="请输入博客名称搜索" v-model="keyword" :actionStyle="actionStyle" @search="search" @custom="search"></u-search>
            <view class="u-m-t-20" v-if="0">
                <view class="u-flex u-row-between">
                    <view class="title">历史记录</view>
                    <view>
                        <u-icon name="trash" size="32"></u-icon>
                    </view>
                </view>
            </view>
        </view>
        <c-list :blogList="blogList"></c-list>
    </view>
</template>

<script>
import { getBlogs } from '@/api';
export default {
    data() {
        return {
            background: {
                'background-image': 'linear-gradient(45deg, #2BC3C8, #84E7B9)',
            },
            keyword: '',
            backTextColor: {
                color: '#ffffff',
            },
            actionStyle: {
                color: '#39CCCC',
            },
            page: 1,
            limit: 10,
            blogList: [],
        };
    },
    onLoad() {},
    methods: {
        search() {
            this.page = 1;
            this.initBlogs();
        },
        async initBlogs() {
            const data = {};
            data.page = this.page;
            data.limit = this.limit;
            data.title = this.keyword;
            data.categoryid = -1;
            await getBlogs(data).then((res) => {
                if (res.code == 0) {
                    this.blogList = res.data.rows;
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 1500,
                    });
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.search-wrap {
    padding: 0 30rpx;
}
.title {
    font-size: 32rpx;
    font-weight: 700;
}
</style>
