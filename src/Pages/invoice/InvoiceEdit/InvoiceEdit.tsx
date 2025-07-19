import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../mainInvoice/InvoiceTopCustomers/Inv_Top_cust_details.css';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { IoMdAdd } from "react-icons/io";
import searchIcon from '../../../assets/Icons/searchicon.svg'
import Select from 'react-select';
import { GetCustomersList } from '../../../service/CustomerService';

import threedotOpt from '../../../assets/Icons/Billtablethreedot.svg';
import billtableCloce from '../../../assets/Icons/billTableClose.svg';
import Discounticonbilltable from '../../../assets/Icons/Discount -icon-billtable.svg';
import addNewRowIcon from '../../../assets/Icons/addnewrowicon.svg';
import addNewheadderIcon from '../../../assets/Icons/addnewHeaddericon.svg';
import showSummaryIcon from '../../../assets/Icons/showSummaryDrop.svg'
import hideSummary from '../../../assets/Icons/hideSummaryIcon.svg'
import dustbinDelete from '../../../assets/Icons/dustbinDeleteIcon.svg';
import printIcon from '../../../assets/Icons/printIcon.svg'
import warningicon from '../../../assets/Icons/WarningIcon.svg'
import CreatableSelect from 'react-select/creatable';
import customericon from '../../../assets/Icons/customerInactive.svg'
import { FaClone } from "react-icons/fa6";
import { BiSolidBasket } from "react-icons/bi";
import { FaUserCheck } from "react-icons/fa";

import { fetchInvoice, fetchInvoiceById, updateInvoiceById } from '../../../service/invoiceService';
import { toast } from 'react-toastify';


interface individualInvoice{
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
    discount_amount: number;
  }[];
}

function InvoiceEdit() {
const{id}=useParams()
const [individualinvoice,setIndividualinvoice]=useState<individualInvoice|null>(null)
 
const [customerName, setCustomerName] = useState("");


  useEffect(() => {
  fetchInvoiceById(String(id))
    .then((res) => {
      const indinv = res.data;
      const items = indinv.items.map((item: any) => ({
        ...item,
        discount: typeof item.discount_amount === 'number' ? item.discount_amount : Number(item.discount_amount) || 0
      }));
      setIndividualinvoice({ ...indinv, items });
      setCustomerName(indinv.customer.customer_name);
      console.log(res)
    })
    .catch((err) => console.error("inv edit error", err));
}, [id]);


      const navigate = useNavigate();

      const handleInvoiceEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setIndividualinvoice(prev => {
    if (!prev) return null;
    return {...prev,[name]: value};
  });
};


const handleEditSave = async () => {
  if (!individualinvoice) return;
  try {
    await updateInvoiceById(String(id), individualinvoice);
    navigate('/invoice');
    toast.success("invoice edited successfully")
  } catch (error) {
    console.error('Failed to update invoice:', error);
    toast.error("failed to edit invoice");
  }
};

      const [renderAddHeadderButton,setrenderAddHeadderButton]=useState<boolean>(false)
      const [rendRowactions,setrendRowactions]=useState<boolean>(false)

    {/*--------------------------------------------------Invoice Bill Table---------------------------*/}

      const [showSummary, setShowSummary] = useState(false);

//   const items = [
//     {
//       itemName: "Item A",
//       itemQuantity: 2,
//       itemRate: 500,
//       itemDiscount: 10, 
//       taxSelection: { label: "GST 18%", value: "GST18(18%)" },
//     }
//   ];

const subtotal = individualinvoice?.items.reduce((sum, item) => {
  return sum + parseFloat(item.total_amount || '0');
}, 0) || 0;

  const getSummaryDetails = () => {
    return individualinvoice?.items.map((item:any, idx:number) => {
      const baseAmount = item.quantity * item.unit_price;
      const discount = (baseAmount * item.discount_amount) / 100;
      const taxable = baseAmount - discount;

      const [taxType, taxRateStr] = item.taxSelection?.label.split(' ') || [];
      const taxPercent = parseFloat(taxRateStr || '0');
      const taxAmount = (taxable * taxPercent) / 100;
      const cgst = taxType === 'GST' ? taxAmount / 2 : 0;
      const sgst = taxType === 'GST' ? taxAmount / 2 : 0;
      const igst = taxType === 'IGST' ? taxAmount : 0;
      return {
        itemName: item.itemName,
        cgst,
        sgst,
        igst,
        discount,
      }
    });
  };
  const summaryDetails = getSummaryDetails();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const handleCancelClick = () => {
    setShowCancelPopup(true);
  };
  const handleStayHere = () => {
    setShowCancelPopup(false);
  };

  const handleLeaveAndDiscard = () => {
    navigate('/invoice');
  };

