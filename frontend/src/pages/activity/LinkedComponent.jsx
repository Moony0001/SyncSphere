import React, { useState } from 'react';
import Map1 from '../../Maps/Map1';
import Map2 from '../../Maps/Map2';
import Map3 from '../../Maps/Map3';
import Form from '../../Maps/Form';
import Map from './common/Map';
export default function LinkedComponent() {
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
