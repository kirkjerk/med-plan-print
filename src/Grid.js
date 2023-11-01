import React from "react";

import { isNeededThatDay } from "./Utils.js"

const Header = ({children, handleClick, offset, isOpen, anyOpen}) => {
  return anyOpen ?  <th className={isOpen?"open":""}>{children}</th>: 
  
  <th ><button className="button-as-link" onClick={()=>handleClick(offset)}>{children}</button></th>;
}
const DateBox = ({prettyDay, prettyDate}) => {
  return (
    <td>
      <nobr>
      {prettyDay} <br />
      {prettyDate}
      </nobr>
    </td>
  );
     
}
const CheckboxBox = ({hasCheckbox}) => {
  return (
    <td>
      {hasCheckbox ? <input type='checkbox'/> : null}
    </td>
  );
     
}

const Grid = ({data, onEdit, currentlyEditing}) =>{
  const { dayCount, entries, startDate } = data;
  const dayLoop = [...Array(Number(dayCount))];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const date = new Date(startDate);


  return (
    <>
    <table className={'grid'}>
    <thead>
      <tr>
        {/* <th>{dayCount}:{dayLoop.length}</th> */}
        <th>{ currentlyEditing === null? <span className='no=print'>edit:</span> : '' }</th>
        {
          entries.map((entry,i)=> (
            <Header anyOpen={currentlyEditing!==null} isOpen={currentlyEditing===i} offset={i} key={`${i}.${entry.name}`} handleClick={onEdit}>
            { currentlyEditing===i && <div className="triangle-up no-print"></div>}
            {entry.name || "???"}</Header>
          ))  
        }
      </tr>
      </thead>
      <tbody>
        {
          dayLoop.map((d,dayOffset)=>{
            const prettyDay = days[date.getUTCDay()];
            const prettyDate = `${months[date.getUTCMonth()]}-${String(date.getUTCDate()).padStart(2, '0')}`;

            
            date.setDate(date.getDate() + 1);
            return (
            <tr key={dayOffset}>
            <DateBox prettyDay={prettyDay} prettyDate={prettyDate} />
            {
              entries.map((entry,j)=>
                <CheckboxBox key={`${j}_${entry.name}`} hasCheckbox={isNeededThatDay(entry,dayOffset)} />

              ) 
            }
            </tr>)
          })
        }
        
        {/* <th>{dayCount}:{dayLoop.length}</th> */}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
              {entries.map((entry,i)=> (<th key={`${i}.${entry.name}`}>{entry.name || "???"}</th>))}
          </tr>        
        </tfoot>

    </table>
    </>
  );
};


export default Grid;
