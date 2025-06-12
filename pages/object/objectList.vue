<template>
    <view>
        <u-navbar :title="categoryname" backIconColor="#fff" titleColor="#fff" :bgcolor="background" :placeholder="true" :autoBack="true"></u-navbar>

        <mescroll-uni ref="mescrollRef" :down="downOption" :top="100" :up="upOption" @up="onLoadMore">
            <view class>
                <c-list :blogList="blogList"></c-list>
            </view>
        </mescroll-uni>

        <!-- top -->
        <!-- <u-back-top
            :scrollTop="scrollTop"
            :mode="modeTop"
            :bottom="bottomTop"
            :right="rightTop"
            :top="top"
            :icon="iconTop"
            :custom-style="{
                backgroundColor: '#39CCCC',
                color: '#ffffff',
            }"
            :icon-style="iconStyleTop"
            :tips="tips"
        ></u-back-top>-->
    </view>
</template>

<script>
import { getBlogs } from "@/api";
export default {
    data() {
        return {
            background: {
                "background-image": "linear-gradient(45deg, #2BC3C8, #84E7B9)",
            },
            // top
            scrollTop: 0,
            modeTop: "circle",
            bottomTop: 200,
            rightTop: 40,
            top: 600,
            iconTop: "arrow-up",
            iconStyleTop: {
                color: "#ffffff",
                fontSize: "30rpx",
            },
            tips: "顶部",
            page: 1,
            limit: 10,
            blogList: [],
            downOption: {
                // 禁用下拉刷新
                use: false,
            },
            upOption: {
                auto: false, // 页面一进入自动加载
                page: {
                    num: 1, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10, //每页数据条数,默认10
                },
            },
            categoryid: 0,
            categoryname: "分类列表",
        };
    },
    onLoad(options) {
        this.categoryid = options.id;
        this.categoryname = options.name;
    },
    mounted() {
        this.initBlogs();
    },
    methods: {
        // 回到顶部
        onPageScroll(e) {
            this.scrollTop = e.scrollTop;
        },
        initBlogs() {
            let data = {};
            data.page = this.page;
            data.limit = this.limit;
            data.categoryid = this.categoryid;
            getBlogs(data).then((res) => {
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
        onLoadMore(mescroll) {
            const pageSize = mescroll.size;
            let data = {};
            data.page = mescroll.num;
            data.limit = pageSize;
            data.categoryid = this.categoryid;
            getBlogs(data).then((res) => {
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

<style lang="scss" scoped>
/*通过fixed固定mescroll的高度*/

.mescroll {
    position: fixed;
    top: 44px;
    bottom: 0;
    height: auto; /*如设置bottom:50px,则需height:auto才能生效*/
}
</style>
