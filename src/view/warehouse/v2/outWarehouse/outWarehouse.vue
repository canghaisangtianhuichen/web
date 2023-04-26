<template>
  <div>
    <warning-bar title="注：右上角头像下拉可切换角色" />
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button type="primary" icon="plus" @click="addUser">新增出库单</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="id"
      >
        <el-table-column align="left" label="orderNumber" min-width="150" prop="orderNumber" />
        <el-table-column align="left" label="仓库名" min-width="180" prop="warehouseName" />
        <el-table-column align="left" label="员工名" min-width="180" prop="staffName" />
        <el-table-column align="left" label="重量" min-width="180" prop="weight" />
        <el-table-column align="left" label="出库方式" min-width="180" prop="type" />
        <el-table-column align="left" label="去处" min-width="180" prop="toWhere" />
        <el-table-column align="left" label="添加时间" min-width="150" prop="createdAt" />
        <el-table-column align="left" label="修改时间" min-width="150" prop="updatedAt" />
        <el-table-column label="操作" min-width="250" fixed="right">
          <template #default="scope">
            <el-button type="primary" link icon="edit" @click="openDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="addCustomerDialog"
      custom-class="user-dialog"
      :show-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      destroy-on-close
      width="1000px"
    >
      <header>
        <div style="margin-bottom: 20px;">
          <el-button type="primary" @click="addChild">点击添加出库单</el-button>
        </div>
        <div>
          <el-form-item label="出库类型">
            <el-select v-model="toType" placeholder="请选择出库类型">
              <el-option v-for="item in temType" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="出库来源">
            <el-select v-model="toWhere" placeholder="请选择出库来源">
              <el-option v-for="item in tableData3" :key="item.index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
      </header>

      <section style="height: 300px; overflow: auto">
        <ul>
          <template v-for="(item,index) in list">
            <span v-if="item.type === 'child'" :key="index">
              <el-form v-model="form" inline>
                <el-form-item label="货物">
                  <el-select v-model="form[index].huowu" placeholder="请选择货物">
                    <el-option v-for="item in tableData1" :key="item.index" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="货架">
                  <el-select v-model="form[index].huojia" placeholder="请选择货架">
                    <el-option v-for="item in tableData2" :key="item.index" :label="item.name" :value="item.name" />
                  </el-select>
                </el-form-item>
                <el-form-item label="重量">
                  <el-input v-model="form[index].zhongliang" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="delChild">删除</el-button>
                </el-form-item>
              </el-form>
            </span>
          </template>
        </ul>
      </section>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeaddCustomerDialog">取 消</el-button>
          <el-button type="primary" @click="enteraddCustomerDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <ChooseImg ref="chooseImg" :target="userInfo" :target-key="`headerImg`" />
    <el-dialog
      v-model="addDetailDialog"
      custom-class="user-dialog"
      title="出库单详情"
      :show-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="gva-table-box">
        <el-table
          :data="tableData5"
          row-key="id"
        >
          <el-table-column align="left" label="orderNumber" min-width="150" prop="orderNumber" />
          <el-table-column align="left" label="仓库名" min-width="180" prop="warehouseName" />
          <el-table-column align="left" label="货物名" min-width="180" prop="goodsName" />
          <el-table-column align="left" label="重量" min-width="180" prop="weight" />
          <el-table-column align="left" label="员工名" min-width="180" prop="staffName" />
          <el-table-column align="left" label="添加时间" min-width="150" prop="createdAt" />
          <el-table-column align="left" label="修改时间" min-width="150" prop="updatedAt" />

        </el-table>
        <div class="gva-pagination">
          <el-pagination
            :current-page="page1"
            :page-size="pageSize1"
            :page-sizes="[10, 30, 50, 100]"
            :total="total1"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
}
</script>

<script setup>

import {
  getV2OutWarehousesList,
  getV2GoodsList,
  getV2GoodsShelfsList,
  getV2CustomersList,
  getV2WarehousesList,
  getV2OutWarehousesDetail,
  outWarehouse,
} from '@/api/warehouse'

// import { getAuthorityList } from '@/api/authority'
// import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import WarningBar from '@/components/warningBar/warningBar.vue'
// import { setUserInfo, resetPassword } from '@/api/user.js'

