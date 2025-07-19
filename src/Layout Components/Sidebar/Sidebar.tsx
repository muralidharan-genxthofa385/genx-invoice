import './sidebar.css'
import genxLogo from '../../assets/Images/Layer_1.svg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import dashboardiconactive from '../../assets/Icons/dashboardIcon.png'
import dashboardInactiveIcon from '../../assets/Icons/dashboardincativeFrame.svg'
import invoiceInactiveIcon from '../../assets/Icons/invoiceInactiveIcon.svg'
import invoiceActiveIcon from '../../assets/Icons/invoiceActive.svg'
import custumerInactiveICon from '../../assets/Icons/customerInactive.svg'
import custumeractiveICon from '../../assets/Icons/customersActive.svg'
import expensesInactiveIcon from '../../assets/Icons/expensesinactive.svg'
import expensesactiveIcon from '../../assets/Icons/expensesActive.svg'
import settingsInactiveIcon from '../../assets/Icons/setingsInactive.svg'
import logoutImage from '../../assets/Icons/logoutLogo.svg'
import settingsActiveimg from '../../assets/Icons/settingsActive.svg'
import itemsInactive from '../../assets/Icons/sidebarItemsActiveIcon.svg'
import sidebaritemsWhiteIcon from '../../assets/Icons/sidebaritemsWhiteIcon.svg'


import { useState } from 'react'
interface HeadderPropsimg {
  sibebrcol:boolean,
}

function Sidebar({sibebrcol}:HeadderPropsimg) {

const inactivelinkStyle = {
  display: "flex",
  alignItems: "center",
  width: sibebrcol ? "2rem" : "192px",
  height: "34px",
  fontSize: "14px",
  gap: "8px",
  textDecoration: "none",
  padding: "8px 12px",
  justifyContent: sibebrcol ? "center" : "flex-start",
};

const activelinkStyle={
   display: "flex",
  alignItems: "center",
  width: sibebrcol ? "2rem" : "192px",
  height: "34px",
  fontSize: "14px",
  gap: "8px",
  textDecoration: "none",
  padding: "8px 12px",
  color:"var(--whitebg)",
  backgroundColor:"var(--color-accent)",
  borderRadius:"4px",
  justifyContent: sibebrcol ? "center" : "flex-start",
}

const navigate=useNavigate()

const [dashActive,setDashactive]=useState<boolean>(true)
const [invoiceActive,setinvoiceactive]=useState<boolean>(false)
const [customerActive,setcustomeractive]=useState<boolean>(false)
const [expensesActive,setexpensesactive]=useState<boolean>(false)
const [itemsActive,setitemsActive]=useState<boolean>(false)
const [settingsActive,setsettingsactive]=useState<boolean>(false)


const sideDashActRender=()=>{
setDashactive(true)
setinvoiceactive(false)
setcustomeractive(false)
setexpensesactive(false)
    setsettingsactive(false)
        setitemsActive(false)
    navigate('/dashboard')
}
const sideinvoideActRender=()=>{
setDashactive(false)
setinvoiceactive(true)
setcustomeractive(false)
setexpensesactive(false)
    setsettingsactive(false)
    navigate('/invoice')
            setitemsActive(false)
}
const sidecustomerActRender=()=>{
  setDashactive(false)
  setinvoiceactive(false)
  setcustomeractive(true)
  setexpensesactive(false)
    setsettingsactive(false)
  setitemsActive(false)
}

const sideexpensesActRender=()=>{
  setDashactive(false)
  setinvoiceactive(false)
  setcustomeractive(false)
    setexpensesactive(true)
    setsettingsactive(false)
    setitemsActive(false)
}
const sideItemsActRender=()=>{
 setDashactive(false)
  setinvoiceactive(false)
  setcustomeractive(false)
    setexpensesactive(false)
    setsettingsactive(false)
    setitemsActive(true)
}

const sideSetingsActRender=()=>{
  setDashactive(false)
  setinvoiceactive(false)
  setcustomeractive(false)
    setexpensesactive(false)
    setsettingsactive(true)
      setitemsActive(false)
}

const handleLogout=()=>{

  const logoutconfirmation=window.confirm('Are You Sure To Logout ?')

  if(logoutconfirmation){
localStorage.removeItem('token')
  navigate('/')
  }
}

const location = useLocation();
const isActive = (path: string) => location.pathname.startsWith(path);

return (
<>
<div className={`sidebar-container-overall ${sibebrcol ? 'collapsed' : ''}`}>
  <div className='sidebar-logo'>
<img src={genxLogo} alt="" style={{width: sibebrcol ? "2rem" : "10rem", height: "2.1rem"}}/>
</div>
<div className='sidebar-contents'>
<div className="sidebar-contents-top">
  <Link className='sidebar-links' onClick={sideDashActRender} style={dashActive==false?inactivelinkStyle:activelinkStyle} to='/dashboard'>
  <img src={dashActive==false ?dashboardInactiveIcon :dashboardiconactive}/>{!sibebrcol && "Dashboard"}</Link>
  <Link className='sidebar-links' onClick={sideinvoideActRender} style={invoiceActive==false?inactivelinkStyle:activelinkStyle}  to='/invoice'>
  <img src={invoiceActive==false?invoiceInactiveIcon:invoiceActiveIcon}/>{!sibebrcol && " Invoice"}</Link>
  <Link className='sidebar-links' onClick={sidecustomerActRender} style={customerActive==false?inactivelinkStyle:activelinkStyle} to='/Customers'>
  <img src={customerActive==false?custumerInactiveICon:custumeractiveICon}/>{!sibebrcol && " Customer"}</Link>
  <Link className='sidebar-links' onClick={sideexpensesActRender} style={expensesActive==false?inactivelinkStyle:activelinkStyle} to='/expenses'>
  <img src={expensesActive==false?expensesInactiveIcon:expensesactiveIcon}/>{!sibebrcol && " Expense"}</Link>
  <Link className='sidebar-links' onClick={sideItemsActRender} style={itemsActive==false?inactivelinkStyle:activelinkStyle} to='/Items'>
  <img src={itemsActive==false?itemsInactive:sidebaritemsWhiteIcon}/>{!sibebrcol && "Items"}</Link>

  
</div>
<div className='sidebar-contents-bottom'>
<Link className='sidebar-links' onClick={sideSetingsActRender} style={settingsActive==false?inactivelinkStyle:activelinkStyle} to=''>
  <img src={settingsActive==false?settingsInactiveIcon:settingsActiveimg}/>{!sibebrcol && " Settings"}</Link>
  <button onClick={handleLogout} className='logout-Button' style={{width: sibebrcol ? "2rem" : "12rem",border:"none", justifyContent: sibebrcol ? "center" : "flex-start"}}><img src={logoutImage}/>{!sibebrcol && "Logout"}</button>
</div>

</div>

</div>

    </>
  )
}

export default Sidebar