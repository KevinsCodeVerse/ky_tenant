<template>
	<div>
		<main-head>
			<span slot="after">
				<el-button plain size="medium" @click="submit" type="primary" icon="el-icon-plus">保存</el-button>
			</span>
		</main-head>
		<div class="hero">
			<el-card class="card" shadow="always" :body-style="{ padding: '20px' }">
				<div slot="header">
					<span>今日英雄</span>
				</div>
				<el-form ref="form1" :model="usHeroes[0]" label-width="100px" :rules="rules">
					<el-form-item label="选择员工" prop="empId">
						<el-select v-model="usHeroes[0].empId" placeholder="选择员工" filterable clearable>
							<el-option v-for="item in userLsit" :key="item.value" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择荣耀" prop="gloryId">
						<el-select v-model="usHeroes[0].gloryId" placeholder="选择荣耀" filterable clearable>
							<el-option v-for="item in gloryList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="表彰内容" prop="commend">
						<el-input type="textarea" autosize v-model="usHeroes[0].commend" placeholder="请输入表彰内容"></el-input>
					</el-form-item>
					<el-form-item label="收益金额" prop="incomeAmount">
						<el-input v-model="usHeroes[0].incomeAmount" placeholder="请输入收益金额" maxlength="30"></el-input>
					</el-form-item>
					<el-form-item label="业绩金额" prop="performanceAmount">
						<el-input v-model="usHeroes[0].performanceAmount" placeholder="请输入业绩金额" maxlength="30"></el-input>
					</el-form-item>
				</el-form>
			</el-card>
			<el-card class="card" shadow="always" :body-style="{ padding: '20px' }">
				<div slot="header">
					<span>本月英雄</span>
				</div>
				<el-form ref="form2" :model="usHeroes[1]" label-width="100px" :rules="rules">
					<el-form-item label="选择员工" prop="empId">
						<el-select v-model="usHeroes[1].empId" placeholder="选择员工" filterable clearable>
							<el-option v-for="item in userLsit" :key="item.value" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择荣耀" prop="gloryId">
						<el-select v-model="usHeroes[1].gloryId" placeholder="选择荣耀" filterable clearable>
							<el-option v-for="item in gloryList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="表彰内容" prop="commend">
						<el-input type="textarea" autosize v-model="usHeroes[1].commend" placeholder="请输入表彰内容"></el-input>
					</el-form-item>
					<el-form-item label="收益金额" prop="incomeAmount">
						<el-input v-model="usHeroes[1].incomeAmount" placeholder="请输入收益金额" maxlength="30"></el-input>
					</el-form-item>
					<el-form-item label="业绩金额" prop="performanceAmount">
						<el-input v-model="usHeroes[1].performanceAmount" placeholder="请输入业绩金额" maxlength="30"></el-input>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			load: false,
			usHeroes: [
				{
					empId: "",
					gloryId: "",
					commend: "",
					incomeAmount: "",
					performanceAmount: "",
				},
				{
					empId: "",
					gloryId: "",
					commend: "",
					incomeAmount: "",
					performanceAmount: "",
				},
			],
			userLsit: [],
			gloryList: [],
			rules: {
				commend: {
					message: "请输入表彰内容",
					required: true,
				},
				empId: {
					message: "请选择员工",
					required: true,
				},
				gloryId: {
					message: "请选择荣誉",
					required: true,
				},
				incomeAmount: {
					message: "收益金额",
					required: true,
				},
				performanceAmount: {
					message: "请输入业绩金额",
					required: true,
				},
			},
		};
	},
	created() {
		this.getUsHeroes();
		this.getuserList();
		this.getusGloryList();
	},
	methods: {
		submit() {
			this.$refs["form1"].validate((valid) => {
				if (!valid) return;
				this.$refs["form2"].validate((valid) => {
					if (!valid) return;
					if (this.load) return;
					this.load = true;
					this.usHeroes[0].type = 1;
					this.usHeroes[1].type = 2;
					let usHeroes = JSON.stringify(this.usHeroes);
					console.log(usHeroes);
					this.$request.post({
						type: "array",
						url: "/admin/usHero/update",
						params: { usHeroes },
						success: (res) => {
							this.$message.success("提交成功");
						},
						error: () => {},
						finally: () => {
							this.load = false;
						},
					});
				});
			});
		},
		getUsHeroes() {
			this.$request.post({
				url: "/admin/usHero/select",
				params: {},
				success: (res) => {
					if(res.length == 0) return;
					this.usHeroes = res 
				},
				error: () => {},
				finally: () => {},
			});
		},
		// 获取所有列表
		getuserList() {
			this.$request.post({
				url: "/admin/usEmployee/list",
				params: {
					pageNo: 1,
					pageSize: 1000,
				},
				success: (result) => {
					this.userLsit = result.list.map((item) => {
						return {
							label: item.name,
							value: item.id,
						};
					});
				},
			});
		},
		// 获取所有荣誉列表
		getusGloryList() {
			this.$request.post({
				url: "/admin/usGlory/list",
				params: {
					pageNo: 1,
					pageSize: 1000,
				},
				success: (result) => {
					this.gloryList = result.list.map((item) => {
						return {
							label: item.gloryName,
							value: item.id,
						};
					});
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.hero {
	display: flex;
	padding: 20px 0;

	.card {
		width: 50%;
		&:first-child {
			margin-right: 20px;
		}
	}
}
</style>
