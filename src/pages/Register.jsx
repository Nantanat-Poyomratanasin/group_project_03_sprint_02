import { useState } from "react";

import NavBar from "@/components/HomeComponents/NavBar";
import bgRegister from "../assets/BgLoginAndRegiter/bgRegiter.jpg";
import Footer from "@/components/HomeComponents/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

// ตอนพัฒนา local ตอนนี้ backend ฝั่ง group ใช้ base URL นี้อยู่
const API_BASE_URL =
  "https://group-project-03-sprint-03-backend-1.onrender.com/api";

function validateRegisterForm(formData) {
  // errors จะเก็บข้อความ error ของแต่ละ field
  const errors = {};
  // trim() เอา space หน้า-หลังออกก่อน validate
  const trimmedUsername = formData.username.trim();
  const trimmedFullName = formData.fullName.trim();
  const trimmedEmail = formData.email.trim();

  // username ต้องตรงกับเงื่อนไข backend: required, min 3, max 20
  if (!trimmedUsername) {
    errors.username = "Username is required";
  } else if (trimmedUsername.length < 3) {
    errors.username = "Username must be at least 3 characters";
  } else if (trimmedUsername.length > 20) {
    errors.username = "Username must be at most 20 characters";
  }

  // fullName เป็น field บังคับจาก backend เช่นกัน
  if (!trimmedFullName) {
    errors.fullName = "Full name is required";
  }

  // regex นี้ใช้เช็กรูปแบบ email ขั้นพื้นฐานก่อนส่งไป backend
  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address";
  }

  // password ฝั่ง backend ต้องอย่างน้อย 8 และไม่เกิน 72
  if (!formData.password.trim()) {
    errors.password = "Password is required";
  } else if (formData.password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (formData.password.trim().length > 72) {
    errors.password = "Password must be at most 72 characters";
  }

  // confirmPassword มีไว้เช็กความถูกต้องฝั่ง UI ก่อนยิง API
  if (!formData.confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

function SocialButton({ children }) {
  return (
    // SocialButton คือ "ปุ่มแม่แบบ" สำหรับปุ่มสมัคร/เข้าสู่ระบบด้วย social account
    // เช่น Google หรือ Apple เพื่อให้เราไม่ต้องเขียน class ซ้ำทุกครั้ง
    // ใช้ shadcn <Button /> แล้วค่อย override className เพิ่ม
    <Button
      type="button"
      variant="outline"
      className="min-w-[118px] rounded-full border-[#ead7ce] bg-white px-5 py-3 text-sm text-[#231815] shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-[#fffaf7]"
    >
      {children}
    </Button>
  );
}

function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[18px] text-[#231815]">{label}</span>
      {/* เดิมจะเป็น <input type={type} className="..." /> */}
      {/* ตอนนี้ใช้ shadcn <Input /> เพื่อได้ style base + focus state มาตรฐาน แล้วค่อยปรับ class เพิ่ม */}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-12 rounded-full bg-white px-6 text-sm text-[#3f322d] placeholder:text-[#cfbeb5] focus-visible:border-[#b57a63] focus-visible:ring-2 focus-visible:ring-[#e6c2b2] ${
          error ? "border-[#d15b52]" : "border-[#dcc8bf]"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#d15b52]">
          {error}
        </p>
      ) : null}
    </label>
  );
}

