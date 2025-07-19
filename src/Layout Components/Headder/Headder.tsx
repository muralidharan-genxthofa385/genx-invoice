import React, { useState } from 'react'
import './Headder.css'
import { IoMdAdd } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import invoiceActiveIcon from '../../assets/Icons/invoiceActive.svg'
import custumeractiveICon from '../../assets/Icons/customersActive.svg'
import expensesactiveIcon from '../../assets/Icons/expensesActive.svg'
import headderSlider from '../../assets/Icons/headderSlider.svg'
import searchIcon from '../../assets/Icons/searchicon.svg'
import { Link } from 'react-router-dom';

interface HeadderProps {
  renderSidebr: () => void;
  sidebarCollapsed?: boolean;
}

function Headder({renderSidebr, sidebarCollapsed}:HeadderProps) {

    const [NewDropshow,setNewDropshow]=useState<boolean>(false)

  return (
    <>
    <div className="header-wrapper">

  
<div className="headder-container">
    <div>
        <img  src={headderSlider} onClick={renderSidebr}  style={{cursor:"pointer",backgroundColor:"#FCFCFC"}}/>
        <label><img  src={searchIcon} /> <input placeholder='Search' type="search"/></label>
    </div>
    <div className='new-dropdown-button-container'>
        <button onClick={()=>setNewDropshow(!NewDropshow)}><IoMdAdd/> New | <IoMdArrowDropdown/> </button>

        {NewDropshow==false?null:<div className='new-options-drop'>
          <div className='gap-3'>  <Link to='' className='new-options-drop-links' style={{paddingLeft:"-10px"}}><img src={invoiceActiveIcon} /> Invoice</Link>
            <Link to='' className='new-options-drop-links'> <img src={custumeractiveICon} alt="" /> Customer</Link>
            <Link to='' className='new-options-drop-links'><img src={expensesactiveIcon} /> Expenses</Link>
 </div>
        </div>}
    </div>

</div>
  </div>
    </>
  )
}

export default Headder