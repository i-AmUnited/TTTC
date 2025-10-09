import React from 'react';

const SelectComp = ({ label, name, value, onChange, onBlur, options, onError, placeholder }) => {
  
  return (
      <div className="grid gap-1">
        <div className='grid gap-[2px]'>
          <span className="">{label}</span>
          <div className="relative w-full">
            <div className='px-4 border-[1.5px] border-[#c4c4c432] rounded active:outline-0 focus:outline-0'>
              <select
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className="w-full py-5 md:py-4 text-sm"
              >
                <option value="Select an option" disabled>
                {placeholder}
              </option>
                {options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <span className="text-red-500 text-xs">{onError}</span>
      </div>
  );
};

export default SelectComp;
