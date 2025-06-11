<template>
    <view class>
        <!-- <u-navbar title="首页" :leftIcon="''" :placeholder="true" :backTextStyle="backTextColor" bgcolor="#000000">
            <view class="search-wrap" @click="toSearch">
                <u-search height="56" :showAction="false"></u-search>
            </view>
        </u-navbar>-->

        <mescroll-uni ref="mescrollRef" :down="downOption" :up="upOption" @down="onRefresh" @up="onLoadMore">
            <view class="toptem">
                <view>
                    <u-swiper :list="swiper" keyName="midImg" border-radius="0" :effect3d="true"></u-swiper>
                </view>
                <!-- <u-gap bgcolor="#ededed" height="20"></u-gap> -->
                <c-list :blogList="blogList"></c-list>
            </view>
        </mescroll-uni>
    </view>
</template>

<script>
import { getBanners, getBlogs } from "@/api";

export default {
    data() {
        return {
            swiper: [
                {
                    image: "http://static.zzf.net.cn/uploads/mid117479696792302665.jpg",
                    title: "昨夜星辰昨夜风，画楼西畔桂堂东",
                },
                {
                    image: "http://static.zzf.net.cn/uploads/mid217479709049749982.jpg",
                    title: "身无彩凤双飞翼，心有灵犀一点通",
                },
                {
                    image: "http://static.zzf.net.cn/uploads/mid317479709246928784.jpg",
                    title: "谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳",
                },
            ],
            background: {
                "background-image": "linear-gradient(45deg, #2BC3C8, #84E7B9)",
            },
            backTextColor: {
                color: "#ffffff",
            },
            page: 1,
            limit: 10,
            blogList: [],
            downOption: {
                auto: false, // 自动触发刷新
            },
            upOption: {
                auto: false, // 页面一进入自动加载
                page: {
                    num: 1, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10, //每页数据条数,默认10
                },
            },
        };
    },
    onLoad() {},
    mounted() {
        this.initBanner();
        this.initBlogs();
    },
    methods: {
        initBanner() {
            getBanners().then((res) => {
                if (res.code == 0) {
                    this.swiper = res.data;
                }
            });
        },
        async initBlogs(page = this.page, limit = this.limit) {
            await getBlogs(page, limit).then((res) => {
                if (res.code == 0) {
                    this.blogList = res.data.rows;
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: "none",
                        duration: 1500,
                    });
                }
            });
        },

        toSearch() {
            this.$common.navigateTo("/pages/index/search");
        },
        back() {
            // 首页
            uni.navigateBack({
                delta: 2,
            });
        },
        toDetail() {
            this.$common.navigateTo("/packageA/pages/index/detail");
        },

        async onRefresh(mescroll) {
            await this.initBlogs(this.page, this.limit);
            mescroll.endSuccess(); // 结束刷新
        },
        onLoadMore(mescroll) {
            const pageNum = mescroll.num;
            const pageSize = mescroll.size;
            getBlogs(pageNum, pageSize).then((res) => {
                if (res.code == 0) {
                    const newData = res.data.rows;
                    if (newData.length < pageSize) {
                        mescroll.endSuccess(newData.length, false); // 没有更多数据
                    } else {
                        mescroll.endSuccess(); // 正常加载
                    }
                    this.blogList = [...this.blogList, ...newData];
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: "none",
                        duration: 1500,
                    });
                }
            });
        },
    },
};
</script>

<style lang="scss">
.search-wrap {
    margin: 0 30rpx 0 10rpx;
    flex: 1;
}

.u-body-item {
    font-size: 32rpx;
    color: #333;
    padding: 20rpx;
}

.u-body-item image {
    width: 180rpx;
    flex: 0 0 180rpx;
    height: 150rpx;
    border-radius: 6rpx;
    margin-right: 12rpx;
}

.height {
    height: 88rpx;
}

/* #ifdef H5 */
.toptem {
    padding: 20rpx 0;
}
/* #endif */

/* #ifndef H5 */
.toptem {
    padding: 8vw 0 20rpx;
}
/* #endif */

/*通过fixed固定mescroll的高度*/
.mescroll {
    position: fixed;
    top: 44px;
    bottom: 0;
    height: auto;
}
</style>
