import service from '@/utils/request'
export const getWarehousesList = (data) => {
  return service({
    url: "/warehouse/v1/getWarehousesList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getGoodsList = (data) => {
  return service({
    url: "/warehouse/v1/getGoodsList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getStaffsList = (data) => {
  return service({
    url: "/warehouse/v1/getStaffsList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getCustomersList = (data) => {
  return service({
    url: "/warehouse/v1/getCustomersList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getSuppliersList = (data) => {
  return service({
    url: "/warehouse/v1/getSuppliersList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getGoodsShelfsList = (data) => {
  return service({
    url: "/warehouse/v1/getGoodsShelfsList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getOutWarehousesList = (data) => {
  return service({
    url: "/warehouse/v1/getOutWarehousesList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getOutWarehousesDetail = (data) => {
  return service({
    url: "/warehouse/v1/getOutWarehousesDetail" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getInWarehousesList = (data) => {
  return service({
    url: "/warehouse/v1/getInWarehousesList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
// 获取客户列表
export const getInWarehousesDetail = (data) => {
  return service({
    url: "/warehouse/v1/getInWarehousesDetail" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const addCustomer = (data) => {
  return service({
    url: '/warehouse/v1/addCustomer',
    method: 'post',
    data: data
  })
}
export const deleteCustomer = (data) => {
  return service({
    url: '/warehouse/v1/deleteCustomer',
    method: 'post',
    data: data
  })
}
export const updateCustomer = (data) => {
  return service({
    url: '/warehouse/v1/updateCustomer',
    method: 'post',
    data: data
  })
}
