<template>
    <view>
        <u-navbar title="反馈" backIconColor="#fff" titleColor="#fff" :background="background"></u-navbar>
        <view class="home">
            <view class="u-p-t-20 u-p-b-20">
                <u-alert
                    @close="close"
                    :show="show"
                    :closeAble="closeAble"
                    :showIcon="true"
                    icon="file-text"
                    class="desctip"
                    type="info"
                    description="您的意见或者建议就是我们前进的动力~~~"
                ></u-alert>
            </view>
            <u-gap bgcolor="#f7f7f7" height="2"></u-gap>
            <u-form :model="form" ref="uForm">
                <u-form-item>
                    <u-input type="textarea" v-model="form.content" placeholder="请输入您的意见或者建议" />
                </u-form-item>
                <u-form-item>
                    <u-input v-model="form.link" placeholder="请输入您的联系方式" />
                </u-form-item>
            </u-form>
            <u-button @click="submit" class="button">提交</u-button>
        </view>
    </view>
</template>

<script>
export default {
    data () {
        return {
            background: {
                'background-image': 'linear-gradient(45deg, #2BC3C8, #84E7B9)'
            },
            closeAble: true,
            show: true,
            form: {
                content: '',
                link: ''
            }
        };
    },
    onLoad () {},
    methods: {
        // 提交
        submit () {
            if (!this.form.content) {
                return this.$common.errorToShow('请输入反馈内容');
            }
            this.$common.successToShow('提交成功');
        },
        close () {
            this.show = !this.show;
        }
    }
};
</script>

<style lang="scss" scoped>
.button {
    background-image: linear-gradient(45deg, #2bc3c8, #84e7b9);
    margin-top: 60rpx;
    color: #ffffff;
}
.desctip {
    letter-spacing: 2rpx;
}
</style>
