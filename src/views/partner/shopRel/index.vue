<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="shopRelManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="id" width="65">
      <template scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="店铺id">
      <template scope="scope">
        <span>{{scope.row.shopId}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="合伙人id">
      <template scope="scope">
        <span>{{scope.row.partnerId}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="分销比例 万分之几">
      <template scope="scope">
        <span>{{scope.row.rate}}</span>
      </template>
    </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150"> <template scope="scope">
        <el-button v-if="shopRelManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="shopRelManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="店铺id" prop="shopId">
      <el-input v-model="form.shopId" placeholder="请输入店铺id"></el-input>
    </el-form-item>
        <el-form-item label="合伙人id" prop="partnerId">
      <el-input v-model="form.partnerId" placeholder="请输入合伙人id"></el-input>
    </el-form-item>
        <el-form-item label="分销比例 万分之几" prop="rate">
      <el-input v-model="form.rate" placeholder="请输入分销比例 万分之几"></el-input>
    </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
      page,
      addObj,
      getObj,
      delObj,
      putObj
  } from 'api/partner/shopRel/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'shopRel',
    data() {
      return {
        form: {
        shopId : undefined,        partnerId : undefined,        rate : undefined          },
        rules: {
    shopId: [
  {
    required: true,
    message: '请输入店铺id',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
],   partnerId: [
  {
    required: true,
    message: '请输入合伙人id',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
],   rate: [
  {
    required: true,
    message: '请输入分销比例 万分之几',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
]        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        shopRelManager_btn_edit: false,
        shopRelManager_btn_del: false,
        shopRelManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.shopRelManager_btn_edit = this.elements['shopRelManager:btn_edit'];
      this.shopRelManager_btn_del = this.elements['shopRelManager:btn_del'];
      this.shopRelManager_btn_add = this.elements['shopRelManager:btn_add'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
            .then(response => {
          this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
            .then(response => {
          this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
          delObj(row.id)
      .then(() => {
          this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        });
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
      });
      });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
        if (valid) {
        addObj(this.form)
        .then(() => {
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
        });
        })
        } else {
        return false;
        }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
        if (valid) {
        this.dialogFormVisible = false;
        this.form.password = undefined;
        putObj(this.form.id, this.form).then(() => {
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
        });
        });
        } else {
        return false;
        }
        });
      },
      resetTemp() {
        this.form = {
          username: undefined,
          name: undefined,
          sex: '男',
          password: undefined,
          description: undefined
        };
      }
    }
  }
</script>
