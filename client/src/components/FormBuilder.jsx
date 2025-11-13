import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: '📝' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'phone', label: 'Phone', icon: '📞' },
  { type: 'textarea', label: 'Long Text', icon: '📄' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'select', label: 'Dropdown', icon: '📋' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'radio', label: 'Radio Buttons', icon: '⚪' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'file', label: 'File Upload', icon: '📎' },
];

const FormBuilder = ({ schema, onChange }) => {
  const [editingField, setEditingField] = useState(null);

  const addField = (fieldType) => {
    const newField = {
      id: Date.now().toString(),
      type: fieldType.type,
      label: fieldType.label,
      required: false,
      placeholder: '',
      options: fieldType.type === 'select' || fieldType.type === 'radio' ? ['Option 1'] : [],
    };
    onChange([...schema, newField]);
  };

  const updateField = (id, updates) => {
    onChange(schema.map((field) => (field.id === id ? { ...field, ...updates } : field)));
  };

  const removeField = (id) => {
    onChange(schema.filter((field) => field.id !== id));
  };

  const moveField = (dragIndex, hoverIndex) => {
    const newSchema = [...schema];
    const [draggedField] = newSchema.splice(dragIndex, 1);
    newSchema.splice(hoverIndex, 0, draggedField);
    onChange(newSchema);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Field Types Panel */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-lg p-4 sticky top-4">
          <h3 className="font-semibold text-gray-800 mb-3">Field Types</h3>
          <div className="space-y-2">
            {fieldTypes.map((fieldType) => (
              <button
                key={fieldType.type}
                onClick={() => addField(fieldType)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
              >
                <span>{fieldType.icon}</span>
                <span className="text-sm">{fieldType.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Preview */}
      <div className="lg:col-span-3 space-y-4">
        {schema.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">
              Click on field types to add them to your form
            </p>
          </div>
        ) : (
          schema.map((field, index) => (
            <FormField
              key={field.id}
              field={field}
              index={index}
              moveField={moveField}
              updateField={updateField}
              removeField={removeField}
              editingField={editingField}
              setEditingField={setEditingField}
            />
          ))
        )}
      </div>
    </div>
  );
};

const FormField = ({ field, index, moveField, updateField, removeField, editingField, setEditingField }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'field',
    hover: (item) => {
      if (item.index !== index) {
        moveField(item.index, index);
        item.index = index;
      }
    },
  });

  const isEditing = editingField === field.id;

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white border-2 rounded-lg p-4 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isEditing ? 'border-primary-500' : 'border-gray-200'}`}
    >
      <div className="flex items-start gap-3">
        <div className="cursor-move mt-2">
          <GripVertical size={20} className="text-gray-400" />
        </div>

        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                className="input"
                placeholder="Field Label"
              />
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                className="input"
                placeholder="Placeholder Text"
              />
              {(field.type === 'select' || field.type === 'radio') && (
                <div>
                  <label className="label">Options (one per line)</label>
                  <textarea
                    value={field.options.join('\n')}
                    onChange={(e) =>
                      updateField(field.id, {
                        options: e.target.value.split('\n').filter((o) => o.trim()),
                      })
                    }
                    className="input"
                    rows="3"
                  />
                </div>
              )}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Required field</span>
              </label>
              <button
                onClick={() => setEditingField(null)}
                className="btn btn-primary btn-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <div onClick={() => setEditingField(field.id)} className="cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800">{field.label}</span>
                {field.required && <span className="text-red-500">*</span>}
              </div>
              <p className="text-sm text-gray-500">Type: {field.type}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => removeField(field.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;
