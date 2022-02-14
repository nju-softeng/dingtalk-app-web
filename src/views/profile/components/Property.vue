<template>
  <div>
    <div class="propertyList">
      <el-row type="flex">
        <el-col :span="8"> 资产详情 </el-col>
        <el-col :span="8" style="float: right; margin-right: 30px">
          <el-button type="primary" @click="addPropertyDialogueVisible = true"
            >新增固定资产</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="propertyList" style="width: 100%">
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="startTime" label="开始时间" width="200" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="preserver" label="保管人" width="150" />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="modifyPropertyClick(scope.row)"
              >修改</el-button
            >
            <el-button type="danger" @click="deletePropertyClick(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--      新增固定资产-->
    <el-dialog
      title="新增固定资产"
      :visible.sync="addPropertyDialogueVisible"
      width="30%"
    >
      <el-form ref="form" :model="addPropertyForm" label-width="80px">
        <el-form-item label="名称:">
          <el-col :span="12">
            <el-input v-model="addPropertyForm.name" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间:">
          <el-col :span="12">
            <el-date-picker
              v-model="addPropertyForm.startTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 150px"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="类型：">
          <el-col :span="16">
            <el-input v-model="addPropertyForm.type" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item label="保管人：">
          <el-input v-model="addPropertyForm.preserver" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addPropertyDialogueVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProperty">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改固定资产信息"
      :visible.sync="modifyPropertyDialogueVisible"
      width="30%"
    >
      <el-form ref="form" :model="modifyPropertyForm" label-width="80px">
        <el-form-item label="名称:">
          <el-col :span="12">
            <el-input v-model="modifyPropertyForm.name" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间:">
          <el-col :span="12">
            <el-date-picker
              v-model="modifyPropertyForm.startTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 150px"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="类型:">
          <el-col :span="16">
            <el-input v-model="modifyPropertyForm.type" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="modifyPropertyForm.preserver" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="modifyPropertyDialogueVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmModifyProperty"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserProperties,
  addProperty,
  deleteProperty,
  updateProperty,
} from "@/api/user";
export default {
  name: "Property",
  data() {
    return {
      addPropertyDialogueVisible: false,
      modifyPropertyDialogueVisible: false,
      propertyList: [
        {
          startTime: "12414",
          name: "124124",
          type: "12",
          preserver: "12414",
        },
      ],
      typeConvertor: ["校级", "省级", "国家级", "国际级"],
      addPropertyForm: {},
      modifyPropertyForm: {},
    };
  },
  created() {
    getUserProperties().then((res) => {
      console.log(res);
      this.propertyList = res.data;
    });
  },
  methods: {
    async addProperty() {
      var res = await addProperty(this.addPropertyForm);
      this.addPropertyForm = {};
      if (res) {
        this.$message({
          showClose: true,
          message: "固定资产信息添加成功！",
          type: "success",
        });
      }
      getUserProperties().then((res) => {
        this.propertyList = res.data;
      });
      this.addPropertyDialogueVisible = false;
    },
    modifyPropertyClick(data) {
      console.log(data);
      this.modifyPropertyDialogueVisible = true;
      this.modifyPropertyForm = JSON.parse(JSON.stringify(data));
    },
    async confirmModifyProperty() {
      var res = await updateProperty(this.modifyPropertyForm);
      if (res) {
        this.$message({
          showClose: true,
          message: "固定资产信息修改成功！",
          type: "success",
        });
      }
      this.modifyPropertyDialogueVisible = false;
      getUserProperties().then((res) => {
        this.propertyList = res.data;
      });
    },
    async deletePropertyClick(data) {
      await deleteProperty(data.id);
      this.$message({
        showClose: true,
        message: "固定资产信息删除成功！",
        type: "success",
      });
      getUserProperties().then((res) => {
        this.propertyList = res.data;
      });
    },
  },
};
</script>

<style scoped></style>
