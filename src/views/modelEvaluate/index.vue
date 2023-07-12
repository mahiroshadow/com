<template>
    <div class="app-container">
        <el-card>
            <el-button type="text" icon="el-icon-arrow-left" @click="backToLastPage">返回</el-button>
            <el-divider />
            <span>整体评估</span>
            <div style="width:100%;margin-top:10px;">
                <span>特征 </span><span style="color:#409EFF;">107列</span>
                <el-divider direction="vertical"></el-divider>
                <span>目标列 </span><span style="">label</span>
                <el-divider direction="vertical"></el-divider>
                <span>算法类型 </span><span style="">多分类</span>
                <el-divider direction="vertical"></el-divider>
            </div>
            <el-divider />
            <div class="evaluate">
                <div>
                    <el-progress type="circle" :percentage="accuracy" :width="60" :stroke-width="4"
                        color="#2468F2"></el-progress>
                    <div>准确率:<span style="color:#409EFF;">{{ accuracy + '%' }}</span></div>
                </div>
                <div>
                    <el-progress type="circle" :percentage="f1" :width="60" :stroke-width="4" color="#2468F2"></el-progress>
                    <div>F1-score:<span style="color:#409EFF;">{{ f1 + '%' }}</span></div>
                </div>
                <div>
                    <el-progress type="circle" :percentage="precision" :width="60" :stroke-width="4"
                        color="#2468F2"></el-progress>
                    <div>精确率:<span style="color:#409EFF;">{{ precision + '%' }}</span></div>
                </div>
                <div>
                    <el-progress type="circle" :percentage="recall" :width="60" :stroke-width="4"
                        color="#2468F2"></el-progress>
                    <div>召回率:<span style="color:#409EFF;">{{ recall + '%' }}</span></div>
                </div>
            </div>
            <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">
                    混淆矩阵每一列代表了预测类别，每一列的总数表示预测为该类别的数据的数目；每一行代表了数据的真实归属类别，每一行的数据总<br />数表示该类别的数据实例的数目。混淆矩阵对角线上的值表示一个类别被正确预测的概率，对角线上的值约接近于1，说明模型分类效<br />果越好
                </div>
                <span>混淆矩阵</span>
            </el-tooltip>
            <el-table :data="confusionMatrix" border style="width: 70%;margin-top:10px;">
                <el-table-column :resizable="false" class-name="elChgTbeClmn" prop="label" label="" width="120">
                    <template slot="header" slot-scope="scope">
                        <div class="elHeadCon">
                            <div class="headerCon1">预测值</div>
                            <div class="headerCon2">真实值</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="0" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.label == '0'" style="color: #3081EA;">
                            {{ scope.row.label0 }}
                        </div>
                        <div v-else>
                            {{ scope.row.label0 }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="1" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.label == '1'" style="color: #3081EA;">
                            {{ scope.row.label1 }}
                        </div>
                        <div v-else>
                            {{ scope.row.label1 }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="2" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.label == '2'" style="color: #3081EA;">
                            {{ scope.row.label2 }}
                        </div>
                        <div v-else>
                            {{ scope.row.label2 }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="3" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.label == '3'" style="color: #3081EA;">
                            {{ scope.row.label3 }}
                        </div>
                        <div v-else>
                            {{ scope.row.label3 }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="4" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.label == '4'" style="color: #3081EA;">
                            {{ scope.row.label4 }}
                        </div>
                        <div v-else>
                            {{ scope.row.label4 }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="5" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.label == '5'" style="color: #3081EA;">
                            {{ scope.row.label5 }}
                        </div>
                        <div v-else>
                            {{ scope.row.label5 }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top:10px;">特征重要性</div>
            <div id="feature" style="width: 700px;height: 400px;margin-top: -50px;"></div>
        </el-card>
    </div>
</template>
<script>
import { getModelInfo } from '@/utils/modelInfo'
export default {
    mounted() {
        //初始化数据
        this.initData()

    },
    data() {
        return {
            accuracy: 0,
            f1: 0,
            precision: 0,
            recall: 0,
            model: {},
            feature: {},
            confusionMatrix: []
        }
    },
    methods: {
        //初始化数据
        initData() {
            this.model = JSON.parse(getModelInfo())
            const { accuracy, f1, recall, precision } = this.model.model_effect
            this.accuracy = (parseFloat(accuracy) * 100).toFixed(2)
            this.f1 = (parseFloat(f1) * 100).toFixed(2)
            this.precision = (parseFloat(precision) * 100).toFixed(2)
            this.recall = (parseFloat(recall) * 100).toFixed(2)
            this.model.model_confusion_matrix = JSON.parse(this.model.model_confusion_matrix)
            //重写混淆矩阵格式
            this.model.model_confusion_matrix.forEach((item, index) => {
                this.confusionMatrix.push({
                    label: index,
                    label0: (parseFloat(item[0]) * 100).toFixed(1) + '%',
                    label1: (parseFloat(item[1]) * 100).toFixed(1) + '%',
                    label2: (parseFloat(item[2]) * 100).toFixed(1) + '%',
                    label3: (parseFloat(item[3]) * 100).toFixed(1) + '%',
                    label4: (parseFloat(item[4]) * 100).toFixed(1) + '%',
                    label5: (parseFloat(item[5]) * 100).toFixed(1) + '%',
                })
            })
            //初始化特征重要性图表
            this.feature = this.$echarts.init(document.getElementById('feature'))
            this.model.model_importance = JSON.parse(this.model.model_importance)
            const y_data = [], s_data = []
            this.model.model_importance.forEach(item => {
                y_data.push(item[0])
                s_data.push(parseFloat(item[1]).toFixed(2))
            })
            console.log(s_data)
            this.feature.setOption(this.getOption(y_data, s_data))
        },
        getOption(y_data, s_data) {
            return {
                color: '#528EFF',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {},
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: y_data
                },
                series: [
                    {
                        type: 'bar',
                        data: s_data,
                        // itemStyle: {
                        //   nomal: {
                        label: {
                            show: true,
                            formatter: (params) => { return params.value + '%' },
                            position: 'right',
                        }
                        //   }
                        // }
                    }
                ]
            }
        },
        backToLastPage() {
            this.$router.push({ path: '/nested/myModel' })
        }
    }
}
</script>
<style scoped>
.evaluate {
    display: grid;
    grid-template-columns: auto auto auto auto;
    height: 100px;
}

.evaluate div {
    text-align: center;
    align-items: center;
}

/* 如果单元格的padding */
.elChgTbeClmn .cell {
    padding: 0px !important;
}

.elHeadCon {
    height: 50px;
    position: relative;
}

.headerCon1 {
    position: absolute;
    left: 0;
    bottom: 0;
}

.headerCon2 {
    position: absolute;
    right: 0;
    top: 0;
}
</style>