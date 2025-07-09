export interface Login_DATARESPONSE {
  access_token: string;
  userName: string;
  id: string;
  logtime: string;
  code: number;
  result: string;
  name: string;
}

/////////////////////////////////////////////////////////////

export interface AllDataSubject_DATARESPONSE {
  result: boolean;
  code: number;
  time: string;
  data: AllDataSubject_DATARESPONSE_dataChild;
}

interface AllDataSubject_DATARESPONSE_dataChild {
  ds_lop: data_ds_lop[];
  ds_mon_hoc: data_ds_mon_hoc[];
  ds_khoa: data_ds_lop[];
  ds_nhom_to: data_ds_nhom_to[];
}
interface data_ds_lop {
  ten: string;
  ma: string;
}
interface data_ds_mon_hoc extends data_ds_lop {
  ten_eg: string;
}
interface data_ds_nhom_to {
  ma_mon: string;
  is_dk: boolean;
  id_to_hoc: string;
  id_mon_hoc: string;
  so_tc_so: number;
  nhom_to: string;
  to: string;
  ds_lop: string[];
  ds_khoa: string[];
  sl_dk: number;
  sl_cp: number;
  sl_cl: number;
  tkb: string;
}

/////////////////////////////////////////////////////////////////////

export interface AllDataSubjectSigned_DATARESPONSE {
  result: boolean;
  data: AllDataSubjectSigned_DATARESPONSE_dataChild;
  code: number;
}
interface AllDataSubjectSigned_DATARESPONSE_dataChild {
  total_items: number;
  ds_kqdkmh: kqdkmh[];
}
interface kqdkmh {
  to_hoc: data_ds_nhom_to;
  enable_xoa: boolean;
  id_kqdk: string;
}

//////////////////////////////////////////////////////////

export interface HandleRegisterSubject_DATARESPONSE {
  result: boolean;
  data: HandleRegisterSubject_DATARESPONSE_dataChild;
  code: number;
  message: string;
}
interface HandleRegisterSubject_DATARESPONSE_dataChild {
  is_thanh_cong: boolean;
  thong_bao_loi: string;
  ket_qua_dang_ky: data_ds_nhom_to;
}

////////////////////////////////////////////////////
export interface infoStudent_DATARESPONSE<T = unknown> {
  result: boolean;
  data: T;
  code: number;
}
