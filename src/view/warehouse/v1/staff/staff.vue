<template>
  <div>
    <warning-bar title="注：右上角头像下拉可切换角色" />
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button type="primary" icon="plus" @click="temCustomer">新增员工</el-button>
        <el-button type="primary" icon="search" @click="staffList">查看离职员工</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="id"
      >
        <!--        <el-table-column align="left" label="ID" min-width="50" prop="id" />-->
        <el-table-column align="left" label="员工名" min-width="150" prop="name" />
        <el-table-column align="left" label="手机号" min-width="180" prop="phone" />
        <el-table-column align="left" label="邮箱" min-width="180" prop="email" />
        <el-table-column align="left" label="仓库名" min-width="180" prop="warehouseName" />
        <el-table-column align="left" label="状态" min-width="180" prop="status" />
        <el-table-column align="left" label="添加时间" min-width="200" prop="createdAt">
          <template #default="scope">
            <div>{{ changeTime(scope.row.createdAt) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right">
          <template #default="scope">
            <el-popover v-model="scope.row.visible" placement="top" width="160">
              <p>确定设定员工为离职吗</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button type="primary" link @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" @click="deleteCustomerFunc(scope.row)">确定</el-button>
              </div>
              <template #reference>
                <el-button type="primary" link icon="delete">离职</el-button>
              </template>
            </el-popover>
            <el-button type="primary" link icon="edit" @click="openEdit(scope.row)">编辑</el-button>
            <el-button type="primary" link icon="magic-stick" @click="resetPasswordFunc(scope.row)">重置密码</el-button>
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
      title="新增员工"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div style="height:60vh;overflow:auto;padding:0 12px;">
        <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="80px">
          <!--          <el-form-item v-if="dialogFlag === 'add'" label="用户名" prop="name">-->
          <!--            <el-input v-model="userInfo.userName" />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item v-if="dialogFlag === 'add'" label="密码" prop="password">-->
          <!--            <el-input v-model="userInfo.password" />-->
          <!--          </el-form-item>-->
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="userInfo.userName" />
          </el-form-item>
          <el-form-item label="密码" prop="passWord">
            <el-input v-model="userInfo.passWord" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="userInfo.nickName" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userInfo.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email" />
          </el-form-item>
<!--          <el-form-item label="启用" prop="disabled">-->
<!--            <el-switch-->
<!--              v-model="userInfo.enable"-->
<!--              inline-prompt-->
<!--              :active-value="1"-->
<!--              :inactive-value="2"-->
<!--            />-->
<!--          </el-form-item>-->

        </el-form>

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeaddCustomerDialog">取 消</el-button>
          <el-button type="primary" @click="enteraddCustomerDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="updateCustomerDialog"
      custom-class="user-dialog"
      title="编辑员工"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div style="height:60vh;overflow:auto;padding:0 12px;">
        <el-form ref="userForm1" :rules="rules" :model="userInfo" label-width="80px">
          <el-form-item label="昵称" prop="name">
            <el-input v-model="userInfo.name" />
          </el-form-item>
          <el-form-item label="仓库名" prop="warehouseName">
            <el-input v-model="userInfo.warehouseName" />
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
          <el-button @click="closeUpdateCustomerDialog">取 消</el-button>
          <el-button type="primary" @click="enterUpdateCustomerDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <ChooseImg ref="chooseImg" :target="userInfo" :target-key="`headerImg`" />
    <el-dialog
      v-model="staffListDialog"
      custom-class="user-dialog"
      title="离职员工列表"
      :show-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="1400px"
      :before-close="closeDialog"
    >
      <div class="gva-table-box">
        <el-table
          :data="tableData1"
          row-key="id"
        >
          <el-table-column align="left" label="员工名" min-width="150" prop="name" />
          <el-table-column align="left" label="手机号" min-width="180" prop="phone" />
          <el-table-column align="left" label="邮箱" min-width="180" prop="email" />
          <el-table-column align="left" label="仓库名" min-width="180" prop="warehouseName" />
          <el-table-column align="left" label="状态" min-width="180" prop="status" />
          <el-table-column align="left" label="添加时间" min-width="200" prop="createdAt">
            <template #default="scope">
              <div>{{ changeTime(scope.row.createdAt) }}</div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="离职时间" min-width="200" prop="deletedAt">
            <template #default="scope">
              <div>{{ changeTime(scope.row.deletedAt) }}</div>
            </template>
          </el-table-column>

        </el-table>
        <div class="gva-pagination">
          <el-pagination
            :current-page="page1"
            :page-size="pageSize1"
            :page-sizes="[10, 30, 50, 100]"
            :total="total1"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange1"
            @size-change="handleSizeChange1"
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
  getStaffsList,
  addStaff,
  deleteStaff,
  updateStaff, resetPassword, getOffStaffList
} from '@/api/warehouse'

// import { getAuthorityList } from '@/api/authority'
// import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import WarningBar from '@/components/warningBar/warningBar.vue'
// import { setUserInfo, resetPassword } from '@/api/user.js'

import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatTimeToStr } from '@/utils/date'
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
const page1 = ref(1)
const total1 = ref(0)
const pageSize1 = ref(10)
const tableData1 = ref([])
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}
const handleSizeChange1 = (val) => {
  pageSize1.value = val
  openDetail(_row.value)
}
const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

