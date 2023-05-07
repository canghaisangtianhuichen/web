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
    url: "/warehouse/v1/getOutWarehousesDetail" +  "?orderNumber="+data.orderNumber+"&page="+data.page+"&pageSize="+data.pageSize,
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

export const getInWarehousesDetail = (data) => {
  return service({
    url: "/warehouse/v1/getInWarehousesDetail" + "?orderNumber="+data.orderNumber+"&page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getOffStaffList = (data) => {
  return service({
    url: "/warehouse/v1/getStaffsList/off" + "?orderNumber="+data.orderNumber+"&page="+data.page+"&pageSize="+data.pageSize,
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
export const addSupplier = (data) => {
  return service({
    url: '/warehouse/v1/addSupplier',
    method: 'post',
    data: data
  })
}
export const updateSupplier = (data) => {
  return service({
    url: '/warehouse/v1/updateSupplier',
    method: 'post',
    data: data
  })
}
export const deleteSupplier = (data) => {
  return service({
    url: '/warehouse/v1/deleteSupplier',
    method: 'post',
    data: data
  })
}
export const addWarehouse = (data) => {
  return service({
    url: '/warehouse/v1/addWarehouse',
    method: 'post',
    data: data
  })
}
export const updateWarehouse = (data) => {
  return service({
    url: '/warehouse/v1/updateWarehouse',
    method: 'post',
    data: data
  })
}
export const deleteWarehouse = (data) => {
  return service({
    url: '/warehouse/v1/deleteWarehouse',
    method: 'post',
    data: data
  })
}
export const addStaff = (data) => {
  return service({
    url: '/warehouse/v1/addStaff',
    method: 'post',
    data: data
  })
}
export const updateStaff = (data) => {
  return service({
    url: '/warehouse/v1/updateStaff',
    method: 'post',
    data: data
  })
}
export const deleteStaff = (data) => {
  return service({
    url: '/warehouse/v1/deleteStaff',
    method: 'post',
    data: data
  })
}
export const resetPassword = (data) => {
  return service({
    url: '/warehouse/v1/resetPassword',
    method: 'post',
    data: data
  })
}

// -------------------------------------------------------------------------------------------v2
export const getV2GoodsList = (data) => {
  return service({
    url: "/warehouse/v2/getGoodsList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getV2StaffsList = (data) => {
  return service({
    url: "/warehouse/v2/getStaffsList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getV2CustomersList = (data) => {
  return service({
    url: "/warehouse/v2/getCustomersList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getV2SuppliersList = (data) => {
  return service({
    url: "/warehouse/v2/getSuppliersList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getV2GoodsShelfsList = (data) => {
  return service({
    url: "/warehouse/v2/getGoodsShelfsList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getV2OutWarehousesList = (data) => {
  return service({
    url: "/warehouse/v2/getOutWarehousesList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getV2OutWarehousesDetail = (data) => {
  return service({
    url: "/warehouse/v2/getOutWarehousesDetail" +  "?orderNumber="+data.orderNumber+"&page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getV2InWarehousesList = (data) => {
  return service({
    url: "/warehouse/v2/getInWarehousesList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const getV2InWarehousesDetail = (data) => {
  return service({
    url: "/warehouse/v2/getInWarehousesDetail" +  "?orderNumber="+data.orderNumber+"&page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
//生成出/入库列表-获取仓库列表
export const getV2WarehousesList = (data) => {
  return service({
    url: "/warehouse/v2/getWarehousesList" + "?page="+data.page+"&pageSize="+data.pageSize,
    method: 'get',
    data: data
  })
}
export const addGood = (data) => {
  return service({
    url: '/warehouse/v2/addGood',
    method: 'post',
    data: data
  })
}

export const deleteGood = (data) => {
  return service({
    url: '/warehouse/v2/deleteGood',
    method: 'post',
    data: data
  })
}
export const addGoodsShelf = (data) => {
  return service({
    url: '/warehouse/v2/addGoodsShelf',
    method: 'post',
    data: data
  })
}

export const deleteGoodsShelf = (data) => {
  return service({
    url: '/warehouse/v2/deleteGoodsShelf',
    method: 'post',
    data: data
  })
}

export const inWarehouse = (data) => {
  return service({
    url: '/warehouse/v2/inWarehouse',
    method: 'post',
    data: data
  })
}
export const outWarehouse = (data) => {
  return service({
    url: '/warehouse/v2/outWarehouse',
    method: 'post',
    data: data
  })
}
