<template>
  <div class="app-container">
    <el-card>
      <div class="operation">
        <el-upload class="upload-demo" ref="upload" action="" :file-list="fileList" accpet=".csv" :auto-upload="true"
          limit="1" :http-request="handleUpload" :show-file-list="false">
          <el-button slot="trigger" type="primary" icon="el-icon-plus" :disabled="uploading">导入测试集</el-button>
        </el-upload>
        <el-input placeholder="搜索数据集" v-model="testName" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="queryTestSets"> </el-button>
        </el-input>
      </div>
      <el-table :data="testSetList" style="width: 100%;margin-top: 20px;">
        <template slot="empty">
          <div>暂无测试集,快去导入吧</div>
        </template>
        <el-table-column label="上传时间" prop="uploadTime" align="center">
        </el-table-column>
        <el-table-column label="名称" prop="filename" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.verify_status == 0" style="color:#909399;">
              未验证
            </div>
            <div v-else-if="scope.row.verify_status == 1" style="color:#409EFF;">
              <i class="el-icon-loading"></i>验证中
            </div>
            <div v-else style="color:#67C23A;">
              已验证
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="fileDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="查询" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" :disabled="scope.row.verify_status != 2"
              @click="queryClassifiedResult(scope.row)">查询分类结果</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="prev, pager, next" :total="total" :page-size="8" :current-page.sync="currentPage"
          @current-change="pageChange">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="分类结果" :visible.sync="dialogVisible" width="600px" @open="open">
      <el-row type="flex" justify="center" style="margin-top: 20px;">
        <el-col :span="24">
          <div class="piechart" id="piechart"></div>
        </el-col>
      </el-row>
      <el-table :data="classifiedSets" style="width: 100%;margin-bottom: 15px;" id="outputData">
        <el-table-column prop="label0" label="label0" align="center">
        </el-table-column>
        <el-table-column prop="label1" label="label1" align="center">
        </el-table-column>
        <el-table-column prop="label2" label="label2" align="center">
        </el-table-column>
        <el-table-column prop="label3" label="label3" align="center">
        </el-table-column>
        <el-table-column prop="label4" label="label4" align="center">
        </el-table-column>
        <el-table-column prop="label5" label="label5" align="center">
        </el-table-column>
      </el-table>
      <div class="download">
        <!-- <el-button type="danger" size="small" @click="exportExcel">多样本分类结果下载</el-button> -->
        <el-button type="danger" size="small" @click="exportJson">json数据导出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//依赖引入
