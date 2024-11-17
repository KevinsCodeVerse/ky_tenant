<template>
	<div class="cmpsRight">
		<div class="row_item_box" v-for="(item, index) in usCommend" :key="index">
			<div class="profile_box">
				<div class="dw " :class="'jr' + ++index">{{item.gloryName}}</div>
				<div class="profile">
					<img class="k" :src="item.avatarFrame" alt="" />
					<img :src="item.avatar" alt="" />
				</div>
				<div class="name " :class="'jr' + index">{{item.empName}}</div>
			</div>
			<div class="info_box">
				<div class="text">恭喜{{item.empName}}{{item.commend}}</div>
				<div class="info">
					<div class="item">
						<span>业绩:</span>
						<span class="data">{{item.performanceAmount}}</span>
						<span>元</span>
					</div>
					<div class="item">
						<span>收入:</span>
						<span class="data">{{item.incomeAmount}}</span>
						<span>元</span>
					</div>
					<div class="item">
						<span>奖励:</span>
						<span class="data">{{item.rewardAmount}}</span>
						<span>元</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	props: {
		usCommend: {
			type: Array,
			default: ()=>[]
		},
	},
};
</script>

<style lang="scss" scoped>
.cmpsRight {
	padding: 20px 16px;
	.row_item_box {
		display: flex;
		width: 433px;
		height: 172px;
		background: #10194d;
		border: 1px solid #172860;
		margin-bottom: 16px;
		padding: 16px;
		box-sizing: border-box;
		.profile_box {
			display: flex;
			flex-direction: column;
			align-items: center;
			.dw {
				font-weight: 700;
			}

			.profile {
				margin: 18px 14px;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				img {
					width: 70px;
					height: 70px;
					border-radius: 50%;
				}
				.k {
					position: absolute;
					width: 100px;
					height: 100px;
				}
			}

			.name {
				font-weight: 700;
			}
		}

		.info_box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin-left: 14px;
			.text {
				font-size: 14px;
				font-weight: normal;
				text-align: left;
				color: #82a9ef;
				line-height: 24px;
			}

			.info {
				margin-top: 16px;
				display: flex;
				width: 288px;
				height: 34px;
				line-height: 34px;
				padding: 0 10px;
				background-color: #1b276a;
				box-sizing: border-box;
				.item {
					margin-right: 8px;
					// 禁止换行
					white-space: nowrap;
					font-weight: 700;

					span {
						font-size: 14px;
						color: #8cd2f2;
						line-height: 24px;
					}

					span.data {
						color: #00d1ff;
					}
				}
			}
		}
	}
}
.jr1 {
	color: #ebba46 !important;
}
.jr2 {
	color: #00d1ff !important;
}
.jr3 {
	color: #7a8cff !important;
}
</style>
