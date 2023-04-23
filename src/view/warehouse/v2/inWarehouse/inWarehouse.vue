<template>
  <div>
    <warning-bar title="注：右上角头像下拉可切换角色" />
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button type="primary" icon="plus" @click="addUser">新增入库单</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="id"
      >
        <el-table-column align="left" label="orderNumber" min-width="150" prop="orderNumber" />
        <el-table-column align="left" label="仓库名" min-width="180" prop="warehouseName" />
        <el-table-column align="left" label="员工名" min-width="180" prop="staffName" />
        <el-table-column align="left" label="重量" min-width="180" prop="weight" />
        <el-table-column align="left" label="入库方式" min-width="180" prop="type" />
        <el-table-column align="left" label="来源" min-width="180" prop="fromWhere" />
        <el-table-column align="left" label="添加时间" min-width="150" prop="createdAt" />
        <el-table-column align="left" label="修改时间" min-width="150" prop="updatedAt" />
        <!--        <el-table-column label="操作" min-width="250" fixed="right">-->
        <!--          <template #default="scope">-->
        <!--            <el-popover v-model="scope.row.visible" placement="top" width="160">-->
        <!--              <p>确定要删除此用户吗</p>-->
        <!--              <div style="text-align: right; margin-top: 8px;">-->
        <!--                <el-button type="primary" link @click="scope.row.visible = false">取消</el-button>-->
        <!--                <el-button type="primary" @click="deleteCustomerFunc(scope.row)">确定</el-button>-->
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
      :show-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      destroy-on-close
      width="1000px"
    >
      <header>
        <div style="margin-bottom: 20px;">
          <el-button type="primary" @click="addChild">点击添加儿童</el-button>
        </div>
      </header>

      <section style="height: 300px; overflow: auto">
        <ul>
          <template v-for="(item,index) in list">
          <span :key="index" v-if="item.type === 'child'">
            <el-form v-model='form' inline>
              <el-form-item label="货物">
                <el-select v-model="form[index].huowu" placeholder="please select your zone">
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="货架">
                <el-select v-model="form[index].huojia" placeholder="please select your zone">
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
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
  </div>
</template>

<script>
export default {
  name: 'User',
}
</script>

<script setup>

import {
  getV2InWarehousesList,
  // addCustomer,
  // deleteCustomer,
  // updateCustomer
} from '@/api/warehouse'

// import { getAuthorityList } from '@/api/authority'
// import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import WarningBar from '@/components/warningBar/warningBar.vue'
// import { setUserInfo, resetPassword } from '@/api/user.js'

import { nextTick, reactive, ref, watch } from 'vue'
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
  const table = await getV2InWarehousesList({ page: 1, pageSize: 10 })
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
  const len = list.value.length;
  for (let i=0; i<len; i++){
    if(form[i].huowu === '' || form[i].huojia === '' || form[i].zhongliang === '') {
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
      listZhongliang.value.push(value.zhongliang)
    }
  }

  console.log(listHuowu.value)
  console.log(listHuojia.value)
  console.log(listZhongliang.value)

}

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

const addUser = () => {
  addCustomerDialog.value = true
}

 const child = ref(0)
 const list = ref([])

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
  { huowu: '', huojia: '', zhongliang: '' }])

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
