<template>
  <div class="app-container">
    <el-card>
      <el-form :model="model" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="模型选择" prop="modelChoose">
          <el-select v-model="model.modelChoose" placeholder="请选择模型">
            <el-option v-for="(item, index) in modelList" :label="item.model_name" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据选择" prop="trainChoose">
          <el-select v-model="model.trainChoose" placeholder="请选择数据集">
            <el-option v-for="item in trainSetList" :label="item.filename" :value="item.train_filepath"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标对象">
          <div>Label标签</div>
        </el-form-item>
        <el-form-item label="算法类型">
          <div>多分类任务</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style scoped></style>
<script>
import { getCanBeTrainedList } from '@/api/model'
import { onlineTrain } from '@/api/model'

export default {
  created() {
    this.getCanBeTrainedModel()
  },
  data() {
    return {
      model: {
        modelChoose: '',
        trainChoose: '',
      },
      modelList: [],
      trainSetList: [],
      rules: {
        modelChoose: [
          { required: true, message: '请选择模型', trigger: 'change' }
        ],
        trainChoose: [
          { required: true, message: '请选择数据集', trigger: 'change' }
        ],
      }
    }
  }
  , methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const model_s = this.modelList[this.model.modelChoose]
          const data = JSON.stringify({ id: model_s.id, model_name: model_s.model_name, train_filepath: this.model.trainChoose })
          //在线训练
          onlineTrain(data)
          this.$router.push({ path: '/nested/myModel' })
        } else {
          this.$message.error('请先选择数据集或模型')
          return
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCanBeTrainedModel() {
      getCanBeTrainedList().then(res => {
        const { modelList, trainSetList } = res.data
        this.modelList = modelList
        this.trainSetList = trainSetList
      })
    }
  }
}
</script>
