import { deleteRequest, getRequest, postRequest, putRequest } from "./ApiServices";

export const fetchInvoice = () => getRequest('/invoices');

export const fetchInvoiceById = (id: string | number) => getRequest(`/invoices/${id}`);

export const updateInvoiceById=(id:string,data:any)=>{
    putRequest(`/invoices/${id}`,data)
}

export const createInvoice=(NewInvoice:any)=>{
    return postRequest(`/invoices`,NewInvoice)
}
export const deleteInvoice = (id: string | number) => {
    return deleteRequest(`/invoices/${id}`)
}
