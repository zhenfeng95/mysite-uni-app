<template>
	<view>
		<view class="" v-for="(item,index) in blogList" :key="index">
			<c-card :title="item.title" :sub-title="$u.timeFormat(item.createDate, 'yyyy-mm-dd')"  :full="true" :border="false" :padding="20" margin="10rpx" :footBorderTop="false" :footStyle="footStyle" @click="toDetail(item.id)">
				<view class="" slot="body">
					<view class="u-body-item u-flex u-flex-between u-flex-y-center u-border-bottom u-col-between u-p-t-0">
						<view class="u-body-item-title u-font-sm u-line-3">{{item.description}}</view>
						<image src="https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="u-flex" slot="foot">
                    <u-icon name="eye-fill" size="22" color="#2BC3C8" :label="`${item.scanNumber} 浏览`" labelSize="14" class="u-mr-30"></u-icon>
					<u-icon name="file-text-fill" size="22" color="#2BC3C8" :label="`${item.commentNumber} 评论`" labelSize="14" ></u-icon>
				</view>
			</c-card>
			<u-gap bgColor="#ededed" height="20"></u-gap>
		</view>
	</view>
</template>

<script>
export default {
    props: {
        blogList: {
            type: Array,
            default() {
                return []
            }
        }
     },
    data() {
        return {
            footStyle:{
                'paddingTop':'0rpx'
            },
          
         
        }
    },
    onLoad() {

    },
    methods: {
        toDetail(id) {
            this.$common.navigateTo('/packageA/pages/index/detail?id=' + id)
        },
    }
}
</script>

<style lang="scss" scoped>
	.u-card-wrap {
		background-color: $u-bg-color;
		padding: 1px;
	}

	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;
	}

	.u-body-item image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	}
</style>
