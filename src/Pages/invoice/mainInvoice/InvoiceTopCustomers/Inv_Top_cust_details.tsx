import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inv_Top_cust_details.css';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { IoMdAdd } from "react-icons/io";
import searchIcon from '../../../../assets/Icons/searchicon.svg'

import Select from 'react-select';
import { GetCustomersList } from '../../../../service/CustomerService';

interface CustomerOption {
  label: string;
  value: string;
  isNew?: boolean; 
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
   renderNewcustPop: () => void
}

function Inv_Top_cust_details({ topDetails, setTopDetails,renderNewcustPop }: Props) {
  
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const navigate = useNavigate();
  const [selectedCustomer,setSelectedCustomer]=useState<CustomerOption|null>(null)


  useEffect(() => {
    GetCustomersList().then((res) => {
      const customers = res.data ? res.data : res;
      setCustomerOptions([
        ...customers.map((customer: any)=>({
          value: customer.id,
          label: customer.customer_name
        })),
        { label: 'Add New Customer', value: 'add-new', isNew: true }
      ]);
    });
  }, []);
  
  useEffect(() => {
  if (topDetails.customerId && customerOptions.length > 0) {
    const found = customerOptions.find((c) => c.value === topDetails.customerId);
    if (found) {
      setSelectedCustomer(found);
    }
  }
}, [topDetails.customerId, customerOptions]);


  useEffect(() => {
  if (!topDetails.invoiceDate || !topDetails.paymentTerm) return;

  const date = new Date(topDetails.invoiceDate);

  if (topDetails.paymentTerm === 'due-on-recipt') {
    setTopDetails((prev:any) => ({ ...prev, dueDate: date.toISOString().slice(0, 10) }));
  } else if (topDetails.paymentTerm === 'end-this-month') {
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    setTopDetails((prev:any) => ({ ...prev, dueDate: endOfMonth.toISOString().slice(0, 10) }));
  } else if (topDetails.paymentTerm === 'next-month') {
    const endOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 2, 0);
    setTopDetails((prev:any) => ({ ...prev, dueDate: endOfNextMonth.toISOString().slice(0, 10) }));
  }
}, [topDetails.invoiceDate, topDetails.paymentTerm]);


  const handleChange = (selected: CustomerOption | null) => {
  if (!selected) return;

  if (selected.value === 'add-new') {
   renderNewcustPop()
    console.log("add")
  } else {
    setTopDetails((prev:any) => ({ ...prev, customerId: selected.value }));
    setSelectedCustomer(selected)
  }
};

console.log(selectedCustomer)


  return (
    <>
      <div className="inv-cust-det-container">
        <Link to={`/invoice`} className="new-customer-heading d-flex align-items-center" style={{ textDecoration: 'none',width:"11%" }} > <IoIosArrowBack /> New Invoice
        </Link>
        <div className="inv-cust-details">
          <div className="cust-name-nd-SalesPer">
            <label className='select-customer-label invoice-label'>
              Customer Name  <img src={searchIcon} />
              <Select className='select-customer-dropdown' options={customerOptions} onChange={handleChange} placeholder="Select or search customer" isSearchable
            styles={{ 
                 placeholder: (base) => ({...base,paddingLeft: '38px',color: '#888',fontWeight: '500',fontSize: '14px'}),
                 input: (base) => ({...base,paddingLeft: '38px',}),
                 singleValue: (base) => ({...base,paddingLeft: '38px',}),
               }}
               formatOptionLabel={(e:CustomerOption) =>
                  e.isNew ? (
                    <span className='inv-customer-select-drop'>
                      <IoMdAdd  />
                      {e.label}
                    </span>
                  ) : (
                    e.label 
                  )
                }
                value={selectedCustomer}
              />
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
            <label className='invoice-label' htmlFor="">Invoice No.<input type="text"
             value={topDetails.invoiceNo}
  onChange={(e) => setTopDetails((prev:any) => ({ ...prev, invoiceNo: e.target.value }))}
            placeholder='INV-123-333' /></label>
            <label className='invoice-label' htmlFor="">Invoice Date
              <input type="date"
              value={topDetails.invoiceDate}
  onChange={(e) => setTopDetails((prev:any) => ({ ...prev, invoiceDate: e.target.value }))}
              />
            </label>
            <label className='invoice-label' htmlFor="">Payment Terms
              <select value={topDetails.paymentTerm}
  onChange={(e) => setTopDetails((prev:any) => ({ ...prev, paymentTerm: e.target.value }))}>
                <option value="" disabled>Select payment term</option>
                <option value="due-on-recipt">Due On Recipt</option>
                <option value="next-month">Due at the end of next month</option>
                <option value="end-this-month">Due at the end of this month</option>

              </select>
            </label>
            <label className='invoice-label' htmlFor="">Due Date
              <input type="date"
               value={topDetails.dueDate}
  onChange={(e) => setTopDetails((prev:any) => ({ ...prev, dueDate: e.target.value }))}
           />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Inv_Top_cust_details;
