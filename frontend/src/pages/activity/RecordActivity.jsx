import React, { useState } from 'react';
import Map1 from './Map1';
import Map2 from './Map2';
import Map3 from './Map3';
import Form from './Form';
import Map from '../../components/common/Map';
export default function RecordActivity() {
    const [page, setPage] = useState({
        first: true,
        second: false,
        third: false,
        fourth: false,
    });

    return (
        <>   
            <Map/>
            {page.first && <Map1 setPage={setPage} page={page} />}
            {page.second && <Map2 setPage={setPage} page={page} />}
            {page.third && <Map3 setPage={setPage} page={page} />}
            {
               page.fourth &&
                (<div className='top-level'>
                 <Form />
                </div>)
            } 
        </>
    );
}
