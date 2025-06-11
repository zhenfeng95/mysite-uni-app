<template>
    <view>
        <u-navbar title="收藏" backIconColor="#fff" titleColor="#fff" :background="background"></u-navbar>
        <c-list></c-list>
    </view>
</template>

<script>
export default {
    data() {
        return {
            background: {
                "background-image": "linear-gradient(45deg, #2BC3C8, #84E7B9)",
            },
        };
    },
    onLoad() {},
    methods: {},
};
</script>

<style lang="scss" scoped>
</style>