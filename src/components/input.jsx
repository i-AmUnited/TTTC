
const InputComp = ({
  label,
  placeholder,
  value,
  name,
  onChange,
  onBlur,
  onError,
}) => {
 
  return (
    <div className="grid gap-1">
      <div className="grid gap-[2px]">
        <span className="">{label}</span>
          <div className="relative w-full">
            <div>
              <input
                onChange={onChange}
                placeholder={placeholder}
                value={value}
                name={name}
                onBlur={onBlur}
                className="w-full px-4 py-4 border-[1.5px] border-[#c4c4c432] text-sm placeholder:text-[12px] focus:outline-0 focus:border-primary rounded-md"
              />
            </div>
          </div>
      </div>
      <span className="text-red-500 text-xs">{onError}</span>
    </div>
  );
};

export default InputComp;
