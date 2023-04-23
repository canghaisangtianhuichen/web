<template>
  <div>
    <warning-bar title="注：右上角头像下拉可切换角色" />
    <div class="gva-table-box">
<!--      <div class="gva-btn-list">-->
<!--        <el-button type="primary" icon="plus" @click="temCustomer">新增供应商</el-button>-->
<!--      </div>-->
      <el-table
        :data="tableData"
        row-key="id"
      >
        <el-table-column align="left" label="ID" min-width="50" prop="id" />
        <el-table-column align="left" label="姓名" min-width="150" prop="name" />
        <el-table-column align="left" label="手机号" min-width="180" prop="phone" />
        <el-table-column align="left" label="邮箱" min-width="180" prop="email" />
        <el-table-column align="left" label="添加时间" min-width="150" prop="createdAt" />
<!--        <el-table-column label="操作" min-width="250" fixed="right">-->
<!--          <template #default="scope">-->
<!--            <el-popover v-model="scope.row.visible" placement="top" width="160">-->
<!--              <p>确定要删除此用户吗</p>-->
<!--              <div style="text-align: right; margin-top: 8px;">-->
<!--                <el-button type="primary" link @click="scope.row.visible = false">取消</el-button>-->
<!--                <el-button type="primary" @click="deleteSupplierFunc(scope.row)">确定</el-button>-->
<!--              </div>-->
<!--              <template #reference>-->
<!--                <el-button type="primary" link icon="delete">删除</el-button>-->
<!--              </template>-->
<!--            </el-popover>-->
<!--            <el-button type="primary" link icon="edit" @click="openEdit(scope.row)">编辑</el-button>-->
<!--            &lt;!&ndash;            <el-button type="primary" link icon="magic-stick" @click="resetPasswordFunc(scope.row)">重置密码</el-button>&ndash;&gt;-->
<!--          </template>-->
<!--        </el-table-column>-->

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
      title="供应商"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:60vh;overflow:auto;padding:0 12px;">
        <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="80px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userInfo.name" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userInfo.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email" />
          </el-form-item>
        </el-form>

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeaddCustomerDialog">取 消</el-button>
          <el-button type="primary" @click="enteraddCustomerDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <ChooseImg ref="chooseImg" :target="userInfo" :target-key="`headerImg`" />
  </div>
</template>

<script>
export default {
  name: 'User',
}
</script>

<script setup>

import {
  getV2SuppliersList,
  // addSupplier,
  // deleteSupplier,
  // updateSupplier,
} from '@/api/warehouse'

// import { getAuthorityList } from '@/api/authority'
// import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import WarningBar from '@/components/warningBar/warningBar.vue'
// import { setUserInfo, resetPassword } from '@/api/user.js'

import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
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
const pageSize = ref(10)
const tableData = ref([])
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
const getTableData = async() => {
  const table = await getV2SuppliersList({ page: 1, pageSize: 10 })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
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

const chooseImg = ref(null)
// const openHeaderChange = () => {
//   chooseImg.value.open()
// }

const authOptions = ref([])
const setOptions = (authData) => {
  authOptions.value = []
  setAuthorityOptions(authData, authOptions.value)
}

// const deleteSupplierFunc = async(row) => {
//   const res = await deleteSupplier({ id: row.id })
//   if (res.code === 0) {
//     ElMessage.success('删除成功')
//     row.visible = false
//     await getTableData()
//   }
// }
// 弹窗相关
const userInfo = ref({
  name: '',
  phone: 0,
  email: '',
  enable: 1,
})

const rules = ref({
  Name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, message: '最低2位字符', trigger: 'blur' }
  ]
})
const userForm = ref(null)
// const enteraddCustomerDialog = async() => {
//   // userInfo.value.authorityId = userInfo.value.authorityIds[0]
//   userForm.value.validate(async valid => {
//     if (valid) {
//       const req = {
//         ...userInfo.value
//       }
//       if (dialogFlag.value === 'add') {
//         const res = await addSupplier(req)
//         if (res.code === 0) {
//           ElMessage({ type: 'success', message: '创建成功' })
//           await getTableData()
//           closeaddCustomerDialog()
//         }
//       }
//       if (dialogFlag.value === 'edit') {
//         const res = await updateSupplier(req)
//         if (res.code === 0) {
//           ElMessage({ type: 'success', message: '编辑成功' })
//           await getTableData()
//           closeaddCustomerDialog()
//         }
//       }
//     }
//   })
// }

const addCustomerDialog = ref(false)
const closeaddCustomerDialog = () => {
  userForm.value.resetFields()
  userInfo.value.headerImg = ''
  userInfo.value.authorityIds = []
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
</style>
