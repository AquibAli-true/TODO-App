import React from 'react'
import checkButton from './assets/svg/checked.svg';
import uncheckButton from './assets/svg/unchecked.svg';
import { useState,useEffect } from 'react';

const History = () => {
  const [historyMap, setHistoryMap] = useState(new Map());
  useEffect(() => {
    const initiator=async ()=>{
    try{
    const resHistory = await fetch('http://localhost:3333/history');
    const historyArray= await resHistory.json();
    if(historyArray.length!==0){
      const newMap=new Map(historyArray.map(({id,...rest})=>[id,rest]));
      setHistoryMap(newMap);
    }
    if(!resHistory.ok){
      console.log(resHistory.statusText);
    }
    } catch(err){
      console.log(err);
    }
    }
    initiator();
  }, []);



  return (
    <section className='flex flex-col fixed top-[26vh] lg:top-[24vh] left-[10vw] md:left-[11vw] lg:left-[25vw] bg-[#25273D] overflow-y-scroll scrollbar-thin scrollbar-thumb-[#9C77C4] scrollbar-track-[#25273D] items-center gap-3 w-[80vw] lg:w-[50vw] h-[65vh] lg:h-[70vh] p-3 rounded-xl text-white' >
        {[...historyMap].map(([id, object])=>(
          <div className='w-[99%] px-3 py-2 flex justify-between items-center border-b border-gray-400 bg-[#25273D]'>
            <div className='flex-1 md:w-[80%] w-[60%] overflow-x-hidden' >{object.completed?<s>{object.text}</s> : <p>{object.text}</p> }</div> 
            <div className='flex gap-3'>
              <span className='text-sm' >{object.createdAt.slice(0,10)}</span>
              <div className='p-1'  > {object.completed?<img className='w-3.5 h-3.5 sm:w-5 sm:h-5 ' src={checkButton} alt="checkbox" /> : <img className='w-3.5 h-3.5 sm:w-5 sm:h-5' src={uncheckButton} alt="checkbox" /> } </div>
            </div>
          </div>
        ))}
    </section>
  )
}

export default History