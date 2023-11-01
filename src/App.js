import React from "react";
// import SampleData from "./sampleData";
import Grid from "./Grid";
import Editor from "./Editor";
import IconButton from './IconButton';
import { getDateOfStringPlusDays, updatedEntry, moveEntry, getCurrentDate, getDataFromHash, getDataFromLocalStorage } from "./Utils"

import Link from './icons/Link';
import Printer from './icons/Printer';
import Check from './icons/Check';
import Pencil from './icons/Pencil';
import Plus from './icons/Plus';
import LeftChevron from './icons/LeftChevron';
import RightChevron from './icons/RightChevron';

const blankEntry = { "name": "", "freq": 1, "offset": 0 };

const App = () =>{

  const [data,setData] = React.useState({ "dayCount": 24, entries: [ {...blankEntry} ],   startDate: getCurrentDate()});
  // the date and daycount are managed seperately than the one used for the grid
  const [pickedDate, setPickedDate] = React.useState(getCurrentDate());
  const [pickedDayCount, setPickedDayCount] = React.useState(24);

  // const [showModal, setShowModal] = React.useState(true);
  
  const [editingIndex, setEditingIndex] = React.useState(null); // we are actually banking on null (not editing) vs undefined (not yet placed)
  const [isEditingDate, setIsEditingDate] = React.useState(false); // we are actually banking on null (not editing) vs undefined (not yet placed)

  //attempt to load - first from hash (via link) then via local storage
  React.useEffect(()=>{
    const hashData = getDataFromHash();
    const storedData = getDataFromLocalStorage('printable-med-sched');

    const oldData = hashData || storedData || data;
    setData(oldData);
    setPickedDate(oldData.startDate);
    setPickedDayCount(oldData.dayCount);
    if(oldData.entries.length === 1 && oldData.entries[0].name === ""){
      setEditingIndex(0);
    }
  },[]);

  React.useEffect(()=>{
    localStorage.setItem('printable-med-sched',JSON.stringify(data));
  },[data]);

  const handleOnSubmit = (e) => {
    console.log(`on Submit ${pickedDayCount} ${pickedDate}`);
    e.preventDefault(); // Prevent form submission
    setData({...data, dayCount:pickedDayCount, startDate:pickedDate });
    setIsEditingDate(false);
  }

  const jumpToNext = () =>{
    calculateToNewDate(+1);
  } 
  const jumpToPrev = () =>{
    calculateToNewDate(-1);
  } 

  const handleEditorUpdate = (name,freq,offset) => {
    const newEntries = data.entries.map((entry,i)=>i===editingIndex ? {name,freq,offset}:entry);
    setData({...data,entries:newEntries});
    setEditingIndex(null);
  }

  const handleEditorDelete = () => {
    setData({...data, entries:[...data.entries.slice(0, editingIndex), ...data.entries.slice(editingIndex + 1)]});
    setEditingIndex(null);
  }

  const handleAddNewEntry = () =>{
    setData({...data, entries:[...data.entries, {...blankEntry}]});
    setEditingIndex(data.entries.length);
  }


  const calculateToNewDate = (dir) => {
    const dayCount = data.dayCount;
    const oldDateString = data.startDate;
    
    const startDate = getDateOfStringPlusDays(oldDateString,dayCount * dir).toISOString().substring(0, 10);

    console.log(JSON.stringify(data.entries[0]));
    console.log(JSON.stringify({dayCount, dir}));
    const newEntries = data.entries.map((entry)=>updatedEntry(entry,dayCount,dir))
    console.log(JSON.stringify(newEntries[0]));
    setData({...data, startDate, entries:newEntries});
    setPickedDate(startDate); 

  }
  const handlePickedDateUpdate = (e) => {
    setPickedDate(e.target.value);
  }
  const handlePickedDayCountUpdate = (e) => {
    setPickedDayCount(e.target.value);
  }

  const setEditing = (offset) => {
    setEditingIndex(offset);
  }
  
  const moveEntryInList = (dir) => {
    const {entries,index} = moveEntry(data.entries, editingIndex, dir);
    setData({...data,entries});
    setEditingIndex(index);
  }

  const copyCurrentUrlPlus = () => {
    const baseUrl = window.location.href.split('#')[0];  // Split on '#', take first part
    const url = baseUrl +'#' + encodeURIComponent(JSON.stringify(data))
    navigator.clipboard.writeText(url).then(function() {
        alert('Copied Link to Clipboard');
    }, function(err) {
        console.error('Could not copy url to clipboard: ', err);
    });
}

  return (
    <>
      <section className='content'>
        <section className='intro no-print'>
          <h1>med-plan-print</h1>
          <p>A simple tool for making printable "checkbox" charts for medication schedules for humans or pets.</p>

          <p>The printable version of this page only displays the resulting chart.</p>

          <p>The link icon copies this page's link (preopopulated with your info) to the clipboard.</p>

          <p>(Also this site uses local storage so the information will be preserved if you use the same browser- but no information is stored on the server)</p>

          <p>If you advance to the next time period, any offsets (i.e. weeky, but starting in 2 days) will be automatically updated</p>

          <p>This is an open source project: <a href="https://github.com/kirkjerk/med-plan-print">github.com/kirkjerk/med-plan-print</a></p>
        </section> 
      {editingIndex === null && (
        <section className="metasetup editor no-print">
        <IconButton ariaLabel='Previous Time Period' onClick={jumpToPrev} ><LeftChevron/></IconButton>          
          
        {(!isEditingDate) &&
            (<section className="show-date">
              {pickedDate}
              <br />
              ({pickedDayCount} Days)
              <IconButton ariaLabel='Edit Date Range' onClick={()=>setIsEditingDate(true)} className="pencil"><Pencil sz='48'/></IconButton>  
            </section>)
          }

          
          {(isEditingDate) &&
            (<form onSubmit={handleOnSubmit} className='date-edit'>
              <label>
                Start Date: 
                <input name="startDate" onChange={handlePickedDateUpdate} type="date" value={pickedDate} />
              </label>
              <label># of Days:
                <input name="dayCount" className="short" onChange={handlePickedDayCountUpdate} value={pickedDayCount} />
              </label>
              <IconButton ariaLabel='Set Date and Day Count' className="check"><Check/></IconButton>  
            </form>)
          }
          {!isEditingDate && <IconButton ariaLabel='Add New Medicine' onClick={handleAddNewEntry} className="plus"><Plus /></IconButton>}
          {!isEditingDate && <IconButton ariaLabel='Generate Link' onClick={copyCurrentUrlPlus} ><Link/></IconButton>}
          {!isEditingDate && <IconButton ariaLabel='Print' onClick={window.print} ><Printer/></IconButton> }

        <IconButton ariaLabel='Next Time Period' onClick={jumpToNext} ><RightChevron/></IconButton>
        </section>)}
        {(editingIndex !== null) && <Editor entry={data.entries[editingIndex]} goLeft={editingIndex > 0} goRight={editingIndex < data.entries.length-1} onUpdate={handleEditorUpdate} onDelete={handleEditorDelete} handleMove={moveEntryInList}/>}
        <Grid data={data} onEdit={setEditing} currentlyEditing={editingIndex} />
      </section>
    </>
  );
};


export default App;
