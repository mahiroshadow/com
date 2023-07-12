<template>
  <div class="app-container">
    <el-card>
      <div class="operation">

        <el-upload ref="upload" action="" :headers="headers" :file-list="fileList" accpet=".csv" :auto-upload="true"
          limit="1" :http-request="handleUpload" :show-file-list="false">
          <el-button type="primary" icon="el-icon-plus" :disabled="uploading">导入训练集</el-button>
        </el-upload>

        <el-input placeholder="搜索训练集" v-model="trainName" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="queryTrainSets"></el-button>
        </el-input>
      </div>
      <el-table :data="trainSet" style="width: 100%;margin-top: 20px;">
        <template slot="empty">
          <div>暂无训练集,快去导入吧</div>
        </template>
        <el-table-column label="上传时间" prop="upload_time" align="center">
        </el-table-column>
        <el-table-column label="名称" prop="filename" align="center">
        </el-table-column>
        <el-table-column label="导入状态" align="center">
          <div style="color:#67C23A;">已导入</div>
        </el-table-column>
        <el-table-column label="文件操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="showDetail(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="deleteFile(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="prev, pager, next" :total="total" :page-size="8" :current-page.sync="currentPage"
          @current-change="pageChange">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getUserUploadTrainSet, deleteTrainSet, queryTrainSet } from '@/api/file'
import { uploadTrainSet } from '@/api/uploadFile'
import { getToken } from '@/utils/auth'
import { setLastRouter, setFilePath, setTrainBegin, getTrainBegin } from '@/utils/rechangeInfo'


export default {
  created() {
    this.getTrainSet()
  },
  data() {
    return {
      uploading: false,
      trainName: '',
      trainSet: [],
      begin: getTrainBegin() == undefined ? 0 : getTrainBegin(),
      currentPage: getTrainBegin() == undefined ? 1 : parseInt(Math.floor(getTrainBegin() / 8) + 1),
      fileList: [],
      headers: { 'X-Token': getToken() },
      total: 0,
    }
  },
  watch: {

  },

  methods: {
    queryTrainSets() {
      this.$store.dispatch('user/trainameStore', this.trainName)
      this.begin = 0
      setTrainBegin(0)
      const data = JSON.stringify({ begin: this.begin, vague_name: this.trainName })
      queryTrainSet(data).then(res => {
        const code = res.data.code
        if (code == 1) {
          this.trainSet = res.data.trainSetList
          this.total = res.data.total
        }
        else
          this.$message.error('查询失败')
      })
    },
    showDetail(row) {
      setFilePath(row.train_filepath)
      setLastRouter('/data/train')
      //跳转至页面查看
      this.$router.push({ path: '/data/csvreader' })
    },
    deleteFile(row) {

      const { id, train_filepath } = row
      const data = JSON.stringify({ id: id, train_filepath: train_filepath })
      this.total -= 1
      this.begin = this.begin >= this.total ? (this.begin - 8 >= 0 ? this.begin - 8 : 0) : this.begin
      setTrainBegin(this.begin)
      deleteTrainSet(data).then(res => {
        const { code } = res.data
        if (code == 1) {
          this.$message.success('删除成功')
          //重新获取训练集
          this.getTrainSet()
        }
        else
          this.$message.error('删除失败')
      })
    },
    getTrainSet() {
      const data = JSON.stringify({ begin: this.begin })
      getUserUploadTrainSet(data).then(res => {
        const code = res.data.code
        if (code == 1) {
          this.trainSet = res.data.userTrainSetList
          this.total = res.data.total
        }
        else
          this.$message.error('获取训练集列表失败')
      })
    },
    //上传文件
    handleUpload(params) {
      this.$notify.info({
        title: '提示',
        dangerouslyUseHTMLString: true,
        message: '<div style="color:#409EFF;"><i class="el-icon-loading"></i>上传中请耐心等待</div>',
        showClose: false,
        duration: 0
      });
      this.uploading = true
      const fd = new FormData()
      fd.append('file', params.file)
      uploadTrainSet(this.headers, fd).then(res => {
        //不管是否上传成功都关闭
        this.$notify.closeAll()
        if (res.data.code == 1) {
          this.uploading = false
          this.$refs.upload.clearFiles()
          this.$message.success('上传成功')
          this.getTrainSet()
        }
        else
          this.$message.error('上传失败')
      })
    },
    //页码发生改变
    pageChange(val) {
      this.begin = (val - 1) * 8
      if (this.$store.state.user.trainName == '') {
        setTrainBegin(this.begin)
        this.getTrainSet()
      }
      else {
        const data = JSON.stringify({ begin: this.begin, vague_name: this.trainName })
        queryTrainSet(data).then(res => {
          const code = res.data.code
          if (code == 1) {
            this.trainSet = res.data.trainSetList
            this.total = res.data.total
          }
          else
            this.$message.error('查询失败')
        })
      }
    }
  }

}
</script>
<style  scoped>
.el-card {
  position: relative;
  height: 620px;
}

.operation {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 42px;
  align-items: center;
}

.el-input {
  width: 260px;

}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.pagination {
  position: absolute;
  width: 100%;
  text-align: center;
  right: 0%;
  bottom: 4%;
}
</style>
