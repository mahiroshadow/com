<template>
    <div class="app-container">
        <el-card>
            <div>
                <label style="font-weight: 100;">请选择模型</label>
                <el-select v-model="modelChoose" placeholder="选择模型" style="margin-left: 10px;">
                    <el-option v-for="item in modelList" :label="item.model_name"
                        :value="item.model_store_localpth"></el-option>
                </el-select>
                <label style="font-weight: 100;margin-left: 10px;">请选择数据</label>
                <el-select v-model="trainChoose" placeholder="选则数据" style="margin-left: 10px;">
                    <el-option v-for="(item, index) in testSetList" :label="item.filename" :value="index"></el-option>
                </el-select>
                <el-button type="primary" style="margin-left:10px;" @click="onlineVerify">在线验证</el-button>
            </div>
            <div class="empty">
                <img src="../../../assets/images/empty.png" />
                <div style="color:#409EFF">可选择模型与数据获取结果</div>
            </div>
        </el-card>
    </div>
</template>
<script>
import { getCanBeVerifiedList, onlineVerify } from '@/api/model'

export default {
    mounted() {

    },
    created() {
        this.getCanVerifyList()
    },
    data() {
        return {
            myCharts: {},
            modelChoose: '',
            trainChoose: '',
            modelList: [],
            testSetList: []
        }
    },
    methods: {
        getCanVerifyList() {
            getCanBeVerifiedList().then(res => {
                const { modelList, testSetList } = res.data
                this.modelList = modelList
                this.testSetList = testSetList
            })
        },
        //在线验证
        onlineVerify() {
            const { id, test_filepath } = this.testSetList[this.trainChoose]
            //在线验证
            const data = JSON.stringify({ id: id, test_filepath: test_filepath, model_store_localpth: this.modelChoose })
            onlineVerify(data)
            this.$router.push({ path: '/example/tree' })
        },

    }
}
</script>
<style scoped>
.empty {
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.echarts-container {
    width: 1200px;
    margin: 0 auto;
}

.el-row {
    margin-bottom: 10px;
}

.piechart {
    height: 500px;
}

.download {
    display: flex;
    align-items: center;
    justify-content: center;
}

.score {
    width: 100%;
    height: 500px;
}
</style>