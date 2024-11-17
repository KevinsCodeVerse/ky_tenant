<template>
	<div id="authority_account">
		<main-head>
			<span slot="after">
				<el-button plain size="medium" @click="openAddForm" type="primary" icon="el-icon-plus">添加金榜提名</el-button>
			</span>
		</main-head>
		<main-content>
			<!-- 筛选 -->
			<!-- <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
				<el-form-item>
					<el-select v-model="params.status" placeholder="状态" @change="search">
						<el-option value="" label="全部"></el-option>
						<el-option value="1" label="正常"></el-option>
						<el-option value="-1" label="已冻结"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
				</el-form-item>
			</el-form> -->
			<!-- 表格 -->
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="name" label="头像" align="center">
					<template slot-scope="scope">
						<el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" class="img" fit="fill" :lazy="true"></el-image>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="大图" align="center">
					<template slot-scope="scope">
						<el-image :src="scope.row.bigAvatar" :preview-src-list="[scope.row.bigAvatar]" style="height: 60px;" fit="fill" :lazy="true"></el-image>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="荣誉头像框" align="center">
					<template slot-scope="scope">
						<el-image :src="scope.row.avatarFrame" :preview-src-list="[scope.row.avatarFrame]" class="img" fit="fill" :lazy="true"></el-image>
					</template>
				</el-table-column>
				<el-table-column prop="commend" label="表彰内容" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="empName" label="员工姓名" align="center"></el-table-column>
				<el-table-column prop="gloryName" label="荣誉" align="center"></el-table-column>
				<el-table-column prop="performanceAmount" label="业绩金额" align="center"></el-table-column>
				<el-table-column prop="incomeAmount" label="收益金额" align="center"></el-table-column>
				<el-table-column prop="rewardAmount" label="奖励金额" align="center"></el-table-column>
				<el-table-column prop="orderNum" label="订单数" align="center"></el-table-column>
				<el-table-column label="创建时间" align="center">
					<template slot-scope="scope">
						<span>{{ $moment(scope.row.createTime).format("Y-MM-DD HH:mm") }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="310" class-name="operation">
					<template slot-scope="scope">
						<el-button type="primary" plain size="small" @click="setupdateForm(scope.row)">修改</el-button>
						<el-button type="danger" plain size="small" @click="del(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
				background
				:layout="$store.state.isPhone ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
				:page-size.sync="params.pageSize"
				:current-page.sync="params.pageNo"
				:total="total"
				@size-change="search"
				@current-change="getList"
				class="page"
			>
			</el-pagination>
		</main-content>

		<!-- 添加账号弹框 -->
		<el-dialog center title="添加金榜提名" :visible.sync="addVisible" :close-on-click-modal="false" width="420px">
			<el-form ref="form" :model="addForm" label-width="100px" :rules="rules" label-position="left">
					<el-form-item label="选择员工" prop="empId">
					<el-select v-model="addForm.empId" placeholder="选择员工" filterable clearable>
						<el-option v-for="item in userLsit" :key="item.value" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择荣誉" prop="gloryId">
					<el-select v-model="addForm.gloryId" placeholder="选择荣誉" filterable clearable>
						<el-option v-for="item in gloryList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="表彰内容" prop="commend">
					<el-input type="textarea" autosize v-model="addForm.commend" placeholder="请输入表彰内容"></el-input>
				</el-form-item>
				<el-form-item label="收益金额" prop="incomeAmount">
					<el-input v-model="addForm.incomeAmount" placeholder="请输入收益金额" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="业绩金额" prop="performanceAmount">
					<el-input v-model="addForm.performanceAmount" placeholder="请输入业绩金额" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="订单数" prop="orderNum">
					<el-input v-model="addForm.orderNum" placeholder="请输入订单数" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="奖励金额" prop="rewardAmount">
					<el-input v-model="addForm.rewardAmount" placeholder="请输入奖励金额" maxlength="30"></el-input>
				</el-form-item>
				
			
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="add">添 加</el-button>
			</span>
		</el-dialog>

		<!-- 修改账号弹框 -->
		<el-dialog center title="修改金榜提名" :visible.sync="updateVisible" :close-on-click-modal="false" width="500px">
			<el-form ref="form" :model="updateForm" label-width="100px" :rules="rules">
				<el-form-item label="选择员工" prop="empId">
					<el-select v-model="updateForm.empId" placeholder="选择员工" filterable clearable>
						<el-option v-for="item in userLsit" :key="item.value" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择荣誉" prop="gloryId">
					<el-select v-model="updateForm.gloryId" placeholder="选择荣誉" filterable clearable>
						<el-option v-for="item in gloryList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="表彰内容" prop="commend">
					<el-input type="textarea" autosize v-model="updateForm.commend" placeholder="请输入表彰内容" ></el-input>
				</el-form-item> 
				<el-form-item label="收益金额" prop="incomeAmount">
					<el-input v-model="updateForm.incomeAmount" placeholder="请输入收益金额" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="业绩金额" prop="performanceAmount">
					<el-input v-model="updateForm.performanceAmount" placeholder="请输入业绩金额" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="订单数" prop="orderNum">
					<el-input v-model="updateForm.orderNum" placeholder="请输入订单数" maxlength="30"></el-input>
				</el-form-item>
					<el-form-item label="奖励金额" prop="rewardAmount">
					<el-input v-model="updateForm.rewardAmount" placeholder="请输入奖励金额" maxlength="30"></el-input>
				</el-form-item>
				
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="updateVisible = false">取 消</el-button>
				<el-button type="primary" @click="update">修 改</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import rsa from "@/utils/rsa";
import ImgCropper from "../../../components/utils/ImgCropper.vue";

export default {
	components: { ImgCropper },
	data() {
		return {
			list: [],
			load: false,
			cropperShow: false,
			bigAvatarcropperShow: false,
			params: {
				pageSize: 10,
				pageNo: 1,
				status: "",
			},
			total: 0,

			roleTotal: 0,
			roleList: [],
			addVisible: false,
			updateVisible: false,
			typeList: [
				{
					label: "精英榜",
					value: 1,
				},
				{
					label: "英雄荣誉",
					value: 2,
				},
				{
					label: "金牌荣誉",
					value: 3,
				},
			],
			userLsit: [],
			gloryList: [],
			// 账号表单信息
			updateForm: {
				id: "",
				commend: "",
				empId: "",
				gloryId: "",
				incomeAmount: "",
				orderNum: "",
				performanceAmount: "",
				rewardAmount:"",
			},
			addForm: {
				commend: "",
				empId: "",
				gloryId: "",
				incomeAmount: "",
				orderNum: "",
				performanceAmount: "",
				rewardAmount:"",
			},
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
				orderNum: {
					message: "请输入订单数",
					required: true,
				},
				performanceAmount: {
					message: "请输入业绩金额",
					required: true,
				},
				rewardAmount: {
					message: "请输入奖励金额",
					required: true,
				},
			},
		};
	},

	mounted() {
		this.search();
		this.getuserList();
		this.getusGloryList();
	},

	methods: {
		search() {
			this.params.pageNo = 1;
			this.getList();
		},

		// 获取账号列表
		getList() {
			this.load = true;
			this.$request.post({
				url: "/admin/usCommend/list",
				params: this.params,
				success: (result) => {
					this.list = result.list;
					this.total = result.total;
				},
				finally: () => {
					this.load = false;
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

		// 添加
		add() {
			if (this.load) {
				return;
			}
			this.$refs["form"].validate((valid) => {
				if (valid) {
					this.load = true;
					this.addVisible = false;
					let formData = new FormData();
					formData.append("commend", this.addForm.commend);
					formData.append("empId", this.addForm.empId);
					formData.append("gloryId", this.addForm.gloryId);
					formData.append("incomeAmount", this.addForm.incomeAmount);
					formData.append("orderNum", this.addForm.orderNum);
					formData.append("performanceAmount", this.addForm.performanceAmount);
					formData.append("rewardAmount", this.addForm.rewardAmount);
					this.$request.post({
						url: "/admin/usCommend/add",
						params: formData,
						success: (result) => {
							this.$message.success("添加成功");
							this.search();
						},
						finally: () => {
							this.load = false;
						},
					});
				}
			});
		},

		// 打开添加窗口
		openAddForm() {
			this.reset();
			this.addVisible = true;
		},

		// 重置表单信息
		reset() {
			this.updateForm = {
				id: "",
				commend: "",
				empId: "",
				gloryId: "",
				incomeAmount: "",
				orderNum: "",
				performanceAmount: "",
				rewardAmount:"",
			};
			this.addForm = {
				id: "",
				commend: "",
				empId: "",
				gloryId: "",
				incomeAmount: "",
				orderNum: "",
				performanceAmount: "",
				rewardAmount:"",
			};

			var setint = setInterval(() => {
				if (this.$refs.form) {
					this.$refs.form.resetFields();
					this.$refs.form.clearValidate();
					clearInterval(setint);
				}
			}, 100);
		},

		// 设置角色表单信息
		setupdateForm(data) {
			console.log(data);
			this.updateForm = {
				id: data.id,
				commend: data.commend,
				empId: data.empId,
				gloryId: data.gloryId,
				incomeAmount: data.incomeAmount,
				orderNum: data.orderNum,
				performanceAmount: data.performanceAmount,
				rewardAmount: data.rewardAmount,
			};
			this.updateVisible = true;
		},

		// 修改
		update() {
			this.$refs["form"].validate((valid) => {
				if (!valid) {
					return;
				}
				if (this.load) {
					return;
				}
				this.updateVisible = false;
				this.load = true;
				let formData = new FormData();
				formData.append("id", this.updateForm.id);
				formData.append("commend", this.updateForm.commend);
				formData.append("empId", this.updateForm.empId);
				formData.append("gloryId", this.updateForm.gloryId);
				formData.append("incomeAmount", this.updateForm.incomeAmount);
				formData.append("orderNum", this.updateForm.orderNum);
				formData.append("performanceAmount", this.updateForm.performanceAmount);
				formData.append("rewardAmount", this.updateForm.rewardAmount);
				this.$request.post({
					url: "/admin/usCommend/update",
					params: formData,
					success: (result) => {
						this.$message.success("修改成功");
						this.reset();
						this.getList();
					},
					finally: () => {
						this.load = false;
					},
				});
			});
		},
		// base64转换file流文件
		dataURLtoFile(dataurl, filename) {
			// 判断有/files
			if (dataurl.indexOf("/files") != -1) {
				return "";
			}
			var arr = dataurl.split(","),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, {
				type: mime,
			});
		},

		// 删除
		del(id) {
			if (this.load) {
				return;
			}
			this.$confirm("此操作将永久删除, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).then(() => {
				this.load = true;
				this.$request.post({
					url: "/admin/usCommend/delete",
					params: {
						id,
					},
					success: (result) => {
						this.$message.success("删除成功");
						if (this.list.length < 2 && this.params.pageNo > 1) {
							this.params.pageNo--;
						}
						this.getList();
					},
					finally: () => {
						this.load = false;
					},
				});
			});
		},
	},
};
</script>

<style></style>

<style scoped>
.img {
	width: 60px;
	height: 60px;
}
</style>
