<template>
	<div class="cmpsCenter">
		<el-image class="img" :src="eliteList.today?.[0]?.bigAvatar" fit="cover" />
		<div class="name">{{eliteList.today?.[0]?.name}}</div>
		<div class="row">
			<div class="text">订单: </div>
			<div class="data">{{eliteList.today?.[0]?.orderNum}}</div>
			<div class="text">单</div>
			<img src="@/assets/img/dataView/dd.png" alt="" />
		</div>
		<div class="row">
			<div class="text">业绩: </div>
			<div class="data">{{eliteList.today?.[0]?.performance}}</div>
			<div class="text">元</div>
			<img src="@/assets/img/dataView/yj.png" alt="" />
		</div>
		<div class="row">
			<div class="text">收益: </div>
			<div class="data">{{eliteList.today?.[0]?.incomeAmount}}</div>
			<div class="text">元</div>
			<img src="@/assets/img/dataView/sy.png" alt="" />
		</div>
		<img class="jrjy" src="@/assets/img/dataView/jrjy.png" alt="" />
	</div>
</template>

<script>
export default {
	props: {
		eliteList: {
			type: Object,
			default: ()=>{}
		},
	},
};
</script>

<style lang="scss" scoped>
.cmpsCenter {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 20px 40px 40px 40px;
	background-size: 100% 100%;
	height: 501px;
	background: #152456;
	background-image: url("~@/assets/img/dataView/jybj.png");
	background-size: 100% 100%;

	border: 1px solid #32447b90;
	.img {
		margin: 0 auto;
		width: 191px;
		height: 255px;
		background: rgba(0, 0, 0, 0);
	}
	.name {
		font-size: 22px;
		text-align: center;
		color: #ebba46;
		line-height: 24px;
		margin: 18px 0;
	}

	.row {
		justify-content: center;
		display: flex;
		font-size: 25px;
		text-align: left;
		color: #8cd2f2;
		line-height: 40px;
		align-items: center;
		margin-bottom: 4px;
		.text {
		}

		.data {
			color: #ebba46;
		min-width: 110px;
		margin-left: 10px;
		text-align: center;
		}

		img {
			margin-left: 10px;
			width: 14px;
			height: 14px;
		}
	}
	.jrjy {
		width: 150px;
		height: 96px;
		position: absolute;
		bottom: -56px;
		left: 50%;
		transform: translateX(-50%);
	}
}
</style>