import { uploadVerifySet } from '@/api/uploadFile'
import { getUserUploadTestSet, getClassifiedResult, queryTestSet, deleteTestSet } from '@/api/file'
import { getToken } from '@/utils/auth'
import { setFilePath, setLastRouter, setTestBegin, getTestBegin } from '@/utils/rechangeInfo'
import saveJson from 'file-saver'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  created() {
    this.getTestSetList()
  },
  data() {
    return {
      uploading: false,
      testName: '',
      testSetList: [],
      fileList: [],
      total: 0,
      currentPage: getTestBegin() == undefined ? 1 : parseInt(Math.floor(getTestBegin() / 8) + 1),
      begin: getTestBegin() == undefined ? 0 : getTestBegin(),
      dialogVisible: false,
      classifiedSet: [],
      classifiedSets: [],
      myCharts: null,
      jsonData: ''
    }
  },
  watch: {

  },
  methods: {
    //初始化图表
    initialCharts() {
      if (this.myCharts == null)
        this.myCharts = this.$echarts.init(document.getElementById('piechart'))
      this.myCharts.setOption(this.getOption(this.classifiedSet))
    },
    queryTestSets() {
      this.$store.dispatch('user/testnameStore', this.testName)
      this.begin = 0
      this.currentPage = 1
      setTestBegin(0)
      const data = JSON.stringify({ vague_name: this.testName, begin: this.begin })
      queryTestSet(data).then(res => {
        const { testSetList, total } = res.data
        this.testSetList = testSetList
        this.total = total
      })
    },
    //删除文件
    fileDelete(row) {
      const { id, test_filepath } = row
      const data = JSON.stringify({ id: id, test_filepath: test_filepath })
      this.total -= 1
      this.begin = this.begin >= this.total ? (this.begin - 8 >= 0 ? this.begin - 8 : 0) : this.begin
      setTestBegin(this.begin)
      deleteTestSet(data).then(res => {
        const { code } = res.data
        if (code == 1) {
          this.$message.success('删除成功')
          this.getTestSetList()
        }
        else {
          this.$message.success('删除失败')
        }
      })
    },
    //上传验证集
    handleUpload(params) {
      this.$notify.info({
        title: '提示',
        dangerouslyUseHTMLString: true,
        message: '<div style="color:#409EFF;"><i class="el-icon-loading"></i>上传中请耐心等待</div>',
        showClose: false,
        duration: 0
      });
      this.uploading = true
      const file = params.file
      const formData = new FormData()
      formData.append('file', file)
      uploadVerifySet({ 'X-Token': getToken() }, formData).then(res => {
        //不管是否上传成功都关闭
        this.$notify.closeAll()
        const { code } = res.data
        if (code == 1) {
          this.uploading = true
          this.$message.success('文件上传成功')
          this.$refs.upload.clearFiles()
          this.getTestSetList(JSON.stringify({ begin: this.begin }))
        }
        else {
          this.$message.error('文件上传失败')
        }
      })
    },
    //获取用上传的测试集
    getTestSetList() {
      const data = JSON.stringify({ begin: this.begin })
      getUserUploadTestSet(data).then(res => {
        const { testSetList, total } = res.data
        this.testSetList = testSetList
        this.total = total
      })
    },
    handleEdit(row) {
      setFilePath(row.test_filepath)
      setLastRouter('/data/test')
      // 跳转至页面查看
      this.$router.push({ path: '/data/csvreader' })
    },
    open() {
      this.$nextTick(() => {
        this.initialCharts()
      })
    },
    //查询分类结果
    queryClassifiedResult(row) {
      this.classifiedSet = []
      this.classifiedSets = []
      const { id } = row
      getClassifiedResult(JSON.stringify({ id: id })).then(res => {
        let { classified_result, detail_classified } = res.data.userTestSet
        this.jsonData = detail_classified
        classified_result = JSON.parse(classified_result)
        for (var i = 0; i < 6; i++) {
          this.classifiedSet.push({ name: 'label' + i, value: parseInt(classified_result[i]) })
        }
        this.classifiedSets.push({
          label0: classified_result[0], label1: classified_result[1],
          label2: classified_result[2], label3: classified_result[3],
          label4: classified_result[4], label5: classified_result[5]
        })
        this.dialogVisible = true
      })
    },
    //导出json
    exportJson() {
      let arr = new Blob([this.jsonData], { type: 'text/plain;charset=utf-8' })
      saveJson(arr, `validate.json`)
    },
    //导出excel
    exportExcel() {
      var xlsxParam = { raw: true };
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(
        document.querySelector("#outputData"),
        xlsxParam
      )
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      })
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          "outputData.xlsx"
        )
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout)
      }
      return wbout
    },
    pageChange(val) {
      this.begin = (val - 1) * 8
      if (this.$store.state.user.testName == '') {
        setTestBegin(this.begin)
        this.getTestSetList()
      }
      else {
        const data = JSON.stringify({ vague_name: this.testName, begin: this.begin })
        queryTestSet(data).then(res => {
          const { testSetList, total } = res.data
          this.testSetList = testSetList
          this.total = total
        })
      }

    },
    //设置表格数据
    getOption(data) {
      return {
        title: {
          text: '分类结果',
          //subtext: '训练后的数据',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card {
  position: relative;
  height: 620px;
}

.operation {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 42px;
  align-items: center;
}

.piechart {
  height: 300px;
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

.download {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
