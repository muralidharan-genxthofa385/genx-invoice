import { Link, useParams } from 'react-router-dom';
import './InvoiceView.css';
import { FaChevronLeft } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { fetchInvoice } from '../../../service/invoiceService';


interface invoiceDetails {
  invoice_number: string;
  invoice_date: string;
  payment_terms: string;
  due_date: string;
  amount_received: string;
  grand_total: string;
  tax_amount: string;
  total_amount: string;
  notes: string | null;
  customer: {
    company_name: string;
    gst_number: string;
    email: string;
    customer_name: string;
    shipping_address:{
        address_line_1: string;
      address_line_2: string;
      city: string;
      pincode: string;
      state: string;
    };
    billing_address: {
      address_line_1: string;
      address_line_2: string;
      city: string;
      pincode: string;
      state: string;
    };
  };
  items: {
    id: number;
    item_name: string;
    quantity: string;
    unit_price: string;
    total_amount: string;
    tax_amount: string;
    tax_percentage: string;
  }[];
}


function InvoiceView() {
    const {id}=useParams();
    const[invoiceView,setInvoiceView]=useState<invoiceDetails|null>(null)
    useEffect(()=>{
        fetchInvoice()
        .then((res)=>{
            const selectedView=res.data.data.find((inv:any)=>String(inv.id)===id);
            setInvoiceView(selectedView)
            console.log("invoice ",selectedView)
        })
        .catch(res=>console.log(res))
    },[id])

let subtotal = 0;
let taxAmount = 0;
let grandTotal = 0;
let balanceDue = 0;

if (invoiceView?.items) {
  subtotal = invoiceView.items.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity || "0");
    const price = parseFloat(item.unit_price || "0");
    return sum + quantity * price;
  }, 0);
  taxAmount = invoiceView.items.reduce((sum, item) => {
    return sum + parseFloat(item.tax_amount || "0");
  }, 0);
  grandTotal = subtotal + taxAmount;
  balanceDue = grandTotal - parseFloat(invoiceView.amount_received || "0");
}
const shippingOrBillingAddress = invoiceView?.customer?.shipping_address ?? invoiceView?.customer?.billing_address;

  return (
    <>
    <div className="inv-view-headder">
        <label>
            <Link to={`/invoice`} className='newExpenseHeading  view-inv-back-link'><FaChevronLeft/> View Invoice</Link>
        </label>
    </div>
    <div className="inv-view-overall mt-5">
        <div className='inv-view-container'>
<div className="company-Name-info p-3 d-flex justify-content-between">
    <div>
    <h3>{invoiceView?.customer?.company_name}</h3>
    <h5>{invoiceView?.customer.billing_address.city}</h5>
    <h5>{invoiceView?.customer.billing_address.state}</h5>
    <h5>{invoiceView?.customer?.gst_number}</h5>
    <h5>{invoiceView?.customer?.email}</h5>
</div>
<div className='d-flex align-items-end'>
    <h1>Invoice</h1>
</div>
</div>

<div className="invoice-date-due-dt  d-flex justify-content-between">
    <div className='w-50  p-3 '>
<h5 className='d-flex' style={{gap:"24%"}}><span className='w-25'>inv-No</span> <span>:{invoiceView?.invoice_number||""}</span></h5> 
 <h5 className='d-flex '  style={{gap:"24%"}}><span className='w-25'>Invoice Date</span> <span>:{invoiceView?.invoice_date.slice(0,10)}  </span></h5>
{invoiceView?.payment_terms&&<h5 className='d-flex '  style={{gap:"25%"}}><span className='w-25'>Terms</span> <span>:{invoiceView?.payment_terms}</span></h5>}
<h5 className='d-flex '  style={{gap:"24%"}}><span className='w-25'>Due Date</span> <span>:{invoiceView?.due_date.slice(0,10)} </span></h5>
    </div> 
</div>

<div className="bill-to-and-shipto-container d-flex">
    <div className="bill-to w-50">
        <div className="billto-headder add-headder w-100">
            <p>Bill to</p>
            <div className='bill-add-details p-3 d-flex flex-column gap-2' style={{borderRight:"var(--color-border)"}}>
            <span style={{color:"var(--color-accent)",fontWeight:"700"}}>{invoiceView?.customer?.customer_name}</span>
            <span>{invoiceView?.customer?.billing_address.address_line_1}</span>
            <span>{invoiceView?.customer?.billing_address.address_line_2||null}</span>
            <span>{invoiceView?.customer?.billing_address.city}</span>
            <span>{invoiceView?.customer?.billing_address.pincode} {invoiceView?.customer?.billing_address.state}.</span>
          
            </div>
        </div>
    </div>
    <div className="ship-to add-headder w-50">
          <div className="billto-headder add-headder w-100">
            <p>ship to</p>
<div className='bill-add-details p-3 d-flex flex-column gap-2' style={{borderRight:"var(--color-border)"}}>
            <span>{shippingOrBillingAddress?.address_line_1}</span>
            <span>{shippingOrBillingAddress?.address_line_2}</span>
            <span>{shippingOrBillingAddress?.city}</span>
            <span>{shippingOrBillingAddress?.pincode} {shippingOrBillingAddress?.state}.</span>
             <span style={{visibility:"hidden"}}>name</span> 
            </div>
        </div>

    </div>
</div>
<div className='invoice-view-table-container'>
    <table className='invoice-view-table'>
        <thead>
            <tr className='invoice-view-table-headder-row'>
                <th style={{width:"5%"}}>s.no</th>
                <th style={{width:"60%"}}>Item & Description</th>
                <th style={{textAlign:"right"}}>Qty</th>
                <th style={{textAlign:"right"}}>Rate</th>
                <th style={{textAlign:"right"}}>Amount</th>
            </tr>
        </thead>
        <tbody>
           {invoiceView?.items.map((item,index)=><tr key={item.id} className='invoice-view-table-items-row'  style={{backgroundColor:"white"}}>
                <td>{index+1}</td>
                 <td style={{textAlign:"left"}}>{item.item_name}</td>
                  <td style={{textAlign:"right"}}>{item.quantity}</td>
                   <td style={{textAlign:"right"}}>₹ {item.unit_price}</td>
                    <td style={{textAlign:"right"}}>₹ {item.total_amount}</td>
            </tr>)}
        </tbody>
    </table>

</div>

<div className="inv-view-notes-nd-subtot-container w-100 d-flex">
    <div className='w-50 p-3'>
<h3>Notes</h3>
<p>{!invoiceView?.notes?"no notes were added":invoiceView.notes}</p>
    </div>
    <div className='w-50 p-3 '>
<p><span>Sub Total </span><span>₹ {subtotal.toFixed(2)}</span></p>
<p><span>GST </span><span>₹ {taxAmount.toFixed(2)}</span></p>
<p><span> Total </span><span>₹ {grandTotal.toFixed(2)}</span></p>
<p><span>Balance Due</span><span>₹ {balanceDue.toFixed(2)}</span></p>


    </div>
</div>
        </div> {/*-------------------*/}

    </div>
    </>
  );

}

export default InvoiceView;