const [paymentbox,setpaymentbox]=useState<boolean>(false)

// const addNewHeaderRow = () => {
//   const newHeader = {
//     id: Date.now(),
//     isHeader: true,
//     item_name: '',
//     quantity: '',
//     unit_price: '',
//     total_amount: '',
//     tax_percentage: '',
//     tax_amount: '',
//   };
  
//   setIndividualinvoice(prev => prev ? {
//     ...prev,
//     items: [...prev.items, newHeader]
//   } : null);
// };

const addNewRow = () => {
  const newItem = {
    id: Date.now(),
    isHeader: false,
    item_name: '',
    quantity: '',
    unit_price: '',
    total_amount: '',
    tax_percentage: '',
    tax_amount: '',
    discount_amount: 0,
  };

  setIndividualinvoice(prev => prev ? {
    ...prev,
    items: [...prev.items, newItem]
  } : null);
};

const deleteItemRow = (index: number) => {
  setIndividualinvoice(prev => {
    if (!prev) return null;
    const updated = [...prev.items];
    updated.splice(index, 1);
    return { ...prev, items: updated };
  });
};
const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
  const { name, value } = e.target;

  setIndividualinvoice(prev => {
    if (!prev) return null;

    const updatedItems = [...prev.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: name === 'discount_amount' ? Number(value) : value,
      total_amount: calculateItemTotal({
        ...updatedItems[index],
        [name]: name === 'discount_amount' ? Number(value) : value
      })
    };

    return {
      ...prev,
      items: updatedItems
    };
  });
};

