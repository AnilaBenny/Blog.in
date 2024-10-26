import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import SelectedBlogPreferences from './SelectedBlogPreferences';
import { EditProfile } from '../../ApiService/ApiService';
import { setUser } from '../../Redux/slices/UserSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const ProfileEdit = ({ profileEditOpen, setProfileEditOpen, editedUser }: any) => {
  const initialValues = {
    firstName: editedUser.firstName || '',
    lastName: editedUser.lastName || '',
    email: editedUser.email || '',
    phone: editedUser.phone || '',
    preferences: editedUser.blogPreferences || [],  
  };
  

  const dispatch = useDispatch();
  const handleSaveProfile = async (values: any) => {
    try {

        const response = await EditProfile(values);
      if(response?.status===200)
      {dispatch(setUser(response?.data.user));
      setProfileEditOpen(false);
    toast.success('Profile Updated Successfully')
    }
      else{
        toast.error('Profile updation failed')
      }
    } catch (error) {
      console.log('Error updating profile:', error);
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'First name cannot contain numbers or special characters')
      .min(2, 'First name must be at least 2 characters long')
      .max(30, 'First name must be at most 30 characters long')
      .required('First name is required'),
    lastName: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Last name cannot contain numbers or special characters')
      .min(2, 'Last name must be at least 2 characters long')
      .max(30, 'Last name must be at most 30 characters long')
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    // If you don't need the dob field, remove it from here.
    // If you do, include it in the form.
    // dob: Yup.date().max(new Date(), 'Date of birth cannot be in the future').required('Date of birth is required'),
    preferences: Yup.array()
  .min(1, 'Please select at least one blog preference')
  .required('Blog preferences are required'),

  });

  return (
    profileEditOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white p-8 rounded-lg w-96 shadow-2xl transform transition-transform duration-300 ease-in-out">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
          <Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={(values, { setSubmitting }) => {
    console.log("Form submitted with values:", values);
    handleSaveProfile(values)
      .finally(() => setSubmitting(false)); 
  }}
>

            {({ values, setFieldValue }) => (
              <Form>
                <div className="mb-5">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <Field
                    name="firstName"
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 ease-in-out"
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-5">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <Field
                    name="lastName"
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 ease-in-out"
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Field
                    name="email"
                    type="email"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 ease-in-out"
                    readOnly
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Field
                    name="phone"
                    type="tel"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 ease-in-out"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferences</label>
                <SelectedBlogPreferences
                  values={values}
                  setFieldValue={setFieldValue}
                  selected={values.preferences} 
                />
                <ErrorMessage name="preferences" component="div" className="text-red-500 text-sm" />
              </div>


                <div className="flex justify-end">
                  <button
                    onClick={() => setProfileEditOpen(false)}
                    type="button"
                    className="mr-3 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    Save changes
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  );
};

export default ProfileEdit;
