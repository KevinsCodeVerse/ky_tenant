<template>
	<div id="authority_account">
		<main-head>
			<span slot="after">
				<el-button plain size="medium" @click="openAddForm" type="primary" icon="el-icon-plus">添加荣誉等级</el-button>
			</span>
		</main-head>
		<main-content>
			<!-- 筛选 -->
			<el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
				<el-form-item>
					<el-radio-group v-model="params.type" @change="search">
      <el-radio-button label="">全部</el-radio-button>
      <el-radio-button label="1">精英榜</el-radio-button>
      <el-radio-button label="2">英雄荣誉</el-radio-button>
      <el-radio-button label="3">金牌荣誉</el-radio-button>
    </el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
				</el-form-item>
			</el-form>
			<!-- 表格 -->
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="gloryName" label="荣誉名称" align="center"></el-table-column>
				<el-table-column prop="ranking" label="荣誉排名" align="center"></el-table-column>
				<el-table-column prop="avatarFrame" label="头像框" align="center">
					<template slot-scope="scope">
						<el-image :src="scope.row.avatarFrame" :preview-src-list="[scope.row.avatarFrame]" class="img" fit="fill" :lazy="true"></el-image>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="荣誉分类" align="center">
					<template slot-scope="scope">
							{{typeList.find(item => item.value === scope.row.type).label}}
					</template>
				</el-table-column>
				
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
		<el-dialog center title="添加荣誉等级" :visible.sync="addVisible" :close-on-click-modal="false" width="420px">
			<el-form  v-if="addVisible" ref="form" :model="addForm" label-width="100px" :rules="rules" label-position="left">
				<el-form-item label="荣誉分类" prop="type">
					<el-select v-model="addForm.type"  placeholder="荣誉分类" clearable >
						<el-option v-for="item in typeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="荣誉名称" prop="gloryName">
					<el-input v-model="addForm.gloryName" placeholder="请输入荣誉名称" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="荣誉排名" prop="ranking">
					<el-input v-model="addForm.ranking" placeholder="请输入荣誉排名" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="上传头像框" prop="file">
					<el-image class="img" style="margin-right: 10px;" v-if="addForm.file" :src="addForm.file" fit="cover"></el-image>
					<el-button type="primary" size="small" @click="cropperShow = true">上传</el-button>
					<img-cropper width="150" height="150" :show.sync="cropperShow" @success="addForm.file = $event"></img-cropper>
				</el-form-item>
				
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="add">添 加</el-button>
			</span>
		</el-dialog>

		<!-- 修改账号弹框 -->
		<el-dialog center title="修改荣誉等级" :visible.sync="updateVisible" :close-on-click-modal="false" width="500px">
			<el-form v-if="updateVisible" ref="form" :model="updateForm" label-width="100px" :rules="rules">
				<el-form-item label="荣誉分类" prop="type">
					<el-select v-model="updateForm.type"  placeholder="荣誉分类" clearable >
						<el-option v-for="item in typeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
					
				</el-form-item>
				<el-form-item label="荣誉名称" prop="gloryName">
					<el-input v-model="updateForm.gloryName" placeholder="请输入荣誉名称" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="荣誉排名" prop="ranking">
					<el-input v-model="updateForm.ranking" placeholder="请输入荣誉排名" maxlength="30"></el-input>
				</el-form-item>
				
				<el-form-item label="上传头像框" prop="file">
					<el-image class="img" style="margin-right: 10px;" v-if="updateForm.file" :src="updateForm.file" fit="cover"></el-image>
					<el-button type="primary" size="small" @click="cropperShow = true">上传</el-button>
					<img-cropper width="150" height="150" :show.sync="cropperShow" @success="updateForm.file = $event"></img-cropper>
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
				type: '',
			},
			total: 0,

			roleTotal: 0,
			roleList: [],
			addVisible: false,
			updateVisible: false,
			// 是否修改密码
			isUpdPwd: "1",
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
			// 账号表单信息
			updateForm: {
				id: '',
				gloryName: "",
				ranking: "",
				file: "",
				type: "",
			},
			addForm: {
				gloryName: "",
				ranking: "",
				file: "",
				type: "",
			},
			rules: {
				gloryName: {
					message: "荣誉名称",
					required: true,
				},
				file: {
					message: "请输入上传头像框",
					required: true,
				},
				ranking: {
					message: "荣誉排名",
					required: true,
				},
					type: {
					message: "荣誉分类",
					required: true,
				},
				


			},
		};
	},

	mounted() {
		this.search();
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
				url: "/admin/usGlory/list",
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
					formData.append("gloryName", this.addForm.gloryName);
					formData.append("ranking", this.addForm.ranking);
					formData.append("type", this.addForm.type);
					this.addForm.file && formData.append("file", this.dataURLtoFile(this.addForm.file, "test.png"));
					this.$request.post({
						url: "/admin/usGlory/add",
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
				id: '',
				gloryName: "",
				ranking: "",
				file: "",
				type: "",
			};
			this.addForm = {
				id: '',
				gloryName: "",
				ranking: "",
				file: "",
				type: "",
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
				gloryName: data.gloryName,
				ranking: data.ranking,
				file: data.avatarFrame,
				type: data.type,
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
				formData.append("gloryName", this.updateForm.gloryName);
				formData.append("ranking", this.updateForm.ranking);
				formData.append("type", this.updateForm.type);
				this.updateForm.file && formData.append("file", this.dataURLtoFile(this.updateForm.file, "test.png"));

				this.$request.post({
					url: "/admin/usGlory/update",
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
				return '';
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
					url: "/admin/usGlory/delete",
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
