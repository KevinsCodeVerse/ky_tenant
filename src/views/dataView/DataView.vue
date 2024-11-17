<template>
	<div id="dataView" v-loading="load" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
		
		<template v-if="!load">
			<div class="top">
			<img src="@/assets/img/dataView/top.png" />
			<div class="title" @click="refreshjrjy">{{title}}</div>
			<div class="lastSyncTime">上次更新时间：{{lastSyncTime}}</div>
			<div class="date">{{ date }}</div>
			<i class="qp el-icon-full-screen" @click='toggleFullScreen'></i>
		</div>
		<div class="centent">
			<div class="left">
				<div class="title">精英榜</div>
				<CmpsLeft :eliteList="eliteList"></CmpsLeft>
			</div>
			<div ref="jrjyRef" class="center animate__animated animate__bounceInDown">
				<div class="title">今日精英</div>
				<CmpsCenter :eliteList="eliteList"></CmpsCenter>
			</div>
			<div class="right">
				<div class="title">金榜提名</div>
				<CmpsRight :usCommend="usCommend"></CmpsRight>
			</div>
		</div>
		<div class="bottom">
			<CmpsBottom :usHero="usHero"></CmpsBottom>
		</div>
		<div class="b_arr">
			<div class="b_tag">
				<CmpsGdt v-if="sliderData.length" :lists="sliderData" />
			</div>
			<div class="b">合作共赢: 团队协作，共同成就辉煌 创新进取: 勇于创新，追求卓越 持续学习: 不断学习，追求进步 激情投入: 全情投入，创造无限可能 快乐工作: 积极向上，快乐工作</div>
		</div>
		</template>
	</div>
</template>

