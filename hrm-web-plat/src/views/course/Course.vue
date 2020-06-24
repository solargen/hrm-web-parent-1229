<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" v-model="filters.keyword" placeholder="关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select size="small" clearable  v-model="filters.status" placeholder="请选择状态">
						<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" v-on:click="getCoursesAdvanced">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="success" @click="handleOnline">上线</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="warning" @click="handleOffline">下线</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="courses" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="课程名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="courseType.name" label="课程类型" width="100" sortable>
			</el-table-column>
			<el-table-column prop="userName" label="创建人" width="100" sortable>
			</el-table-column>
			<el-table-column prop="startTime" label="上线时间" width="180" sortable :formatter="formatStartTime">
			</el-table-column>
			<el-table-column prop="endTime" label="下线时间" width="180" sortable :formatter="formatEndTime">
			</el-table-column>
			<el-table-column prop="status" label="状态" min-width="80" sortable>
				<template scope="scope">
					<span style="color:green" v-if="scope.row.status==1">上线</span>
					<span style="color:red" v-else>下线</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="300" fixed="right">
				<template scope="scope">
					<el-button type="default" size="small" @click="handleEdit(scope.$index, scope.row)">基本信息</el-button>
					<el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">市场信息</el-button>
					<el-button type="danger" size="small" @click="handleEdit(scope.$index, scope.row)">资源信息</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面（基本信息）-->
		<el-dialog title="新增" :visible.sync="courseVisible" :close-on-click-modal="false">
			<el-form :model="course" label-width="80px" :rules="courseRules" ref="course">
				<el-form-item label="课程名称" prop="name">
					<el-input v-model="course.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="适用人群" prop="users">
					<el-input v-model="course.users" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程类型">
					<el-cascader :props="props" style="width: 100%" clearable
							v-model="course.courseTypeId"
							:options="courseTypes"></el-cascader>
				</el-form-item>
				<el-form-item label="课程等级" >
					<!--<el-input v-model="course.grade" auto-complete="off"></el-input>-->
					<!--<el-radio v-for="level in levels" v-model="course.grade" :label="level.id">{{level.name}}</el-radio>-->
					<el-radio v-model="grade" :label="21">初级</el-radio>
					<el-radio v-model="grade" :label="22">中级</el-radio>
					<el-radio v-model="grade" :label="23">高级</el-radio>
				</el-form-item>
				<el-form-item label="课程图片">
					<!--<el-input v-model="course.pic" auto-complete="off"></el-input>-->
					<el-upload
							action="http://localhost:1299/services/file/upload"
							:on-success="handleUploadSuccess"
							:limit="1"
							list-type="picture">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="课程简介">
					<el-input type="textarea" v-model="course.intro" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程详情">
					<!--<el-input type="textarea" v-model="course.description" auto-complete="off"></el-input>-->
					<quill-editor
		                v-model="course.description"
		              ></quill-editor>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="courseVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>

    import { quillEditor } from 'vue-quill-editor';
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

	export default {
	    components:{
            quillEditor
		},
		data() {
			return {
			    grade:null,
			    levels:[],
                props:{
                    label: "name",
					value: "id"
				},
			    //课程类型
                courseTypes:[],
                options: [{
                    value: 1,
                    label: '上线'
                }, {
                    value: 0,
                    label: '下线'
                }],
				filters: {
					keyword: '',
					status:null
				},
				courses: [],
				total: 0,
				page: 1,
				pageSize:10,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				courseVisible: false,//新增界面是否显示
				addLoading: false,
				courseRules: {
					name: [
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				course: {
					name: '',
					users:'',
                    courseTypeId:null,
					grade:'21',
					pic:'',
                    intro:'',
					description:''
				}

			}
		},
		methods: {
	        //课程上线
            handleOnline(){

                //选取选中的行
				if(this.sels.length<=0){
                    this.$message({
                        message: "请选中要上线的课程!",
                        type: 'warning'
                    });
                    return;
				}
				//判断是否重复上线,后端判断

				let ids = this.sels.map(course=>{
				    return course.id;
				})

                this.$confirm('你确定要上线这'+ids.length+'个课程?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("/course/course/online",ids)
                        .then(res=>{
                            let {success,message} = res.data;
                            if(success){
                                this.$message({
                                    message: "上线成功!",
                                    type: 'success'
                                });
                                this.getCourses();
                            }else{
                                this.$message({
                                    message: message,
                                    type: 'error'
                                });
                            }
                        })
                })




			},
			//课程下线
            handleOffline(){
                //选取选中的行
                if(this.sels.length<=0){
                    this.$message({
                        message: "请选中要下线的课程!",
                        type: 'warning'
                    });
                    return;
                }
                //判断是否重复上线,后端判断

                let ids = this.sels.map(course=>{
                    return course.id;
                })

                this.$confirm('你确定要下线这'+ids.length+'个课程?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("/course/course/offline",ids)
                        .then(res=>{
                            let {success,message} = res.data;
                            if(success){
                                this.$message({
                                    message: "下线成功!",
                                    type: 'success'
                                });
                                this.getCourses();
                            }else{
                                this.$message({
                                    message: message,
                                    type: 'error'
                                });
                            }
                        })
                })
			},
		    //课程图片上传成功
            handleUploadSuccess(response, file, fileList){
                let {success,message,resultObj} = response;
                if(success){
                    this.course.pic = resultObj;
                    this.$message({
                        message: "上传成功!",
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: "上传失败!",
                        type: 'error'
                    });
                }
            },
		    getLevels(){
		        this.$http.get("/system/systemdictionaryItem/getCourseLevel")
					.then(res=>{
					    this.levels = res.data;
                        //初始化couse.grade的值
                        this.grade = this.levels[0].id;
					})
			},
            // 递归判断列表，把最后的children设为undefined
            getTreeData(data){
                for(var i=0;i<data.length;i++){
                    if(data[i].children.length<1){
                        // children若为空数组，则将children设为undefined
                        data[i].children=undefined;
                    }else {
                        // children若不为空数组，则继续 递归调用 本方法
                        this.getTreeData(data[i].children);
                    }
                }
                return data;
            },
		    //加载课程类型
		    getCourseTypes(){
		        this.$http.get("/course/courseType/loadTypeTree")
					.then(res=>{
					    this.courseTypes = this.getTreeData(res.data);
					})
			},
            formatStartTime(row, column){
				return this.formatTime(row.startTime)
			},
            formatEndTime(row, column){
                return this.formatTime(row.endTime)
            },
			//时间显示转换
            formatTime: function (time) {
                if(!time){
                    return "";
				}
                let date = new Date(time);
				let year = date.getFullYear();
				let mounth = date.getMonth()+1;
				let day = date.getDate();//getDay是一周中的第几天,getDate是一个月中的第几天
				let hours = date.getHours();
				let minutes = date.getMinutes();
				let seconds = date.getSeconds();

				return year+"-"+this.formatNum(mounth)+"-"+this.formatNum(day)
					+" "+this.formatNum(hours)+":"+this.formatNum(minutes)+":"+this.formatNum(seconds);
			},
			formatNum(num){
                if(num<10){
                    return "0"+num;
				}
				return num;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCourses();
			},
			//课程列表高级查询
            getCoursesAdvanced(){
                this.page = 1;
                this.getCourses();
			},
			//获取课程列表
			getCourses() {
				let para = {
					pageNum: this.page,
					pageSize: this.pageSize,
					keyword: this.filters.keyword,
					status: this.filters.status
				};
				this.listLoading = true;

				this.$http.post("/course/course/page",para)
					.then(res=>{
                        this.total = res.data.total;
						this.courses = res.data.rows;
						this.listLoading = false;
					})
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeCourse(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCourses();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.courseVisible = true;
				this.course = {
                    name: '',
                    users:'',
                    courseTypeId:null,
                    grade:'21',
                    pic:'',
                    intro:'',
                    description:''
                };
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editCourse(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getCourses();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.course.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.course);
							para.grade = this.grade;
							//cascader 级联选择器选中的结果是一个数组，我们只需要提交最后一级的类型
							para.courseTypeId = this.course.courseTypeId[this.course.courseTypeId.length-1];
							this.$http.post("/course/course/add",para)
								.then(res=>{
                                    this.addLoading = false;
								    let {success,message} = res.data;
								    if(success){
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.$refs['course'].resetFields();
                                        this.courseVisible = false;
                                        this.getCourses();
									}else{
                                        this.$message({
                                            message: message,
                                            type: 'error'
                                        });
									}
								})
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveCourse(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCourses();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getCourses();
			this.getCourseTypes();
			this.getLevels();
		}
	}

</script>

<style scoped>

</style>