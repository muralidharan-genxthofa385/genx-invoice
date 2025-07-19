import React, { useState, useRef, useEffect } from 'react';
import './InvoiceBilltable.css';
import threedotOpt from '../../../../../assets/Icons/Billtablethreedot.svg';
import billtableCloce from '../../../../../assets/Icons/billTableClose.svg';
import Discounticonbilltable from '../../../../../assets/Icons/Discount -icon-billtable.svg';
import addNewRowIcon from '../../../../../assets/Icons/addnewrowicon.svg';
import addNewheadderIcon from '../../../../../assets/Icons/addnewHeaddericon.svg';
import showSummaryIcon from '../../../../../assets/Icons/showSummaryDrop.svg'
import hideSummary from '../../../../../assets/Icons/hideSummaryIcon.svg'
import dustbinDelete from '../../../../../assets/Icons/dustbinDeleteIcon.svg'
import CreatableSelect from 'react-select/creatable';
import printIcon from '../../../../../assets/Icons/printIcon.svg'
import warningicon from '../../../../../assets/Icons/WarningIcon.svg'
import { useNavigate } from 'react-router-dom';
import { FaClone } from "react-icons/fa6";
import { BiSolidBasket } from "react-icons/bi";
import { createInvoice } from '../../../../../service/invoiceService';
import { toast } from 'react-toastify';
import { ItemsGet } from '../../../../../service/InvoiceItemsService';


interface ItemRow {
  itemName: string;
  itemQuantity: number;
  itemRate: number;
  itemDiscount: number;
  taxSelection: {
    label: string;
    value: number;
  } | null;
  itemAmount: number;
  description: string;
  unit: string;
  product_id: string;
}

interface Item {
  id: number;
  item_name: string;
  unit: string;
  rate: number;
  tax: string;
}

interface itemOptions {
  label: string;
  value: string;
}

interface it{
  id: number;
  item_name: string;
}

interface Props {
  topDetails: {
    customerId: string;
    invoiceDate: string;
    dueDate: string;
    paymentTerm: string;
    invoiceNo: string;
    notes: string;
    paymentMethod: string;
    amountReceived: string;
  };
  setTopDetails: React.Dispatch<React.SetStateAction<any>>;
}

interface GroupedItemRow {
  headdingName: string;
  items: ItemRow[];
}
type OptionType = {
  label: string;
  value: string;
};