<script>
import autofit from "autofit.js";
import CmpsLeft from "./cmps/CmpsLeft.vue";
import CmpsCenter from "./cmps/CmpsCenter.vue";
import CmpsRight from "./cmps/CmpsRight.vue";
import CmpsBottom from "./cmps/CmpsBottom.vue";
import CmpsGdt from "./cmps/CmpsGdt.vue";
export default {
	
	mounted() {
		this.updateTime();
		this.getToken();
		autofit.init({
			designHeight: 1080,
			designWidth: 1920,
			renderDom: "#dataView",
			resize: true,
		});
		// 显示element-ui加载动画
		

	},
	data() {
		return {
			title:'',
			load:true,
			timer: null,
			date: "",
			sliderData: [],
			usCommend: [],
			usHero: [],
			eliteList: {},
			// token 失效日期
			tokenExpireTime: "",
			lastSyncTime:'',
		};
	},
	watch: {
		eliteList: {
			handler: function(val, oldVal) {
				if (val?.today?.[0]?.name != oldVal.today?.[0]?.name&&oldVal.today?.[0]?.name) {
					this.refreshjrjy();
				}
			},
			deep: true,
		},
	},
	methods: {
		// 获取token过期
		getToken() {
			this.$request.post({
				url: "user/public/usHero/getTokenExpireTime",
				success: (res) => {
					console.log(res);
					this.tokenExpireTime = res;
				},
				error: () => {},
				finally: () => {},
			});
		},
		// 刷新今日精英
		refreshjrjy() {
			this.$refs.jrjyRef.classList.add("animate__animated", "animate__fadeOut");
			setTimeout(() => {
				this.$refs.jrjyRef.classList.remove("animate__fadeOut");
			}, 500);
		},
		// 获取表彰表
		getusCommend() {
			this.$request.post({
				url: "/user/public/usCommend/list",
				params: {
					pageNo: 1,
					pageSize: 3,
				},
				success: (res) => {
					this.usCommend = res.list;
				},
				error: () => {},
				finally: () => {},
			});
			// 金榜
			this.$request.post({
				url: "/user/public/usHero/select",
				params: {
					pageNo: 1,
					pageSize: 10,
				},
				success: (res) => {
					this.usHero = res;
					this.usHero.sort((a, b) => a.type - b.type);
					console.log(this.usHero);
				},
				error: () => {},
				finally: () => {},
			});
			// 精英榜
			this.$request.post({
				url: "/user/public/usOrder/eliteList",

				success: (res) => {
					this.load = false
					this.eliteList = res;
				},
				error: () => {},
				finally: () => {},
			});
			// 公告
			this.$request.post({
				url: "/user/public/params/getNotice",

				success: (res) => {
					this.sliderData.push(res);
				},
				error: () => {},
				finally: () => {},
			});
			// 公告
			this.$request.post({
				url: "/user/public/params/getTitle",
				success: (res) => {
					this.title = res
				},
				error: () => {},
				finally: () => {},
			});
			// 数据更新时间
			this.$request.post({
					url: 'user/public/usOrder/getLastSyncTime',
					params: {},
					success: (res) => {
						// 格式化时间
						this.lastSyncTime = this.$moment(res).format("Y-MM-DD HH:mm:ss")
					},
					
			});
		},
		// 实时更新当前时间 格式 2021年11月11日 16:00:00 星期六
		updateTime() {
			let index = 0;
			this.getusCommend();
			this.timer = setInterval((e) => {

				this.date = new Date().toLocaleString("zh", {
					hour12: false,
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					weekday: "long",
				});
				index++;
				if (Number(index) % 5 == 0) {
					if (new Date().getTime() > new Date(this.tokenExpireTime).getTime()) {
						return this.$message.error("token已过期，请更新token保证数据正常显示");
					}
					this.getusCommend();
				}
			}, 1000);
		},
		toggleFullScreen() {
			if (
				!document.fullscreenElement && // alternative standard method
				!document.mozFullScreenElement &&
				!document.webkitFullscreenElement
			) {
				// current working methods
				if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if (document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if (document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			} else {
				if (document.cancelFullScreen) {
					document.cancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
			}
		},
	},
	// 清空定时器
	beforeDestroy() {
		clearInterval(this.timer);
	},
	components: { CmpsLeft, CmpsCenter, CmpsRight, CmpsBottom, CmpsGdt },
};
</script>

<style lang="scss" scoped>
.animate__fadeOut {
	animation-duration: 0.5s;
}
.animate__bounceInDown {
	animation-duration: 1s;
}
#dataView {
	width: 100vw;
	height: 100vh;
	background-color: #030e3b;
	color: #fff;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-image: url("~@/assets/img/dataView/bj.jpg");
	background-repeat: no-repeat;
	background-size: 100% 100%;

	.top {
		position: relative;
		width: 100%;
		height: 100px;
		img {
			width: 100%;
			height: 100px;
		}
		.date {
			position: absolute;
			left: 40px;
			top: 28%;
			transform: translate(0%, -50%);
			font-size: 18px;
		}
		.lastSyncTime{
			position: absolute;
			left: 50%;
			bottom: 2%;
			transform: translate(-50%, -50%);
			font-size: 14px;
			font-weight: 400;
			color: #ffffff90;
			text-align: center;
			
		}
		.title {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			font-size: 24px;
			font-size: 30px;
			font-weight: 400;
			color: #ffffff;
			text-align: center;
		}
		.qp{
			position: absolute;
			right: 40px;
			top: 10px;
			font-size: 40px;
		}
	}

	.centent {
		width: 100%;
		height: 640px;
		display: flex;
		justify-content: space-between;
		padding: 0 55px;
		box-sizing: border-box;
		.left {
			height: 100%;
			background-image: url("~@/assets/img/dataView/l.png");
			background-size: 100% 100%;

			width: 471px;
			height: 640px;
			.title {
				color: #7a8cff;
			}
		}
		.center {
			height: 100%;
			margin-top: 20px;
			background-image: url("~@/assets/img/dataView/c.png");
			background-size: 100% 100%;
			width: 606px;
			height: 605px;
			.title {
				color: #ebba46;
			}
		}
		.right {
			height: 100%;
			background-size: 100% 100%;
			background-image: url("~@/assets/img/dataView/r.png");

			width: 471px;
			height: 640px;
			.title {
				color: #00d1ff;
			}
		}
		.title {
			font-size: 20px;
			text-align: center;
			line-height: 36px;
			font-weight: 700;
		}
	}
	.bottom {
		height: 210px;
		margin: 0 42px;
		margin-top: 20px;
		box-sizing: border-box;
		background-size: 100% 100%;
		background-image: url("~@/assets/img/dataView/b.png");
	}
	.b_tag {
		width: calc(100% - 84px);
		box-sizing: border-box;
		height: 50px;
		background: #22326790;
		border: 1px solid #32447b;
		padding: 0 40px;
		line-height: 50px;
		margin: 10px 42px;
		font-weight: normal;
		text-align: left;
		color: #8cd2f2;
		display: flex;
		align-items: center;
	}
	.b {
		width: 100%;
		height: 20px;
		font-size: 14px;
		font-weight: normal;
		text-align: center;
		color: #00d1ff;
		line-height: 28px;
		margin-bottom: 20px;
	}
	.b_arr {
	}
}
</style>
