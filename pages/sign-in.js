import Image from "next/image";
import { Form, Formik } from "formik";
import useSignin from "@/hooks/useSignin";
import useGetDataPublic from "@/hooks/useGetDataPublic";
import PageWrapper from "@/components/Layout/PageWrapper";
import { EmailField } from "@/components/FormFields/EmailField";
import { PasswordField } from "@/components/FormFields/PasswordField";
import { CheckboxField } from "@/components/FormFields/CheckboxField";
import { Spinner } from "@/components/Loading/Spinner";
import Button from "@/components/ui/Button";

function SigninPage() {
  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const { data, isPending } = useGetDataPublic({
    path: "/user/public/logo",
  });

  const logo = data?.success?.logo;

  const { signin } = useSignin();

  // console.log("data", logo);

  const handleSubmit = async (values) => {
    // console.log(values);
    await signin(values);
  };

  return (
    <PageWrapper title="Sign in" description="sign in">
      <div className="min-h-screen flex bg-custom-gray3">
        <div className="flex-1 flex relative">
          <div className="flex items-center w-[70%] justify-center z-10 text-5xl font-bold bg-white text-black">
            <div className="ml-[20%] relative w-[340px] h-[340px]">
              {logo && (
                <Image
                  src={logo}
                  alt="company logo"
                  sizes="400px"
                  priority
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          <div className="absolute inset-y-0 right-[15%] w-[30%] bg-white -skew-x-[16deg]"></div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="w-[400px] h-[536px] 2xl:w-[473px] 2xl:h-[616px] px-10 bg-white rounded-2xl shadow-lg">
                <div className="pt-[68px] flex flex-col items-center font-manrope">
                  <h1 className="text-2xl font-bold">Welcome Back !</h1>
                  <p className="text-custom-red">Sign in to continue</p>
                </div>

                <div className="mt-[54px] w-full">
                  <div className="space-y-9">
                    <EmailField placeholder="Email" name="email" required />
                    <PasswordField
                      placeholder="Password"
                      name="password"
                      required
                    />
                  </div>

                  <div className="mt-9">
                    <div className="mb-3.5">
                      <CheckboxField label="Remember me" name="rememberMe" />
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-3 rounded-md relative"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <span className="absolute left-24 2xl:left-32">
                          <Spinner />
                        </span>
                      )}
                      Log in
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </PageWrapper>
  );
}

export default SigninPage;
