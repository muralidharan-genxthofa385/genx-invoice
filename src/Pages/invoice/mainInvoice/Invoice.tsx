import React, { useState } from 'react'
import './Invoice.css'
import Inv_Top_cust_details from './InvoiceTopCustomers/Inv_Top_cust_details'
import InvoiceBilltable from './InvoiceTopCustomers/InvoiceBillTable/InvoiceBilltable'
import { createInvoice } from '../../../service/invoiceService';
import InvAddnewCustomer from '../InvoiceAddnewCustomer/InvAddnewCustomer';


function Invoice() {
   const [topDetails, setTopDetails] = useState({
    customerId: '',
    invoiceDate: '',
    dueDate: '',
    paymentTerm: '',
    invoiceNo: '',
    notes: '',
    paymentMethod: '',
    amountReceived: '',
  });

  const [billtableDatas,setBilltableDatas]=useState([
    {
      headdingName: '',
      items: [
        {
          itemName: '',
          itemQuantity: 0,
          itemRate: 0,
          itemDiscount: 0,
          taxSelection: '',
          itemAmount: 0,
        },
      ],
    }
  ])
  
  const [newCustPop,setNewCustPop]=useState<boolean>(false)
 const renderNewcustPop=()=>{
        setNewCustPop(!newCustPop)
    }
  return (
    <div>
      <Inv_Top_cust_details topDetails={topDetails} renderNewcustPop={renderNewcustPop} setTopDetails={setTopDetails}/>
      {newCustPop&&<InvAddnewCustomer renderNewcustPop={renderNewcustPop} />}
    <InvoiceBilltable topDetails={topDetails} setTopDetails={setTopDetails} />


    </div>
  )
}

export default Invoice