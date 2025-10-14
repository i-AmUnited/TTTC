import logo from "../assets/images/TTTC Logo 4 1.png";
import banner from "../assets/images/bannerTTTC.png";
import themeIcon from "../assets/icons/theme.svg";
import calenderIcon from "../assets/icons/calender.svg";
import locationIcon from "../assets/icons/location.svg";
import arrowIcon from "../assets/icons/arrow.svg";
import InputComp from "../components/input";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  cardPayment,
  userCheckout,
  validateCode,
} from "../hooks/local/reducer";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/spinner";
import jsPDF from "jspdf";

const PageStructure = () => {
  const [activeCategory, setActiveCategory] = useState("undergraduate");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [ticketDownloaded, setTicketDownloaded] = useState(false);

  const handleCategorySwitch = (tab) => {
    if (tab === "undergraduate" && secondaryCount > 0) {
      alert("Please reset secondary school tickets to 0 before switching tabs");
      return;
    }
    if (tab === "secondary" && undergraduateCount > 0) {
      alert("Please reset undergraduate tickets to 0 before switching tabs");
      return;
    }
    setActiveCategory(tab);
  };

  const [ticketDetails, setTicketDetails] = useState(true);
  const [guestDetails, setGuestDetails] = useState(false);

  const showTicketDetails = () => {
    setTicketDetails(true);
    setGuestDetails(false);
  };

  const showGuestDetails = () => {
    setTicketDetails(false);
    setGuestDetails(true);
  };

  const [undergraduateCount, setUndergraduateCount] = useState(0);
  const [secondaryCount, setSecondaryCount] = useState(0);

  const decreaseUndergraduate = () => {
    setUndergraduateCount((prev) => Math.max(0, prev - 1));
  };

  const decreaseSecondary = () => {
    setSecondaryCount((prev) => Math.max(0, prev - 1));
  };

  const increaseUndergraduate = () => {
    setUndergraduateCount((prev) => prev + 1);
  };

  const increaseSecondary = () => {
    setSecondaryCount((prev) => prev + 1);
  };

  const totalGuests = undergraduateCount + secondaryCount;

  const [guests, setGuests] = useState(
    Array.from({ length: totalGuests }, () => ({
      fullName: "",
      category: "",
      schoolName: "",
    }))
  );

  useEffect(() => {
    const newGuestsCount = undergraduateCount + secondaryCount;

    if (newGuestsCount > guests.length) {
      const newGuests = Array.from(
        { length: newGuestsCount - guests.length },
        () => ({ fullName: "", category: activeCategory, schoolName: "" })
      );
      setGuests([...guests, ...newGuests]);
    } else if (newGuestsCount < guests.length) {
      setGuests(guests.slice(0, newGuestsCount));
    }
  }, [undergraduateCount, secondaryCount]);

  const handleInputChange = (index, field, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index][field] = value;
    setGuests(updatedGuests);
  };

  const formattedGuests = guests
    .map(
      (g) =>
        `${g.fullName.trim()}, ${g.category.trim()}, ${g.schoolName.trim()}`
    )
    .join(" | ");

  const undergraduatePrice = 2000;
  const secondarySchoolPrice = 2000;

  const totalPrice =
    undergraduatePrice * undergraduateCount +
    secondarySchoolPrice * secondaryCount;
  const price = totalPrice * (1 - promoData / 100);
  
  const dispatch = useDispatch();

  const handleDownloadTicket = (name) => {

  if (!name) {
    console.log("No name provided");
    return;
  }

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
  doc.text(name, 20, 85);

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
  doc.text("YUSUF GRILLO HALL, YABA COLLEGE OF TECHNOLOGY Yaba, Lagos", 20, 161);

  // Date and time
  doc.setTextColor(...lightGray);
  doc.setFont(undefined, "bold");
  doc.text("Date & Time:", 20, 176);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "normal");
  doc.text("November 1st, 2025", 20, 184);

  // Footer
  doc.setLineWidth(0.5);
  doc.line(20, 240, 190, 240);
  
  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.text("Please present this ticket at the venue entrance.", 105, 250, { align: "center" });
  doc.text("Thank you for your registration!", 105, 257, { align: "center" });

  // Save the PDF
  doc.save(`TTTC-2025-Ticket-${name.replace(/\s+/g, "-")}.pdf`);
};

  const couponCodeForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      promoCode: "",
      category: "1",
    },
    onSubmit: async (values) => {
      const { promoCode, category } = values;
      let couponCodeData = { promoCode, category };
      const { payload } = await dispatch(validateCode(couponCodeData));
      if (payload.statusCode === 200) {
        setPromoApplied(true);
        setPromoData(payload.data.promoRate);
        setPromoCode(payload.data.promoCode)
      }
    },
  });

  const checkoutForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      emailAddress: "",
      fullName: "",
      hasPromo: promoApplied,
      quantity: totalGuests,
      schoolDetails: formattedGuests,
      ticketPrice:
        activeCategory === "secondary"
          ? secondarySchoolPrice
          : undergraduatePrice,
      promoCode: promoCode ? promoCode : "",
      promoPrice: promoApplied === true ? price : "",
    },
    onSubmit: async (values) => {
      const {
        emailAddress,
        fullName,
        hasPromo,
        quantity,
        schoolDetails,
        ticketPrice,
        promoCode,
        promoPrice,
      } = values;
      let checkoutData = {
        emailAddress,
        fullName,
        hasPromo,
        quantity,
        schoolDetails,
        ticketPrice,
        promoCode,
        promoPrice,
      };

      const { payload } = await dispatch(userCheckout(checkoutData));
     
      // if (payload.statusCode === 200) {
      //   setTimeout(async () => {
      //     let paymentData = {
      //       amount:
      //         promoApplied === true ? Number(promoPrice) : Number(ticketPrice),
      //     };

      //     const paymentResponse = await dispatch(cardPayment(paymentData));
      //     if (paymentResponse.payload.statusCode === 200) {
      //       if (promoApplied === true) {
      //         const reference = paymentResponse.payload?.data?.paymentReference;
      //         window.location.href = `https://tttc-pi.vercel.app/status?paymentReference=${reference}`;
      //       } else {
      //         window.location.href = paymentResponse.payload.data.checkoutUrl;
      //       }
      //     }
      //   }, 1000);
      // }
      if (payload.statusCode === 200) {
  setTimeout(async () => {
    let paymentData = {
      amount:
        promoApplied === true ? Number(promoPrice) : Number(ticketPrice),
    };

    const paymentResponse = await dispatch(cardPayment(paymentData));
    if (paymentResponse.payload.statusCode === 200) {
      window.location.href = paymentResponse.payload.data.checkoutUrl;
    }
  }, 1000);
} else if (payload.statusCode === 215 && !ticketDownloaded) {
  setTicketDownloaded(true);
  handleDownloadTicket(payload.data.fullName);
}
    },
  });

  return (
    <div>
      <Spinner loading={useSelector((state) => state.user).loading} />
      <div className="text-brown mx-10 md:mx-[100px] lg:mx-[150px] py-5 grid grid-cols-1 lg:grid-cols-5 gap-[10px] text-sm">
        <div className="bg-white rounded-xl border-b-5 border-orange md:col-span-3">
          <div className="bg-brown px-6 rounded-t-lg border-b-orange border-b-4 h-20 flex items-center">
            <img src={logo} alt="TTTC Logo" className="h-12" />
          </div>
          <div>
            <img src={banner} alt="" />
          </div>
          <div className="p-6">
            <div className="text-orange font-black text-lg">
              Teens, Twenties & Trendsetters Convention 2025
            </div>
            <div className="px-[40px] py-6 border border-brown/10 rounded-lg mt-5 grid gap-6">
              <div className="grid gap-2">
                <span className="flex items-center gap-1">
                  {" "}
                  <img src={themeIcon} alt="" />{" "}
                  <span className="font-black opacity-50">Theme:</span>
                </span>
                <span className="font-bold text-xs">
                  LIFE (Life. Industry. Finance. Education)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 divide-x divide-brown/10">
                <div className="grid gap-2">
                  <span className="flex items-center gap-1">
                    {" "}
                    <img src={calenderIcon} alt="" />{" "}
                    <span className="font-black opacity-50">Date:</span>
                  </span>
                  <span className="text-xs font-bold">November 1st, 2025</span>
                </div>
                <div className="grid gap-2 md:px-6">
                  <span className="flex items-center gap-1">
                    {" "}
                    <img src={locationIcon} alt="" />{" "}
                    <span className="font-black opacity-50">Venue:</span>
                  </span>
                  <span className="text-xs font-bold">
                    Iceland Civic Center, Egbeda
                  </span>
                </div>
              </div>
            </div>
            <div className="grid gap-3 mt-6">
              <span className="font-black opacity-50">
                About this convention:
              </span>
              <span className="leading-5 text-xs font-bold">
                The Teens, Twenties & Trendsetters Convention is a
                purpose-driven annual gathering designed to empower and inspire
                the next generation of leaders, innovators, professionals, and
                citizens. This edition is set to hold on 1st November, 2025,
                bringing together 1,500 teenagers and young adults (Secondary
                School students and Undergraduates) from across Lagos and
                neighboring states. <br /> <br /> The convention focuses on 4
                critical pillars shaping the future of today’s youth:
              </span>
              <div className="grid md:grid-cols-5 gap-2 mt-4 text-lightText border-b pb-10">
                <div className="bg-orange md:col-span-3 rounded-md px-8 py-6 flex items-center">
                  <div className="grid">
                    <span className="text-lg opacity-50 font-black italic">
                      1500
                    </span>
                    <span className="text-xs">
                      Vibrant students and youth (future consumers and leaders)
                    </span>
                  </div>
                </div>
                <div className="bg-brown md:col-span-2 rounded-md px-8 py-6 flex items-center">
                  <div className="text-xs leading-4.5">
                    Vibrant students and youth (future consumers and leaders)
                  </div>
                </div>
                <div className="bg-brown md:col-span-2 rounded-md px-8 py-6 flex items-center">
                  <div className="grid">
                    <span className="text-lg opacity-50 font-black italic">
                      50+
                    </span>
                    <span className="text-xs">
                      Partner schools, universities & institutions
                    </span>
                  </div>
                </div>
                <div className="bg-orange md:col-span-3 rounded-md px-8 py-6 flex items-center">
                  <div className="text-xs leading-4.5">
                    Thousands of social media followers and online viewers
                    (through event streaming and promotion)
                  </div>
                </div>
              </div>
              <div className="text-xs opacity-50 pt-5 leading-5">
                © 2025 Teens, Twenties & Trendsetters Convention. All rights
                reserved. Tickets are non-refundable unless otherwise stated by
                the event organizer.
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl md:col-span-2 overflow-hidden">
          <div className="bg-white rounded-xl border-b-5 border-orange">
            <div className="bg-brown px-6 text-lg font-black text-orange h-20 border-b-5 border-orange flex items-center">
              <span>Choose Ticket</span>
            </div>
            {ticketDetails && (
              <div>
                <div className="py-4 px-6 grid gap-5">
                  <div className="flex gap-2 mb-6 border-b border-gray-200 w-fit">
                    <button
                      onClick={() => handleCategorySwitch("undergraduate")}
                      disabled={secondaryCount > 0}
                      className={`px-6 py-3 font-bold transition-colors cursor-pointer ${
                        activeCategory === "undergraduate"
                          ? "border-b-2 border-orange text-orange"
                          : secondaryCount > 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Undergraduate
                    </button>
                    <button
                      onClick={() => handleCategorySwitch("secondary")}
                      disabled={undergraduateCount > 0}
                      className={`px-6 py-3 font-bold transition-colors  cursor-pointer ${
                        activeCategory === "secondary"
                          ? "border-b-2 border-orange text-orange"
                          : undergraduateCount > 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Secondary School
                    </button>
                  </div>
                  {activeCategory === "undergraduate" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="grid gap-1 lg:col-span-2">
                        <span className="font-bold">
                          Undergraduate Tickets:
                        </span>
                        <span className="font-black text-[16px]">
                          <span className="montserrat font-extrabold opacity-50">
                            ₦
                          </span>
                          {undergraduatePrice}{" "}
                          <span className="text-xs italic text-orange">
                            /person
                          </span>
                        </span>
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center gap-4 bg-lightText py-4 px-6 rounded-full w-fit">
                          <img
                            src={arrowIcon}
                            alt=""
                            className="size-5 rotate-180 cursor-pointer"
                            onClick={
                              promoApplied ? undefined : decreaseUndergraduate
                            }
                          />
                          <span className="font-black">
                            {undergraduateCount}
                          </span>
                          <img
                            src={arrowIcon}
                            alt=""
                            className="size-5 cursor-pointer"
                            onClick={
                              promoApplied ? undefined : increaseUndergraduate
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeCategory === "secondary" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="grid gap-1 lg:col-span-2">
                        <span className="font-bold">
                          Secondary School Tickets:
                        </span>
                        <span className="font-black text-[16px]">
                          <span className="montserrat font-extrabold opacity-50">
                            ₦
                          </span>
                          {secondarySchoolPrice}{" "}
                          <span className="text-xs italic text-orange">
                            /person
                          </span>
                        </span>
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center gap-4 bg-lightText py-4 px-6 rounded-full w-fit">
                          <img
                            src={arrowIcon}
                            alt=""
                            className="size-5 rotate-180"
                            onClick={
                              promoApplied ? undefined : decreaseSecondary
                            }
                          />
                          <span className="font-black">{secondaryCount}</span>
                          <img
                            src={arrowIcon}
                            alt=""
                            className="size-5"
                            onClick={
                              promoApplied ? undefined : increaseSecondary
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={couponCodeForm.handleSubmit}>
                    <InputComp
                      label={"Promo code:"}
                      name={"promoCode"}
                      value={couponCodeForm.values.promoCode}
                      onChange={couponCodeForm.handleChange}
                      onBlur={couponCodeForm.handleBlur}
                    />
                    {!promoApplied ? (
                      <button
                        type="submit"
                        className="font-bold text-orange italic underline underline-offset-2 text-end w-fit cursor-pointer"
                      >
                        Apply promo code
                      </button>
                    ) : (
                      <div className="text-green-600 font-bold text-xs mt-2">
                        ✓ {promoData}% discount has been applied to your ticket
                        price.
                      </div>
                    )}
                  </form>
                </div>
                <div className="flex items-center justify-between my-6 px-6">
                  <div className="grid">
                    <span className="font-black opacity-50">Total price:</span>
                    <span className="font-black text-[18px] flex">
                      <span className="montserrat text-orange font-extrabold opacity-50">
                        ₦
                      </span>
                      {!promoApplied ? totalPrice : <span>{price}</span>}
                    </span>
                  </div>
                  <div
                    className="rounded-full py-5 px-10 bg-brown text-orange font-semibold cursor-pointer"
                    onClick={showGuestDetails}
                  >
                    Continue
                  </div>
                </div>
              </div>
            )}
            {guestDetails && (
              <div className="py-4 px-6 grid gap-4">
                <span
                  onClick={showTicketDetails}
                  className="text-red-500 font-bold cursor-pointer w-fit"
                >
                  Go back
                </span>
                <div className="font-black mb-2">
                  Total guests: {totalGuests}
                </div>
                {Array.from({ length: totalGuests }, (_, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-md grid grid-cols-1 gap-4 border-b border-gray-200 pb-6"
                  >
                    <div className="font-black">Guest {index + 1}</div>

                    <InputComp
                      label="Full name:"
                      value={guests[index].fullName}
                      onChange={(e) =>
                        handleInputChange(index, "fullName", e.target.value)
                      }
                    />
                    {/* <SelectComp
                      label="Category:"
                      options={categoryOptions}
                      value={guests[index].category}
                      onChange={(e) =>
                        handleInputChange(index, "category", e.target.value)
                      }
                      placeholder="Select an option"
                    /> */}
                    <InputComp
                      label="School name:"
                      value={guests[index].schoolName}
                      onChange={(e) =>
                        handleInputChange(index, "schoolName", e.target.value)
                      }
                    />
                  </div>
                ))}
                {formattedGuests}
                <form onSubmit={checkoutForm.handleSubmit}>
                  <div className="mb-4 font-black mt-5">
                    Ticket buyer information:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <InputComp
                      label="Full name:"
                      name="fullName"
                      value={checkoutForm.values.fullName}
                      onChange={checkoutForm.handleChange}
                      onBlur={checkoutForm.handleBlur}
                    />
                    <InputComp
                      label="Email address:"
                      name="emailAddress"
                      value={checkoutForm.values.emailAddress}
                      onChange={checkoutForm.handleChange}
                      onBlur={checkoutForm.handleBlur}
                    />
                  </div>
                  <button
  className="rounded-full py-5 px-10 bg-brown text-orange font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  type="submit"
  disabled={ticketDownloaded}
>
  {promoApplied ? "Download Ticket" : "Submit"}
</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageStructure;
