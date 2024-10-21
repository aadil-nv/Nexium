import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import useFetchAdminData from "../hooks/useFetchAdmin";
import { setAdmin, setadminAuthenticated } from "../features/admin/adminSlice";
import AdmintPrivateRoute from "./Privateroutes/AdminPrivateRoute";
import { useAppSelector } from "../hooks/useTypeSelector";
import { onMessageListener, requestFCMToken } from "../config/firebase";
import toast, { Toaster } from "react-hot-toast";
import LoadingPage from "../components/common/Loading/LoadingPage";
import { getMessaging } from "firebase/messaging";
import NotFound from "../components/common/not-found/Not-foundPage";

const  AdminLogin =lazy(()=>import("../components/admin/login/AdminLogin")) ;
const Dashboard =lazy(()=>import("../components/admin/dashbord/AdimnDashboard")) ;
const CategoryTable =lazy(()=>import("../components/admin/category/CategoryList")) ;
const  AddnewCategory =lazy(()=>import("../components/admin/category/AddnewCategory")) ;
const EditCategory =lazy(()=>import("../components/admin/category/CategoryEdit")) ;
const SubCategoryTable =lazy(()=>import("../components/admin/subcategory/Subcategory")) ;
const EditSubCategory =lazy(()=>import("../components/admin/subcategory/SubCategoryEdit")) ;
const AddSubCategory =lazy(()=>import("../components/admin/subcategory/AddSubCategory")) ;
const  ExpertDetailsView =lazy(()=>import("../components/admin/expertDetails/ExpertView")) ;
const Experts = lazy(()=>import("../components/admin/expertDetails/ExpertDetails")) ;
const Header =lazy(()=>import("../components/admin/header/AdminHeader")) ;
const Sidebar =lazy(()=>import("../components/admin/sidebar/AdminSidebar")) ;
const BookingDetails =lazy(()=>import("../components/admin/booking/BookingDetails")) ;
const BookingView =lazy(()=>import("../components/admin/booking/BookingView")) ;
const StudentDetails =lazy(()=>import("../pages/admin/StudentDetails")) ;
const StudentSingleView =lazy(()=>import("../pages/admin/StudentSingleView")) ;
const PsychometricTestPage =lazy(()=>import("../pages/admin/PsychometricTestPage")) ;
const AddPsychometricTestPage =lazy(()=>import("../pages/admin/AddPsychometricTestPage")) ;
const FaqPage =lazy(()=>import("../pages/admin/FaqPage")) ;
const ReviewAndRatingPage =lazy(()=>import("../pages/admin/ReviewAndRatingPage")) ;
const ReportPage =lazy(()=>import("../pages/admin/ReportPage")) ;

const AdminRouter = () => {
  const dispatch = useDispatch();
  const { admin, isAuthenticated } = useFetchAdminData();
  const adminData = useAppSelector((state) => state.admin);
  useEffect(() => {
    if (admin !== null) {
      dispatch(setAdmin(admin));
      dispatch(setadminAuthenticated(isAuthenticated));
      console.log("isauth", isAuthenticated);
    } else {
      dispatch(setadminAuthenticated(false));
      console.log("isauth", isAuthenticated);
    }
  }, [dispatch, admin, isAuthenticated]);

  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const token = await requestFCMToken();
        console.log("token:->", token);
      } catch (error) {
        console.log("error during fetch fcm token", error);
      }
    };
    fetchFcmToken();
  }, []);
  interface NotificationPayload {
    notification: {
      title: string;
      body: string;
    };
    data?: {
      role: string;
    };
  }
  useEffect(() => {
    const messaging = getMessaging(); 

    
    const handleMessage = (payload: NotificationPayload) => {
      if (payload.notification && payload.data?.role.trim() === "admin") {
        toast(
          <div>
            <strong>{payload.notification.title}</strong>
            <p>{payload.notification.body}</p>
          </div>,
          {
            position: "top-right",
          }
        );
        console.log("Received foreground message:", payload);
      }
    };


    const unsubscribe = onMessageListener(messaging, handleMessage);

   
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe(); 
      }
    };
  }, []);

  return (
    <Suspense fallback={<LoadingPage />}>
    <div className="flex h-screen bg-gray-100">
      <Routes>
        <Route
          path="/login"
          element={
            adminData.isAuthenticated ? (
              <Navigate to="/admin" />
            ) : (
              <AdminLogin />
            )
          }
        />

        <Route element={<AdmintPrivateRoute />}>
          <Route
            element={
              <>
                <div className="flex flex-col w-full">
                  <Header />
                  <Toaster />
                  <div className="flex-1 flex bg-white ">
                    <Sidebar />
                    <Outlet />
                  </div>
                </div>
              </>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/category" element={<CategoryTable />} />
            <Route path="/addCategory" element={<AddnewCategory />} />
            <Route
              path="/editCategory/:categoryId"
              element={<EditCategory />}
            />
            <Route path="/subCategory" element={<SubCategoryTable />} />
            <Route path="/addSubCategory" element={<AddSubCategory />} />
            <Route path="/booking-details" element={<BookingDetails />} />
            <Route path="/booking-view/:bookingId" element={<BookingView />} />
            <Route
              path="/editSubCategory/:categoryId"
              element={<EditSubCategory />}
            />
            <Route
              path="/expertView/:expertId"
              element={<ExpertDetailsView />}
            />
            <Route path="/users" element={<StudentDetails />} />
            <Route
              path="/studentView/:studentId"
              element={<StudentSingleView />}
            />
            <Route
              path="/psychometric-test"
              element={<PsychometricTestPage />}
            />
            <Route
              path="/add-psychometric-test"
              element={<AddPsychometricTestPage />}
            />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/review-rating" element={<ReviewAndRatingPage />} />
            <Route path="/report" element={<ReportPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    </Suspense>
  );
};

export default AdminRouter;