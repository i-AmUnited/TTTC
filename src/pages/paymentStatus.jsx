import successIcon from "../assets/images/success 1.svg";
import banner from "../assets/images/bannerTTTC.png";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { confirmPayment } from "../hooks/local/reducer";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

const PaymentStatus = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentReference = urlParams.get("paymentReference");
  const dispatch = useDispatch();

  const [customerName, setCustomerName] = useState("Tobi");
  // const [paymentData, setPaymentData] = useState(null);

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
        // setPaymentData(payload?.data);
      }
    },
  });

  // ✅ Automatically submit form when paymentReference is available
  useEffect(() => {
    if (paymentReference) {
      confirmPaymentForm.handleSubmit();
    }
  }, [paymentReference]);


  const handleDownloadTicket = () => {
    if (!customerName) return;

    const doc = new jsPDF();
    
    // Set colors
    const orangeColor = [255, 140, 0];
    const brownColor = [101, 67, 33];
    const lightGray = [150, 150, 150];

    // Header
    doc.setFillColor(...orangeColor);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, "bold");
    doc.text("EVENT TICKET", 105, 25, { align: "center" });

    // Success message
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Payment Confirmed!", 105, 55, { align: "center" });

    // Customer details
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...lightGray);
    doc.text("Attendee Name:", 20, 75);
    
    doc.setTextColor(...orangeColor);
    doc.setFontSize(14);
    doc.text(customerName, 20, 85);

    // Event details section
    doc.setDrawColor(...brownColor);
    doc.setLineWidth(0.5);
    doc.line(20, 100, 190, 100);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Event Details", 20, 115);

    doc.setFontSize(11);
    doc.setTextColor(...lightGray);
    doc.setFont(undefined, "bold");
    
    // Event name
    doc.text("Event Name:", 20, 130);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text("Teens, Twenties & Trendsetters Convention 2025", 20, 138);

    // Venue
    doc.setTextColor(...lightGray);
    doc.setFont(undefined, "bold");
    doc.text("Venue:", 20, 153);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text("Iceland Civic Center, Egbeda", 20, 161);

    // Date and time
    doc.setTextColor(...lightGray);
    doc.setFont(undefined, "bold");
    doc.text("Date & Time:", 20, 176);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text("November 1st, 2025", 20, 184);

    // Payment reference
    if (paymentReference) {
      doc.setTextColor(...lightGray);
      doc.setFont(undefined, "bold");
      doc.text("Payment Reference:", 20, 199);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "normal");
      doc.text(paymentReference, 20, 207);
    }

    // Footer
    doc.setLineWidth(0.5);
    doc.line(20, 240, 190, 240);
    
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text("Please present this ticket at the venue entrance.", 105, 250, { align: "center" });
    doc.text("Thank you for your registration!", 105, 257, { align: "center" });

    // Save the PDF
    doc.save(`TTTC-2025-Ticket-${customerName.replace(/\s+/g, "-")}.pdf`);
  };

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
          <button
            onClick={handleDownloadTicket}
            // disabled={!customerName}
            className="rounded-full py-5 px-10 bg-brown font-semibold cursor-pointer w-fit text-orange disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download ticket
          </button>
        </div>
      </div>
      <img src={banner} alt="" className="h-screen object-cover hidden lg:block" />
    </div>
  );
};

export default PaymentStatus;