function InvoiceBilltable({ topDetails, setTopDetails }: Props) {

  const cteateNewInvoice=()=>{

     setTopDetails((prev:any) => ({
    ...prev,
    amountReceived: totalReceived.toString()
  }));
const isValid = billtableDatas.every(group =>
  group.items.every(item =>
    item.itemName.trim() !== '' &&
    item.itemQuantity > 0 &&
    item.itemRate > 0
  )
);

if (!isValid) {
  toast.error("Please fill all required item fields before saving.");
  return;
}
   const NewInvoicePayload = {
    invoice_no: topDetails.invoiceNo,
    invoice_date: topDetails.invoiceDate,
    due_date: topDetails.dueDate,
    notes: topDetails.notes,
    payment_method: topDetails.paymentMethod,
    amount_received: topDetails.amountReceived,
    customer_id: topDetails.customerId,
  
  items: billtableDatas.flatMap((group) =>
  group.items.map((item) => {
    const baseAmount = item.itemQuantity * item.itemRate;
    const discountAmt = (baseAmount * item.itemDiscount) / 100;
    const taxPercent = parseFloat(item.taxSelection?.label.split(' ')[1] || '0');
    const taxAmount = ((baseAmount - discountAmt) * taxPercent) / 100;

    return {
      item_name: item.itemName,
      quantity: item.itemQuantity,
      unit_price: item.itemRate,
      description: item.description,
      unit: item.unit,
      product_id: item.product_id,
      discount_percentage: item.itemDiscount,
      discount_amount: discountAmt,
      tax_amount: taxAmount,
      tax_percentage: taxPercent,
      is_header: false,
      header_title: group.headdingName || '',
     within_state_tax_rate: item.taxSelection?.label.startsWith("GST")? item.taxSelection.value : null,
cross_state_tax_rate: item.taxSelection?.label.startsWith("IGST")? item.taxSelection.value : null
    };
  })
)

  };
createInvoice(NewInvoicePayload)
.then(()=>toast.success("invoice Added Successfully"))
.catch((err)=>{
  console.log("inv creation error",err)
toast.error("failed to create invoice")
})
  }

  const [billtableDatas, setbilltableDatas] = useState<GroupedItemRow[]>([{
    headdingName: '',
   items: [{
  itemName: '',
  description:"",
  itemQuantity: 0,
  itemRate: 0,
  itemDiscount: 0,
  taxSelection: null,        
  itemAmount: 0,
  unit:"",
  product_id:""
}]

  }]);
  const navigate=useNavigate()
const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: 'none',
    boxShadow: 'none',
    minHeight: '36px', 
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

 const handleChange = (
  groupIndex: number,
  itemIndex: number,
  field: keyof ItemRow,
  value: string | number
) => {
  const updated = [...billtableDatas];
(updated[groupIndex].items[itemIndex] as any)[field] = value;

  const item = updated[groupIndex].items[itemIndex];
  const baseAmount = item.itemQuantity * item.itemRate;
  const discountAmt = (baseAmount * item.itemDiscount) / 100;

 const taxType = item.taxSelection?.label.split(' ')[0] || '';
const taxPercent = parseFloat(item.taxSelection?.label.split(' ')[1] || '0');
  const taxAmount = ((baseAmount - discountAmt) * taxPercent) / 100;

  item.itemAmount = parseFloat((baseAmount - discountAmt + taxAmount).toFixed(2));

  setbilltableDatas(updated);
};


  const handleHeaderChange = (groupIndex: number, value: string) => {
    const updated = [...billtableDatas];
    updated[groupIndex].headdingName = value;
    setbilltableDatas(updated);
  };

  const addNewHeader = () => {
    setbilltableDatas(prev => [
      ...prev,
      {
        headdingName: '',
      items: [{
  itemName: '',
  itemQuantity: 0,
  itemRate: 0,
  itemDiscount: 0,
  taxSelection: null,        
  itemAmount: 0,
  description:"",
  unit:"",
  product_id:""
}]
    }
    ]);
  };
const taxOptions = [
  { label: "GST 5%", value: "GST5(5%)" },
  { label: "GST 12%", value: "GST12(12%)" },
  { label: "GST 18%", value: "GST18(18%)" },
  { label: "GST 28%", value: "GST28(28%)" },
  { label: "IGST 5%", value: "IGST(5%)" },
  { label: "IGST 12%", value: "IGST(12%)" },
  { label: "IGST 18%", value: "IGST(18%)" },
  { label: "IGST 28%", value: "IGST(28%)" }
];

  const addNewRow = () => {
    const updated = [...billtableDatas];
    const lastGroup = updated[updated.length - 1];
    lastGroup.items.push({
      itemName: '',
  itemQuantity: 0,
  itemRate: 0,
  itemDiscount: 0,
  taxSelection: null,         
  itemAmount: 0,
  description:"",
  unit:"",
  product_id:""
    });
    setbilltableDatas(updated);
  };

  const calculateSubtotal = () => {
    return billtableDatas.reduce((total, group) =>
      total + group.items.reduce((sum, item) => sum + item.itemAmount, 0), 0
    ).toFixed(2);
  };

  const subtotal = () => {
  return billtableDatas.reduce((total, group) => {
    const groupTotal = group.items.reduce((sum, item) => {
      return sum + (item.itemQuantity * item.itemRate);
    }, 0);
    return total + groupTotal;
  }, 0).toFixed(2);
};

const removeHeaderRow = (groupIndex: number) => {
  const updated = [...billtableDatas];
  const itemsToKeep = updated[groupIndex].items;

  updated.splice(groupIndex, 1);
  if (updated.length > 0) {
    const insertIndex = groupIndex === 0 ? 0 : groupIndex - 1;
    updated[insertIndex].items.push(...itemsToKeep);
  } else {
    updated.push({
      headdingName: '',
      items: itemsToKeep,
    });
  }
  setbilltableDatas(updated);
};

const removeItemRow = (groupIndex: number, itemIndex: number) => {
  const updated = [...billtableDatas];
  updated[groupIndex].items.splice(itemIndex, 1);
  if (updated[groupIndex].items.length === 0 && updated[groupIndex].headdingName === '') {
    updated.splice(groupIndex, 1);
  }
  setbilltableDatas(updated);
};

const [showAndHideSummary,setshowAndHideSummary]=useState<boolean>(false)

const renderShowHideSummary=()=>{
    setshowAndHideSummary(!showAndHideSummary)
}
 const initialOptions: OptionType[] = [
  { value: 'Cash', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Card', label: 'Card' },
  { value: 'Netbanking', label: 'Netbanking' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Cheque', label: 'Cheque' },
];
const [PaymentMethodoptions, setPaymentMethodOptions] = useState<OptionType[]>(initialOptions);
const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

const handlePaymentMethodChange = (newValue: OptionType | null) => {
  setSelectedOption(newValue);
};

const handleCreate = (inputValue: string) => {
  const newOption = { label: inputValue, value: inputValue };
  setPaymentMethodOptions([...PaymentMethodoptions, newOption]);
  setSelectedOption(newOption);
};
const [paymentTypeRender,setpaymentTypeRender]=useState<boolean>(false)
const renderPaymentType=()=>{
  setpaymentTypeRender(!paymentTypeRender)
}

type SplitPayment = {
  method: OptionType | null;
  amount: number;
};
const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([
  { method: null, amount: 0 }
]);

const totalAmount = Number(calculateSubtotal());
const totalReceived = splitPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
const balanceAmount = Math.max(totalAmount - totalReceived, 0);

const addSplitPayment = () => {
  setSplitPayments([...splitPayments, { method: null, amount: 0 }]);
};
const deleteSplitPayment = (index: number) => {
  setSplitPayments(splitPayments.filter((_, i) => i !== index));
};
const handleSplitPaymentChange = (index: number, field: 'method' | 'amount', value: any) => {
  setSplitPayments(splitPayments.map((payment, i) =>
    i === index ? { ...payment, [field]: value } : payment
  ));
};

const [renCancelbtn,setrenCancelbtn]=useState<boolean>(false)

const [activeMenu, setActiveMenu] = useState<{ type: 'header' | 'row', groupIndex: number, itemIndex?: number } | null>(null);

const menuRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  if (!activeMenu) return;

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setActiveMenu(null);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [activeMenu]);

const addHeader = (groupIndex: number) => {
  const updated = [...billtableDatas];
  updated.splice(groupIndex + 1, 0, {
    headdingName: '',
    items: [{
       itemName: '',
  itemQuantity: 0,
  itemRate: 0,
  itemDiscount: 0,
  taxSelection: null,        
  itemAmount: 0,
  description:"",
  unit:"",
  product_id:""
    }]
  });
  setbilltableDatas(updated);
  setActiveMenu(null);
};

const cloneRow = (groupIndex: number, itemIndex: number) => {
  const updated = [...billtableDatas];
  const rowToClone = updated[groupIndex].items[itemIndex];
  updated[groupIndex].items.splice(itemIndex + 1, 0, { ...rowToClone });
  setbilltableDatas(updated);
  setActiveMenu(null);
};
const addRow = (groupIndex: number, itemIndex: number) => {
  const updated = [...billtableDatas];
  updated[groupIndex].items.splice(itemIndex + 1, 0, {
     itemName: '',
  itemQuantity: 0,
  itemRate: 0,
  itemDiscount: 0,
  taxSelection: null,        
  itemAmount: 0,
  description:"",
  unit:"",
  product_id:""
  });
  setbilltableDatas(updated);
  setActiveMenu(null);
};
const [itemList, setItemList] = useState<Item[]>([]);
const [itemOptions, setItemOptions] = useState<itemOptions[]>([]);
const [invoiceItems, setInvoiceItems] = useState<any[]>([]);


useEffect(() => {
  ItemsGet().then((res) => {
    const itmList=res.data?res.data:res
    setItemOptions([
      ...itemList.map((itms:any)=>({
        value:itms.item_name,
        label:itms.item_name,
      }  ))
    ])
  });
}, []);


// const [fetchedItems,setfetchedItems]=useState<it[]|null>([])
// useEffect(()=>{
//   ItemsGet()
//   .then((res)=>{
//   console.log("items list",res.data)
//   setfetchedItems(res.data)
//   })
//   .catch((err)=>console.log(err))
// },[])
// const mappedit=fetchedItems?.map((ind:any)=>ind.item_name)

const handleItemChange = (
  newValue: itemOptions | null,
  index: number
) => {
  if (!newValue) return;

  const selectedItem = itemList.find(
    (item) => item.item_name === newValue.value
  );

  if (selectedItem) {
    const updatedRows = [...invoiceItems];
    updatedRows[index] = {
      ...updatedRows[index],
      item: newValue.value,
      rate: selectedItem.rate,
      unit: selectedItem.unit,
      tax: selectedItem.tax,
    };
    setInvoiceItems(updatedRows);
  }
};



return (
  <div className="invoiceBilltableOverall">
    {/* <select name="" id="">
      {fetchedItems.map((nam,ind)=><option value="">{nam.item_name}</option>)}
    </select> */}
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
        {billtableDatas.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <tr className='items-headder-row-container'>
              <td className='items-headder w-100' colSpan={6}>
                <input
                  type="text"
                  placeholder='Enter Header'
                  required
                  style={{width:"100%"}}
                  value={group.headdingName}
                  onChange={(e) => handleHeaderChange(groupIndex, e.target.value)}
                />
              </td>
              <td style={{ position: 'relative' }}>
                <img
                  src={threedotOpt}
                  alt=""
                  onClick={() => setActiveMenu(activeMenu?.type === 'header' && activeMenu.groupIndex === groupIndex ? null : { type: 'header', groupIndex })}
                  style={{ cursor: 'pointer' }}
                />
                {activeMenu?.type === 'header' && activeMenu.groupIndex === groupIndex && (
                  <div className="row-menu" ref={menuRef}>
                    <div style={{cursor:"pointer"}} onClick={() => addHeader(groupIndex)}><img src={addNewheadderIcon} />Add Header</div>
                  </div>
                )}
                <img onClick={() => removeHeaderRow(groupIndex)} src={billtableCloce} />
              </td>
            </tr>

            {group.items.map((item, itemIndex) => (
              <tr className='items-row' key={itemIndex}>
                <td>
                 <CreatableSelect options={itemOptions} className="itemnameInput" onChange={(newValue) => handleItemChange(newValue, itemIndex)} placeholder="Select or Create Item"/>
                </td>
                <td>
                  <input type="number" value={item.itemQuantity}
                    onChange={(e) => handleChange(groupIndex, itemIndex, 'itemQuantity', e.target.value)} />
                </td>
                <td>
                  <input type="number" value={item.itemRate}
                    onChange={(e) => handleChange(groupIndex, itemIndex, 'itemRate', e.target.value)} />
                </td>
                <td className='discount-sect-table'>
                  <span>
                    <input type="number" value={item.itemDiscount}
                      onChange={(e) => handleChange(groupIndex, itemIndex, 'itemDiscount', e.target.value)} />
                    <img src={Discounticonbilltable} alt="" />
                  </span>
                </td>
                <td className='tax-sect-table' style={{width:"11%",textAlign:"center"}}>
  <div style={{ position: "relative", width: "100px" }}>
<select
  value={item.taxSelection?.value || ''}
  onChange={(e) => {
    const selectedOption = taxOptions.find(opt => opt.value === e.target.value);  
    if (selectedOption) {
      const updated = [...billtableDatas];
      updated[groupIndex].items[itemIndex].taxSelection = selectedOption;
      const item = updated[groupIndex].items[itemIndex];
      const baseAmount = item.itemQuantity * item.itemRate;
      const discountAmt = (baseAmount * item.itemDiscount) / 100;
      const taxPercent = parseFloat(selectedOption.label.split(' ')[1].replace('%', ''));
      const taxAmount = ((baseAmount - discountAmt) * taxPercent) / 100;
      item.itemAmount = parseFloat((baseAmount - discountAmt + taxAmount).toFixed(2));
      setbilltableDatas(updated);}}}>
  <option value="">Tax</option>
  {taxOptions.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>
  </div>
                </td>
                <td>
                  <input type="text" value={item.itemAmount} readOnly />
                </td>
                <td style={{ position: 'relative' }}>
                  <img
                    src={threedotOpt}
                    alt=""
                    onClick={() => setActiveMenu(activeMenu?.type === 'row' && activeMenu.groupIndex === groupIndex && activeMenu.itemIndex === itemIndex ? null : { type: 'row', groupIndex, itemIndex })}
                    style={{ cursor: 'pointer' }}
                  />
                  {activeMenu?.type === 'row' && activeMenu.groupIndex === groupIndex && activeMenu.itemIndex === itemIndex && (
                    <div className="row-items-menu" ref={menuRef}>
                      <div style={{textAlign:"left"}} onClick={() => addRow(groupIndex, itemIndex)}><img src={addNewheadderIcon}  className='clone-icon' /> Add Row</div>
                      <div style={{textAlign:"left"}} onClick={() => cloneRow(groupIndex, itemIndex)}><FaClone className='clone-icon'/> Clone</div>
                       <div style={{textAlign:"left"}}><BiSolidBasket className='clone-icon'/> Add to Items</div>
                    </div>
                  )}
                  <img onClick={() => removeItemRow(groupIndex, itemIndex)} src={billtableCloce} />
                </td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
     <div className='table-row-add-actions pt-3'>
        <button onClick={addNewRow}><img src={addNewRowIcon} />Add New Row</button>
        <button onClick={addNewHeader}><img src={addNewheadderIcon} />Add New Header</button>
      </div>

    <div className="add-row-nd-headder-container">
      <div className='table-row-add-actions'>
      </div>
<div className='subtotal-container'>
    
    {showAndHideSummary&&<div className='hidendshowsummary'>
        <div className="gstandDiscountDisplay total-div">
        <span>Sub Total</span>
        <span>₹{subtotal()}</span>
    </div>
    <div className='gst-and-discount-container'>   
  {billtableDatas.map((group, groupIndex) =>
  group.items.map((item, itemIndex) => {
    const baseAmount      = item.itemQuantity * item.itemRate;
    const discountAmount  = (baseAmount * item.itemDiscount) / 100;
    const taxableAmount   = baseAmount - discountAmount;

  
    // const [taxType, taxRateStr] = item.taxSelection?.split(' ') || [];
    const [taxType, taxRateStr] = item.taxSelection?.label.split(' ') || [];

    const taxPercent      = parseFloat(taxRateStr || '0');       
    const taxAmount       = (taxableAmount * taxPercent) / 100;   

 
    const cgstAmount      = taxType === 'GST'  ? taxAmount / 2 : 0;
    const sgstAmount      = taxType === 'GST'  ? taxAmount / 2 : 0;
    const igstAmount      = taxType === 'IGST' ? taxAmount     : 0;

    return (
      <div key={`${groupIndex}-${itemIndex}`} className="item-gst-discount-breakdown">
        <div className="total-div">
          <span>Item: {item.itemName || '(No Name)'}</span>
        </div>

        {taxType === 'GST' && taxPercent > 0 && (
          <>
            <div className="total-div">
              <span>CGST</span>
              <span>₹{cgstAmount.toFixed(2)}</span>
            </div>
            <div className="total-div">
              <span>SGST</span>
              <span>₹{sgstAmount.toFixed(2)}</span>
            </div>
          </>
        )}

      
        {taxType === 'IGST' && taxPercent > 0 && (
          <div className="total-div">
            <span>IGST</span>
            <span>₹{igstAmount.toFixed(2)}</span>
          </div>
        )}

  
        <div className="total-div">
          <span>DISCOUNT</span>
          <span>₹{discountAmount.toFixed(2)}</span>
        </div>
      </div>
    );
  })
)}


    </div>
    </div>}


    <div className="subTotalDiv">
      <span>Total (₹)</span>
      <h4>{calculateSubtotal()}</h4>
    </div>
    <div className='total-summary d-flex gap-2 justify-content-end'>
{showAndHideSummary==false?<span onClick={renderShowHideSummary}>SHOW TOTAL SUMMARY <img src={showSummaryIcon} alt="" /></span>:
<span onClick={renderShowHideSummary}>HIDE TOTAL SUMMARY <img src={hideSummary} alt="" /></span> }
    </div>

    </div>
  </div>

  <div className='invoice-customer-notes'>
    <label htmlFor="" className='invoice-label'>
        Customer Notes
        <textarea name="" className='customer-notes-text-area' placeholder='Thank you for your business' id=""></textarea>

    </label>
  </div>
  
<label className='payment-received-check  pt-3' style={paymentTypeRender==false?{paddingBottom:"5%"}:{}}><input type="checkbox" onChange={renderPaymentType} />I have received the payment</label>

 {paymentTypeRender&&<> <div className="inv-payment-received-container">

<div className='payment-mode-table-container'>
<table className='payment-mode-table' >
  <thead >
    <tr className='payment-mode-table-th-row' >
    <th>PAYMENT MODE</th>
    <th>AMOUNT RECEIVED</th>
    <th><img src={dustbinDelete}/></th>
  </tr>
  </thead>
  <tbody>
    {splitPayments.map((payment, idx) => (
      <tr className='payment-mode-table-td-row' key={idx}>
        <td style={{width:"30%"}}>
          <CreatableSelect
            className='payment-method-selector'
            isClearable
            onChange={val => handleSplitPaymentChange(idx, 'method', val)}
            onCreateOption={handleCreate}
            options={PaymentMethodoptions}
            menuPortalTarget={document.body}
            value={payment.method}
            styles={customStyles}
            components={{ IndicatorSeparator: () => null }}
            menuPosition="fixed"
            placeholder="Select a payment mode"
          />
        </td>
        <td className='payment-mode-table-enter-amount' style={{width:"30%"}}>
          <input
            type="number"
            placeholder='Enter an amount'
            value={payment.amount}
            onChange={e => handleSplitPaymentChange(idx, 'amount', Number(e.target.value))}
          />
        </td>
        <td>
          <img src={dustbinDelete} onClick={() => deleteSplitPayment(idx)} style={{cursor: 'pointer'}} />
        </td>
      </tr>
    ))}
  </tbody>

</table>
</div>
      </div>
      <div className="splitPayment-container pt-4">
        <button className='Split-payment-add-btn' onClick={addSplitPayment}><img src={addNewheadderIcon}/>Add Split Payment</button>

<div className='total-nd-balance-container'>
  <div className='d-flex flex-column align-items-end'>
    <h3>Total (₹) :<span>{totalAmount.toLocaleString()}</span></h3>
    <h3 className='balance-amount-h3'>Balance Amount (₹) :<span>{balanceAmount.toLocaleString()}</span></h3>
  </div>
</div>
      </div>
</>}
<div className="invoice-save-print-buttons">
    <button onClick={cteateNewInvoice}>Save</button>
        <button><img src={printIcon} />Save and Print</button>
        <button onClick={()=>setrenCancelbtn(!renCancelbtn)}>Cancel</button>
</div>
{renCancelbtn&&<div className="Cancel-button-popup-container" style={{zIndex:"10"}}> 
  <div className="cancel-button-div">
    <div className="cancel-btn-headder-msg-cont" >
<div className="cancel-btn-headder-msg"><img src={warningicon} alt="" /> <h3>Leave this Page?</h3></div>
<p>If you leave this page, your unsaved changes will be discarded.</p>
</div>
<div className="cancel-button-action-buttons"><button onClick={()=>setrenCancelbtn(!renCancelbtn)}>Stay Here</button><button onClick={()=>{navigate(`/invoice`)}} >Leave & Discard Changes</button></div>
  </div>
</div>}
  </div>
);
}
export default InvoiceBilltable;