<template>
	<div class="cmpsBottom">
		<div class="item_box" v-for="(item, index) in usHero" :key="index">
			<div class="info">
				<div class="profile_box">
					<img v-if="index==0" class="k" src="@/assets/img/dataView/jryx.png"  />
					<img v-else class="k" src="@/assets/img/dataView/byyx.png"  />
					<img :src="item.avatar"  />
				</div>
				<div class="name jr2">{{item.empName}}</div>
			</div>
			<div class="data">
				<div class="row">
					<span>业绩:<span class="num">{{item.performanceAmount}}</span>元</span>
					<img src="@/assets/img/dataView/yj.png"  />
				</div>
				<div class="row">
					<span>收益:<span class="num">{{item.incomeAmount}}</span>元</span>
					<img src="@/assets/img/dataView/sy.png"  />
				</div>
			</div>
			<div class="text_box">
				<div class="title">{{index==0?'今日英雄':'本月英雄'}}</div>
				<div class="text">
					{{item.commend}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		usHero: {
			type: Array,
			default: () => [],
		},
	},
};
</script>

<style lang="scss" scoped>
.cmpsBottom {
	display: flex;
	padding: 30px 70px;

	.item_box {
		display: flex;
		align-items: center;
		flex: 0 0 48%;
		&:nth-child(2) {
			margin-left: 70px;
		}
		.info {
			position: relative;
			font-weight: 700;
			.profile_box {
				margin: 0 30px;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				img {
					width: 90px;
					height: 90px;
					border-radius: 50%;
				}
				.k {
					position: absolute;
					width: 140px;
					height: 117px;
				}
			}
			.name {
				position: absolute;
				font-size: 14px;
				text-align: center;
				color: #ebba46;
				line-height: 24px;
				bottom: -36px;
				left: 50%;
				transform: translateX(-50%);
				font-weight: 700;
			}
		}

		.data {
			margin-right: 20px;
			margin-top: 60px;
			.row {
				display: flex;
				align-items: center;
				margin-bottom: 20px;
				white-space: nowrap;

				span {
					font-weight: 700;
					font-size: 12px;
					text-align: left;
					color: #8cd2f2;
					line-height: 24px;
					min-width: 80px;
				}
				.num {
					color: #ebba46;

				}
				img {
					margin-left: 4px;
					width: 12px;
					height: 12px;
				}
			}
		}

		.text_box {
			flex: 1;
			.title {
				font-size: 20px;
				font-family: lianmengqiyilushuaizhengruiheiti, lianmengqiyilushuaizhengruiheiti-Regular;
				font-weight: 400;
				text-align: center;
				color: #ebba46;
				line-height: 24px;
				letter-spacing: 4px;
				font-weight: 700;
				margin-bottom: 20px;
			}

			.text {
				font-size: 14px;
				font-family: Source Han Sans CN, Source Han Sans CN-Normal;
				font-weight: normal;
				text-align: left;
				color: #82a9ef;
				line-height: 24px;
			}
		}
	}
}
</style>
