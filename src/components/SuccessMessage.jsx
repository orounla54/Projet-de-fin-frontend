import React from "react";
import Toast from "./Toast";

function SuccessMessage({ successMessage }) {
  return (
    <div className="absolute -top-20 left-0 z-60 ">
      <Toast
        type="success"
        open={toastSuccessOpen}
        setOpen={setToastSuccessOpen}
      >
        {successMessage}
      </Toast>
    </div>
  );
}

export default SuccessMessage;
