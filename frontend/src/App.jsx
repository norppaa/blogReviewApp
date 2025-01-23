import { Routes, Route } from 'react-router-dom';
import BlogPage from './BlogPage';
import SignUp from './Signup';
import Home from './Home';
import { AuthProvider, ProtectedRoute } from './services/authentication';
import AddReviewPage from './AddReview';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="blogs"
          element={
            <ProtectedRoute>
              <BlogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="addReview"
          element={
            <ProtectedRoute>
              <AddReviewPage />
            </ProtectedRoute>
          }
        />
        <Route path="signUp" element={<SignUp />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}