const calculateItemTotal = (item: any) => {
  const quantity = parseFloat(item.quantity || '0');
  const unitPrice = parseFloat(item.unit_price || '0');
  const discount = typeof item.discount === 'number' ? item.discount_amount : parseFloat(item.discount_amount || '0');
  const tax = parseFloat(item.tax_percentage || '0');

  const baseAmount = quantity * unitPrice;
  const discountAmt = (baseAmount * discount) / 100;
  const taxable = baseAmount - discountAmt;
  const taxAmt = (taxable * tax) / 100;
  return (taxable + taxAmt).toFixed(2);
};




  return (
    <>
       <div className="inv-cust-det-container">
        <Link to={`/invoice`} className="new-customer-heading d-flex align-items-center" style={{ textDecoration: 'none',width:"11%" }} > <IoIosArrowBack />Edit Invoice
        </Link>
        <div className="inv-cust-details">
          <div className="cust-name-nd-SalesPer">
            <label className='select-customer-label invoice-label'>
              Customer Name  <FaUserCheck style={{position:"absolute",top:"63%",left:"2%",color:"var(--color-accent)",fontSize:"19px"}} />
              <input className='select-customer-dropdown'  placeholder="Select or search customer" 
            style={{ paddingLeft: '38px', color: 'var(--color-accent)', fontWeight: 500, fontSize: '16px', height: '40px', outline:"none", border: '1px solid var(--color-border)',  borderRadius: '4px', 
    background: '#fff'}} 
    value={individualinvoice?.customer.customer_name || ""}/>
            </label>

            <label className='select-salesperson-label invoice-label'>
                Salesperson  <img src={searchIcon}/>
                <Select className='select-salesperson-dropdown'
                isDisabled
                 placeholder="Select or add a new salesperson"
                 styles={{ placeholder: (base) => ({...base,paddingLeft: '38px',color: '#888',fontWeight: '500',fontSize: '14px'}),
                control: (base) => ({...base,paddingLeft: '0px'}), input: (base) => ({...base, paddingLeft: '38px',}),singleValue: (base) => ({ ...base, paddingLeft: '38px',}),}}/>
            </label>
          </div>

          <div className="invoice-duedate-details">
            <label className='invoice-label' htmlFor="">Invoice No.<input type="text" value={individualinvoice?.invoice_number} name='invoice_number' onChange={handleInvoiceEditChange} placeholder='INV-123-333' /></label>
            <label className='invoice-label' htmlFor="">Invoice Date<input type="date" name='invoice_date' defaultValue={individualinvoice?.invoice_date} onChange={handleInvoiceEditChange} /> </label>
            <label className='invoice-label' htmlFor="">Payment Terms
              <select value={individualinvoice?.payment_terms} name='payment_terms' onChange={handleInvoiceEditChange}>
                <option value="" disabled>Select payment term</option>
                <option value="due-on-recipt">Due On Recipt</option>
                <option value="next-month">Due at the end of next month</option>
                <option value="end-this-month">Due at the end of this month</option>

              </select>
            </label>
            <label className='invoice-label' htmlFor="">Due Date
              <input type="date" name='due_date' onChange={handleInvoiceEditChange} value={individualinvoice?.due_date}/>
            </label>
          </div>
        </div>
      </div>

{/**----------------------------------------------------------- Invoice Bill Table------------------------------------------------------------------------ */}
 <div className="invoiceBilltableOverall">
      <h2 className='item-table-label'>Item Table</h2>
      <table className='invoice-bill-table'>
        <thead>
          <tr>
            <th>ITEM DETAILS</th>
            <th>QUANTITY</th>
            <th>RATE</th>
            <th>DISCOUNT (%)</th>
            <th>TAX (%)</th>
            <th>AMOUNT</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody className='bill-table-body'>
         {individualinvoice?.items.map((item, index) => (
    <tr className='items-row' key={item.id}>
      <td>
        <input type="text" name="item_name" value={item.item_name} onChange={(e) => handleItemChange(e, index)} required/>
      </td>
      <td>
        <input
          type="number"
          name="quantity"
          value={item.quantity}
          onChange={(e) => handleItemChange(e, index)}
        />
      </td>
      <td>
        <input
          type="number"
          name="unit_price"
          value={item.unit_price}
          onChange={(e) => handleItemChange(e, index)}
        />
      </td>
      <td className='discount-sect-table'>
        <span>
          <input
            type="number"
            name="discount_amount"
            value={item.discount_amount || 0}
            onChange={(e) => handleItemChange(e, index)}
          />
          <img src={Discounticonbilltable} />
        </span>
      </td>
      <td className='tax-sect-table'>
        <select
          name="tax_percentage"
          value={item.tax_percentage}
          onChange={(e) => handleItemChange(e, index)}
        >
          <option value="">Tax</option>
          <option value="5">GST 5%</option>
          <option value="12">GST 12%</option>
          <option value="18">GST 18%</option>
          <option value="28">GST 28%</option>
        </select>
      </td>
      <td>
        <input type="text" readOnly value={item.total_amount} />
      </td>
      <td style={{position:"relative"}}>
         {rendRowactions&&<div className="row-items-menu">
                      <div style={{textAlign:"left"}}><img src={addNewheadderIcon}  className='clone-icon' /> Add Row</div>
                      <div style={{textAlign:"left"}} ><FaClone className='clone-icon' style={{color:"var(--color-accent)"}}/> Clone</div>
                       <div style={{textAlign:"left"}}><BiSolidBasket className='clone-icon' style={{color:"var(--color-accent)"}}/> Add to Items</div>
                    </div>}
        <img src={threedotOpt} onClick={()=>setrendRowactions(!rendRowactions)} />
        <img src={billtableCloce} onClick={() => deleteItemRow(index)} />
      </td>
    </tr>
  )
)}
  </tbody>
      </table>
      <div className='table-row-add-actions pt-3'>
        <button><img src={addNewRowIcon} onClick={addNewRow} />Add New Row</button>
        <button><img src={addNewheadderIcon} />Add New Header</button>
      </div>
      <div className="add-row-nd-headder-container">
        <div className='table-row-add-actions'></div>

        <div className='subtotal-container'>
          <div className="subTotalDiv">
            <span>Total (₹)</span>
            <h4>{subtotal}</h4>
          </div>
            <div className='total-summary d-flex gap-2 justify-content-end'>
        {showSummary ? (
          <span 
            style={{cursor:'pointer'}}
            onClick={() => setShowSummary(false)}>
            HIDE TOTAL SUMMARY <img src={hideSummary} alt="" />
          </span>
        ) : (
          <span 
            style={{cursor:'pointer'}}
            onClick={() => setShowSummary(true)}>
            SHOW TOTAL SUMMARY <img src={showSummaryIcon} alt="" />
          </span>
        )}
      </div>

      {showSummary && (
        <div className='hidendshowsummary'>
          {Array(individualinvoice)?.map((detail:any, idx:number) => (
            <div key={idx} style={{margin:'1em 0'}}>
              <div>Item: {detail.itemName}</div>
             <div className='w-100 d-flex justify-content-between'><span>Tolal Amount:</span> ₹{detail?.total_amount}</div>
             <div className='w-100 d-flex justify-content-between'><span>GST:</span> ₹{individualinvoice?.tax_amount}</div>
              {<div className='w-100 d-flex justify-content-between'><span>Discount:</span> ₹{detail?.discount_amount}</div>}
            </div>
          ))}
        </div>
      )}
        </div>
      </div>
      <div className='invoice-customer-notes'>
        <label htmlFor="" className='invoice-label'>
          Customer Notes
          <textarea className='customer-notes-text-area' placeholder='Thank you for your business' id=""></textarea>
        </label>
      </div>
      <label className='payment-received-check pt-3' style={{paddingBottom:"60px"}}>
        <input type="checkbox" onChange={()=>setpaymentbox(!paymentbox)} />I have received the payment
      </label>
    
   {paymentbox&&<>
      <div className="inv-payment-received-container">
        <div className='payment-mode-table-container'>
          <table className='payment-mode-table'>
            <thead>
              <tr className='payment-mode-table-th-row'>
                <th>PAYMENT MODE</th>
                <th>AMOUNT RECEIVED</th>
                <th><img src={dustbinDelete}/></th>
              </tr>
            </thead>
            <tbody>
              <tr className='payment-mode-table-td-row'>
                <td>
                  <CreatableSelect className='payment-method-selector' placeholder="Select a payment mode" />
                </td>
                <td className='payment-mode-table-enter-amount'>
                  <input type="number" placeholder='Enter an amount' />
                </td>
                <td>
                  <img src={dustbinDelete} style={{cursor: 'pointer'}} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="splitPayment-container pt-4">
        <button className='Split-payment-add-btn'><img src={addNewheadderIcon}/>Add Split Payment</button>
        <div className='total-nd-balance-container'>
          <div className='d-flex flex-column align-items-end'>
            <h3>Total (₹) :<span>0</span></h3>
            <h3 className='balance-amount-h3'>Balance Amount (₹) :<span>0</span></h3>
          </div>
        </div>
      </div>
      </>}

      <div className="invoice-save-print-buttons">
        <button onClick={handleEditSave}>Save</button>
        <button><img src={printIcon} />Save and Print</button>
        <button onClick={handleCancelClick}>Cancel</button>
      </div>
      {showCancelPopup&&<div className="Cancel-button-popup-container" style={{zIndex:"10"}}>
        <div className="cancel-button-div">
          <div className="cancel-btn-headder-msg-cont" >
            <div className="cancel-btn-headder-msg"><img src={warningicon} alt="" /> <h3>Leave this Page?</h3></div>
            <p>If you leave this page, your unsaved changes will be discarded.</p>
          </div>
          <div className="cancel-button-action-buttons">
            <button onClick={handleStayHere}>Stay Here</button>
            <button onClick={handleLeaveAndDiscard}>Leave & Discard Changes</button>
          </div>
        </div>
      </div>}
    </div>

    </>
  )
}

export default InvoiceEdit