import bgLogin from "../assets/BgLoginAndRegiter/bglogin.jpg";
import NavBar from "../components/HomeComponents/NavBar";
import Footer from "../components/HomeComponents/Footer";
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

function FormField({ label, type = "text", placeholder, rightLabel }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-4 text-[18px] text-[#231815]">
        <span>{label}</span>
        {rightLabel ? (
          <button
            type="button"
            className="text-sm text-[#b0705a] transition hover:text-[#955440]"
          >
            {rightLabel}
          </button>
        ) : null}
      </span>
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

export default function Login() {
  return (
    <div className="min-h-screen bg-[#eee1db] text-[#231815]">
      <NavBar />

      <main className="relative mx-auto max-w-[1260px] px-0 py-0 md:px-4 md:py-10 lg:px-8 lg:py-9">
        <section className="relative overflow-hidden bg-[#f7efea] md:rounded-[42px] md:shadow-[0_0_0_1px_rgba(166,104,88,0.08)]">
          <img
            src={bgLogin}
            alt="A textured reading backdrop"
            className="absolute inset-0 h-full w-full object-cover md:hidden"
          />
          <div className="absolute inset-0 bg-[#f5ece6]/45 md:hidden" />

          <div className="grid min-h-screen md:min-h-[540px] md:grid-cols-[0.95fr_1.45fr]">
            <div className="relative hidden min-h-[280px] overflow-hidden md:block">
              <img
                src={bgLogin}
                alt="A textured reading backdrop"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#f5ece6]/35" />
              <div className="relative flex h-full flex-col justify-between p-8 sm:p-10 lg:p-12">
                <div className="max-w-[330px] space-y-4">
                  <h2 className="text-[34px] font-semibold leading-none">
                    Readly
                  </h2>
                  <p className="text-[24px] font-semibold leading-tight">
                    "The more that you read, the more things you will know. The
                    more that you learn, the more places you&apos;ll go."
                  </p>
                  <p className="text-[20px] font-semibold sm:text-[24px]">
                    — Dr. Seuss
                  </p>
                </div>

                <div className="max-w-[330px] text-lg leading-relaxed">
                  <p className="font-semibold">
                    Discover your next favorite story.
                  </p>
                  <p>
                    Join our community of avid readers and digital curators.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center px-5 py-14 sm:px-8 md:bg-white md:p-10 lg:p-12">
              <div className="w-full max-w-[480px] rounded-[34px] bg-[#fbf5f1] px-6 py-8 shadow-[0_18px_40px_rgba(100,69,55,0.08)] sm:px-8 md:rounded-none md:bg-transparent md:px-0 md:py-0 md:shadow-none">
                <h1 className="text-center text-[34px] leading-none sm:text-[44px]">
                  Welcome Back
                </h1>
                <p className="mx-auto mt-4 max-w-[360px] text-center text-[18px] text-[#3f322d]">
                  Please enter your details to access your library.
                </p>

                <form
                  className="mx-auto mt-8 max-w-[380px] space-y-6 sm:mt-10 sm:space-y-7"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <FormField
                    label="Email"
                    type="email"
                    placeholder="e.g. reader@example.com"
                  />
                  <FormField
                    label="Password"
                    type="password"
                    placeholder="************"
                    rightLabel="Forgot Password?"
                  />

                  <div className="flex justify-center">
                    {/* เดิมจะเป็น <button type="submit" className="...">Sign In</button> */}
                    {/* ตอนนี้ใช้ shadcn <Button /> แล้วคุมสี/ทรงของปุ่มด้วย className */}
                    <Link to="/">
                      <Button
                        type="submit"
                        className="h-auto rounded-full bg-[#b0705a] px-12 py-3 text-base text-white hover:bg-[#9c604c]"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </form>

                <div className="mx-auto mt-8 max-w-[380px] space-y-5">
                  <div className="flex items-center gap-4 text-sm text-[#231815]">
                    <div className="h-px flex-1 bg-[#40332d]" />
                    <span>Or continue with</span>
                    <div className="h-px flex-1 bg-[#40332d]" />
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <SocialButton>
                      <span>G</span>
                      <span>Google</span>
                    </SocialButton>
                  </div>
                </div>

                <p className="mt-8 text-center text-[17px] text-[#231815]">
                  New to this website?{" "}
                  <Link to="/register">
                    <button className="font-medium text-[#b0705a]">
                      Create an account
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
