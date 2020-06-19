<template>
  <el-form :model="tenant" :rules="tenantRules" ref="tenantForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">公司入驻</h3>
    <el-form-item label="公司名称" label-width="80px" prop="companyName">
      <el-input type="text" v-model="tenant.companyName" auto-complete="off" placeholder="请输入公司名称"></el-input>
    </el-form-item>
    <el-form-item  label="公司电话" label-width="80px" prop="companyNum">
    <el-input type="text" v-model="tenant.companyNum" auto-complete="off" placeholder="请输入公司电话"></el-input>
  </el-form-item>
    <el-form-item  label="机构类型" label-width="80px">
      <!--<el-input type="text" v-model="tenant.tenantType" auto-complete="off" placeholder="请选择机构类型"></el-input>-->
      <el-select v-model="tenant.tenantType" clearable placeholder="请选择机构类型" style="width: 100%">
        <el-option
                v-for="item in tenantTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item  label="套餐选择" label-width="80px">
      <el-select v-model="tenant.mealId" clearable placeholder="请选择套餐" style="width: 100%">
        <el-option
                v-for="item in meals"
                :key="item.id"
                :label="item.mealName"
                :value="item.id">
          <span style="float: left">{{ item.mealName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mealPrice }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item  label="公司地址" label-width="80px">
      <el-input type="text" v-model="tenant.address" auto-complete="off" placeholder="请输入公司地址"></el-input>
    </el-form-item>
    <el-form-item  label="账号" label-width="80px" prop="username">
      <el-input type="text" v-model="tenant.username" auto-complete="off" placeholder="请输入公司账号"></el-input>
    </el-form-item>
    <el-form-item  label="密码" label-width="80px" prop="password">
      <el-input type="password" v-model="tenant.password" auto-complete="off" placeholder="请输入公司密码"></el-input>
    </el-form-item>
    <el-form-item  label="确认密码" label-width="80px" prop="confirmPassword">
      <el-input type="password" v-model="tenant.confirmPassword" auto-complete="off" placeholder="请再次输入密码"></el-input>
    </el-form-item>
    <el-form-item  label="公司Logo" label-width="80px">
      <!--<el-input type="text" v-model="tenant.logo" auto-complete="off" placeholder="请上传公司Logo"></el-input>-->
      <!--
        action : 文件上传接口
        file-list：回显
        list-type 文件缩略图

        limit 限制上传的文件个数 老版本不支持
      -->
      <el-upload
              action="http://localhost:1299/services/file/upload"
              :on-success="handleLogoSuccess"
              :limit="1"
              list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>

    </el-form-item>

    <el-form-item style="width:100%;">
      <el-col :span="11">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handlerRegister" :loading="regLogining">注册</el-button>
      </el-col>
      <el-col :span="11" :offset="2">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handlerLogin" >已有账号，登录</el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data() {
      var validateTel = (rule, value, callback) => {
          let reg = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
          if (!reg.test(value)) {
              callback(new Error('请输入正确的手机号码'));
          } else {
              callback();
          }
      };
      var validateConfirmPassword = (rule, value, callback) => {
          if (value !== this.tenant.password) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };
      return {
        tenantTypes:[],//机构类型
        meals:[],//套餐
        regLogining: false,
        tenant: {
          companyName: '',
          companyNum: '',
          tenantType:null,
          address:'',
          logo:'',
          username:'',
          password:'',
          mealId:null,
          confirmPassword:''
        },
        tenantRules:{
            companyName:[
                { required: true, message: '公司名称不能为空', trigger: 'blur' }
            ],
            companyNum:[
                { required: true, message: '公司电话不能为空', trigger: 'blur' },
                { validator: validateTel, trigger: 'blur' }
            ],
            username:[
                { required: true, message: '账号不能为空', trigger: 'blur' }
            ],
            password:[
                { required: true, message: '密码不能为空', trigger: 'blur' }
            ],
            confirmPassword:[
                { required: true, message: '请再次输入密码', trigger: 'blur' },
                { validator: validateConfirmPassword, trigger: 'blur' }

            ]
        }
      };
    },
    methods: {
        //公司logo上传成功
        handleLogoSuccess(response, file, fileList){
            let {success,message,resultObj} = response;
            if(success){
                this.tenant.logo = resultObj;
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
        //获取机构类型
        getTenantTypes(){
            this.$http.get("/system/tenantType/list").then(res=>{
                this.tenantTypes = res.data;
            })
        },
        //获取套餐
        getMeals(){
            this.$http.get("/system/meal/list").then(res=>{
                this.meals = res.data;
            })
        },
        //注册
        handlerRegister(){
            //验证表单
            this.$refs["tenantForm"].validate((valid) => {
                if (valid) {

                    this.regLogining = true;

                    //封装请求参数  对象属性的复制
                    let param = Object.assign({},this.tenant);

                    //发送请求  /system/tenant/register   post
                    this.$http.post("/system/tenant/register",param).then(res=>{

                        this.regLogining = false;

                        let {message,success} = res.data;
                        if(success){
                            alert("注册成功!!!");
                            this.$router.push({ path: '/login' });
                        }else{
                            this.$message({
                                message: message,
                                type: 'error'
                            });
                        }
                    })

                } else {
                    return false;
                }
            });







        },
        //回到登录页面
        handlerLogin(){},
    },
    mounted() {
        this.getTenantTypes();
        this.getMeals();
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 50px auto;
    width: 500px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>