import  { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Navbar from '../Navbar/Navbar';
import { useSelector } from 'react-redux';
import axiosInstance from '../../AxiosConfig/AxiosConfig';

const BlogForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 6000);
      return () => clearTimeout(timer); 
    }
  }, [isSubmitted]);

  const initialValues = {
    name: '',
    description: '',
    tags: '',
    category: '',
    image: null, 
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string()
      .oneOf(
        ['Technology', 'Science', 'Business', 'Entertainment', 'Sports', 'Politics', 'Health', 'Travel'],
        'Invalid category'
      )
      .required('Category is required'),
    image: Yup.mixed()
      .required('An image is required')
      .test('fileFormat', 'Only .jpg format is supported', (value:any) => {
        return value && value.type === 'image/jpeg';
      }),
  });

  const user = useSelector((state:any) => state.user.user);

  const onSubmit = async (values:any, { resetForm }:any) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('tags', values.tags.split(',').map((tag:any) => tag.trim()));
    formData.append('image', values.image); 
    formData.append('author', user._id);

    try {
      await axiosInstance.post('/writeblog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsSubmitted(true);
      resetForm();
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-4 pt-28">
      {isSubmitted ? (
        <div className="max-w-md mx-auto p-6 mt-6 bg-white rounded-lg shadow-lg">
  <div className="text-center text-green-600">
    <h2 className="text-xl font-semibold mb-4">Your blog is created!</h2>
    <p className="text-sm">Happy journaling...</p>
  </div>
</div>

      ) : (
        <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
          <h1 className="text-2xl font-bold mb-4">Add a New Blog</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
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

                <div className="mb-4">
                  <label className="block text-sm font-medium">Image (only .jpg)</label>
                  <input
                    type="file"
                    name="image"
                    accept=".jpg"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    onChange={(event:any) => {
                      setFieldValue("image", event.currentTarget.files[0]);
                    }}
                  />
                  <ErrorMessage name="image" component="div" className="text-red-600" />
                </div>

                <button
                  type="submit"
                  className="block w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
    </>
  );
};

export default BlogForm;
