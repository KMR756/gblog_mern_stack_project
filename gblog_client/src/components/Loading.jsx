import React from 'react';
import loadingIcon from "../assets/images/loading.svg"
const Loading = () => {
    return (
        <div className='flex fixed z-50 top-0 left-0  justify-center items-center h-screen w-screen'>
            <img width={100} src={loadingIcon} alt="" />
        </div>
    );
};

export default Loading;