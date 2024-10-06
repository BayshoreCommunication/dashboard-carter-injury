import ColorChange from "./ColorChange";
import LogoChange from "./LogoChange";
import NameChange from "./NameChange";

function CompanyDetails({ logo, name, color }) {
  return (
    <div className="p-7 space-y-4 rounded-lg bg-custom-gray5">
      <LogoChange logo={logo} />
      <NameChange name={name} />
      <div className="w-full border border-gray-300" />
      <ColorChange color={color} />
    </div>
  );
}

export default CompanyDetails;
