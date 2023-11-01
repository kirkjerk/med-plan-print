import { updatedEntry, moveEntry } from "./Utils.js";

test('recalculates new entry forward in time', () =>{
  const entry = {"name":"clippy","freq":14,"offset":9}
  const newEntry = {"name":"clippy","freq":14,"offset":3}
  expect(updatedEntry(entry,10,1)).toEqual(newEntry);
});

test('recalculates new back in time', () =>{
  const entry = {"name":"clippy","freq":14,"offset":9}
  const newEntry = {"name":"clippy","freq":14,"offset":5}
  expect(updatedEntry(entry,24,-1)).toEqual(newEntry);
});

// export function moveEntry(oldEntries, entryIndex, dir) {

test('move entry forward', () =>{
  const entries = [1,2,3,4];
  const newEntries = {"index":2, entries:[1,3,2,4]};
  expect(moveEntry(entries,1,1)).toEqual(newEntries);
});

test('move entry backwards', () =>{
  const entries = [1,2,3,4];
  const newEntries = {"index":0, entries:[2,1,3,4]};
  expect(moveEntry(entries,1,-1)).toEqual(newEntries);
});

test('bounds check - do not move entry past beginning', () =>{
  const entries = [1,2,3,4];
  const newEntries = {"index":0, entries:[1,2,3,4]};
  expect(moveEntry(entries,0,-1)).toEqual(newEntries);
});

test('bounds check - do not move entry past ending', () =>{
  const entries = [1,2,3,4];
  const newEntries = {"index":3, entries:[1,2,3,4]};
  expect(moveEntry(entries,3,1)).toEqual(newEntries);
});