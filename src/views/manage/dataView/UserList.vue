<template>
	<div id="authority_account">
		<main-head>
			<span slot="after">
				<el-button plain size="medium" @click="openAddForm" type="primary" icon="el-icon-plus">添加员工</el-button>
			</span>
		</main-head>
		<main-content>
			<!-- 筛选 -->
			<el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
				<el-form-item>
					<el-input v-model="params.name" placeholder="请输入员工姓名" @keyup.enter.native="search"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
				</el-form-item>
			</el-form>
			<!-- 表格 -->
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="name" label="名字" align="center"></el-table-column>
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
		<el-dialog center title="添加账号" :visible.sync="addVisible" :close-on-click-modal="false" width="420px">
			<el-form v-if="addVisible" ref="form" :model="addForm" label-width="100px" :rules="rules" label-position="left">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" placeholder="请输入姓名" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="上传头像" prop="file">
					<el-image class="img" style="margin-right: 10px;" v-if="addForm.file" :src="addForm.file" fit="cover"></el-image>
					<el-button type="primary" size="small" @click="cropperShow = true">上传</el-button>
					<img-cropper width="150" height="150" :show.sync="cropperShow" @success="addForm.file = $event"></img-cropper>
				</el-form-item>
				<el-form-item label="上传大图" prop="bigAvatar">
					<el-image class="img" style="margin-right: 10px;" v-if="addForm.bigAvatar" :src="addForm.bigAvatar" fit="cover"></el-image>
					<el-button type="primary" size="small" @click="bigAvatarcropperShow = true">上传</el-button>
					<img-cropper :enlarge="2" width="191" height="255" :show.sync="bigAvatarcropperShow" @success="addForm.bigAvatar = $event"></img-cropper>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="add">添 加</el-button>
			</span>
		</el-dialog>

		<!-- 修改账号弹框 -->
		<el-dialog center title="修改员工" :visible.sync="updateVisible" :close-on-click-modal="false" width="500px">
			<el-form v-if="updateVisible" ref="form" :model="updateForm" label-width="100px" :rules="rules">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="updateForm.name" placeholder="请输入姓名" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="上传头像" prop="file">
					<el-image class="img" style="margin-right: 10px;" v-if="updateForm.file" :src="updateForm.file" fit="cover"></el-image>
					<el-button type="primary" size="small" @click="cropperShow = true">上传</el-button>
					<img-cropper width="150" height="150" :show.sync="cropperShow" @success="updateForm.file = $event"></img-cropper>
				</el-form-item>
				<el-form-item label="上传大图" prop="bigAvatar">
					<el-image class="img" style="margin-right: 10px;" v-if="updateForm.bigAvatar" :src="updateForm.bigAvatar" fit="cover"></el-image>
					<el-button type="primary" size="small" @click="bigAvatarcropperShow = true">上传</el-button>
					<img-cropper :enlarge="2" width="191" height="255" :show.sync="bigAvatarcropperShow" @success="updateForm.bigAvatar = $event"></img-cropper>
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
			// 是否修改密码
			isUpdPwd: "1",
			storeList: [],
			// 账号表单信息
			updateForm: {
				id: -1,
				bigAvatar: "",
				name: "",
				file: "",
				name: "",
			},
			addForm: {
				bigAvatar: "",
				name: "",
				file: "",
				name: "",
			},
			rules: {
				name: {
					message: "请输入姓名",
					required: true,
				},
				// file: {
				// 	message: "请输入上传头像",
				// 	required: true,
				// },
				// bigAvatar: {
				// 	message: "请输入上传大图",
				// 	required: true,
				// },
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
				url: "/admin/usEmployee/list",
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
					formData.append("name", this.addForm.name);
					this.addForm.bigAvatar && formData.append("bigAvatar", this.dataURLtoFile(this.addForm.bigAvatar, "test.png"));
					this.addForm.file && formData.append("file", this.dataURLtoFile(this.addForm.file, "test.png"));
					this.$request.post({
						url: "/admin/usEmployee/add",
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
				id: -1,
				bigAvatar: "",
				name: "",
				file: "",
			};
			this.addForm = {
				bigAvatar: "",
				name: "",
				file: "",
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
				name: data.name,
				bigAvatar: data.bigAvatar,
				file: data.avatar,
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
				formData.append("name", this.updateForm.name);

				this.updateForm.bigAvatar && formData.append("bigAvatar", this.dataURLtoFile(this.updateForm.bigAvatar, "test.png"));
				this.updateForm.file && formData.append("file", this.dataURLtoFile(this.updateForm.file, "test.png"));

				this.$request.post({
					url: "/admin/usEmployee/update",
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
					url: "/admin/usEmployee/delete",
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
