<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户"
                v-model="listQuery.name"></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="incomeListManager_btn_add" style="margin-left: 10px;" @click="handleCreate"
                 type="primary" icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%">

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
      <el-table-column width="200px" align="center" label="备注">
        <template scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="单价">
        <template scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="折扣金额">
        <template scope="scope">
          <span>{{scope.row.discount}}</span>
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
      <el-table-column width="200px" align="center" label="推广人">
        <template scope="scope">
          <span>{{scope.row.popularizeUserId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="推广码">
        <template scope="scope">
          <span>{{scope.row.popularizeCode}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="">
        <template scope="scope">
          <span>{{scope.row.tradeTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="是否分销 0 没有 1有">
        <template scope="scope">
          <span>{{scope.row.isDistribution}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="incomeListManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="incomeListManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">

        <el-form-item label="产品名称" prop="productName">
          <el-select v-model="selectValue" filterable remote placeholder="请输入产品名称"
                     :remote-method="remoteMethod" :loading="loading" @change="selectChange">
            <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="单价" prop="price">
          <el-input :disabled="true" v-model="form.price" placeholder="请输入单价"></el-input>
        </el-form-item>
        <el-form-item label="折扣金额" prop="discount">
          <el-input v-model="form.discount" placeholder="请输入折扣金额" @blur="calcAmount"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" @blur="calcAmount"></el-input>
        </el-form-item>
        <el-form-item label="总价" prop="totalPrice">
          <el-input v-model="form.totalPrice" placeholder="请输入总价"></el-input>
        </el-form-item>
        <el-form-item label="推广人" prop="popularizeUserId">
          <el-input v-model="form.popularizeUserId" placeholder="请输入推广人"></el-input>
        </el-form-item>
        <el-form-item label="推广码" prop="popularizeCode">
          <el-input v-model="form.popularizeCode" placeholder="请输入推广码"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" placeholder="请输入备注"></el-input>
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
  } from 'api/partner/incomeList/index';
  import {mapGetters} from 'vuex';

  import * as selectValue from 'api/partner/product/index';

  export default {
    name: 'incomeList',
    loading: false,
    data() {
      return {
        selectValue: '',
        loading: false,
        items: [],
        form: {
          productName: undefined,
          productId: undefined,
          description: undefined,
          price: undefined,
          discount: 0,
          quantity: 0,
          totalPrice: undefined,
          popularizeUserId: undefined,
          popularizeCode: undefined,
          createTime: undefined,
          tradeTime: undefined,
          isDistribution: undefined
        },
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
          ], description: [
            {
              required: false,
              message: '请输入备注',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
              trigger: 'blur'
            }
          ], discount: [
            {
              required: false,
              message: '请输入折扣金额',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
              trigger: 'blur'
            }
          ], quantity: [
            {
              required: false,
              message: '请输入数量',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
              trigger: 'blur'
            }
          ], totalPrice: [
            {
              required: false,
              message: '请输入总价',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
              trigger: 'blur'
            }
          ], popularizeUserId: [
            {
              required: false,
              message: '请输入推广人',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
              trigger: 'blur'
            }
          ], popularizeCode: [
            {
              required: false,
              message: '请输入推广码',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 40,
              message: '长度在 1 到 40 个字符',
              trigger: 'blur'
            }
          ]
        },
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
        incomeListManager_btn_edit: false,
        incomeListManager_btn_del: false,
        incomeListManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.incomeListManager_btn_edit = this.elements['incomeListManager:btn_edit'];
      this.incomeListManager_btn_del = this.elements['incomeListManager:btn_del'];
      this.incomeListManager_btn_add = this.elements['incomeListManager:btn_add'];
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
            this.selectValue = response.data.productName;

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
      }, remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          selectValue.page({
            name: query
          }).then(response => {
            this.items = response.data.rows;
            this.total = response.data.total;
            this.loading = false;
            console.info('total:' + this.total)
          });
        } else {
          this.items = [];
        }
      },
      selectChange(val) {
        console.info('selectChange');
        console.info(val);
        this.form.prductId = val.id;
        this.form.prductName = val.name;
        this.form.price = val.price;
        this.form.discount = val.price;
        this.form.quantity = 1;
        this.calcAmount();
        console.info(this.form);
      },
      calcAmount() {
        console.info("calcAmount");
        console.info(this.form);
        this.$set(this.form, 'totalPrice', this.form.discount * this.form.quantity)
        // this.form.totalPrice = this.form.discount * this.form.quantity;
      }
    }

  }
</script>
