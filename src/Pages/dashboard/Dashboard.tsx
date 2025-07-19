import { useEffect, useState } from 'react'
import './dashboard.css'
import expenseout from '../../assets/Icons/expenseOutIcon.svg'
import { fetchInvoice } from '../../service/invoiceService';
import { getExpences } from '../../service/ExpensesService';

interface Expense {
  id: number;
  expense_date: string;
  vendor_name: string;
  amount: string;
}
interface RecentInvoice {
  customer_id: number;
customer: {
    customer_name: string;
  };
  total_amount: string;
  status: "PAID" | "NOT PAID"|"ADVANCE";
amount_received:number,
}

function Dashboard() {

const [dashrecentInvoice,setdashrecentInvoice]=useState<RecentInvoice[]>([])

 
useEffect(()=>{
  fetchInvoice()
  .then((res)=>{setdashrecentInvoice(res.data.data)
console.log(res)
  })
  .catch((err)=>console.log(err))
},[])



const [expenseTableData,setexpenseTableData]=useState<Expense[]>([])


useEffect(()=>{
getExpences()
.then((res)=>setexpenseTableData(res.data))
.catch((err)=>console.log(err))

},[])


const TotalDashDisplayAmount=dashrecentInvoice.reduce((total, item) => total + parseFloat((item.total_amount)), 0)
const totalpaidDashDisplayAmount=expenseTableData.reduce((total,expense)=>total+ parseFloat(expense.amount),0)
const totalReceived = dashrecentInvoice.reduce((total, row) => total + row.amount_received, 0);
const totalUnpaid = TotalDashDisplayAmount - totalReceived;

  
return (

    <div className='Dashboard-container'>
<h2>Dashboard</h2>

<div className='dash-board-amount-display-container'>
<div className='dash-board-total-display'>
  <label><h5>Total Sales</h5> <h1>₹ { TotalDashDisplayAmount.toFixed(3)}</h1></label>
</div>
<div  className='dash-board-Paid-display'>
    <label><h5>Paid</h5> <h1>₹ {totalpaidDashDisplayAmount.toFixed(3)}</h1></label>

</div>
<div className='dash-board-unpaid-display'>
<label><h5>Unpaid</h5> <h1>₹ {totalUnpaid > 0 ? totalUnpaid.toFixed(2) : '0.00'}</h1></label>
</div>
</div>

<div className="dashboard_tables w-100 pt-5">
<div className="recent-transaction-table">
<h4 className='pb-2'>Recent Invoices</h4>
<div style={{border:"1.5px solid var(--color-border)",borderRadius:"10px"}}><table>
   <thead>
        <tr>
          <th>S.No</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        { dashrecentInvoice.slice(0,5).map((row,index) => (
          <tr key={index}>
            <td style={{padding:"2.7%"}}>{index+1}</td>
            <td>{row.customer?.customer_name}</td>
            <td>₹ {row.total_amount}</td>
            <td style={{width:"max-content"}}>
              <span className={
                row.status === "PAID".toLowerCase() ? "status-paid" :
                row.status === "ADVANCE".toLowerCase()  ? "status-advance":row.status === "UNPAID".toLowerCase()  ? "status-notpaid" :""}>
                {row.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
</table>
</div>
</div>

<div className="recent-expenses-table">
  <h4 className='pb-2'>Recent Expenses</h4>
  <div style={{border:"1.5px solid var(--color-border)",borderRadius:"10px"}}>
    <table>
   <thead>
        <tr>
          <th>S.No</th>
          <th>Date</th>
          <th>Name</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
       {expenseTableData.slice(0,5).map((expense) => (
  <tr key={expense.id}>
    <td style={{ padding: "2.7%" }}>{expense.id}</td>
    <td>{expense.expense_date.slice(0,10)}</td>
    <td>{expense.vendor_name}</td>
    <td style={{ padding: "0.375rem 1.25rem",fontWeight:"600",color:"var(--color-warning)",alignItems:"center",height:"100%" }}>
      <span> ₹ {expense.amount}</span><img className='' src={expenseout} />
      {/* <span style={expense. === "debit" ? { color: "var(--color-warning)" } : { color: "var(--color-success-dark)" }}>
        ₹ {expense.amount}
        <img src={expense.type === 'debit' ? expenseout : expenseinic} />
      </span> */}
    </td>
  </tr>
))}
      </tbody>
</table></div>

</div>

</div>
    </div>
  )
}

export default Dashboard