import successIcon from "../assets/images/success 1.svg";
import banner from "../assets/images/bannerTTTC.png";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { confirmPayment } from "../hooks/local/reducer";
import { useEffect, useState } from "react";

const PaymentStatus = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentReference = urlParams.get("paymentReference");
  const dispatch = useDispatch();

  const [customerName, setCustomerName] = useState("");

  const confirmPaymentForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      transRef: paymentReference || "",
    },
    onSubmit: async (values) => {
      const { transRef } = values;
      const confirmPaymentData = { transRef };
      const { payload } = await dispatch(confirmPayment(confirmPaymentData));
      if (payload?.statusCode === 200) {
        setCustomerName(payload?.data?.name);
      }
    },
  });

  // ✅ Automatically submit form when paymentReference is available
  useEffect(() => {
    if (paymentReference) {
      confirmPaymentForm.handleSubmit();
    }
  }, [paymentReference]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
      <div className="h-screen flex items-center">
        <div className="mx-10 md:mx-[100px] lg:mx-[150px] py-5">
          <img src={successIcon} alt="" />
          <div className="font-black text-lg text-orange mt-6">Payment successful!</div>
          <div className="text-sm font-medium">
            Thank you!,{" "}
            <span className="font-black text-orange underline">{customerName}</span>, your payment
            has been confirmed.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="grid gap-1 text-sm md:col-span-2">
              <span className="font-black opacity-50">Event name:</span>
              <span className="font-black">
                Teens, Twenties & Trendsetters Convention 2025
              </span>
            </div>
            <div className="grid gap-1 text-sm">
              <span className="font-black opacity-50">Venue:</span>
              <span className="font-black">Iceland Civic Center, Egbeda</span>
            </div>
            <div className="grid gap-1 text-sm">
              <span className="font-black opacity-50">Date and time:</span>
              <span className="font-black">November 1st, 2025</span>
            </div>
          </div>
          <div className="rounded-full py-5 px-10 bg-brown font-semibold cursor-pointer w-fit text-orange">
            Continue
          </div>
        </div>
      </div>
      <img src={banner} alt="" className="h-screen object-cover hidden lg:block" />
    </div>
  );
};

export default PaymentStatus;
