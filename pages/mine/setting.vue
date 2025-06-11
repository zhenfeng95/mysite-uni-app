<template>
    <view>
        <u-navbar title="设置" backIconColor="#fff" titleColor="#fff" :background="background"></u-navbar>
        <view class>
            <u-cell-group>
                <u-cell
                    title="头像"
                    valueImage="https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg"
                ></u-cell>
                <u-cell title="昵称" value="WenBo" @click="showModal = true"></u-cell>
                <u-cell title="性别" :value="gender==1?'男':'女'" @click="showGender = true"></u-cell>
                <u-cell title="生日" :value="birthday" @click="showPicker = true"></u-cell>
                <u-cell title="格言" value="剑未佩妥,出门已是江湖" @click="showModal = true"></u-cell>
            </u-cell-group>
            <view class="u-m-t-20">
                <u-cell-group>
                    <u-cell title="手机号" value="(未绑定)"></u-cell>
                </u-cell-group>
            </view>
        </view>
        <u-action-sheet :list="list" v-model="showGender" @click="clickGender"></u-action-sheet>
        <!-- modal -->
        <u-modal v-model="showModal" :show-title="false" @confirm="confirm" @cancel="cancel" :showCancelButton="true">
            <view class="u-p-30">
                <u-input placeholder="请输入内容..." maxlength="32"></u-input>
            </view>
        </u-modal>
        <!-- picker -->
        <u-picker v-model="showPicker" mode="time" @confirm="pickerConfirm"></u-picker>
    </view>
</template>

<script>
export default {
    data() {
        return {
            background: {
                "background-image": "linear-gradient(45deg, #2BC3C8, #84E7B9)",
            },
            list: [
                {
                    text: "男",
                    value: 1,
                },
                {
                    text: "女",
                    value: 2,
                },
            ],
            birthday: "2021-07-01",
            gender: 1,
            showGender: false,
            showModal: false,
            showPicker: false,
        };
    },
    onLoad() {},
    methods: {
        clickGender(e) {
            this.gender = this.list[e].value;
        },
        confirm() {
            this.showModal = false;
        },
        cancel() {
            this.showModal = false;
        },
        pickerConfirm(e) {
            this.birthday = e.year + "-" + e.month + "-" + e.day;
        },
    },
};
</script>

<style lang="scss" scoped>
page {
    background-color: #ededed;
}
</style>
