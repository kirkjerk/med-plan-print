export function isNeededThatDay(entry, i){
    const {freq = 1, offset = 0} = entry;
    if(freq < 0) return false;
    if(freq === 1) return true;
    if((i - offset) % freq === 0) return true;
    return false;
  }
  
  export function getDateOfStringPlusDays(str,days){
    const date = new Date(str);
    date.setUTCDate(date.getUTCDate() + days);
    return date;
  }

// figure out the new offset relative to the sliding window
// forward is easy-ish with mod but backwards was weird
export function updatedEntry(oldEntry, dayCount, dir){
    const entry = {...oldEntry};
    let loopEscape = 1000;  
    
    let {freq = 1, offset = 0} = entry;
    if(freq < 2) return entry; 

    dayCount = Number(dayCount);
    dir = Number(dir);
    freq = Number(freq);
    offset = Number(offset);  
    
    if(dir > 0) {
        let ptr = offset;
        while(ptr < dayCount) {
            if(loopEscape-- < 0) return oldEntry;
        ptr += Number(freq);
        }
        entry.offset = ptr % dayCount;
    } else {
        let daysFromPrevEnd = Math.abs(offset - freq); // last time in previous set
        let ptr = dayCount - daysFromPrevEnd;
        while(ptr >= 0){
            if(loopEscape-- < 0) return oldEntry;
        ptr -= freq;
        }
        ptr += freq;
        entry.offset = ptr;
    }
    return entry;
}

export function moveEntry(oldEntries, entryIndex, dir) {
    const newEntries = [...oldEntries];
    const targetIndex = entryIndex + dir;
    
    if (targetIndex >= 0 && targetIndex < newEntries.length) {
        const temp = newEntries[entryIndex];
        newEntries[entryIndex] = newEntries[targetIndex];
        newEntries[targetIndex] = temp;
        return {entries:newEntries,index:targetIndex};  
     }
     return {entries:oldEntries,index:entryIndex};
}


export function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so we add 1
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function resetWindowHash() {
    const url = window.location.href;
    const cleanURL = url.split('#')[0];
    window.history.replaceState(null, null, cleanURL);
}

export function getDataFromHash(){
    let oldData = null;
    const hash = window.location.hash.substring(1);
    if(hash && hash !== '') { 
        try {
            console.log(`setting from hash`);
            oldData = JSON.parse(decodeURIComponent(hash));
            resetWindowHash();
        } catch (error) {
          console.error(`Could not parse hash ${hash} : ${error}`);
        }        
    }
    return oldData;
}
export function getDataFromLocalStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key))   
    }catch(error) {
        return null;
    }
}