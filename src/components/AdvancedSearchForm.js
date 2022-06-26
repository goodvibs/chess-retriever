import React from 'react';
import {YearMonth} from "../utils";

export default function AdvancedSearchForm(props) {

    const [advancedVisible, setAdvancedVisibility] = React.useState(false);

    function toggleAdvanced() {
        setAdvancedVisibility(!advancedVisible);
    }

    function getAdvancedBtnText() {
        return advancedVisible ? 'hide advanced' : 'advanced';
    }

    const currYearMonth = YearMonth.fromDate(new Date());
    const yearMonthTodayStr = currYearMonth.toString();

    const timeClasses = ['bullet', 'blitz', 'rapid', 'daily'];
    const timeClassCheckboxes = timeClasses.map(timeClass => (
        <label className='flex items-center align-middle md:gap-1 lg:gap-2'>
            <input type='checkbox' defaultChecked name={timeClass} className='scale-100 md:scale-125 lg:scale-150'/>
            &nbsp;{timeClass}
        </label>
    ));

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const monthOptions = months.map((month, index) => (
        <option value={index + 1}>{month}</option>
    ));

    return (
        <div className={props.className}>
            <div className='flex'>
                <form onSubmit={props.searchFormSubmissionHandler} className='block'>
                    <div className='inline-flex gap-3 w-fit items-center'>
                        <div className='inline-flex items-center rounded-full whitespace-nowrap'>
                            <label>
                                <input type='text' minLength='3' maxLength='20' spellCheck='false' autoCapitalize='false' autoCorrect='false' name='username' className='flex w-fit h-fit whitespace-nowrap p-2 bg-white text-sm rounded-l-full outline-none md:p-2.5 md:text-lg lg:p-3 lg:text-xl transition-all duration-500' placeholder='Chess.com username'/>
                            </label>
                            <div className='bg-teal-800 hover:bg-teal-900 rounded-r-full'>
                                <button type='submit' disabled={props.loading} className='flex justify-center font-light w-32 h-fit whitespace-nowrap p-2 text-white text-sm outline-none rounded-r-full md:p-2.5 md:text-lg md:w-40 lg:p-3 lg:text-xl lg:w-44 transition-all duration-500'>
                                <span hidden={!props.loading}>
                                    <svg role="status"
                                         className="flex w-6 h-6 animate-spin fill-white"
                                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"/>
                                    </svg>
                                </span>
                                    <span hidden={props.loading}>
                                    Retrieve games
                                </span>
                                </button>
                            </div>

                        </div>
                        <button type='button' className='peer group text-gray-600 z-20 w-4 h-fit rounded-full md:w-5 lg:w-6 transition-all duration-500' onClick={toggleAdvanced}>
                            <svg viewBox='0 0 64 64' className='relative fill-teal-800 group-hover:rotate-45 ease-in-out duration-500'>
                                <path d="m24 0v6.78a26.47 26.47 0 0 0-4.17 1.74l-4.8-4.8-11.31 11.31 4.79 4.79a26.47 26.47 0 0 0-1.71 4.18h-6.8v16h6.78a26.47 26.47 0 0 0 1.74 4.17l-4.8 4.81 11.31 11.31 4.79-4.79a26.47 26.47 0 0 0 4.18 1.71v6.8h16v-6.78a26.47 26.47 0 0 0 4.17-1.74l4.8 4.8 11.31-11.31-4.79-4.79a26.47 26.47 0 0 0 1.71-4.18h6.8v-16h-6.78a26.47 26.47 0 0 0-1.74-4.17l4.81-4.8-11.31-11.31-4.79 4.79a26.47 26.47 0 0 0-4.18-1.71v-6.8h-16zm8 19a13 13 0 0 1 13 13 13 13 0 0 1-13 13 13 13 0 0 1-13-13 13 13 0 0 1 13-13z"/>
                            </svg>
                        </button>
                        <div className='flex invisible items-center opacity-0 z-10 select-none cursor-default text-xs scale-75 md:scale-100 lg:text-md peer-hover:visible peer-hover:opacity-100 peer-hover:translate-x-2 transition-all duration-500'>
                            <div className='absolute -ml-2'>
                                {getAdvancedBtnText()}
                            </div>
                        </div>
                    </div>
                    <div id='advanced' hidden={!advancedVisible} className='text-lg p-4 space-y-2 md:text-xl lg:text-2xl'>
                        <div className='flex flex-col items-center gap-2'>
                            <div>
                                <label>
                                    from&nbsp;
                                    <select className='w-fit bg-transparent font-light outline-none' defaultValue={currYearMonth.month} name='month'>
                                        {monthOptions}
                                    </select>
                                    ,&nbsp;
                                    <input type='number' min='2007' max={currYearMonth.year} defaultValue={currYearMonth.year} name='year' className='bg-transparent outline-none font-light'/>
                                </label>
                            </div>
                            <div className='hidden flex gap-1'>
                                <label className='flex'>
                                    from&nbsp;
                                    <input type='month' maxLength='7' size='7' min='2007-05' max={yearMonthTodayStr} defaultValue={yearMonthTodayStr} name='from' className='flex bg-transparent font-light focus:outline-none'/>
                                </label>
                                <label className='flex'>
                                    to&nbsp;
                                    <input type='month' maxLength='7' size='7' min='2007-05' max={yearMonthTodayStr} defaultValue={yearMonthTodayStr} name='to' className='flex bg-transparent font-light focus:outline-none'/>
                                </label>
                            </div>
                            <div className='hidden'>
                                <label>
                                    sort by&nbsp;
                                    <select className='bg-transparent font-light focus:outline-none' defaultValue='1' name='sort_method'>
                                        <option value='1'>recent first</option>
                                        <option value='2'>oldest first</option>
                                    </select>
                                </label>
                            </div>
                            <div className='flex gap-5'>
                                {timeClassCheckboxes}
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}