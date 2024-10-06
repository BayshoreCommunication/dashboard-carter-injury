import EmailChange from "./EmailChange";
import PasswordChange from "./PasswordChange";

function AccountSettings({ currentEmail }) {
  return (
    <div className="p-7 space-y-4 rounded-lg bg-custom-gray5">
      <EmailChange currentEmail={currentEmail} />
      <div className="w-full border border-gray-300" />
      <PasswordChange />
    </div>
  );
}

export default AccountSettings;
