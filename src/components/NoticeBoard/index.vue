<template>
    <div >
        <el-table
          :data="tableData1"
          stripe
          style="width: 100%">
          <el-table-column
            prop="notice"
            label="通知公告"
            width="450">
              <template slot-scope="scope">
                 <a href="scope.row.notice" target="_blank" class="buttonText">{{scope.row.notice}}</a>
               </template>
          </el-table-column>
  
          <el-table-column
            prop="date1"
            width="100">
            <template slot="header" slot-scope="scope">
                    <a href="" target="_blank">More&lt;&lt;</a>
                  </template>
          </el-table-column>
        </el-table>
  </div>
</template>

<script>
export default {
    data() {
    return {
        tableData1: [{
        notice: '校内天梯选拔赛开始报名啦！',
        date1 :'2020-3-6'
        }, {
        notice: '校内天梯选拔赛开始报名啦！',
        date1 :'2020-3-6'
        }, {
        notice: '校内天梯选拔赛开始报名啦！',
        date1 :'2020-3-6'
        }, {
        notice: '校内天梯选拔赛开始报名啦！',
        date1 :'2020-3-6'
        }],
        tableData2: [{
        msg: '校内天梯选拔赛开始报名啦！',
        date2 :'2020-3-6'
        }, {
        msg: '校内天梯选拔赛开始报名啦！',
        date2 :'2020-3-6'
        }, {
        msg: '校内天梯选拔赛开始报名啦！',
        date2 :'2020-3-6'
        }, {
        msg: '校内天梯选拔赛开始报名啦！',
        date2 :'2020-3-6'
        }]
    }
    }
}
</script>

<style>
a{
    color: #7ac804;
}
</style>

