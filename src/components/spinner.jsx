import * as React from "react";
const Spinner = ({ loading }) => {
    if (!loading) return null;
  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
    </div>
  );
};

export default Spinner;
