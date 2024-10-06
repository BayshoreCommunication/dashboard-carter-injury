import { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import OTPInput from "react-otp-input";
import Button from "../../ui/Button";
import usePostData from "@/hooks/usePostData";
import useSignout from "@/hooks/useSignout";
import { Spinner } from "@/components/Loading/Spinner";

function OtpForm({ setFieldValue, values, setShowOtpField }) {
  const otpTimeLimit = 5 * 60;
  const maxOtpLength = 6;

  // console.log("values", values.otp.length);

  const otpValueLength = values.otp.length;

  const [seconds, setSeconds] = useState(otpTimeLimit);

  const { signout } = useSignout();

  const { mutate, isPending } = usePostData({
    path: "/user/otp/checkandsetpass",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  // const formatTime = (time) => {
  //   const minutes = Math.floor(time / 60);
  //   const remainingSeconds = time % 60;
  //   return `${String(minutes).padStart(2, "0")}:${String(
  //     remainingSeconds
  //   ).padStart(2, "0")}`;
  // };

  // const timeLeft = formatTime(seconds);

  const handleOtpChange = (otp) => {
    setFieldValue("otp", otp);
  };

  const handleOtpSubmit = () => {
    // console.log("values", values);
    mutate(values, {
      onSuccess: () => {
        signout();
        setShowOtpField(false);
      },
    });
  };

  return (
    <div>
      <div className=" flex flex-col items-center font-manrope">
        <h1 className="text-4xl font-medium">OTP Verification</h1>
        <p className="mt-[10px] text-custom-gray4">
          We have send an OTP to your email
        </p>
      </div>

      <div className="mt-[48px] w-full">
        <OTPInput
          value={values.otp}
          onChange={(otp) => handleOtpChange(otp)}
          numInputs={maxOtpLength}
          inputStyle="!w-10 h-10 selection:bg-gray-200 border-b-2 border-gray-600 focus:border-black outline-none"
          containerStyle="flex justify-between mt-2"
          shouldAutoFocus
          renderInput={(props) => <input {...props} />}
        />

        <div className="mt-9 flex justify-center">
          <Button
            type="button"
            className="w-[90%] py-3 rounded-md relative"
            disabled={otpValueLength < maxOtpLength || isPending}
            onClick={handleOtpSubmit}
          >
            {isPending && (
              <span className="absolute left-20">
                <Spinner />
              </span>
            )}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OtpForm;
