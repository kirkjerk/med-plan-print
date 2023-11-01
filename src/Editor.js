import React from "react";

import LeftChevron from './icons/LeftChevron';
import Trash from './icons/Trash';
import RightChevron from './icons/RightChevron';
import Check from './icons/Check';
import IconButton from './IconButton';

const Editor = ({entry, onDelete, onUpdate, handleMove , goLeft=true, goRight=true}) => {
  console.log(JSON.stringify(entry));
  const [rhythm,setRhythm] = React.useState(Number(entry.freq) === 1 ? 'daily' : (entry.freq === -1 ? 'never' : 'sometimes')   );
  const [name, setName] = React.useState(entry.name);
  const [freq, setFreq] = React.useState(entry.freq);
  const [offset, setOffset] = React.useState(entry.offset === undefined ? 0 : entry.offset);
  

  const handleNameChange = (e) => {
    setName(e.target.value);
  }
  const handleFreqChange = (e) => {
    setFreq(Number(e.target.value));
  }
  const handleOffsetChange = (e) => {
    setOffset(Number(e.target.value));
  }

  const handleOnUpdate = () => {
    const newFreq = rhythm === 'sometimes' ? Number(freq) : (rhythm === 'daily' ? 1 : -1);
    onUpdate(name, newFreq, offset);
  }

  return (
    <section className="editor med no-print">
      <IconButton ariaLabel='Move Left' className='chevron' onClick={()=>handleMove(-1)} disabled={! goLeft}><LeftChevron/></IconButton>
  
      <label>medicine name: <br /><input value={name} onChange={handleNameChange}  /></label> <br />
      <section className='day-specify'>
        <label><input type="radio" checked={rhythm === 'daily'} onChange={()=>setRhythm('daily')} />Daily</label>
        <div>
        <label><input type="radio" checked={rhythm === 'sometimes'} onChange={()=>setRhythm('sometimes')} />Specify:</label>{' '}
        <label>Every {' '}<input disabled={rhythm !== 'sometimes'} onChange={handleFreqChange} value={freq === -1 ? 'X' : freq} className="short" />{' '} Days </label><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (Offset by <input disabled={rhythm !== 'sometimes'} onChange={handleOffsetChange} value={offset}  className="short" /> Days)
        </div>
        <label><input type="radio" checked={rhythm === 'never'} onChange={()=>setRhythm('never')}  />Never  - Blank Placeholder</label>
      </section>
      
      <IconButton ariaLabel='Update' className='checkmed' onClick={handleOnUpdate}><Check /></IconButton>
      <IconButton ariaLabel='Delete' className='trash' onClick={onDelete}><Trash /></IconButton>
      <IconButton ariaLabel='Move Right' className='chevron' onClick={()=>handleMove(1)}  disabled={! goRight}><RightChevron/></IconButton>
      
    </section>

  );


}


export default Editor;