import { useState, useRef, useEffect } from "react";

import { Phone, Headphones, CreditCard, Lock, Eye, EyeOff } from "lucide-react";

import NavBar from "../components/HomeComponents/NavBar";
import Footer from "../components/HomeComponents/Footer";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  /* =========================
     STATES
  ========================= */
  const { logout, isLoading } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [isEditingPayment, setIsEditingPayment] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const [feedbackData, setFeedbackData] = useState({
    name: "",
    detail: "",
  });

  const resetPasswordModal = () => {
    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });

    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setIsPasswordModalOpen(false);
  };

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* =========================
     REFS --> manage click outside for profile, payment, and modals
  ========================= */

  const profileRef = useRef(null);
  const paymentRef = useRef(null);
  const modalRef = useRef(null);
  const paymentButtonRef = useRef(null);
  const profileButtonRef = useRef(null);
  const navigate = useNavigate();
  /* =========================
     Initial DATA
  ========================= */

  const emptyData = {
    fullName: "",
    username: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  };

  // แสดงข้อมูลบนหน้า settings โดยใช้ formData เป็นตัวเก็บข้อมูลหลัก
  // และ profileDraft กับ paymentDraft เป็นตัวเก็บข้อมูลชั่วคราวเมื่อแก้ไข
  const [formData, setFormData] = useState(emptyData);

  const [profileDraft, setProfileDraft] = useState(emptyData);

  const [paymentDraft, setPaymentDraft] = useState(emptyData);

  const [addressDraft, setAddressDraft] = useState({
    building: "",
    road: "",
    province: "",
    district: "",
    subDistrict: "",
    postCode: "",
    country: "",
  });

  const [profile, setProfile] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile) return;

    const updatedData = {
      fullName: profile.fullName || "",
      username: profile.username || "",
      dob: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address
        ? [
            profile.address.building,
            profile.address.road,
            profile.address.district,
            profile.address.province,
            profile.address.postcode,
            profile.address.country,
          ]
            .filter(Boolean)
            .join(", ")
        : "",
      cardholder: profile.card?.cardholder || "",
      cardNumber: profile.card?.cardNumber || "",
      expiry: profile.card?.expiry || "",
      cvv: profile.card?.cvv || "",
    };

    setFormData(updatedData);
    setProfileDraft(updatedData);
    setPaymentDraft(updatedData);
    setAddressDraft({
      building: profile.address?.building || "",
      road: profile.address?.road || "",
      province: profile.address?.province || "",
      district: profile.address?.district || "",
      subDistrict: profile.address?.subdistrict || "",
      postCode: profile.address?.postcode || "",
      country: profile.address?.country || "",
    });
  }, [profile]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  /* =========================
     PROFILE FIELD
  ========================= */

  const renderProfileField = (label, field, type = "text") => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-[#4d3a33]">{label}</label>

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
            {formData[field] || "-"}
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
                  onClick={async () => {
                    const response = await fetch(`${API_BASE_URL}/users/me`, {
                      method: "PATCH",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        fullName: profileDraft.fullName,
                        username: profileDraft.username,
                        email: profileDraft.email,
                        phone: profileDraft.phone,
                        dateOfBirth: profileDraft.dob,
                      }),
                    });

                    const result = await response.json();

                    if (!response.ok) {
                      alert(result.error || result.message || "Update failed");
                      return;
                    }
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
            className="text-sm grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {renderProfileField("Full Name", "fullName")}

            {renderProfileField("Username", "username")}

            {renderProfileField("Date of Birth", "dob", "date")}

            {renderProfileField("Email", "email")}

            {renderProfileField("Phone", "phone")}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#4d3a33]">
                Password
              </label>

              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full bg-white rounded-full px-4 py-2 border border-[#eee3de] text-[#b67662] hover:bg-[#f3e4df] transition text-center font-bold"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* =========================
              SHIPPING ADDRESS
          ========================= */}

          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xl font-bold text-[#4d3a33]">
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
              <h3 className="text-xl font-bold text-[#4d3a33]">
                Payment Method
              </h3>

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
                    onClick={async () => {
                      if (
                        paymentDraft.cvv &&
                        !/^\d{3}$/.test(paymentDraft.cvv)
                      ) {
                        alert("CVV must be exactly 3 digits");
                        return;
                      }
                      const response = await fetch(`${API_BASE_URL}/users/me`, {
                        method: "PATCH",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          card: {
                            cardholder: paymentDraft.cardholder,
                            cardNumber: paymentDraft.cardNumber,
                            expiry: paymentDraft.expiry,
                            cvv: paymentDraft.cvv,
                          },
                        }),
                      });

                      const result = await response.json();

                      if (!response.ok) {
                        alert(result.error || "Update card failed");
                        return;
                      }

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
                        {formData.cardholder || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#878584]">
                        Credit/Debit Card Number
                      </span>

                      <span className="text-[#878584]">
                        {formData.cardNumber || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#878584]">Expiration Date</span>

                      <span className="text-[#878584]">
                        {formData.expiry || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#878584]">CVV</span>

                      <span className="text-[#878584]">
                        {formData.cvv ? "xxx" : "-"}
                      </span>
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
          <h2 className="text-xl font-bold text-[#2f1f1b] mb-8">
            Customer Service
          </h2>

          <div className="flex justify-center">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
            {/* FEEDBACK */}
            <div className="bg-white rounded-[30px] w-[560px] p-10 flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
              <Headphones size={70} />

              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="mt-6 px-6 py-2 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition"
              >
                Send Feedback
              </button>
            </div>

            {/* CALL CENTER */}
            {/* <div className="bg-white rounded-[30px] p-10 flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
              <Phone size={70} />

              <button className="mt-6 px-6 py-2 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453] transition">
                Call center
              </button>
            </div> */}
          </div>

          {/* LOGOUT */}
          <button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="w-full mt-10 bg-white rounded-full py-4 text-red-500 font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:bg-red-50 transition"
          >
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
                onClick={async () => {
                  const response = await fetch(`${API_BASE_URL}/users/me`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      address: {
                        building: addressDraft.building,
                        road: addressDraft.road,
                        province: addressDraft.province,
                        district: addressDraft.district,
                        subdistrict: addressDraft.subDistrict,
                        postcode: addressDraft.postCode,
                        country: addressDraft.country,
                      },
                    }),
                  });

                  const result = await response.json();

                  if (!response.ok) {
                    alert(result.error || "Update address failed");
                    return;
                  }

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
                onClick={async () => {
                  if (!feedbackData.detail.trim()) {
                    alert("Please enter feedback");
                    return;
                  }

                  const response = await fetch(`${API_BASE_URL}/feedback`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      message: feedbackData.detail,
                    }),
                  });

                  const result = await response.json();

                  console.log("STATUS =", response.status);
                  console.log("RESULT =", result);

                  if (!response.ok) {
                    alert(
                      result.error || result.message || "Send feedback failed",
                    );
                    return;
                  }

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

      {/* =========================
    PASSWORD MODAL
========================= */}

      {isPasswordModalOpen && (
        <div
          onClick={() => setIsPasswordModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F7] rounded-[36px] w-[82%] max-w-[560px] p-7 relative"
          >
            {/* CLOSE */}
            <button
              onClick={resetPasswordModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            {/* TITLE */}
            <div className="flex items-center gap-3 mb-6">
              <Lock size={28} />
              <h2 className="text-2xl font-bold text-[#2f1f1b]">
                Change Password
              </h2>
            </div>

            {/* FORM */}
            <div className="relative gap-4 mb-4">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full border border-[#d9a99a] rounded-xl px-4 py-2 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={async () => {
                  if (
                    passwordData.newPassword !== passwordData.confirmPassword
                  ) {
                    alert("Passwords do not match");
                    return;
                  }

                  if (passwordData.newPassword.length < 8) {
                    alert("Password must be at least 8 characters");
                    return;
                  }

                  const response = await fetch(`${API_BASE_URL}/users/me`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      password: passwordData.newPassword,
                    }),
                  });

                  const result = await response.json();

                  if (!response.ok) {
                    alert(result.error || "Update password failed");
                    return;
                  }

                  setPasswordData({
                    newPassword: "",
                    confirmPassword: "",
                  });

                  resetPasswordModal();
                }}
                className="px-10 py-2.5 bg-[#b67662] text-white rounded-full hover:bg-[#9f6453]"
              >
                Save
              </button>

              <button
                onClick={resetPasswordModal}
                className="px-10 py-2.5 border border-[#b67662] text-[#b67662] rounded-full hover:bg-[#f3e4df]"
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
