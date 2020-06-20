<template>
    <el-container>
        <el-aside width="250px">
            <el-tree
                    :data="courseTypes"
                    :props="defaultProps"
                    accordion>
            </el-tree>
        </el-aside>
        <el-main>

        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "course-type",
        data(){
            return {
                courseTypes: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        methods:{
            /*加载课程类型*/
            getCourseTypes(){
                this.$http.get("/course/courseType/loadTypeTree")
                    .then(res=>{
                        this.courseTypes = res.data;
                    })
            }
        },
        mounted(){
            this.getCourseTypes();
        }
    }
</script>

<style scoped>
    .el-aside {
        border:1px solid #ccc;
        height: 550px;
        margin-top: 10px;
    }

    .el-main {
        border:1px solid #ccc;
        border-left: none;
        margin-top: 10px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

</style>