const handleCurrentChange1 = (val) => {
  page1.value = val
  staffList()
}

const closeDialog = () => {
  staffListDialog.value = false
  page1.value = 1
  pageSize1.value = 10
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
  const table = await getStaffsList({ page: page.value, pageSize: pageSize.value })
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
const changeTime = (time) => {
  return formatTimeToStr(time, 'yyyy-MM-dd hh:mm:ss')
}

const initPage = async() => {
  getTableData()
  // const res = await getAuthorityList({ page: 1, pageSize: 999 })
  // setOptions(res.data.list)
}

initPage()

const resetPasswordFunc = (row) => {
  ElMessageBox.confirm(
    '是否将此用户密码重置为123456?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async() => {
    console.log(row)
    const res = await resetPassword({
      ID: row.id,
    })
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: res.msg,
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
  })
}

const chooseImg = ref(null)
const openHeaderChange = () => {
  chooseImg.value.open()
}

const authOptions = ref([])
const setOptions = (authData) => {
  authOptions.value = []
  setAuthorityOptions(authData, authOptions.value)
}

const deleteCustomerFunc = async(row) => {
  const res = await deleteStaff({ id: row.id })
  if (res.code === 0) {
    ElMessage.success('离职成功')
    row.visible = false
    await getTableData()
  }
}
// 弹窗相关
const userInfo = ref({
  userName: '',
  passWord: '',
  nickName: '',
  warehouseName: '',
  headerImg: '',
  enable: 1,
  phone: '',
  email: '',
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
const userForm1 = ref(null)
const enteraddCustomerDialog = async() => {
  // userInfo.value.authorityId = userInfo.value.authorityIds[0]
  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...userInfo.value
      }
      if (dialogFlag.value === 'add') {
        const res = await addStaff(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeaddCustomerDialog()
        }
      }
    }
  })
}

const enterUpdateCustomerDialog = async() => {
  // userInfo.value.authorityId = userInfo.value.authorityIds[0]
  userForm1.value.validate(async valid => {
    if (valid) {
      const req = {
        ...userInfo.value
      }
      if (dialogFlag.value === 'edit') {
        const res = await updateStaff(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeUpdateCustomerDialog()
        }
      }
    }
  })
}
const addCustomerDialog = ref(false)
const updateCustomerDialog = ref(false)
const closeaddCustomerDialog = () => {
  userForm.value.resetFields()
  userInfo.value.email = ''
  userInfo.value.userName = ''
  userInfo.value.phone = ''
  userInfo.value.headerImg = ''
  userInfo.value.nickName = ''
  userInfo.value.passWord = ''
  userInfo.value.enable = 1
  addCustomerDialog.value = false
}
const closeUpdateCustomerDialog = () => {
  userForm1.value.resetFields()
  userInfo.value.email = ''
  userInfo.value.phone = ''
  userInfo.value.headerImg = ''
  userInfo.value.name = ''
  userInfo.value.warehouseName = ''
  userInfo.value.enable = 1
  updateCustomerDialog.value = false
}

const dialogFlag = ref('add')
const staffListDialog = ref()

const temCustomer = () => {
  dialogFlag.value = 'add'
  addCustomerDialog.value = true
}

// eslint-disable-next-line no-unused-vars
const staffList = async() => {
  const table = await getOffStaffList({ page: page1.value, pageSize: pageSize1.value })
  if (table.code === 0) {
    tableData1.value = table.data.list
    total1.value = table.data.total
    page1.value = table.data.page
    pageSize1.value = table.data.pageSize
  }
  staffListDialog.value = true
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
  updateCustomerDialog.value = true
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
