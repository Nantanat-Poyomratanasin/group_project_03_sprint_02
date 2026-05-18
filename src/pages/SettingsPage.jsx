import { useState, useRef, useEffect } from "react";

import { Phone, Headphones, CreditCard } from "lucide-react";

import NavBar from "../components/HomeComponents/NavBar";
import Footer from "../components/HomeComponents/Footer";

export default function SettingsPage() {
  /* =========================
     STATES
  ========================= */

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [isEditingPayment, setIsEditingPayment] = useState(false);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const [feedbackData, setFeedbackData] = useState({
    name: "",
    detail: "",
  });

  /* =========================
     REFS --> manage click outside for profile, payment, and modals
  ========================= */

  const profileRef = useRef(null);
  const paymentRef = useRef(null);
  const modalRef = useRef(null);
  const paymentButtonRef = useRef(null);
  const profileButtonRef = useRef(null);
  /* =========================
     Initial DATA
  ========================= */

  const initialData = {
    firstName: "Robert",
    lastName: "Johnson",
    username: "Robert.username",
    dob: "1999-09-12",
    email: "Robert.username@gmail.com",
    phone: "0811111111",

    address:
      "45/8 ถนนสุขุมวิท 38 แขวงพระโขนง เขตคลองเตย Bangkok, Thailand 10900",

    cardholder: "ROBERT JOHNSON",
    cardNumber: "XXXX XXXX XXXX 123",
    expiry: "05/30",
    cvv: "123",
  };

  // แสดงข้อมูลบนหน้า settings โดยใช้ formData เป็นตัวเก็บข้อมูลหลัก
  // และ profileDraft กับ paymentDraft เป็นตัวเก็บข้อมูลชั่วคราวเมื่อแก้ไข
  const [formData, setFormData] = useState(initialData);

  const [profileDraft, setProfileDraft] = useState(initialData);

  const [paymentDraft, setPaymentDraft] = useState(initialData);

  const [addressDraft, setAddressDraft] = useState({
    building: "",
    road: "",
    province: "",
    district: "",
    subDistrict: "",
    postCode: "",
    country: "",
  });

  /* =========================
     CLICK OUTSIDE
  ========================= */

  useEffect(() => {
    function handleClickOutside(event) {
      /* PROFILE */
      if (
        isEditingProfile &&
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !profileButtonRef.current?.contains(event.target)
      ) {
        setProfileDraft(formData);
        setIsEditingProfile(false);
      }

      /* PAYMENT */
      if (
        isEditingPayment &&
        paymentRef.current &&
        !paymentRef.current.contains(event.target) &&
        !paymentButtonRef.current?.contains(event.target)
      ) {
        setPaymentDraft(formData);
        setIsEditingPayment(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingProfile, isEditingPayment, formData]);

  /* =========================
     PROFILE FIELD
  ========================= */

  const renderProfileField = (label, field, type = "text") => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#4d3a33]">{label}</label>

        {isEditingProfile ? (
          <input
            type={type}
            value={profileDraft[field]}
            onChange={(e) =>
              setProfileDraft((prev) => ({
                ...prev,
                [field]: e.target.value,
              }))
            }
            className="w-full bg-white rounded-full px-4 py-2 border border-[#eee3de] outline-none focus:border-[#9f6453]"
          />
        ) : (
          <div className="w-full bg-white rounded-full px-4 py-2 text-[#878584]">
            {formData[field]}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F1EE] flex flex-col">
      {/* NAVBAR */}
      <NavBar />

      {/* MAIN */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        {/* =========================
            ACCOUNT SECTION
        ========================= */}

        <section className="mb-16">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold text-[#2f1f1b]">
              Account Information
            </h2>

            {!isEditingProfile ? (
              <button
                ref={profileButtonRef}
                onClick={() => {
                  setProfileDraft(formData);

                  setIsEditingProfile(true);
                }}
                className="px-6 py-2 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition"
              >
                Edit Profile
              </button>
            ) : (
              <div ref={profileButtonRef} className="flex gap-3">
                {/* SAVE */}
                <button
                  onClick={() => {
                    setFormData(profileDraft);

                    setIsEditingProfile(false);
                  }}
                  className="px-6 py-2 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition"
                >
                  Save
                </button>

                {/* CANCEL */}
                <button
                  onClick={() => {
                    setProfileDraft(formData);

                    setIsEditingProfile(false);
                  }}
                  className="px-6 py-2 border border-[#b67662] text-[#b67662] rounded-full hover:bg-[#f3e4df] transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* GRID */}
          <div
            ref={profileRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {renderProfileField("First name", "firstName")}

            {renderProfileField("Last name", "lastName")}

            {renderProfileField("Username", "username")}

            {renderProfileField("Date of Birth", "dob", "date")}

            {renderProfileField("Email", "email")}

            {renderProfileField("Phone", "phone")}
          </div>

          {/* =========================
              SHIPPING ADDRESS
          ========================= */}

          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-[#4d3a33]">
                Shipping Address
              </label>

              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="px-5 py-2 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition"
              >
                Edit Address
              </button>
            </div>

            <div className="w-full bg-white rounded-[24px] px-5 py-4 text-[#878584]">
              {formData.address}
            </div>
          </div>

          {/* =========================
              PAYMENT
          ========================= */}

          <div className="mt-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#4d3a33]">Payment Method</h3>

              {!isEditingPayment ? (
                <button
                  ref={paymentButtonRef}
                  onClick={() => {
                    setPaymentDraft(formData);

                    setIsEditingPayment(true);
                  }}
                  className="px-5 py-2 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition"
                >
                  Edit Card
                </button>
              ) : (
                <div ref={paymentButtonRef} className="flex gap-3">
                  {/* SAVE */}
                  <button
                    onClick={() => {
                      setFormData(paymentDraft);

                      setIsEditingPayment(false);
                    }}
                    className="px-5 py-2 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition"
                  >
                    Save
                  </button>

                  {/* CANCEL */}
                  <button
                    onClick={() => {
                      setPaymentDraft(formData);

                      setIsEditingPayment(false);
                    }}
                    className="px-5 py-2 border border-[#b67662] text-[#b67662] rounded-full hover:bg-[#f3e4df] transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* CARD */}
            <div
              ref={paymentRef}
              className="bg-white rounded-[24px] p-6 flex flex-col md:flex-row gap-6 items-start shadow-[0_2px_6px_rgba(0,0,0,0.05)] border border-[#f0e5e0]"
            >
              {/* ICON */}
              <div className="bg-sky-500 p-3 rounded-lg">
                <CreditCard className="text-white" />
              </div>

              {/* CONTENT */}
              <div className="flex-1 grid grid-cols-1 gap-4 w-full">
                {isEditingPayment ? (
                  <>
                    {/* CARDHOLDER */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#4d3a33]">
                        Cardholder Name
                      </label>

                      <input
                        value={paymentDraft.cardholder}
                        onChange={(e) =>
                          setPaymentDraft((prev) => ({
                            ...prev,
                            cardholder: e.target.value,
                          }))
                        }
                        className="border border-[#eee3de] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
                      />
                    </div>

                    {/* CARD NUMBER */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#4d3a33]">
                        Credit/Debit Card Number
                      </label>

                      <input
                        value={paymentDraft.cardNumber}
                        onChange={(e) =>
                          setPaymentDraft((prev) => ({
                            ...prev,
                            cardNumber: e.target.value,
                          }))
                        }
                        className="border border-[#eee3de] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
                      />
                    </div>

                    {/* EXPIRY + CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* EXPIRY */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-[#4d3a33]">
                          Expiration Date
                        </label>

                        <input
                          value={paymentDraft.expiry}
                          onChange={(e) =>
                            setPaymentDraft((prev) => ({
                              ...prev,
                              expiry: e.target.value,
                            }))
                          }
                          className="border border-[#eee3de] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
                        />
                      </div>

                      {/* CVV */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-[#4d3a33]">
                          CVV
                        </label>

                        <input
                          value={paymentDraft.cvv}
                          onChange={(e) =>
                            setPaymentDraft((prev) => ({
                              ...prev,
                              cvv: e.target.value,
                            }))
                          }
                          className="border border-[#eee3de] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#878584]">Cardholder Name</span>

                      <span className="text-[#878584]">
                        {formData.cardholder}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#878584]">
                        Credit/Debit Card Number
                      </span>

                      <span className="text-[#878584]">
                        {formData.cardNumber}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#878584]">Expiration Date</span>

                      <span className="text-[#878584]">{formData.expiry}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#878584]">CVV</span>

                      <span className="text-[#878584]">{formData.cvv}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            CUSTOMER SERVICE
        ========================= */}

        <section>
          <h2 className="text-4xl font-bold text-[#2f1f1b] mb-8">
            Customer Service
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FEEDBACK */}
            <div className="bg-white rounded-[30px] p-10 flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
              <Headphones size={70} />

              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="mt-6 px-6 py-2 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition"
              >
                Send Feedback
              </button>
            </div>

            {/* CALL CENTER */}
            <div className="bg-white rounded-[30px] p-10 flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
              <Phone size={70} />

              <button className="mt-6 px-6 py-2 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition">
                Call center
              </button>
            </div>
          </div>

          {/* LOGOUT */}
          <button className="w-full mt-10 bg-white rounded-full py-4 text-red-500 font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:bg-red-50 transition">
            Log out
          </button>
        </section>
      </main>

      {/* =========================
          ADDRESS MODAL
      ========================= */}

      {isAddressModalOpen && (
        <div
          onClick={() => setIsAddressModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F7] rounded-[36px] w-[82%] max-w-[560px] p-6 md:p-7 relative max-h-[85vh] overflow-y-auto"
          >
            {/* CLOSE */}
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-[#2f1f1b] mb-6">
              Edit your Shipping Address
            </h2>

            {/* FORM */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Building Number/Name, Street Name"
                value={addressDraft.building}
                onChange={(e) =>
                  setAddressDraft((prev) => ({
                    ...prev,
                    building: e.target.value,
                  }))
                }
                className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
              />

              <input
                type="text"
                placeholder="Street/Road Name, Soi, Moo"
                value={addressDraft.road}
                onChange={(e) =>
                  setAddressDraft((prev) => ({
                    ...prev,
                    road: e.target.value,
                  }))
                }
                className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
              />

              <input
                type="text"
                placeholder="Province"
                value={addressDraft.province}
                onChange={(e) =>
                  setAddressDraft((prev) => ({
                    ...prev,
                    province: e.target.value,
                  }))
                }
                className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
              />

              {/* โค้ดแบบ select */}
              {/* <select className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none text-[#878584]">
                <option>Province</option>
              </select> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Khet/Amphur"
                  value={addressDraft.district}
                  onChange={(e) =>
                    setAddressDraft((prev) => ({
                      ...prev,
                      district: e.target.value,
                    }))
                  }
                  className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
                />

                {/* <select className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none text-[#878584]">
                  <option>c</option>
                </select> */}

                <input
                  type="text"
                  placeholder="Khwaeng/Tambon"
                  value={addressDraft.subDistrict}
                  onChange={(e) =>
                    setAddressDraft((prev) => ({
                      ...prev,
                      subDistrict: e.target.value,
                    }))
                  }
                  className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
                />

                {/* <select className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none text-[#878584]">
                  <option>Khwaeng/Tambon</option>
                </select> */}
              </div>

              <input
                type="text"
                placeholder="Post Code"
                value={addressDraft.postCode}
                onChange={(e) =>
                  setAddressDraft((prev) => ({
                    ...prev,
                    postCode: e.target.value,
                  }))
                }
                className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
              />

              <input
                type="text"
                placeholder="Country"
                value={addressDraft.country}
                onChange={(e) =>
                  setAddressDraft((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#9f6453]"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    address: [
                      addressDraft.building,
                      addressDraft.road,
                      addressDraft.province,
                      addressDraft.district,
                      addressDraft.subDistrict,
                      addressDraft.postCode,
                      addressDraft.country,
                    ]
                      .filter(Boolean)
                      .join(", "),
                  }));

                  setIsAddressModalOpen(false);
                }}
                className="px-10 py-2.5 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition"
              >
                Save
              </button>

              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="px-10 py-2.5 border border-[#b67662] text-[#b67662] rounded-full hover:bg-[#f3e4df] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
    FEEDBACK MODAL
========================= */}

      {isFeedbackOpen && (
        <div
          onClick={() => setIsFeedbackOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
        >
          {/* MODAL */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F7] rounded-[36px] w-[82%] max-w-[560px] p-7 relative"
          >
            {/* CLOSE */}
            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-[#2f1f1b] mb-6">
              Write your Feedback
            </h2>

            {/* FORM */}
            <div className="space-y-4">
              {/* USERNAME */}
              <input
                type="text"
                value={formData.username}
                readOnly
                className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 text-sm outline-none bg-[#f5f1ef] text-[#878584] cursor-not-allowed"
              />
              {/* DETAIL */}
              <textarea
                placeholder="please provide the details..."
                value={feedbackData.detail}
                onChange={(e) =>
                  setFeedbackData((prev) => ({
                    ...prev,
                    detail: e.target.value,
                  }))
                }
                rows={7}
                className="w-full border border-[#d9a99a] rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-[#9f6453]"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-center gap-4 mt-8">
              {/* SEND */}
              <button
                onClick={() => {
                  console.log("Feedback:", feedbackData);

                  setIsFeedbackOpen(false);

                  setFeedbackData({
                    name: "",
                    detail: "",
                  });
                }}
                className="px-10 py-2.5 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition"
              >
                Send Feedback
              </button>

              {/* CANCEL */}
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="px-10 py-2.5 border border-[#b67662] text-[#b67662] rounded-full hover:bg-[#f3e4df] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