export default function Register() {
  // formData รวมค่าทั้งหมดของฟอร์มไว้ใน object เดียว
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // state ชุดนี้ควบคุมการเปิด/ปิดการมองเห็น password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // errors = error ของแต่ละช่อง, serverError = error ที่ backend ส่งกลับมา
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const updateField = (fieldName) => (event) => {
    // ใช้ function เดียวอัปเดตได้หลาย input โดยส่งชื่อ field เข้ามา
    setFormData((currentValue) => ({
      ...currentValue,
      [fieldName]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ดักข้อมูลก่อน submit ให้คล้าย pattern ใน react-form-validation-example
    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);
    setSuccessMessage("");
    setServerError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // เมื่อไม่มี error ค่อยเริ่มส่งข้อมูลไป backend
    setIsSubmitting(true);

    try {
      // ส่งเฉพาะ field ที่ backend ของ route POST /api/users ต้องใช้
      const payload = {
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // อ่าน response body กลับจาก backend
      const result = await response.json();

      if (!response.ok) {
        // ถ้า backend ตอบไม่ผ่าน เช่น email ซ้ำ จะโยนเข้า catch
        throw new Error(result.message || "Failed to create account");
      }

      // สมัครสำเร็จ แสดงข้อความและล้างค่าฟอร์ม
      setSuccessMessage("Account created successfully");

      setFormData({
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // สมัครสำเร็จแล้วพาไปหน้า login เพื่อให้ user เข้าสู่ระบบต่อได้ทันที
      window.setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      // ข้อความ error จาก backend จะมาแสดงในหน้า form ตรงนี้
      setServerError(error.message || "Something went wrong");
    } finally {
      // finally จะทำงานเสมอ ไม่ว่าจะ success หรือ error
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eee1db] text-[#231815]">
      <NavBar />

      <main className="relative mx-auto max-w-[1260px] px-0 py-0 md:px-4 md:py-10 lg:px-8 lg:py-9">
        <section className="relative overflow-hidden bg-[#f7efea] md:rounded-[42px] md:shadow-[0_0_0_1px_rgba(166,104,88,0.08)]">
          <img
            src={bgRegister}
            alt="A warm paper texture"
            className="absolute inset-0 h-full w-full object-cover md:hidden"
          />
          <div className="absolute inset-0 bg-[#f5ece6]/45 md:hidden" />

          <div className="grid min-h-screen md:min-h-[540px] md:grid-cols-[0.95fr_1.45fr]">
            <div className="relative hidden min-h-[280px] overflow-hidden md:block">
              <img
                src={bgRegister}
                alt="A warm paper texture"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#f5ece6]/35" />
              <div className="relative flex h-full p-8 sm:p-10 lg:p-12">
                <div className="max-w-[360px] self-center">
                  <p className="text-[24px] font-semibold leading-tight sm:text-[32px]">
                    "A reader lives a thousand lives before he dies. The man who
                    never reads lives only one."
                  </p>
                  <p className="mt-5 text-[20px] font-semibold sm:text-[24px]">
                    — George R.R. Martin
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center px-5 py-14 sm:px-8 md:bg-white md:p-10 lg:p-12">
              <div className="w-full max-w-[480px] rounded-[34px] bg-[#fbf5f1] px-6 py-8 shadow-[0_18px_40px_rgba(100,69,55,0.08)] sm:px-8 md:rounded-none md:bg-transparent md:px-0 md:py-0 md:shadow-none">
                <h1 className="text-center text-[32px] leading-tight sm:text-[34px] md:text-left">
                  Create your account
                </h1>
                <p className="mx-auto mt-3 max-w-[320px] text-center text-[18px] text-[#3f322d] md:mx-0 md:text-left">
                  Join our global community of passionate readers.
                </p>

                <form
                  className="mt-8 space-y-6 sm:mt-10"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <FormField
                    id="register-username"
                    label="Username"
                    value={formData.username}
                    onChange={updateField("username")}
                    placeholder="Julian"
                    error={errors.username}
                  />
                  <FormField
                    id="register-full-name"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={updateField("fullName")}
                    placeholder="E.g., Julian Barnes"
                    error={errors.fullName}
                  />
                  <FormField
                    id="register-email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={updateField("email")}
                    placeholder="julian@readly.com"
                    error={errors.email}
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <FormField
                        id="register-password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={updateField("password")}
                        placeholder="************"
                        error={errors.password}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((currentValue) => !currentValue)
                        }
                        className="mt-2 text-sm text-[#b0705a] transition hover:text-[#955440]"
                      >
                        {showPassword ? "Hide Password" : "Show Password"}
                      </button>
                    </div>

                    <div>
                      <FormField
                        id="register-confirm-password"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={updateField("confirmPassword")}
                        placeholder="************"
                        error={errors.confirmPassword}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (currentValue) => !currentValue,
                          )
                        }
                        className="mt-2 text-sm text-[#b0705a] transition hover:text-[#955440]"
                      >
                        {showConfirmPassword
                          ? "Hide Password"
                          : "Show Password"}
                      </button>
                    </div>
                  </div>

                  {serverError ? (
                    <p className="text-center text-sm text-[#d15b52] md:text-left">
                      {serverError}
                    </p>
                  ) : null}

                  {successMessage ? (
                    <p className="text-center text-sm text-[#2f6f52] md:text-left">
                      {successMessage}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-center">
                    {/* เดิมจะเป็น <button type="submit" className="...">Create Account</button> */}
                    {/* ตอนนี้ใช้ shadcn <Button /> แล้วคุมสี/ทรงของปุ่มด้วย className */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-auto rounded-full bg-[#b0705a] px-8 py-3 text-base text-white hover:bg-[#9c604c]"
                    >
                      {isSubmitting ? "Creating..." : "Create Account"}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 space-y-5">
                  <div className="flex items-center gap-4 text-sm text-[#231815]">
                    <div className="h-px flex-1 bg-[#40332d]" />
                    <span>Or sign up with</span>
                    <div className="h-px flex-1 bg-[#40332d]" />
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {/* เรียกใช้ SocialButton เพื่อแสดงปุ่มสมัครด้วย Google ในหน้า Register */}
                    <SocialButton>
                      <span>G</span>
                      <span>Google</span>
                    </SocialButton>
                  </div>
                </div>

                <p className="mt-8 text-center text-[17px] text-[#231815] md:text-left">
                  Already have an account?{" "}
                  <Link to="/login">
                    <button className="font-medium text-[#b0705a]">
                      Sign In
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
