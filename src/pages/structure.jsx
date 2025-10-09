import logo from "../assets/images/TTTC Logo 4 1.png";
import banner from "../assets/images/bannerTTTC.png";
import themeIcon from "../assets/icons/theme.svg";
import calenderIcon from "../assets/icons/calender.svg";
import locationIcon from "../assets/icons/location.svg";
import arrowIcon from "../assets/icons/arrow.svg";
import InputComp from "../components/input";
import SelectComp from "../components/select";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { cardPayment, userCheckout, validateCode } from "../hooks/local/reducer";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/spinner";

const PageStructure = () => {

  const [activeCategory, setActiveCategory] = useState('undergraduate');
  const [promoApplied, setPromoApplied] = useState(false);
const [promoData, setPromoData] = useState(null);

  const handleCategorySwitch = (tab) => {
  if (tab === 'undergraduate' && secondaryCount > 0) {
    alert('Please reset secondary school tickets to 0 before switching tabs');
    return;
  }
  if (tab === 'secondary' && undergraduateCount > 0) {
    alert('Please reset undergraduate tickets to 0 before switching tabs');
    return;
  }
  setActiveCategory(tab);
};

//   const categoryOptions = [
//   { value: "Undergraduate", name: "Undergraduate" },
//   { value: "secondary_school", name: "Secondary school" }
// ];

  const [ticketDetails, setTicketDetails] = useState(true);
  const [guestDetails, setGuestDetails] = useState(false);

  const showTicketDetails = () => {
    setTicketDetails(true);
    setGuestDetails(false);
  }

  const showGuestDetails = () => {
    setTicketDetails(false);
    setGuestDetails(true);
  }

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
        () => ({ fullName: "", category: "", schoolName: "" })
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

  const undergraduatePrice = 100;
  const secondarySchoolPrice = 2500;

  const totalPrice = (undergraduatePrice*undergraduateCount) + (secondarySchoolPrice*secondaryCount);
  const price = totalPrice * (1 - promoData / 100)
  const dispatch = useDispatch();

  const couponCodeForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      promoCode: "",
      category: activeCategory === "secondary" ? "2" : "1"
    },
    onSubmit: async (values) => {
      const {promoCode, category} = values;
      let couponCodeData = { promoCode, category };
      const { payload } = await dispatch(validateCode(couponCodeData));
      if (payload.statusCode === 200) {
        setPromoApplied(true);
        setPromoData(payload.data.promoRate); 
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
      ticketPrice: activeCategory === "secondary" ? secondarySchoolPrice : undergraduatePrice ,
      promoCode: promoData ? promoData : "" ,
      promoPrice: promoApplied === true ? price : "",
    },
    onSubmit: async (values) => {
      const { emailAddress, fullName, hasPromo, quantity, schoolDetails, ticketPrice, promoCode, promoPrice  } = values;
      let checkoutData = { emailAddress, fullName, hasPromo, quantity, schoolDetails, ticketPrice, promoCode, promoPrice };
      
      const { payload } = await dispatch(userCheckout(checkoutData));
      if (payload.statusCode === 200) {
        setTimeout(async () => {
          let paymentData = {
             amount: promoApplied === true ? Number(promoPrice) : Number(ticketPrice)
          };
          
          const paymentResponse = await dispatch(cardPayment(paymentData));
          if (paymentResponse.payload.statusCode === 200) {
            window.location.href = paymentResponse.payload.data.checkoutUrl
          }
        }, 2000);
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
              <span>Choose Tickets</span>
            </div>
            {ticketDetails && (
              <div>
                <div className="py-4 px-6 grid gap-5">
                  <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <button
                      onClick={() => handleCategorySwitch("undergraduate")}
                      disabled={secondaryCount > 0}
                      className={`px-6 py-3 font-bold transition-colors ${
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
                      className={`px-6 py-3 font-bold transition-colors ${
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
                            onClick={promoApplied? undefined : decreaseUndergraduate}
                          />
                          <span className="font-black">
                            {undergraduateCount}
                          </span>
                          <img
                            src={arrowIcon}
                            alt=""
                            className="size-5 cursor-pointer"
                            onClick={promoApplied? undefined : increaseUndergraduate}
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
                            onClick={promoApplied? undefined : decreaseSecondary}
                          />
                          <span className="font-black">{secondaryCount}</span>
                          <img
                            src={arrowIcon}
                            alt=""
                            className="size-5"
                            onClick={promoApplied? undefined : increaseSecondary}
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
                      {!promoApplied ? (
                        totalPrice
                      ) : (
                        <span>{price}</span>
                      )}
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
                {/* {formattedGuests} */}
                <form onSubmit={checkoutForm.handleSubmit}>
                  <div className="mb-4 font-black mt-5">Ticket buyer information:</div>
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
                  <button className="rounded-full py-5 px-10 bg-brown text-orange font-semibold cursor-pointer" type="submit">Submit</button>
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