import { nextTick, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { register } from '@/api/user'
// const path = ref(import.meta.env.VITE_BASE_API + '/')
// 初始化相关
const setAuthorityOptions = (AuthorityData, optionsData) => {
  AuthorityData &&
  AuthorityData.forEach(item => {
    if (item.children && item.children.length) {
      const option = {
        authorityId: item.authorityId,
        authorityName: item.authorityName,
        children: []
      }
      setAuthorityOptions(item.children, option.children)
      optionsData.push(option)
    } else {
      const option = {
        authorityId: item.authorityId,
        authorityName: item.authorityName
      }
      optionsData.push(option)
    }
  })
}

const page = ref(1)
const total = ref(0)
const page1 = ref(1)
const total1 = ref(0)
const pageSize1 = ref(10)
const pageSize = ref(10)
const tableData = ref([])
const tableData1 = ref([])
const tableData2 = ref([])
const tableData3 = ref([])
const tableData4 = ref([])
const tableData5 = ref([])

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
// const getTableData = async() => {
//   const table = await getCustomerList({ page: page.value, pageSize: pageSize.value })
//   if (table.code === 0) {
//     tableData.value = table.data.list
//     total.value = table.data.total
//     page.value = table.data.page
//     pageSize.value = table.data.pageSize
//   }
// }
const getTableData = async() => {
  const table = await getV2OutWarehousesList({ page: page.value, pageSize: pageSize.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
  const table1 = await getV2GoodsList({ page: 1, pageSize: 1000 })
  if (table1.code === 0) {
    tableData1.value = table1.data.list
  }
  const table2 = await getV2GoodsShelfsList({ page: 1, pageSize: 1000 })
  if (table2.code === 0) {
    tableData2.value = table2.data.list
  }
  const table3 = await getV2CustomersList({ page: 1, pageSize: 1000 })
  if (table3.code === 0) {
    tableData3.value = table3.data.list
  }
  const table4 = await getV2WarehousesList({ page: 1, pageSize: 1000 })
  if (table4.code === 0) {
    tableData4.value = table4.data.list
  }
}

// watch(() => tableData.value, () => {
//   setAuthorityIds()
// })

const initPage = async() => {
  getTableData()
  // const res = await getAuthorityList({ page: 1, pageSize: 999 })
  // setOptions(res.data.list)
}

initPage()

// const resetPasswordFunc = (row) => {
//   ElMessageBox.confirm(
//     '是否将此用户密码重置为123456?',
//     '警告',
//     {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning',
//     }
//   ).then(async() => {
//     const res = await resetPassword({
//       ID: row.ID,
//     })
//     if (res.code === 0) {
//       ElMessage({
//         type: 'success',
//         message: res.msg,
//       })
//     } else {
//       ElMessage({
//         type: 'error',
//         message: res.msg,
//       })
//     }
//   })
// }
// const setAuthorityIds = () => {
//   tableData.value && tableData.value.forEach((user) => {
//     customer.authorityIds = customer.authorities && customer.authorities.map(i => {
//       return i.authorityId
//     })
//   })
// }

const chooseImg = ref(null)
// const openHeaderChange = () => {
//   chooseImg.value.open()
// }

const authOptions = ref([])
const setOptions = (authData) => {
  authOptions.value = []
  setAuthorityOptions(authData, authOptions.value)
}

const deleteCustomerFunc = async(row) => {
  const res = await deleteCustomer({ id: row.id })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  }
}
// 弹窗相关
const userInfo = ref({
  name: '',
  phone: 0,
  email: '',
  enable: 1,
})
const OutWarehouseInfo = ref({
  totalWeight: 0,
  type: '',
  toId: 0,
  goodsId: [],
  weight: [],
  shelfName: [],
})

const rules = ref({
  Name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, message: '最低5位字符', trigger: 'blur' }
  ],
  // password: [
  //   { required: true, message: '请输入用户密码', trigger: 'blur' },
  //   { min: 6, message: '最低6位字符', trigger: 'blur' }
  // ],
  // nickName: [
  //   { required: true, message: '请输入用户昵称', trigger: 'blur' }
  // ],
  phone: [
    { pattern: /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/, message: '请输入合法手机号', trigger: 'blur' },
  ],
  email: [
    { pattern: /^([0-9A-Za-z\-_.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g, message: '请输入正确的邮箱', trigger: 'blur' },
  ]
  // authorityId: [
  //   { required: true, message: '请选择用户角色', trigger: 'blur' }
  // ]
})
const userForm = ref(null)
const enteraddCustomerDialog = async() => {
  // userInfo.value.authorityId = userInfo.value.authorityIds[0]
  const len = list.value.length
  for (let i = 0; i < len; i++) {
    if (form[i].huowu === '' || form[i].huojia === '' || form[i].zhongliang === '') {
      ElMessage({
        message: '货物信息不能为空',
        type: 'error',
      })
      break
    }
  }

  for (const value of form) {
    if (value.huowu !== '' && value.huojia !== '' && value.zhongliang !== '') {
      listHuowu.value.push(value.huowu)
      listHuojia.value.push(value.huojia)
      listZhongliang.value.push(Number(value.zhongliang))
      OutWarehouseInfo.value.totalWeight = OutWarehouseInfo.value.totalWeight + Number(value.zhongliang)
    }
  }
  console.log(toType.value)
  console.log(toWhere.value)
  console.log(listHuowu.value)
  console.log(listHuojia.value)
  console.log(listZhongliang.value)
  OutWarehouseInfo.value.type = toType.value
  OutWarehouseInfo.value.toId = Number(toWhere.value)
  OutWarehouseInfo.value.goodsId = listHuowu.value
  OutWarehouseInfo.value.shelfName = listHuojia.value
  OutWarehouseInfo.value.weight = listZhongliang.value
  console.log(OutWarehouseInfo)
  const req = {
    ...OutWarehouseInfo.value
  }
  console.log(req)
  const res = await outWarehouse({ ...OutWarehouseInfo.value })
  // const res = await inWarehouse(req)
  if (res.code === 0) {
    ElMessage({ type: 'success', message: '创建成功' })
    await getTableData()
  }
  closeaddCustomerDialog()
}

const addCustomerDialog = ref(false)
const addDetailDialog = ref(false)
const closeaddCustomerDialog = () => {
  // userForm.value.resetFields()
  // userInfo.value.headerImg = ''
  // userInfo.value.authorityIds = []

  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  list.value.pop()
  toType.value = ''
  toWhere.value = ''

  addCustomerDialog.value = false
}

const dialogFlag = ref('add')

const temCustomer = () => {
  dialogFlag.value = 'add'
  addCustomerDialog.value = true
}

// const tempAuth = {}
// const changeAuthority = async(row, flag, removeAuth) => {
//   if (flag) {
//     if (!removeAuth) {
//       tempAuth[row.ID] = [...row.authorityIds]
//     }
//     return
//   }
//   await nextTick()
//   const res = await setUserAuthorities({
//     ID: row.ID,
//     authorityIds: row.authorityIds
//   })
//   if (res.code === 0) {
//     ElMessage({ type: 'success', message: '角色设置成功' })
//   } else {
//     if (!removeAuth) {
//       row.authorityIds = [...tempAuth[row.ID]]
//       delete tempAuth[row.ID]
//     } else {
//       row.authorityIds = [removeAuth, ...row.authorityIds]
//     }
//   }
// }

const openEdit = (row) => {
  dialogFlag.value = 'edit'
  userInfo.value = JSON.parse(JSON.stringify(row))
  addCustomerDialog.value = true
}
const openDetail = async(row) => {
  const table = await getV2OutWarehousesDetail({
    orderNumber: row.orderNumber,
    page: page1.value,
    pageSize: pageSize1.value
  })
  if (table.code === 0) {
    tableData5.value = table.data.list
    total1.value = table.data.total
    page1.value = table.data.page
    pageSize1.value = table.data.pageSize
  }
  // userInfo.value = JSON.parse(JSON.stringify(row))
  addDetailDialog.value = true
}

const addUser = () => {
  addCustomerDialog.value = true
}

const child = ref(0)
const list = ref([])
const toType = ref()
const toWhere = ref()
const form = reactive([
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' },
  { huowu: '', huojia: '', zhongliang: '' }])

const temType = reactive([
  { name: '调拨出库', id: '0' },
  { name: '销售', id: '1' }])
const listHuowu = ref([])
const listHuojia = ref([])
const listZhongliang = ref([])

const addChild = () => {
  list.value.push({
    type: 'child'
  })
}
const delChild = () => {
  list.value.pop()
}

</script>

<style lang="scss">
/*.user-dialog {*/
/*  .header-img-box {*/
/*  width: 200px;*/
/*  height: 200px;*/
/*  border: 1px dashed #ccc;*/
/*  border-radius: 20px;*/
/*  text-align: center;*/
/*  line-height: 200px;*/
/*  cursor: pointer;*/
/*}*/
/*  .avatar-uploader .el-upload:hover {*/
/*    border-color: #409eff;*/
/*  }*/
/*  .avatar-uploader-icon {*/
/*    border: 1px dashed #d9d9d9 !important;*/
/*    border-radius: 6px;*/
/*    font-size: 28px;*/
/*    color: #8c939d;*/
/*    width: 178px;*/
/*    height: 178px;*/
/*    line-height: 178px;*/
/*    text-align: center;*/
/*  }*/
/*  .avatar {*/
/*    width: 178px;*/
/*    height: 178px;*/
/*    display: block;*/
/*  }*/
/*}*/
.nickName{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.pointer{
  cursor: pointer;
  font-size: 16px;
  margin-left: 2px;
}
#divRoot {
  width: 100%;
  height: auto;
}

</style>
