<template>
    <div class="app-container">
        <el-card>
            <el-button type="text" icon="el-icon-arrow-left" @click="backToLastPage">返回</el-button>
            <div style="margin-top:10px;">
                <span style="margin-left: 10px;">总行数 {{ rows }}</span>
                <el-divider direction="vertical"></el-divider>
                <span style="margin-left: 10px;">总列数 {{ cols }}</span>
                <!-- <el-divider direction="vertical"></el-divider>
                <span style="margin-left: 10px;">若少于18条则全部展示，反之只展示其中18条</span> -->
            </div>
            <el-table :data="csvData" style="margin-top:10px;">
                <el-table-column v-for="(item, index) in dataColumn" :label="item" width="120">
                    <template slot-scope="scope">
                        {{ scope.row[index] }}
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
import { readCsv } from '@/api/file'
import { getLastRouter, getFilePath } from '@/utils/rechangeInfo'


export default {
    created() {
        this.csvShow()
    },
    mounted() {

    },
    watch: {

    },
    data() {
        return {
            csvData: [],
            dataColumn: [],
            cols: 0,
            rows: 0
        }
    },
    methods: {
        //返回上一级
        backToLastPage() {
            this.$router.push({ path: getLastRouter() })
        },
        csvShow() {
            readCsv(JSON.stringify({ filepath: getFilePath() })).then(res => {
                if (res.data.code == 1) {
                    this.dataColumn = res.data.setList[0]
                    this.csvData = res.data.setList.slice(1)
                    this.rows = res.data.rows
                    this.cols = res.data.cols
                }
                else
                    this.$message.error('文件读取失败')
            })
        }
    }
}

</script>

<style scoped>
.el-card {
    min-height: 620px;
}
</style>