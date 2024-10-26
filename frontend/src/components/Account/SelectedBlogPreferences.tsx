import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface BlogPreferencesProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  selected: any;
}

export default function BlogPreferences({  setFieldValue, selected }: BlogPreferencesProps) {
    console.log(selected);
    
  const preferences = ['Technology', 'Science', 'Business', 'Entertainment', 'Sports', 'Politics', 'Health', 'Travel'];

  const [selectedPreferences, setSelectedPreferences] = useState(selected || []);

  const handleSelectPreference = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (!selectedPreferences.includes(selectedValue)) {
      const updatedPreferences = [...selectedPreferences, selectedValue];
      setSelectedPreferences(updatedPreferences);
      setFieldValue('preferences', updatedPreferences); 

    }
  };

  const handleRemovePreference = (preference: string) => {
    const updatedPreferences = selectedPreferences.filter((p:any) => p !== preference);
    setSelectedPreferences(updatedPreferences);
    setFieldValue('preferences', updatedPreferences);
  };

  return (
    <div className="my-4">
      <label htmlFor="blogPreferences" className="block text-sm font-medium text-gray-700">
        Blog Preferences
      </label>
      <select
        id="preferences"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onChange={handleSelectPreference}
        value=""
      >
        <option value="" disabled>
          Select your preferences
        </option>
        {preferences.map((preference) => (
          <option key={preference} value={preference}>
            {preference}
          </option>
        ))}
      </select>

      {/* Show selected preferences */}
      {selectedPreferences.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedPreferences.map((preference:any) => (
            <div
              key={preference}
              className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm space-x-2"
            >
              <span>{preference}</span>
              <AiOutlineClose
                onClick={() => handleRemovePreference(preference)}
                className="cursor-pointer text-blue-600 hover:text-red-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
