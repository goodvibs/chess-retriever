import React from 'react';
import SearchForm from './SearchForm';
import LogoSVG from './LogoSVG'

export default function SearchBlock(props) {
    return (
        <div className={(props.expanded ? ' ' : '') + 'flex flex-col items-center rounded-2xl bg-amber-300 text-teal-800 p-10 transition-all duration-500'}>
            <div className='flex items-center justify-center p-5 gap-4 my-auto'>
                <LogoSVG className='w-14 fill-teal-800 object-cover transition-all duration-500'/>
                <h1 className='flex whitespace-nowrap child:text-6xl child:inline-flex child:whitespace-nowrap'>
                    <span className='font-bold'>ChessRetriever</span>
                    <span className='font-light'>.com</span>
                </h1>
            </div>
            <SearchForm className='flex justify-center' searchFormSubmissionHandler={props.searchFormSubmissionHandler} loading={props.loading}/>
        </div>

    );
}