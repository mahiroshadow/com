<template>
  <div class="app-container">
    <el-card>
      <el-form :model="model" :rules="rules" ref="model" label-width="100px" style="width:500px;">
        <el-form-item label="模型信息"></el-form-item>
        <el-form-item label="模型类别">
          <span>表格数据预测</span>
        </el-form-item>
        <el-form-item prop="model_name" label="模型名称">
          <el-input v-model="model.model_name" placeholder="请输入模型描述(3-8个字)"></el-input>
        </el-form-item>
        <el-form-item label="模型描述" prop="model_description">
          <el-input type="textarea" v-model="model.model_description" :rows="5" placeholder="请输入模型描述(100字以内)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('model')">立即创建</el-button>
          <el-button @click="resetForm('model')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { createModel } from '@/api/model'

export default {
  data() {
    return {
      model: {
        model_name: '',
        model_description: ''
      },
      rules: {
        model_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在3-8个字符内', trigger: 'blur' }
        ],
        model_description: [
          { required: true, message: '请填写业务描述', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在100字以内', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createModel(JSON.stringify(this.model)).then(res => {
            const code = res.data.code
            if (code == 1) {
              this.$message.success('模型创建成功')
              //返回我的模型界面
              this.$router.push({ path: '/nested/myModel' })
            }
            else if (code == -2) {
              this.$message.error('模型名称重复，请重新创建')
            } else {
              this.$message.error('模型创建失败')
            }
          })
        } else {
          this.$message.error('请认真填写上述数据')
          return
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style scoped></style>
