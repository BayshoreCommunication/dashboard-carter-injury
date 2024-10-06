import { useFormikContext } from "formik";
import useToggle from "@/hooks/useToggle";

import { HexColorPicker, HexColorInput } from "react-colorful";

function ColorPickerField({ name }) {
  const { values, setFieldValue } = useFormikContext();

  const {
    node,
    toggle: showColorPicker,
    setToggle: setShowColorPicker,
  } = useToggle();

  const handleColorChange = (value) => {
    setFieldValue(name, value);
  };

  const colorValue = values?.[name];

  return (
    <div ref={node} className="inline relative">
      <div className="inline-flex items-center gap-3 p-2 rounded-md border border-gray-500">
        <button
          type="button"
          className={`size-6 rounded-full`}
          style={{ backgroundColor: colorValue }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        ></button>

        <HexColorInput
          color={colorValue}
          onChange={(value) => handleColorChange(value)}
          prefixed
          className="bg-transparent outline-none w-[80px]"
        />
      </div>
      {showColorPicker && (
        <div className="absolute mt-3">
          <HexColorPicker
            color={colorValue}
            onChange={(value) => handleColorChange(value)}
          />
        </div>
      )}
    </div>
  );
}

export default ColorPickerField;
