<template>
    <view class="toptem">
        <u-cell-group>
            <u-cell
                v-for="(item,index) in blogTypeList"
                :key="index"
                :title="item.name"
                :value="`${item.articleCount}篇`"
                :isLink="!!item.articleCount"
                size="large"
                @click="toUrl(item)"
            ></u-cell>
        </u-cell-group>
        <u-back-top
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
        ></u-back-top>
    </view>
</template>

<script>
import { getBlogCategories } from "@/api";
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
            blogTypeList: [],
        };
    },
    onLoad() {
        getBlogCategories().then((res) => {
            if (res.code == 0) {
                this.blogTypeList = res.data;
            } else {
                uni.showToast({
                    title: res.msg,
                    icon: "none",
                    duration: 1500,
                });
            }
        });
    },
    methods: {
        toUrl(item) {
            if (!item.articleCount) {
                return;
            }
            this.$common.navigateTo(
                "/pages/object/objectList?id=" + item.id + "&name=" + item.name
            );
        },
        // 回到顶部
        onPageScroll(e) {
            this.scrollTop = e.scrollTop;
        },
    },
};
</script>

<style lang="scss" scoped>
.ztitle {
    color: #a5a5a5;
}
.weight {
    font-weight: 700;
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
</style>
