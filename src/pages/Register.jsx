import NavBar from "@/components/HomeComponents/NavBar";
import bgRegister from "../assets/BgLoginAndRegiter/bgRegiter.jpg";
import Footer from "@/components/HomeComponents/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

function SocialButton({ children }) {
  return (
    // เดิมจะเขียนเป็น <button className="...">...</button>
    // ตอนนี้เปลี่ยนมาใช้ shadcn <Button /> แล้วค่อย override className เพิ่ม
    <Button
      type="button"
      variant="outline"
      className="min-w-[118px] rounded-full border-[#ead7ce] bg-white px-5 py-3 text-sm text-[#231815] shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-[#fffaf7]"
    >
      {children}
    </Button>
  );
}

function FormField({ label, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[18px] text-[#231815]">{label}</span>
      {/* เดิมจะเป็น <input type={type} className="..." /> */}
      {/* ตอนนี้ใช้ shadcn <Input /> เพื่อได้ style base + focus state มาตรฐาน แล้วค่อยปรับ class เพิ่ม */}
      <Input
        type={type}
        placeholder={placeholder}
        className="h-12 rounded-full border-[#dcc8bf] bg-white px-6 text-sm text-[#3f322d] placeholder:text-[#cfbeb5] focus-visible:border-[#b57a63] focus-visible:ring-2 focus-visible:ring-[#e6c2b2]"
      />
    </label>
  );
}

export default function Register() {
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
                  onSubmit={(event) => event.preventDefault()}
                >
                  <FormField
                    label="Full Name"
                    placeholder="E.g., Julian Barnes"
                  />
                  <FormField
                    label="Email Address"
                    type="email"
                    placeholder="julian@readly.com"
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      label="Password"
                      type="password"
                      placeholder="************"
                    />
                    <FormField
                      label="Confirm Password"
                      type="password"
                      placeholder="************"
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    {/* เดิมจะเป็น <button type="submit" className="...">Create Account</button> */}
                    {/* ตอนนี้ใช้ shadcn <Button /> แล้วคุมสี/ทรงของปุ่มด้วย className */}
                    <Button
                      type="submit"
                      className="h-auto rounded-full bg-[#b0705a] px-8 py-3 text-base text-white hover:bg-[#9c604c]"
                    >
                      Create Account
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
