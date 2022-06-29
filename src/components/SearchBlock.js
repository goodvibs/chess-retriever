import React from 'react';
import SearchForm from './SearchForm';
import LogoSVG from './LogoSVG'

export default function SearchBlock(props) {
    return (
        <header className={(props.expanded ? 'translate-y-48 md:scale-110 lg:scale-125 xl:scale-150 ' : '') + 'flex flex-col items-center rounded-xl bg-amber-300 text-teal-800 p-3 px-8 md:p-4 md:px-9 lg:p-5 lg:px-10 transition-all duration-500'}>
            <div className='flex items-center justify-center p-5 gap-4 my-auto'>
                <LogoSVG className='w-10 fill-teal-800 object-cover md:w-12 lg:w-14 transition-all duration-500'/>
                <h1 className='flex whitespace-nowrap child:text-4xl child:inline-flex child:whitespace-nowrap child:md:text-5xl child:lg:text-6xl'>
                    <span className='font-bold'>ChessRetriever</span>
                    <span className='font-light'>.com</span>
                </h1>
            </div>
            <SearchForm className='flex justify-center' searchFormSubmissionHandler={props.searchFormSubmissionHandler} loading={props.loading}/>
        </header>

    );
}