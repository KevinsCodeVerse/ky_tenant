<template>
	<div id="sys_params">
		<main-head></main-head>

		<main-content>
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="name" label="参数名" align="center"></el-table-column>
				<el-table-column prop="value" label="参数值" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" label="备注" align="center"></el-table-column>
				<el-table-column label="创建时间" align="center">
					<template slot-scope="scope">
						<span>{{ $moment(scope.row.createTime).format("Y-MM-DD HH:mm") }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" plain size="small" @click="update(scope.row.id, scope.row)">修改</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				class="page"
				background
				:layout="$store.state.isPhone ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
				:current-page.sync="params.pageNo"
				:page-size.sync="params.pageSize"
				:total="total"
				@size-change="search"
				@current-change="getList"
			>
			</el-pagination> 
		</main-content>
		<el-dialog title="编辑" :visible.sync="showUpdate" width="30%" @close="close">
			<el-input type="textarea" autosize v-model="updateQuery.value" size="normal" clearable></el-input>

			<span slot="footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="submitUpdate">确认修改</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			load: false,
			showUpdate: false,
			params: {
				pageSize: 10,
				pageNo: 1,
				isCount: true,
			},
			total: 0,
			updateQuery: {
				id: "",
				value: "",
			},
		};
	},

	mounted() {
		this.search();
	},

	methods: {
		submitUpdate() {
			this.$request.post({
				url: "system/sysParams/admin/update",
				params: this.updateQuery,
				success: (result) => {
					this.$message.success("更新成功");
					this.close();
					this.getList();
				},
			});
		},
		close() {
			this.showUpdate = false;
			this.updateQuery = {
				id: "",
				value: "",
			};
		},
		search() {
			this.params.pageNo = 1;
			this.params.isCount = true;
			this.getList();
		},

		getList() {
			this.load = true;
			this.$request.post({
				url: "system/sysParams/admin/list",
				params: this.params,
				success: (result) => {
					if (this.params.isCount) {
						this.total = result.total;
					}
					this.params.isCount = false;
					this.list = result.list;
				},
				finally: () => {
					this.load = false;
				},
			});
		},

		update(id, { value }) {
			if ([1,3].includes(id)) {
				this.updateQuery.id = id;
				this.updateQuery.value = value;
				this.showUpdate = true;
				return;
			}
			this.$prompt("请输入参数值", "修改", {
				inputValue: value,
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				inputPattern: /\S/,
				inputErrorMessage: "请输入参数值",
			}).then(({ value }) => {
				this.load = true;
				this.$request.post({
					url: "system/sysParams/admin/update",
					params: {
						id,
						value,
					},
					success: (result) => {
						this.$message.success("更新成功");
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

<style scoped lang="scss">
.page {
	text-align: right;
	margin-top: 20px;
}
</style>
<style>
.el-tooltip__popper {
	max-width: 400px !important;
}
</style>
