import { useState } from "react";
import { Form, Formik } from "formik";
import usePostData from "@/hooks/usePostData";
import Button from "@/components/ui/Button";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import OtpForm from "./OtpForm";
import { PasswordField2 } from "../../FormFields/PasswordField";

function PasswordChange() {
  const [isSelected, setIsSelected] = useState(false);

  const [showOtpField, setShowOtpField] = useState(false);

  const initialValues = {
    password: "",
    otp: "",
  };

  const { mutate, isPending } = usePostData({
    path: "/user/otp/once",
  });

  const handlePassword = () => {
    // console.log("post to backend");
    mutate(
      {},
      {
        onSuccess: () => {
          setShowOtpField(true);
        },
      }
    );
  };

  return (
    <div>
      <Formik initialValues={initialValues}>
        {({ isSubmitting, resetForm, setFieldValue, values }) => (
          <Form>
            <label htmlFor="">Password</label>
            <div className="flex w-full items-center gap-5">
              {isSelected ? (
                <PasswordField2
                  name="password"
                  autoFocus={isSelected}
                  autoComplete="off"
                  required
                />
              ) : (
                <p className="pl-0.5 pt-1 font-bold text-gray-400 text-2xl w-full">
                  {`********`}
                </p>
              )}
              {!isSelected ? (
                <Button
                  type="button"
                  className="w-[250px]"
                  onClick={() => setIsSelected(true)}
                >
                  Change Password
                </Button>
              ) : (
                <div className="flex items-center gap-5">
                  <Button
                    type="button"
                    className="w-[100px]"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => {
                      setIsSelected(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    className="w-[100px]"
                    onClick={handlePassword}
                    disabled={isPending || !values.password}
                  >
                    Save
                  </Button>

                  <AlertDialog
                    open={showOtpField}
                    onOpenChange={setShowOtpField}
                  >
                    <AlertDialogContent className="w-[473px] px-[70px] pt-[33px] pb-[52px] bg-white rounded-2xl shadow-lg">
                      <OtpForm
                        setFieldValue={setFieldValue}
                        values={values}
                        setShowOtpField={setShowOtpField}
                      />
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PasswordChange;

// import { useState } from "react";
// import { Form, Formik } from "formik";
// import { InputField2 } from "../Fields/InputField";
// import Button from "@/components/ui/Button";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
// import usePostData from "@/hooks/usePostData";
// import OtpForm from "../OtpForm";

// function PasswordChange() {
//   const [isSelected, setIsSelected] = useState(false);

//   const initialValues = {
//     password: "",
//     otp: "",
//   };

//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1);

// const { mutate, isPending } = usePostData({
//   path: "/user/otp/once",
// });
// const { mutate: mutateOtp, otpPending } = usePostData({
//   path: "/user/otp/check",
// });

//   // const handleSubmit = (values) => {
//   //   console.log("values", values);
//   //   // mutate(
//   //   //   {},
//   //   //   {
//   //   //     onSuccess: () => {
//   //   //       setShowModal(true);
//   //   //     },
//   //   //   }
//   //   // );
//   // };

//   // const handlePasswordStep = () => {
//   //   mutate(
//   //     {},
//   //     {
//   //       onSuccess: () => {
//   //         setShowModal(true);
//   //       },
//   //     }
//   //   );
//   // };

//   const handleSendOtp = () => {
//     setStep(2);
//     // mutate(
//     //   {},
//     //   {
//     //     onSuccess: () => {
//     //       setStep(2);
//     //     },
//     //   }
//     // );
//   };

//   const handleSubmit = (values) => {
//     if (step === 2) {
//       const otpValue = {
//         otp: values.otp,
//       };

//       console.log("otp", otp);

//       setStep(3);
//     }

//     if (step === 3) {
//       const passwordValues = {
//         otp: values.otp,
//         password: values.password,
//       };

//       console.log("passwordValues", passwordValues);

//       setShowModal(false);
//     }
//   };

//   return (
//     <div>
//       {/* <Formik
//         initialValues={initialValues}
//         // validationSchema={validate}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting, resetForm }) => (
//           <Form>
//             <label htmlFor="">Password</label>
//             <div className="flex w-full items-center gap-5">
//               {isSelected ? (
//                 <InputField2
//                   name="password"
//                   type="password"
//                   required
//                   autoFocus={isSelected}
//                   autoComplete="off"
//                 />
//               ) : (
//                 <p className="pl-0.5 pt-1 font-bold text-gray-400 text-2xl w-full">
//                   {`********`}
//                 </p>
//               )}
//               {!isSelected ? (
//                 <Button
//                   type="button"
//                   className="w-[250px]"
//                   onClick={() => setIsSelected(true)}
//                 >
//                   Change Password
//                 </Button>
//               ) : (
//                 <div className="flex items-center gap-5">
//                   <Button
//                     type="button"
//                     className="w-[100px]"
//                     variant="outline"
//                     onClick={() => {
//                       setIsSelected(false);
//                       resetForm();
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="button"
//                     className="w-[140px]"
//                     onClick={handlePasswordStep}
//                   >
//                     Next Step

//                   </Button>
//                 </div>
//               )}
//             </div>

//             <AlertDialog open={showModal} onOpenChange={setShowModal}>
//               <AlertDialogContent>
//                 <OtpForm />
//               </AlertDialogContent>
//             </AlertDialog>
//           </Form>
//         )}
//       </Formik> */}

//       <div>
//         <p>Password</p>
//         <div className="flex w-full items-center gap-5">
//           <p className="pl-0.5 pt-1 font-bold text-gray-400 text-2xl w-full">
//             {`********`}
//           </p>

//           <AlertDialog open={showModal} onOpenChange={setShowModal}>
//             <AlertDialogTrigger asChild>
//               <Button
//                 type="button"
//                 className="w-[250px]"
//                 onClick={() => setIsSelected(true)}
//               >
//                 Change Password
//               </Button>
//             </AlertDialogTrigger>

//             <AlertDialogContent className="w-[520px] rounded-lg bg-white p-8">
//            <Formik
//         initialValues={initialValues}
//         // validationSchema={validate}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting, resetForm }) => (
//           <Form>

//           </Form>

//           )}
//           </Formik>
//               {step === 1 && (
//                 <>
//                   <p className="text-center text-xl font-semibold">
//                     An OTP will be sent to your email
//                   </p>
//                   <p className="text-center">
//                     To change your password, you need to verify the OTP that
//                     will be sent to your email address: email@example.com
//                   </p>
//                   <div className="mt-5 flex justify-center items-center gap-5">
//                     <AlertDialogCancel asChild>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         className="w-[150px]"
//                       >
//                         Cancel
//                       </Button>
//                     </AlertDialogCancel>
//                     <Button
//                       type="button"
//                       className="w-[150px]"
//                       onClick={handleSendOtp}
//                     >
//                       Send OTP
//                     </Button>
//                   </div>
//                 </>
//               )}

//               {step === 2 && <OtpForm />}
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PasswordChange;
