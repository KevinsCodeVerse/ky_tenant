<template>
	<div class="centent_item">
		<div class="item_row">
			<div class="item">
				<div class="top_text">今日</div>
				<div class="centent_info">
					<div class="info">
						<div class="profile_box">
							<img class="k" src="@/assets/img/dataView/jy1.png" alt="" />
							<img :src="eliteList.today?.[0]?.avatar" alt="" />
						</div>
						<div class="name">{{eliteList.today?.[0]?.name}}</div>
						<div class="sort jr1">1</div>
					</div>
					<div class="data">
						<div class="row">
							<span>业绩: {{eliteList.today?.[0]?.performance}}元</span>
							<img src="@/assets/img/dataView/yj.png" alt="" />
						</div>
						<div class="row">
							<span>收益: {{eliteList.today?.[0]?.incomeAmount}}元</span>
							<img src="@/assets/img/dataView/sy.png" alt="" />
						</div>
					</div>
				</div>
			</div>
			<img src="@/assets/img/dataView/vs.png" alt="" class="vs" />
			<div class="item">
				<div class="top_text">昨天</div>
				<div class="centent_info">
					<div class="info">
						<div class="profile_box">
							<img class="k" src="@/assets/img/dataView/jy1.png" alt="" />
							<img :src="eliteList.yesterday?.[0]?.avatar" alt="" />
						</div>
						<div class="name jr1">{{eliteList.yesterday?.[0]?.name}}</div>
						<div class="sort jr1">1</div>

					</div>
					<div class="data">
						<div class="row">
							<span>业绩: {{eliteList.yesterday?.[0]?.performance}}元</span>
							<img src="@/assets/img/dataView/yj.png" alt="" />
						</div>
						<div class="row">
							<span>收益: {{eliteList.yesterday?.[0]?.incomeAmount}}元</span>
							<img src="@/assets/img/dataView/sy.png" alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="item_row" >
			<div class="item">
				<div class="top_text">今日</div>
				<div class="centent_info">
					<div class="info">
						<div class="profile_box">
							<img class="k" src="@/assets/img/dataView/jy2.png" alt="" />
							<img :src="eliteList.today?.[1]?.avatar" alt="" />
						</div>
						<div class="name jr2">{{eliteList.today?.[1]?.name}}</div>
						<div class="sort jr2">2</div>

					</div>
					<div class="data">
						<div class="row">
							<span>业绩: {{eliteList.today?.[1]?.performance}}元</span>
							<img src="@/assets/img/dataView/yj.png" alt="" />
						</div>
						<div class="row">
							<span>收益: {{eliteList.today?.[1]?.incomeAmount}}元</span>
							<img src="@/assets/img/dataView/sy.png" alt="" />
						</div>
					</div>
				</div>
			</div>
			<img src="@/assets/img/dataView/vs.png" alt="" class="vs" />
			<div class="item">
				<div class="top_text">昨天</div>
				<div class="centent_info">
					<div class="info">
						<div class="profile_box">
							<img class="k" src="@/assets/img/dataView/jy2.png" alt="" />
							<img :src="eliteList.yesterday?.[1]?.avatar" alt="" />
						</div>
						<div class="name jr2">{{eliteList.yesterday?.[1]?.name}}</div>
						<div class="sort jr2">2</div>

					</div>
					<div class="data">
						<div class="row">
							<span>业绩: {{eliteList.yesterday?.[1]?.performance}}元</span>
							<img src="@/assets/img/dataView/yj.png" alt="" />
						</div>
						<div class="row">
							<span>收益: {{eliteList.yesterday?.[1]?.incomeAmount}}元</span>
							<img src="@/assets/img/dataView/sy.png" alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="item_row" >
			<div class="item">
				<div class="top_text">今日</div>
				<div class="centent_info">
					<div class="info">
						<div class="profile_box">
							<img class="k" src="@/assets/img/dataView/jy3.png" alt="" />
							<img :src="eliteList.today?.[2]?.avatar" alt="" />
						</div>
						<div class="name jr3">{{eliteList.today?.[2]?.name}}</div>
						<div class="sort jr3">3</div>

					</div>
					<div class="data">
						<div class="row">
							<span>业绩: {{eliteList.today?.[2]?.performance}}元</span>
							<img src="@/assets/img/dataView/yj.png" alt="" />
						</div>
						<div class="row">
							<span>收益: {{eliteList.today?.[2]?.incomeAmount}}元</span>
							<img src="@/assets/img/dataView/sy.png" alt="" />
						</div>
					</div>
				</div>
			</div>
			<img src="@/assets/img/dataView/vs.png" alt="" class="vs" />
			<div class="item">
				<div class="top_text">昨天</div>
				<div class="centent_info">
					<div class="info">
						<div class="profile_box">
							<img class="k" src="@/assets/img/dataView/jy3.png" alt="" />
							<img :src="eliteList.yesterday?.[2]?.avatar" alt="" />
						</div>
						<div class="name jr3">{{eliteList.yesterday?.[2]?.name}}</div>
						<div class="sort jr3">3</div>

					</div>
					<div class="data">
						<div class="row">
							<span>业绩: {{eliteList.yesterday?.[2]?.performance}}元</span>
							<img src="@/assets/img/dataView/yj.png" alt="" />
						</div>
						<div class="row">
							<span>收益: {{eliteList.yesterday?.[2]?.incomeAmount}}元</span>
							<img src="@/assets/img/dataView/sy.png" alt="" />
						</div>
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
		}
	},
	props: {
		eliteList: {
			type: Object,
			default: ()=>{}
		},
	},
};
</script>

<style lang="scss" scoped>
.centent_item {
	width: 100%;
	margin-top: 40px;
	.item_row {
		display: flex;
		align-items: center;
		justify-content: center;
		.item {
			position: relative;
			margin-bottom: 90px;
			.top_text {
				left: calc(50% - 30px);
				position: relative;
				font-size: 16px;
				width: 60px;
				font-weight: 700;

				text-align: center;
				color: #c9daff;
				line-height: 24px;
				margin-bottom: 16px;
				&::after {
					position: absolute;
					left: -60px;
					content: "";
					width: 60px;
					height: 1px;
					background-color: #334984;
					top: 50%;
					transform: translateY(-50%);
				}
				&::before {
					position: absolute;
					left: 60px;
					content: "";
					width: 60px;
					height: 1px;
					background-color: #334984;
					top: 50%;
					transform: translateY(-50%);
				}
			}

			.centent_info {
				display: flex;
				align-items: center;
				.info {
					position: relative;
					font-weight: 700;

					.profile_box {
						margin: 0 14px;
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
						img {
							width: 60px;
							height: 60px;
							border-radius: 50%;
						}
						.k {
							position: absolute;
							width: 85px;
							height: 85px;
						}
						
					}
					.sort{
							position: absolute;
							left: -10px;
							top: 48%;
							font-weight: normal;
							font-size: 14px;
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
					.row {
						display: flex;
						align-items: center;
						// 不换行
						white-space: nowrap;
						span {
							font-weight: 700;
							font-size: 12px;
							text-align: left;
							color: #8cd2f2;
							line-height: 24px;
							width: 80px;
						}

						img {
							margin-left: 4px;
							width: 12px;
							height: 12px;
						}
					}
				}
			}
		}

		.vs {
			width: 37px;
			height: 33px;
			margin: 0 10px;
			margin-bottom: 54px;
		}
	}
}
.jr1{
	color: #ebba46 !important;
}
.jr2 {
	color: #00d1ff !important;
}
.jr3 {
	color: #7a8cff !important;
}
</style>
