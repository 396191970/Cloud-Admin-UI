<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="payListManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="id" width="65">
      <template scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="产品名称">
      <template scope="scope">
        <span>{{scope.row.productName}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="产品id">
      <template scope="scope">
        <span>{{scope.row.productId}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="描述">
      <template scope="scope">
        <span>{{scope.row.description}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="单价">
      <template scope="scope">
        <span>{{scope.row.price}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="数量">
      <template scope="scope">
        <span>{{scope.row.quantity}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="总价">
      <template scope="scope">
        <span>{{scope.row.totalPrice}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="支出类型
	采购
	固定支出
		租金
		水电">
      <template scope="scope">
        <span>{{scope.row.payType}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="">
      <template scope="scope">
        <span>{{scope.row.createTime}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="支出时间">
      <template scope="scope">
        <span>{{scope.row.tradeTime}}</span>
      </template>
    </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150"> <template scope="scope">
        <el-button v-if="payListManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="payListManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="产品名称" prop="productName">
      <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
    </el-form-item>
        <el-form-item label="产品id" prop="productId">
      <el-input v-model="form.productId" placeholder="请输入产品id"></el-input>
    </el-form-item>
        <el-form-item label="描述" prop="description">
      <el-input v-model="form.description" placeholder="请输入描述"></el-input>
    </el-form-item>
        <el-form-item label="单价" prop="price">
      <el-input v-model="form.price" placeholder="请输入单价"></el-input>
    </el-form-item>
        <el-form-item label="数量" prop="quantity">
      <el-input v-model="form.quantity" placeholder="请输入数量"></el-input>
    </el-form-item>
        <el-form-item label="总价" prop="totalPrice">
      <el-input v-model="form.totalPrice" placeholder="请输入总价"></el-input>
    </el-form-item>
        <el-form-item label="支出类型" prop="payType">
      <el-input v-model="form.payType" placeholder="请输入支出类型"></el-input>
    </el-form-item>
        <el-form-item label="" prop="createTime">
      <el-input v-model="form.createTime" placeholder="请输入"></el-input>
    </el-form-item>
        <el-form-item label="支出时间" prop="tradeTime">
      <el-input v-model="form.tradeTime" placeholder="请输入支出时间"></el-input>
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
  } from 'api/partner/payList/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'payList',
    data() {
      return {
        form: {
        productName : undefined,        productId : undefined,        description : undefined,        price : undefined,        quantity : undefined,        totalPrice : undefined,        payType : undefined,        createTime : undefined,        tradeTime : undefined          },
        rules: {
    productName: [
  {
    required: true,
    message: '请输入产品名称',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
],   productId: [
  {
    required: true,
    message: '请输入产品id',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
],   description: [
  {
    required: true,
    message: '请输入描述',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
],   price: [
  {
    required: true,
    message: '请输入单价',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
],   quantity: [
  {
    required: true,
    message: '请输入数量',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
],   totalPrice: [
  {
    required: true,
    message: '请输入总价',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
],   payType: [
  {
    required: true,
    message: '请输入支出类型',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
],   createTime: [
  {
    required: true,
    message: '请输入',
    trigger: 'blur'
  },
  {
    min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
    trigger: 'blur'
  }
],   tradeTime: [
  {
    required: true,
    message: '请输入支出时间',
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
        payListManager_btn_edit: false,
        payListManager_btn_del: false,
        payListManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.payListManager_btn_edit = this.elements['payListManager:btn_edit'];
      this.payListManager_btn_del = this.elements['payListManager:btn_del'];
      this.payListManager_btn_add = this.elements['payListManager:btn_add'];
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
