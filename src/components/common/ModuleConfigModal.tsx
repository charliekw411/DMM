// src/components/common/ModuleConfigModal.tsx
import React, { useState } from "react";

type FieldType = "string" | "number" | "boolean" | "select";

interface FieldSchema {
  label: string;
  type: FieldType;
  required?: boolean;
  description?: string;
  options?: string[]; // for select
  validate?: (value: string) => true | string; // ✅ new: custom validation
}

export interface VariableSchema {
  [key: string]: FieldSchema;
}

interface Props {
  title?: string;
  schema: VariableSchema;
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}

const ModuleConfigModal: React.FC<Props> = ({
  title = "Configure Resource",
  schema,
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setFormValues({ ...formValues, [key]: value });
    setErrors({ ...errors, [key]: "" });
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    for (const key in schema) {
      const field = schema[key];
      const value = formValues[key];

      if (field.required && !value?.trim()) {
        newErrors[key] = `${field.label} is required`;
      } else if (field.validate) {
        const result = field.validate(value);
        if (result !== true) {
          newErrors[key] = result;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formValues);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>

          {Object.entries(schema).map(([key, field]) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "select" && field.options ? (
                <select
                  value={formValues[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={formValues[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              )}

              {field.description && (
                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
              )}
              {errors[key] && (
                <p className="text-sm text-red-500 mt-1">{errors[key]}</p>
              )}
            </div>
          ))}

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModuleConfigModal;
