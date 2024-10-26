import  { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default  ({ editModalOpen, setEditModalOpen, editingItem, handleSaveEdit }:any) => {
    const [replaceMessage, setReplaceMessage] = useState(false);
  
    if (!editModalOpen) return null;
  
    const validationSchema = Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      category: Yup.string()
        .oneOf(
          ['Technology', 'Science', 'Business', 'Entertainment', 'Sports', 'Politics', 'Health', 'Travel'],
          'Invalid category'
        )
        .required('Category is required'),
      image: Yup.mixed().notRequired().test('fileFormat', 'Only .jpg format is supported', (value:any) => {
        return !value || (value && value.type === 'image/jpeg'); 
      }),
    });
  
    const initialValues = {
      name: editingItem.name || '',
      description: editingItem.description || '',
      tags: editingItem.tags || '',
      category: editingItem.category || '',
      image: null,  
    };
  
    const handleSubmit = (values:any) => {
      const editedItem = {
        ...values,
        blogId:editingItem._id,
        image: values.image || editingItem.image,
      };
      handleSaveEdit(editedItem);
      setEditModalOpen(false); 
    };
  
    const handleImageChange = (event:any, setFieldValue:any) => {
      const file = event.currentTarget.files[0];
      setFieldValue('image', file);  
      if (file) {
        setReplaceMessage(true);
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 pt-8 min-h-0 overflow-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-xl font-semibold mb-4">Edit Blog</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-600" />
                </div>
  
                <div className="mb-4">
                  <label className="block text-sm font-medium">Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-600" />
                </div>
  
                <div className="mb-4">
                  <label className="block text-sm font-medium">Tags (comma separated)</label>
                  <Field
                    type="text"
                    name="tags"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                  />
                </div>
  
                <div className="mb-4">
                  <label className="block text-sm font-medium">Category</label>
                  <Field
                    as="select"
                    name="category"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                    <option value="Business">Business</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Sports">Sports</option>
                    <option value="Politics">Politics</option>
                    <option value="Health">Health</option>
                    <option value="Travel">Travel</option>
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-red-600" />
                </div>
  
                {/* Show current image if it exists */}
                
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Current Image</label>
                    <img
                    src={`https://persual.mooo.com/uploads/${editingItem.image}`}
                    alt="Current"
                    className="mt-1 max-w-xs border rounded-md"
                    />

                    {replaceMessage && (
                      <p className="text-red-500 text-sm mt-2">
                        This will replace the current image.
                      </p>
                    )}
                  </div>
                
  
                {/* File input for new image */}
                <div className="mb-4">
                  <label className="block text-sm font-medium">Upload New Image (only .jpg)</label>
                  <input
                    type="file"
                    name="image"
                    accept=".jpg"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    onChange={(event) => handleImageChange(event, setFieldValue)}
                  />
                  <ErrorMessage name="image" component="div" className="text-red-600" />
                </div>
  
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-md"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Save
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };
  

  